'use client'

/**
 * Vitrine d'accueil — session 15.3.
 *
 * Accueil « type Netflix » entièrement au service du vote (décision 15.0 #9) :
 * hero sur un film en vote (compteur RÉEL x/5000 + vote en ligne), deux rangées
 * de films en compétition (pistes A/B), « Comment ça marche », le parcours d'un
 * film, la Finale CINEGENY, l'Academy et un appel à l'inscription.
 *
 * Aucun chiffre inventé : tous les compteurs viennent du modèle construit
 * côté serveur à partir de la base (`src/lib/home-vitrine.ts`).
 * Wording puisé dans `src/content/brand.ts` (source de vérité, 15.1).
 * Conçu mobile d'abord (390px) puis étendu (règle 15.0bis #8).
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Vote,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clapperboard,
  PlayCircle,
  Trophy,
  GraduationCap,
  Sparkles,
  Wand2,
  Upload,
  Clock,
} from 'lucide-react'
import { VotePanel } from '@/components/films/vote-panel'
import { Reveal } from '@/components/academy/reveal'
import {
  BRAND,
  HOW_IT_WORKS,
  FILM_STATUS_ORDER,
  FILM_STATUSES,
  FINALE,
  VOTE,
  ACADEMY_NAV,
} from '@/content/brand'
import { ATELIER, FILM_DURATION } from '@/content/atelier'
import type { HomeVitrineModel, HomeFilmVM } from '@/lib/home-vitrine'

/* ── Compteur réel x/5000 + barre de progression ──────────────────────────── */

