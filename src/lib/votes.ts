/**
 * Logique du vote reel (Phase 15, session 15.2).
 *
 * Fonctions pures, testables sans base de donnees : la couche server actions
 * (`src/app/actions/votes.ts`) et l'API (`src/app/api/v1/votes/route.ts`) s'en
 * servent pour prendre leurs decisions, puis executent les requetes Prisma.
 */

import { createHash } from 'crypto'
import { VOTE } from '@/content/brand'

export const VOTE_THRESHOLD = VOTE.threshold
export const ANON_VOTE_COOKIE = 'cinegeny-anon-vote-id'

export type VoteTrack = 'A' | 'B'

/* ── Progression vers le seuil de 5 000 votes ─────────────────────────────── */

export interface VoteProgress {
  count: number
  threshold: number
  pct: number
  reached: boolean
}

export function computeVoteProgress(count: number, threshold: number = VOTE_THRESHOLD): VoteProgress {
  const safeCount = Math.max(0, count)
  const pct = threshold > 0 ? Math.min(100, (safeCount / threshold) * 100) : 0
  return {
    count: safeCount,
    threshold,
    pct,
    reached: safeCount >= threshold,
  }
}

/* ── Anti-fraude : hash de l'IP (jamais stockee en clair) ─────────────────── */

export function hashIp(ip: string, salt: string = process.env.VOTE_IP_SALT || 'cinegeny-vote-salt'): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

/* ── Double vote ───────────────────────────────────────────────────────────
 * Regle (15.0 #5) : 1 vote gratuit par film et par personne, "1 vote confirme
 * par compte et par film". */

export interface ExistingVoteCheck {
  /** Un vote confirme (compte) existe deja pour ce film. */
  hasConfirmedVote: boolean
  /** Un vote anonyme (non confirme) existe deja pour ce film sous ce anonId. */
  hasAnonVote: boolean
}

export interface CastVoteDecision {
  allowed: boolean
  reason?: string
}

export function decideCastVote(check: ExistingVoteCheck): CastVoteDecision {
  if (check.hasConfirmedVote) {
    return { allowed: false, reason: 'Vous avez déjà voté pour ce film.' }
  }
  if (check.hasAnonVote) {
    return { allowed: false, reason: 'Vote déjà enregistré — confirmez-le en vous inscrivant.' }
  }
  return { allowed: true }
}

/* ── Confirmation a l'inscription ──────────────────────────────────────────
 * Quand un visiteur anonyme cree son compte (ou se reconnecte), ses votes en
 * attente (lies a son anonId) doivent devenir definitifs — sauf s'il possede
 * deja un vote confirme pour le meme film (un seul vote confirme par compte
 * et par film). */

export interface PendingAnonVote {
  id: string
  filmId: string
}

export interface ConfirmVotesPlan {
  /** Ids des votes anonymes a confirmer (userId + confirmed=true). */
  toConfirm: string[]
  /** Ids des votes anonymes a supprimer (doublon avec un vote deja confirme). */
  toDiscard: string[]
}

export function planVoteConfirmation(
  pendingAnonVotes: PendingAnonVote[],
  confirmedFilmIds: Set<string>,
): ConfirmVotesPlan {
  const toConfirm: string[] = []
  const toDiscard: string[] = []
  const seenFilmIds = new Set(confirmedFilmIds)

  for (const vote of pendingAnonVotes) {
    if (seenFilmIds.has(vote.filmId)) {
      toDiscard.push(vote.id)
      continue
    }
    toConfirm.push(vote.id)
    seenFilmIds.add(vote.filmId)
  }

  return { toConfirm, toDiscard }
}
