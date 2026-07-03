/**
 * Logique (pure, testable) du catalogue `/films` — session 15.5.
 *
 * Le catalogue public n'a plus qu'un seul axe de navigation, celui du
 * parcours d'un film (décision 15.0 #6) : En vote -> En production ->
 * À regarder. Ce module construit ce modèle à partir de la slate (+ archives
 * réactivées par l'admin) enrichie des compteurs de votes RÉELS fournis par
 * la base (aucun chiffre inventé — règle 15.0bis #1). Le calcul du statut
 * réutilise `deriveFilmStatusKey` (15.4), pour rester cohérent avec la fiche
 * film : c'est la progression réelle du vote qui prime sur le statut legacy.
 *
 * `src/app/(public)/films/page.tsx` (serveur) se charge des accès Prisma puis
 * appelle `buildCatalogModel`. Le rendu (`film-categories.tsx`) ne reçoit que
 * ce modèle sérialisable.
 */

import { computeVoteProgress, deriveFilmStatusKey, type VoteProgress } from '@/lib/votes'
import { VOTE_TRACKS, type FilmStatusKey } from '@/content/brand'
import { type FilmData, type FilmTrack } from '@/data/films'

/* ── Entrée : une entrée de catalogue + son compteur réel + son id en base ── */

export interface CatalogFilmInput {
  film: FilmData
  /** Id du film en base (nécessaire pour voter). `null` si absent de la base. */
  filmId: string | null
  /** Statut Prisma legacy (DRAFT/PRE_PRODUCTION/.../RELEASED). */
  legacyStatus: string
  /** Nombre de votes CONFIRMÉS pour ce film (compteur réel, base). */
  voteCount: number
}

/* ── Sortie : modèle de vue d'un film pour le catalogue ───────────────────── */

export interface CatalogFilmVM {
  filmId: string | null
  title: string
  slug: string
  synopsis: string
  genre: string
  director: string
  coverImageUrl: string | null
  track: FilmTrack
  /** Nom canonique de la piste (brand.ts VOTE_TRACKS). */
  trackName: string
  /** Progression réelle vers le seuil de 5 000 votes. */
  progress: VoteProgress
  /** Étape du parcours public — l'unique axe de navigation (décision 15.0 #6). */
  statusKey: FilmStatusKey
  /** True si le film peut recevoir un vote (présent en base). */
  votable: boolean
}

export function buildCatalogFilmVM(input: CatalogFilmInput): CatalogFilmVM {
  const { film, filmId, legacyStatus, voteCount } = input
  const progress = computeVoteProgress(voteCount)
  const statusKey = deriveFilmStatusKey({ legacyStatus, reached: progress.reached })
  return {
    filmId,
    title: film.title,
    slug: film.slug,
    synopsis: film.synopsis,
    genre: film.genre,
    director: film.director,
    coverImageUrl: film.coverImageUrl,
    track: film.track,
    trackName: VOTE_TRACKS[film.track].name,
    progress,
    statusKey,
    votable: filmId !== null,
  }
}

/* ── Tri d'un groupe : les films les plus proches du seuil d'abord ─────────── */

export function sortByProgressDesc(films: CatalogFilmVM[]): CatalogFilmVM[] {
  return [...films].sort((a, b) => b.progress.count - a.progress.count)
}

/* ── Modèle complet du catalogue : les 3 statuts du parcours ──────────────── */

export type CatalogModel = Record<FilmStatusKey, CatalogFilmVM[]>

export function buildCatalogModel(inputs: CatalogFilmInput[]): CatalogModel {
  const vms = inputs.map(buildCatalogFilmVM)
  return {
    'en-vote': sortByProgressDesc(vms.filter((f) => f.statusKey === 'en-vote')),
    'en-production': sortByProgressDesc(vms.filter((f) => f.statusKey === 'en-production')),
    'a-regarder': vms.filter((f) => f.statusKey === 'a-regarder'),
  }
}
