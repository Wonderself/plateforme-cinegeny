import { NextRequest, NextResponse } from 'next/server'
import { castVoteAction, getVoteStateAction } from '@/app/actions/votes'

export const dynamic = 'force-dynamic'

/**
 * Public REST API — Vote de piste (Phase 15, session 15.2)
 * GET  /api/v1/votes?filmId=xxx — Etat du vote (compteur reel, seuil, deja vote ?)
 * POST /api/v1/votes            — Voter { filmId, track: "A" | "B" }
 *
 * Meme logique que les server actions (src/app/actions/votes.ts) : vote
 * anonyme autorise (cookie + hash IP), confirme a l'inscription.
 */
export async function GET(req: NextRequest) {
  const filmId = req.nextUrl.searchParams.get('filmId')
  if (!filmId) {
    return NextResponse.json({ error: 'filmId requis' }, { status: 400 })
  }

  const state = await getVoteStateAction(filmId)
  return NextResponse.json({ data: state })
}

export async function POST(req: NextRequest) {
  let body: { filmId?: string; track?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps JSON invalide.' }, { status: 400 })
  }

  const { filmId, track } = body
  if (!filmId || (track !== 'A' && track !== 'B')) {
    return NextResponse.json({ error: 'filmId et track ("A" ou "B") requis.' }, { status: 400 })
  }

  const result = await castVoteAction(filmId, track)
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ data: result })
}
