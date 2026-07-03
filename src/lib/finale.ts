/**
 * Logique (pure, testable) de la Finale CINEGENY — session 15.9.
 *
 * Un film entre en Finale quand il est piste B (« Films en compétition »,
 * brand.ts VOTE_TRACKS.B) et a atteint le seuil de 5 000 votes CONFIRMÉS
 * (décision 15.0 #5). Les films piste A ne concourent jamais pour la Finale
 * — à 5 000 votes ils partent en production, pas en Finale.
 *
 * `src/app/(public)/finale/page.tsx` (serveur) récupère les compteurs réels
 * en base puis appelle `selectFinalists`. Zéro finaliste inventé : la liste
 * est vide tant qu'aucun film piste B n'a atteint le seuil.
 */

import { computeVoteProgress, type VoteProgress } from '@/lib/votes'
import type { FilmTrack } from '@/data/films'

export interface FinalistInput {
  slug: string
  title: string
  synopsis: string
  genre: string
  director: string
  coverImageUrl: string | null
  track: FilmTrack
  voteCount: number
}

export interface FinalistVM {
  slug: string
  title: string
  synopsis: string
  genre: string
  director: string
  coverImageUrl: string | null
  progress: VoteProgress
}

export function selectFinalists(films: FinalistInput[]): FinalistVM[] {
  return films
    .filter((f) => f.track === 'B' && computeVoteProgress(f.voteCount).reached)
    .map((f) => ({
      slug: f.slug,
      title: f.title,
      synopsis: f.synopsis,
      genre: f.genre,
      director: f.director,
      coverImageUrl: f.coverImageUrl,
      progress: computeVoteProgress(f.voteCount),
    }))
    .sort((a, b) => b.progress.count - a.progress.count)
}
