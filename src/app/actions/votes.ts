'use server'

import { randomUUID } from 'crypto'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { voteLimiter } from '@/lib/rate-limit'
import {
  ANON_VOTE_COOKIE,
  computeVoteProgress,
  decideCastVote,
  hashIp,
  planVoteConfirmation,
  VOTE_THRESHOLD,
  type VoteProgress,
  type VoteTrack,
} from '@/lib/votes'

const VOTE_TYPE = 'vote'
const ANON_COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 an

async function getClientIp(): Promise<string> {
  const hdrs = await headers()
  return (
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
  )
}

async function getOrCreateAnonId(): Promise<string> {
  const store = await cookies()
  const existing = store.get(ANON_VOTE_COOKIE)?.value
  if (existing) return existing

  const anonId = randomUUID()
  store.set(ANON_VOTE_COOKIE, anonId, {
    path: '/',
    maxAge: ANON_COOKIE_MAX_AGE,
    sameSite: 'lax',
    httpOnly: true,
  })
  return anonId
}

async function readAnonId(): Promise<string | null> {
  const store = await cookies()
  return store.get(ANON_VOTE_COOKIE)?.value ?? null
}

/* ── Etat du vote pour un film et un visiteur donnes ──────────────────────── */

export interface VoteStateResult {
  progress: VoteProgress
  hasVoted: boolean
  /** Le vote existe mais n'est pas encore confirme (visiteur anonyme). */
  pendingConfirmation: boolean
}

export async function getVoteStateAction(filmId: string): Promise<VoteStateResult> {
  const [session, anonId, count] = await Promise.all([
    auth(),
    readAnonId(),
    prisma.filmVote.count({ where: { filmId, voteType: VOTE_TYPE, confirmed: true } }),
  ])

  const progress = computeVoteProgress(count, VOTE_THRESHOLD)
  const userId = session?.user?.id

  let hasVoted = false
  let pendingConfirmation = false

  if (userId) {
    const confirmedVote = await prisma.filmVote.findUnique({
      where: { filmId_userId_voteType: { filmId, userId, voteType: VOTE_TYPE } },
    })
    hasVoted = !!confirmedVote
  } else if (anonId) {
    const anonVote = await prisma.filmVote.findUnique({
      where: { filmId_anonId_voteType: { filmId, anonId, voteType: VOTE_TYPE } },
    })
    hasVoted = !!anonVote
    pendingConfirmation = !!anonVote && !anonVote.confirmed
  }

  return { progress, hasVoted, pendingConfirmation }
}

/* ── Voter pour un film (piste A ou B) ────────────────────────────────────── */

export type CastVoteResult =
  | { error: string }
  | { success: true; progress: VoteProgress; pendingConfirmation: boolean }

export async function castVoteAction(filmId: string, track: VoteTrack): Promise<CastVoteResult> {
  if (!filmId) return { error: 'Film manquant.' }
  if (track !== 'A' && track !== 'B') return { error: 'Piste de vote invalide.' }

  const ip = await getClientIp()
  const rl = await voteLimiter.check(`vote:${ip}`)
  if (!rl.allowed) {
    return { error: `Trop de votes. Réessayez dans ${rl.retryAfterSeconds}s.` }
  }

  const film = await prisma.film.findUnique({ where: { id: filmId }, select: { id: true, slug: true } })
  if (!film) return { error: 'Film introuvable.' }

  const session = await auth()
  const userId = session?.user?.id
  const ipHash = hashIp(ip)

  if (userId) {
    const existingConfirmed = await prisma.filmVote.findUnique({
      where: { filmId_userId_voteType: { filmId, userId, voteType: VOTE_TYPE } },
    })
    const decision = decideCastVote({ hasConfirmedVote: !!existingConfirmed, hasAnonVote: false })
    if (!decision.allowed) return { error: decision.reason! }

    await prisma.filmVote.create({
      data: { filmId, userId, voteType: VOTE_TYPE, track, ipHash, confirmed: true, confirmedAt: new Date() },
    })

    revalidatePath(`/films/${film.slug}`)
    const count = await prisma.filmVote.count({ where: { filmId, voteType: VOTE_TYPE, confirmed: true } })
    return { success: true, progress: computeVoteProgress(count, VOTE_THRESHOLD), pendingConfirmation: false }
  }

  // Visiteur anonyme : vote enregistre immediatement (cookie), confirme a l'inscription.
  const anonId = await getOrCreateAnonId()
  const existingAnon = await prisma.filmVote.findUnique({
    where: { filmId_anonId_voteType: { filmId, anonId, voteType: VOTE_TYPE } },
  })
  const decision = decideCastVote({ hasConfirmedVote: false, hasAnonVote: !!existingAnon })
  if (!decision.allowed) return { error: decision.reason! }

  await prisma.filmVote.create({
    data: { filmId, anonId, voteType: VOTE_TYPE, track, ipHash, confirmed: false },
  })

  revalidatePath(`/films/${film.slug}`)
  // Le compteur public ne compte que les votes confirmes (15.0 #5 : "compteurs
  // reels", pas de vote non verifie affiche comme definitif).
  const count = await prisma.filmVote.count({ where: { filmId, voteType: VOTE_TYPE, confirmed: true } })
  return { success: true, progress: computeVoteProgress(count, VOTE_THRESHOLD), pendingConfirmation: true }
}

/* ── Confirmation des votes anonymes a l'inscription / la connexion ───────── */

/**
 * A appeler juste apres qu'un utilisateur (nouveau ou existant) soit
 * authentifie. Rattache ses votes anonymes en attente (cookie anonId) a son
 * compte, en respectant la regle "1 vote confirme par compte et par film".
 */
export async function confirmPendingVotesForUser(userId: string): Promise<number> {
  const anonId = await readAnonId()
  if (!anonId) return 0

  const [pendingAnonVotes, confirmedVotes] = await Promise.all([
    prisma.filmVote.findMany({
      where: { anonId, voteType: VOTE_TYPE, confirmed: false },
      select: { id: true, filmId: true },
    }),
    prisma.filmVote.findMany({
      where: { userId, voteType: VOTE_TYPE, confirmed: true },
      select: { filmId: true },
    }),
  ])

  if (pendingAnonVotes.length === 0) return 0

  const plan = planVoteConfirmation(pendingAnonVotes, new Set(confirmedVotes.map((v) => v.filmId)))

  await prisma.$transaction([
    ...(plan.toConfirm.length > 0
      ? [
          prisma.filmVote.updateMany({
            where: { id: { in: plan.toConfirm } },
            data: { userId, confirmed: true, confirmedAt: new Date() },
          }),
        ]
      : []),
    ...(plan.toDiscard.length > 0
      ? [prisma.filmVote.deleteMany({ where: { id: { in: plan.toDiscard } } })]
      : []),
  ])

  return plan.toConfirm.length
}