function VoteMeter({ film, size = 'md' }: { film: HomeFilmVM; size?: 'sm' | 'md' | 'lg' }) {
  const { count, threshold, pct } = film.progress
  const big = size === 'lg'
  // Version compacte (cartes du catalogue) : une barre fine + le compteur en
  // une seule ligne discrète — le chiffre reste RÉEL, la carte reste calme.
  if (size === 'sm') {
    return (
      <div className="w-full">
        <div className="h-1 overflow-hidden rounded-full bg-white/[0.10]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] leading-none text-white/45">
          {count.toLocaleString('fr-FR')} / {threshold.toLocaleString('fr-FR')} votes
        </p>
      </div>
    )
  }
  return (
    <div className="w-full">
      <div className={`flex items-baseline justify-between ${big ? 'mb-2' : 'mb-1.5'}`}>
        <span className={`font-playfair font-bold text-gold-brushed ${big ? 'text-2xl sm:text-3xl' : 'text-base'}`}>
          {count.toLocaleString('fr-FR')}
          <span className={`font-sans font-normal text-white/40 ${big ? 'text-sm' : 'text-[11px]'}`}>
            {' '}/ {threshold.toLocaleString('fr-FR')} votes
          </span>
        </span>
        <span className={`font-medium text-[#C9A227] ${big ? 'text-sm' : 'text-[11px]'}`}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className={`overflow-hidden rounded-full bg-white/[0.08] ${big ? 'h-2' : 'h-1.5'}`}>
        <div
          className="progress-sheen h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── Carte compacte d'une rangée de genre (catalogue) ───────────────────────
 * Plus petite que les cartes des deux compétitions phares : la hiérarchie de
 * taille dit ce qui compte. Pas de chips (le genre est déjà le titre de la
 * rangée), un compteur en une ligne, un étalonnage cinéma sur l'affiche pour
 * unifier les visuels génériques avec la matière or/noir du site. */

function FilmCompactCard({ film }: { film: HomeFilmVM }) {
  return (
    <Link
      href={`/films/${film.slug}`}
      className="poster-grade group relative aspect-[2/3] w-[164px] shrink-0 snap-start overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C9A227]/45 hover:shadow-[0_20px_50px_-14px_rgba(0,0,0,0.85),0_0_28px_rgba(201,162,39,0.08)] sm:w-[184px]"
    >
      {film.coverImageUrl ? (
        <Image
          src={film.coverImageUrl}
          alt={`Affiche du film ${film.title}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          sizes="184px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03]">
          <Clapperboard className="h-9 w-9 text-[#C9A227]/20" />
        </div>
      )}

      {/* Voile bas — un peu plus soutenu que sur les grandes cartes pour
          asseoir le titre sur des visuels très variés. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/40 to-[#0A0908]/5 transition-colors duration-500 group-hover:via-[#0A0908]/60" />

      <div className="absolute inset-x-0 bottom-0 p-3">
        <h3 className="line-clamp-2 font-playfair text-sm font-bold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-colors group-hover:text-[#F0D183]">
          {film.title}
        </h3>
        <div className="mt-2">
          <VoteMeter film={film} size="sm" />
        </div>
      </div>
    </Link>
  )
}

/* ── Carte film d'une rangée « En vote » ──────────────────────────────────── */

function FilmVoteCard({ film }: { film: HomeFilmVM }) {
  return (
    <Link
      href={`/films/${film.slug}`}
      className="group relative aspect-[2/3] w-[248px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-all duration-500 hover:-translate-y-2 hover:border-[#C9A227]/50 hover:shadow-[0_28px_70px_-16px_rgba(0,0,0,0.85),0_0_36px_rgba(201,162,39,0.10)] sm:w-[288px]"
    >
      {/* Affiche plein cadre (portrait — normal poster) */}
      {film.coverImageUrl ? (
        <Image
          src={film.coverImageUrl}
          alt={`Affiche du film ${film.title}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          sizes="288px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03]">
          <Clapperboard className="h-12 w-12 text-[#C9A227]/20" />
        </div>
      )}

      {/* Voile bas — renforcé au survol pour la mini-fiche */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/25 to-transparent transition-colors duration-500 group-hover:via-[#0A0908]/55" />

      {/* Chips */}
      <span className="absolute left-3 top-3 rounded-full border border-[#C9A227]/25 bg-[#0A0908]/70 px-2.5 py-0.5 text-[10px] font-semibold text-[#E8C766] backdrop-blur-md">
        En vote
      </span>
      <span className="absolute right-3 top-3 rounded-full border border-white/12 bg-[#0A0908]/60 px-2.5 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
        {film.genre}
      </span>

      {/* Mini-fiche — bouton « Voter » révélé au survol (toujours visible en tactile) */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="line-clamp-2 font-playfair text-lg font-bold leading-snug text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] transition-colors group-hover:text-[#F0D183]">
          {film.title}
        </h3>
        <div className="mt-2.5">
          <VoteMeter film={film} />
        </div>
        <span className="bg-gold-brushed btn-sheen mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-500 md:mt-0 md:max-h-0 md:translate-y-3 md:overflow-hidden md:py-0 md:opacity-0 md:group-hover:mt-3 md:group-hover:max-h-12 md:group-hover:translate-y-0 md:group-hover:py-2.5 md:group-hover:opacity-100 md:group-focus-visible:mt-3 md:group-focus-visible:max-h-12 md:group-focus-visible:py-2.5 md:group-focus-visible:opacity-100">
          <Vote className="h-3.5 w-3.5" />
          Voter
        </span>
      </div>
    </Link>
  )
}

/* ── Rangée horizontale d'une compétition ─────────────────────────────────── */

function VoteRail({
  title,
  tagline,
  films,
}: {
  title: string
  tagline: string
  films: HomeFilmVM[]
}) {
  const railRef = useRef<HTMLDivElement>(null)

  if (films.length === 0) return null

  const scroll = (dir: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' })
  }

  return (
    <section className="relative py-8 md:py-10">
      <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-8 md:px-16 lg:px-20">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E8C766]">
              <Vote className="h-3 w-3" /> En vote
            </span>
          </div>
          <h2 className="font-playfair text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="mt-1.5 max-w-md text-xs text-white/45 sm:text-sm">{tagline}</p>
        </div>
        {/* Flèches (desktop) — seulement si la rangée déborde vraiment */}
        {films.length > 4 && (
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            onClick={() => scroll('left')}
            aria-label="Défiler vers la gauche"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Défiler vers la droite"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        )}
      </div>

      <div
        ref={railRef}
        className="rail-fade flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 px-4 py-3 sm:scroll-pl-8 sm:px-8 md:scroll-pl-16 md:px-16 lg:scroll-pl-20 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {films.map((film) => (
          <FilmVoteCard key={film.slug} film={film} />
        ))}
      </div>
    </section>
  )
}

/* ── Rangée par genre — l'abondance du catalogue (slate + archives) ─────────
 * Même carte que les compétitions, mais titrée par genre. Défilement horizontal
 * façon Netflix. Toutes les rangées ensemble montrent TOUT le catalogue. */

const GENRE_LABELS_FR: Record<string, string> = {
  'Pipeline 2026': 'Pipeline 2026',
  Drama: 'Drame',
  'Sci-Fi': 'Science-fiction',
  Historical: 'Historique',
  Action: 'Action',
  Thriller: 'Thriller',
  Animation: 'Animation',
  Documentary: 'Documentaire',
  Romance: 'Romance',
  Comedy: 'Comédie',
  Fantasy: 'Fantastique',
}

function GenreRail({ genre, films }: { genre: string; films: HomeFilmVM[] }) {
  const railRef = useRef<HTMLDivElement>(null)

  if (films.length === 0) return null

  const scroll = (dir: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' })
  }

  return (
    <section className="relative py-6 md:py-7">
      <div className="mb-4 flex items-end justify-between gap-4 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="flex items-baseline gap-3">
          <h2 className="font-playfair text-lg font-bold text-white sm:text-xl">
            {GENRE_LABELS_FR[genre] ?? genre}
          </h2>
          <span className="text-[11px] text-white/35">{films.length} films</span>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            onClick={() => scroll('left')}
            aria-label="Défiler vers la gauche"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Défiler vers la droite"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="rail-fade flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-4 px-4 py-3 sm:gap-4 sm:scroll-pl-8 sm:px-8 md:scroll-pl-16 md:px-16 lg:scroll-pl-20 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {films.map((film) => (
          <FilmCompactCard key={film.slug} film={film} />
        ))}
      </div>
    </section>
  )
}

/* ── Section « Tout le catalogue » — l'ensemble des rangées de genre ────────── */

function CatalogGenres({ rails }: { rails: HomeVitrineModel['genreRails'] }) {
  if (rails.length === 0) return null
  return (
    // Pas de border-t : la bande « Comment ça marche » juste au-dessus porte
    // déjà le filet de séparation (border-y).
    <section className="relative pt-12">
      <div className="mb-2 px-4 sm:px-8 md:px-16 lg:px-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#E8C766]">
          <Clapperboard className="h-3 w-3" /> Tout le catalogue
        </span>
        <h2 className="mt-2 font-playfair text-2xl font-bold text-white sm:text-3xl">
          Explorez tous les films
        </h2>
        <p className="mt-1.5 max-w-md text-xs text-white/45 sm:text-sm">
          Parcourez l’intégralité du catalogue par genre. Chaque titre est en
          compétition — votez pour celui que vous voulez voir se faire.
        </p>
      </div>
      {rails.map((rail) => (
        <GenreRail key={rail.genre} genre={rail.genre} films={rail.films} />
      ))}
    </section>
  )
}

/* ── Fond vidéo du hero ─────────────────────────────────────────────────────
 * React ne sérialise pas l'attribut `muted` dans le HTML rendu : sans lui, la
 * politique d'autoplay des navigateurs bloque la lecture. On force donc
 * muted + play() au montage. Un jumeau `.webm` du même nom est proposé en
 * secours de codec quand l'URL est un `.mp4` (convention : déposer les deux). */

function HeroVideo({ videoUrl, posterUrl }: { videoUrl: string; posterUrl: string | null }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {
      /* autoplay refusé (économie d'énergie…) : l'affiche poster reste. */
    })
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full scale-105 object-cover object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={posterUrl ?? undefined}
      aria-hidden
    >
      <source src={videoUrl} />
      {videoUrl.endsWith('.mp4') && <source src={videoUrl.replace(/\.mp4$/, '.webm')} />}
    </video>
  )
}

/* ── Carrousel de hero : ~10 films défilent en pleine page ─────────────────
 * Slate en vote + titres « Bientôt » pour compléter jusqu'à 10 diapositives.
 * Auto-avance 8 s (pause au survol), fondu croisé des fonds, vignettes
 * cliquables. Seule la diapositive active anime son Ken Burns (GPU). */

type HeroSlide =
  | { kind: 'film'; film: HomeFilmVM }
  | { kind: 'soon'; title: string; genre: string; posterUrl: string }

function HeroCarousel({ model }: { model: HomeVitrineModel }) {
  // Session 15.11 : uniquement de vrais films (plus de titres « à venir »), et
  // AUCUNE auto-avance — la navigation se fait à la main via les vignettes.
  const slides: HeroSlide[] = (() => {
    const rest = [...model.trackB, ...model.trackA].filter((f) => f.slug !== model.hero.slug)
    return [model.hero, ...rest].map((film) => ({ kind: 'film', film }))
  })()

  const [index, setIndex] = useState(0)
  const active = slides[index]

  return (
    <section className="hero-vignette relative flex min-h-[94vh] items-end overflow-hidden">
      {/* Fonds en fondu croisé */}
      {slides.map((slide, i) => {
        const cover = slide.kind === 'film' ? (slide.film.backdropUrl ?? slide.film.coverImageUrl) : slide.posterUrl
        const video = slide.kind === 'film' ? slide.film.heroVideoUrl : null
        const isActive = i === index
        return (
          <div
            key={slide.kind === 'film' ? slide.film.slug : slide.title}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            aria-hidden={!isActive}
          >
            {video && isActive ? (
              <HeroVideo videoUrl={video} posterUrl={cover} />
            ) : cover ? (
              <Image
                src={cover}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className={`object-cover object-center ${isActive ? 'kenburns' : ''}`}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/15 via-[#0A0908] to-[#0A0908]" />
            )}
          </div>
        )
      })}

      {/* Voiles cinématographiques (communs à toutes les diapositives) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/80 to-[#0A0908]/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A0908]/90 via-[#0A0908]/40 to-transparent" />

      {/* Contenu de la diapositive active (toujours un vrai film) */}
      {active.kind === 'film' && (
        <HeroContent key={active.film.slug} film={active.film} totalVotes={model.totalVotes} />
      )}

      {/* Vignettes de navigation */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-end gap-2 px-4">
        {slides.map((slide, i) => {
          const cover = slide.kind === 'film' ? slide.film.coverImageUrl : slide.posterUrl
          const label = slide.kind === 'film' ? slide.film.title : slide.title
          const isActive = i === index
          return (
            <button
              key={label}
              onClick={() => setIndex(i)}
              aria-label={`Voir ${label}`}
              className={`relative hidden aspect-[2/3] w-9 shrink-0 overflow-hidden rounded-md border transition-all duration-300 sm:block ${
                isActive
                  ? 'w-11 border-[#C9A227]/80 shadow-[0_0_16px_rgba(201,162,39,0.35)]'
                  : 'border-white/15 opacity-55 hover:opacity-90'
              }`}
            >
              {cover && <Image src={cover} alt="" fill sizes="44px" className="object-cover" />}
            </button>
          )
        })}
        {/* Points (mobile) */}
        <div className="flex items-center gap-1.5 sm:hidden">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Diapositive ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-[#E8C766]' : 'w-1.5 bg-white/25'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Contenu hero d'un film en vote ───────────────────────────────────────── */

function HeroContent({ film, totalVotes }: { film: HomeFilmVM; totalVotes: number }) {
  return (
    <div className="fade-in-up relative z-10 w-full px-4 pb-20 sm:px-8 md:px-16 md:pb-24 lg:px-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Récit */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/25 bg-[#0A0908]/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E8C766] backdrop-blur-md">
              <Vote className="h-3 w-3" /> En vote · {film.trackName}
            </span>

            <h1 className="mt-4 font-playfair text-4xl font-bold leading-[1.02] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
              {film.title}
            </h1>

            <p className="mt-3 text-base font-medium text-gold-brushed">{BRAND.baseline}</p>

            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/60 sm:text-[15px]">
              {film.synopsis}
            </p>

            <p className="mt-4 text-xs text-white/40">{film.trackOutcome}</p>

            {/* Preuve sociale réelle */}
            {totalVotes > 0 && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/45">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A227]/70" />
                {totalVotes.toLocaleString('fr-FR')} votes déjà exprimés sur CINEGENY
              </p>
            )}
          </div>

          {/* Vote en ligne (compteur réel + bouton) */}
          <div className="w-full max-w-md lg:justify-self-end">
            {film.votable && film.filmId ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0908]/70 p-1 backdrop-blur-md">
                <VotePanel
                  filmId={film.filmId}
                  filmTitle={film.title}
                  track={film.track}
                  initialProgress={film.progress}
                />
              </div>
            ) : (
              /* Repli : base indisponible → on renvoie vers la fiche du film */
              <div className="rounded-2xl border border-white/[0.08] bg-[#0A0908]/70 p-6 backdrop-blur-md">
                <VoteMeter film={film} size="lg" />
                <div className="mt-4 flex justify-center sm:mt-5 sm:block">
                  <Link
                    href={`/films/${film.slug}`}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/[0.10] px-5 py-1.5 text-xs font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.18] sm:w-full sm:rounded-xl sm:px-0 sm:py-3.5 sm:text-sm"
                  >
                    <Vote className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Voter
                  </Link>
                </div>
              </div>
            )}
            <Link
              href={`/films/${film.slug}`}
              className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-[#E8C766]"
            >
              Voir la fiche du film <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
  )
}

/* ── Bandeau de preuve sous le hero : uniquement des chiffres RÉELS ─────────
 * (compteurs de votes en base + taille de la slate éditoriale). */

function ProofStrip({ model }: { model: HomeVitrineModel }) {
  const items: { value: string; label: string }[] = []

  if (model.totalVotes > 0) {
    items.push({ value: model.totalVotes.toLocaleString('fr-FR'), label: 'votes exprimés' })
  }
  items.push({ value: String(model.totalFilms), label: 'films en compétition' })
  items.push({ value: VOTE.threshold.toLocaleString('fr-FR'), label: 'votes, et le film se fait' })
  items.push({ value: '1', label: 'vote gratuit par film' })

  return (
    <div className="relative border-y border-white/[0.05] bg-[#080706]/80">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 sm:gap-x-14">
        {items.map((it, i) => (
          <div key={it.label} className="flex items-center gap-10 sm:gap-14">
            {i > 0 && <span className="hidden h-8 w-px bg-gradient-to-b from-transparent via-[#C9A227]/30 to-transparent sm:block" />}
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-xl font-bold text-gold-brushed sm:text-2xl">{it.value}</span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">{it.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Bande fine « Créer & apprendre » — Mini Studio + Academy, HAUT de page ──
 * 2e mise en avant du Mini Studio (plus haut, juste sous le hero) et de
 * l'Academy, reliés l'un à l'autre : on apprend à l'Academy, on crée au Mini
 * Studio. Volontairement slim pour ne pas voler la vedette au vote. */

function CreateLearnStrip() {
  return (
    <section className="px-4 pt-8 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2">
        {/* Mini Studio — créer */}
        <Link
          href={ATELIER.href}
          className="group flex items-center gap-4 rounded-2xl border border-[#C9A227]/20 bg-gradient-to-r from-[#C9A227]/[0.07] to-transparent px-5 py-4 transition-colors hover:border-[#C9A227]/40"
        >
          <span className="bg-gold-brushed inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
            <Clapperboard className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              {ATELIER.name} <span className="text-white/40">· Créez votre film</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-white/45">Débutant ou exigeant — plan par plan avec l’IA.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#C9A227] transition-transform group-hover:translate-x-0.5" />
        </Link>

        {/* Academy — apprendre, reliée au Mini Studio */}
        <Link
          href={ACADEMY_NAV.href}
          className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#C9A227]/30"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
            <GraduationCap className="h-5 w-5 text-[#C9A227]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">
              CINEGENY <span className="text-gold-brushed">{ACADEMY_NAV.label}</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-white/45">Apprenez le cinéma IA, puis créez au Mini Studio.</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#C9A227] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}

/* ── « Comment ça marche » + parcours du film — version COMPACTE ────────────
 * Les deux blocs (les 3 gestes du spectateur + le cycle de vie du film)
 * tenaient chacun sur une pleine hauteur d'écran. On les fond ici en UNE bande
 * compacte : à gauche les 3 gestes, à droite le parcours En vote → En
 * production → À regarder en frise fine. Beaucoup moins de place, même message. */

const PARCOURS_ICONS = { 'en-vote': Vote, 'en-production': Clapperboard, 'a-regarder': PlayCircle } as const

function HowItWorks() {
  return (
    <section className="relative border-y border-white/[0.06] bg-white/[0.015] px-4 py-12 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Les 3 gestes — calés sur la baseline */}
        <div>
          <div className="mb-6">
            <h2 className="font-playfair text-2xl font-bold text-white sm:text-3xl">Comment ça marche</h2>
            <p className="mt-1.5 max-w-md text-xs leading-relaxed text-white/45">{VOTE.rule}</p>
          </div>
          <ol className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            {HOW_IT_WORKS.map((step, i) => (
              <li key={step.title} className="flex flex-1 items-start gap-3">
                <span className="font-playfair text-2xl font-bold leading-none text-[#C9A227]/40">{i + 1}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-white/45">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Le parcours d'un film — frise fine */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
          <span className="mb-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/45">
            <Eye className="h-3 w-3" /> Le parcours d’un film
          </span>
          <div className="flex items-stretch gap-2">
            {FILM_STATUS_ORDER.map((key, i) => {
              const status = FILM_STATUSES[key]
              const Icon = PARCOURS_ICONS[key]
              return (
                <div key={key} className="flex flex-1 items-center gap-2">
                  <div className="flex-1 text-center">
                    <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
                      <Icon className="h-4 w-4 text-[#C9A227]" />
                    </span>
                    <p className="mt-2 text-xs font-semibold text-white">{status.label}</p>
                  </div>
                  {i < FILM_STATUS_ORDER.length - 1 && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#C9A227]/40" />
                  )}
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            {FILM_STATUSES['en-vote'].description}
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Finale CINEGENY ──────────────────────────────────────────────────────── */

function FinaleBlock() {
  return (
    <section className="px-4 py-16 sm:px-8 md:px-16 lg:px-20">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/[0.08] via-[#0A0908] to-transparent p-8 md:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#C9A227]/[0.08] blur-[90px]" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A227]/25 bg-[#C9A227]/12">
              <Trophy className="h-6 w-6 text-[#C9A227]" />
            </span>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-gold-brushed md:text-3xl">{FINALE.name}</h2>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#C9A227]/60">
                Des prix à gagner — dont des voyages
              </p>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">{FINALE.description}</p>
          <Link
            href="/finale"
            className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.10] px-5 py-3 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.18]"
          >
            Découvrir la Finale <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Le Mini Studio : créer sa bande-annonce ou insérer son film ───────────── */

function MiniStudioBlock() {
  return (
    <section className="px-4 py-4 sm:px-8 md:px-16 lg:px-20">
      <div className="border-gold-brushed relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#C9A227]/[0.08] via-[#0E0D0A] to-transparent p-8 md:p-12">
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-[#C9A227]/[0.07] blur-[90px]" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <span className="bg-gold-brushed inline-flex h-12 w-12 items-center justify-center rounded-2xl">
              <Clapperboard className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-playfair text-2xl font-bold text-gold-brushed md:text-3xl">
                {ATELIER.name} CINEGENY
              </h2>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#C9A227]/60">
                Débutant ou exigeant — votre film, plan par plan
              </p>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">
            {ATELIER.tagline}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.08] px-3 py-1 text-[11px] font-semibold text-[#E8C766]">
              <Sparkles className="h-3 w-3" /> Débutants bienvenus
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70">
              <Wand2 className="h-3 w-3 text-[#C9A227]/80" /> Contrôle plan par plan pour les exigeants
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/45">
              <Clock className="h-3.5 w-3.5 text-[#C9A227]/70" />
              Format des films : {FILM_DURATION.label}
            </span>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ATELIER.href}
              className="bg-gold-brushed btn-sheen inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all"
            >
              <Wand2 className="h-4 w-4" /> Créer ma bande-annonce
            </Link>
            <Link
              href="/streaming/submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.08] px-6 py-3 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.16]"
            >
              <Upload className="h-4 w-4" /> Insérer mon film
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Academy (accroche) ───────────────────────────────────────────────────── */

function AcademyBlock() {
  return (
    <section className="px-4 pb-4 sm:px-8 md:px-16 lg:px-20">
      <Link
        href={ACADEMY_NAV.href}
        className="group mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 rounded-2xl border border-[#C9A227]/15 bg-gradient-to-r from-[#C9A227]/[0.06] to-transparent px-6 py-5 transition-colors hover:border-[#C9A227]/35 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
            <GraduationCap className="h-5 w-5 text-[#C9A227]" />
          </span>
          <div>
            <p className="text-base font-semibold text-white">
              CINEGENY <span className="text-gold-brushed">{ACADEMY_NAV.label}</span>
            </p>
            <p className="mt-0.5 text-sm text-white/45">{ACADEMY_NAV.tagline}, puis passez à la pratique au Mini Studio.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#C9A227] transition-transform group-hover:translate-x-0.5">
          Découvrir <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </section>
  )
}

/* ── CTA final : inscription ──────────────────────────────────────────────── */

function FinalCta() {
  return (
    <section className="px-4 py-20 text-center sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl">
          {BRAND.launchLine}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">
          Créez votre compte gratuit pour confirmer vos votes, suivre les films que vous soutenez et
          gagner des {`Points ${BRAND.name}`}.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="bg-gold-brushed btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all sm:w-auto"
          >
            <Sparkles className="h-4 w-4" /> Créer mon compte gratuit
          </Link>
          <Link
            href="/films"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white sm:w-auto"
          >
            <Vote className="h-4 w-4" /> Voir tous les films en vote
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── Composant principal ──────────────────────────────────────────────────── */

export function HomeVitrine({ model }: { model: HomeVitrineModel }) {
  return (
    <main className="film-grain bg-[#0A0908] text-white">
      <HeroCarousel model={model} />

      <ProofStrip model={model} />

      <CreateLearnStrip />

      <VoteRail
        title="Bandes-annonces en compétition"
        tagline="Des films au stade bande-annonce. À 5 000 votes, le film part en production."
        films={model.trackA}
      />

      <VoteRail
        title="Films en compétition"
        tagline="Des films déjà réalisés. À 5 000 votes, ils entrent en Finale CINEGENY."
        films={model.trackB}
      />

      {/* La règle du jeu AVANT l'abondance du catalogue : on comprend d'abord,
          on explore ensuite (le catalogue fait dix rangées). */}
      <Reveal><HowItWorks /></Reveal>

      <CatalogGenres rails={model.genreRails} />

      <Reveal><MiniStudioBlock /></Reveal>
      <Reveal><FinaleBlock /></Reveal>
      <Reveal><AcademyBlock /></Reveal>
      <Reveal><FinalCta /></Reveal>
    </main>
  )
}
