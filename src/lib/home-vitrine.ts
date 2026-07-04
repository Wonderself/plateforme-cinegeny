/**
 * Logique (pure, testable) de la vitrine d'accueil — session 15.3.
 *
 * L'accueil est une vitrine « type Netflix » au service du vote (décision
 * 15.0 #9). Ce module construit le modèle de vue de la page à partir de la
 * slate officielle (`src/data/films.ts`) et des compteurs de votes RÉELS
 * fournis par la base (aucun chiffre inventé — règle 15.0bis #1).
 *
 * `src/app/page.tsx` (serveur) se charge des accès Prisma puis appelle
 * `buildHomeVitrineModel`. Le rendu (`src/components/home/*`) ne reçoit que ce
 * modèle sérialisable.
 */

import { computeVoteProgress, type VoteProgress } from '@/lib/votes'
import { VOTE_TRACKS } from '@/content/brand'
import { type FilmData, type FilmTrack } from '@/data/films'

/* ── Entrée : une entrée de slate + son compteur réel + son id en base ─────── */

export interface HomeFilmInput {
  film: FilmData
  /** Id du film en base (nécessaire pour voter). `null` si absent de la base. */
  filmId: string | null
  /** Nombre de votes CONFIRMÉS pour ce film (compteur réel, base). */
  voteCount: number
}

/* ── Sortie : modèle de vue d'un film pour la vitrine ─────────────────────── */

export interface HomeFilmVM {
  /** Id en base — passé au panneau de vote (15.2). `null` si non votable. */
  filmId: string | null
  title: string
  slug: string
  synopsis: string
  genre: string
  director: string
  coverImageUrl: string | null
  /** Affiche rectangulaire (16:9) pour les carrousels — repli sur coverImageUrl si absente. */
  backdropUrl: string | null
  /** 3 à 4 photos du film, façon Netflix. */
  galleryUrls: string[]
  /** Extrait muet joué en fond de hero (facultatif, cf. data/films.ts). */
  heroVideoUrl: string | null
  track: FilmTrack
  /** Nom canonique de la piste (brand.ts VOTE_TRACKS). */
  trackName: string
  /** Ce que déclenchent 5 000 votes pour cette piste. */
  trackOutcome: string
  /** Progression réelle vers le seuil de 5 000 votes. */
  progress: VoteProgress
  /** True si le film peut recevoir un vote (présent en base). */
  votable: boolean
}

export interface HomeVitrineModel {
  /** Film mis en avant dans le hero. */
  hero: HomeFilmVM
  /** Piste A — « Bandes-annonces en compétition ». */
  trackA: HomeFilmVM[]
  /** Piste B — « Films en compétition ». */
  trackB: HomeFilmVM[]
  /** Total des votes confirmés sur toute la slate (compteur public réel). */
  totalVotes: number
}

/* ── Construction du modèle de vue d'un film ──────────────────────────────── */

export function buildHomeFilmVM(input: HomeFilmInput): HomeFilmVM {
  const { film, filmId, voteCount } = input
  const trackInfo = VOTE_TRACKS[film.track]
  return {
    filmId,
    title: film.title,
    slug: film.slug,
    synopsis: film.synopsis,
    genre: film.genre,
    director: film.director,
    coverImageUrl: film.coverImageUrl,
    backdropUrl: film.backdropUrl ?? null,
    galleryUrls: film.galleryUrls ?? [],
    heroVideoUrl: film.heroVideoUrl ?? null,
    track: film.track,
    trackName: trackInfo.name,
    trackOutcome: trackInfo.outcome,
    progress: computeVoteProgress(voteCount),
    votable: filmId !== null,
  }
}

/* ── Sélection du film hero ────────────────────────────────────────────────
 * Renvoie le film demandé (prérequis fondateur 15.3) s'il existe, sinon le
 * premier de la liste — la vitrine ne doit jamais rendre un hero vide. */

export function selectHeroFilm(films: HomeFilmVM[], preferredSlug: string): HomeFilmVM | null {
  if (films.length === 0) return null
  return films.find((f) => f.slug === preferredSlug) ?? films[0]
}

/* ── Tri d'une piste : les films les plus proches du seuil d'abord ─────────── */

export function sortByProgressDesc(films: HomeFilmVM[]): HomeFilmVM[] {
  return [...films].sort((a, b) => b.progress.count - a.progress.count)
}

/* ── Modèle complet de la vitrine ─────────────────────────────────────────── */

export function buildHomeVitrineModel(
  inputs: HomeFilmInput[],
  heroSlug: string,
): HomeVitrineModel | null {
  const vms = inputs.map(buildHomeFilmVM)
  const hero = selectHeroFilm(vms, heroSlug)
  if (!hero) return null

  const trackA = sortByProgressDesc(vms.filter((f) => f.track === 'A'))
  const trackB = sortByProgressDesc(vms.filter((f) => f.track === 'B'))
  const totalVotes = vms.reduce((sum, f) => sum + f.progress.count, 0)

  return { hero, trackA, trackB, totalVotes }
}
