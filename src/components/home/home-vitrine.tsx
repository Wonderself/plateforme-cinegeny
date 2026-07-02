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

import { useRef } from 'react'
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
} from 'lucide-react'
import { VotePanel } from '@/components/films/vote-panel'
import {
  BRAND,
  HOW_IT_WORKS,
  FILM_STATUS_ORDER,
  FILM_STATUSES,
  FINALE,
  VOTE,
  ACADEMY_NAV,
} from '@/content/brand'
import type { HomeVitrineModel, HomeFilmVM } from '@/lib/home-vitrine'

/* ── Compteur réel x/5000 + barre de progression ──────────────────────────── */

function VoteMeter({ film, size = 'md' }: { film: HomeFilmVM; size?: 'md' | 'lg' }) {
  const { count, threshold, pct } = film.progress
  const big = size === 'lg'
  return (
    <div className="w-full">
      <div className={`flex items-baseline justify-between ${big ? 'mb-2' : 'mb-1.5'}`}>
        <span className={`font-playfair font-bold text-gold-metallic ${big ? 'text-2xl sm:text-3xl' : 'text-base'}`}>
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
          className="h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── Carte film d'une rangée « En vote » ──────────────────────────────────── */

function FilmVoteCard({ film }: { film: HomeFilmVM }) {
  return (
    <Link
      href={`/films/${film.slug}`}
      className="group flex w-[210px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A227]/40 sm:w-[230px]"
    >
      {/* Affiche */}
      <div className="relative aspect-[2/3] shrink-0 overflow-hidden bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03]">
        {film.coverImageUrl ? (
          <Image
            src={film.coverImageUrl}
            alt={`Affiche du film ${film.title}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            sizes="230px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Clapperboard className="h-12 w-12 text-[#C9A227]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-[#C9A227]/25 bg-[#0A0908]/70 px-2.5 py-0.5 text-[10px] font-medium text-[#E8C766] backdrop-blur-md">
          En vote
        </span>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-white transition-colors group-hover:text-[#E8C766]">
          {film.title}
        </h3>
        <VoteMeter film={film} />
        <span className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/[0.08] py-2 text-xs font-semibold text-[#E8C766] transition-colors group-hover:bg-[#C9A227]/[0.16]">
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
          <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
          <p className="mt-1 max-w-md text-xs text-white/45 sm:text-sm">{tagline}</p>
        </div>
        {/* Flèches (desktop) */}
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
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-8 md:px-16 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {films.map((film) => (
          <FilmVoteCard key={film.slug} film={film} />
        ))}
      </div>
    </section>
  )
}

/* ── Hero : un film en vote, plein écran ──────────────────────────────────── */

function Hero({ film, totalVotes }: { film: HomeFilmVM; totalVotes: number }) {
  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden">
      {/* Affiche de fond */}
      {film.coverImageUrl ? (
        <Image
          src={film.coverImageUrl}
          alt={`Affiche du film ${film.title}`}
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227]/15 via-[#0A0908] to-[#0A0908]" />
      )}
      {/* Voiles cinématographiques */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/80 to-[#0A0908]/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/90 via-[#0A0908]/40 to-transparent" />

      <div className="relative z-10 w-full px-4 pb-12 sm:px-8 md:px-16 md:pb-16 lg:px-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Récit */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#E8C766]">
              <Vote className="h-3 w-3" /> En vote · {film.trackName}
            </span>

            <h1 className="mt-4 font-playfair text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl">
              {film.title}
            </h1>

            <p className="mt-3 text-base font-medium text-gold-metallic">{BRAND.baseline}</p>

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
                <Link
                  href={`/films/${film.slug}`}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.10] py-3.5 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.18]"
                >
                  <Vote className="h-4 w-4" /> Voter
                </Link>
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
    </section>
  )
}

/* ── « Comment ça marche » (3 étapes, brand.ts) ───────────────────────────── */

function HowItWorks() {
  return (
    <section className="relative px-4 py-16 sm:px-8 md:px-16 md:py-20 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">Comment ça marche</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
            {VOTE.rule}
          </p>
        </div>
        <ol className="grid gap-5 sm:grid-cols-3">
          {HOW_IT_WORKS.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-[#C9A227]/25"
            >
              <span className="font-playfair text-4xl font-bold text-[#C9A227]/30">{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ── Le parcours d'un film : En vote → En production → À regarder ──────────── */

const PARCOURS_ICONS = { 'en-vote': Vote, 'en-production': Clapperboard, 'a-regarder': PlayCircle } as const

function Parcours() {
  return (
    <section className="relative border-y border-white/[0.06] bg-white/[0.015] px-4 py-16 sm:px-8 md:px-16 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/50">
            <Eye className="h-3 w-3" /> Le parcours d’un film
          </span>
          <h2 className="mt-3 font-playfair text-3xl font-bold text-white sm:text-4xl">
            De votre vote au streaming
          </h2>
        </div>
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center">
          {FILM_STATUS_ORDER.map((key, i) => {
            const status = FILM_STATUSES[key]
            const Icon = PARCOURS_ICONS[key]
            return (
              <div key={key} className="flex flex-1 items-center gap-4 md:flex-col md:text-center">
                <div className="flex flex-1 items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:h-full md:flex-col md:items-center md:gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
                    <Icon className="h-5 w-5 text-[#C9A227]" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{status.label}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">{status.description}</p>
                  </div>
                </div>
                {i < FILM_STATUS_ORDER.length - 1 && (
                  <ChevronRight className="h-5 w-5 shrink-0 rotate-90 text-[#C9A227]/40 md:rotate-0" />
                )}
              </div>
            )
          })}
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
              <h2 className="font-playfair text-2xl font-bold text-gold-metallic md:text-3xl">{FINALE.name}</h2>
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
              CINEGENY <span className="text-gold-metallic">{ACADEMY_NAV.label}</span>
            </p>
            <p className="mt-0.5 text-sm text-white/45">{ACADEMY_NAV.tagline} — de l’idée à la projection.</p>
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#C9A227]/40 bg-[#C9A227]/[0.12] px-7 py-3.5 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.22] sm:w-auto"
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
    <main className="bg-[#0A0908] text-white">
      <Hero film={model.hero} totalVotes={model.totalVotes} />

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

      <HowItWorks />
      <Parcours />
      <FinaleBlock />
      <AcademyBlock />
      <FinalCta />
    </main>
  )
}
