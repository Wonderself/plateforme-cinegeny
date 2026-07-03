'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Vote, Clapperboard, PlayCircle, Film, ChevronRight } from 'lucide-react'
import { VotePanel } from '@/components/films/vote-panel'
import { FILM_STATUS_ORDER, FILM_STATUSES, type FilmStatusKey } from '@/content/brand'
import type { CatalogFilmVM, CatalogModel } from '@/lib/films-catalog'

/**
 * Catalogue `/films` — session 15.5.
 *
 * Axe de navigation unique, celui du parcours d'un film (décision 15.0 #6) :
 * 3 onglets seulement — En vote (défaut) -> En production -> À regarder.
 * Compteurs réels et vote possible directement depuis la carte (via
 * `VotePanel` en mode compact, déjà branché sur le vote réel en base — 15.2).
 */

/* ── Helpers ── */

function isUnsplash(url: string | null): boolean {
  return !!url && url.includes('unsplash.com')
}

const STATUS_ICONS: Record<FilmStatusKey, typeof Vote> = {
  'en-vote': Vote,
  'en-production': Clapperboard,
  'a-regarder': PlayCircle,
}

const EMPTY_MESSAGES: Record<FilmStatusKey, string> = {
  'en-vote': 'Aucun film en vote pour le moment.',
  'en-production': 'Aucun film en production pour le moment — votez pour en faire entrer un !',
  'a-regarder': 'Aucun film disponible en streaming pour le moment — votez pour le faire advenir.',
}

/* ── Badges ── */

function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#C9A227]/30 bg-[#0A0908]/70 px-2.5 py-0.5 text-[10px] font-medium text-[#E8C766] backdrop-blur-md ring-1 ring-inset ring-white/5">
      {genre}
    </span>
  )
}

function TrackBadge({ track }: { track: 'A' | 'B' }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-black/60 px-2.5 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-md">
      Piste {track}
    </span>
  )
}

/* ── Carte film du catalogue ── */

function FilmCatalogCard({ film }: { film: CatalogFilmVM }) {
  const StatusIcon = STATUS_ICONS[film.statusKey]

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-[#C9A227]/40 hover:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.8),0_0_0_1px_rgba(201,162,39,0.18)]">
      {/* Gold top accent — reveals on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#E8C766] to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100" />

      <Link href={`/films/${film.slug}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] shrink-0 overflow-hidden bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03]">
          {film.coverImageUrl ? (
            <Image
              src={film.coverImageUrl}
              alt={`Affiche du film ${film.title}`}
              fill
              unoptimized={isUnsplash(film.coverImageUrl)}
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Film className="h-14 w-14 text-[#C9A227]/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
          <div className="absolute left-3 top-3 z-10">
            <GenreBadge genre={film.genre} />
          </div>
          <div className="absolute right-3 top-3 z-10">
            <TrackBadge track={film.track} />
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/films/${film.slug}`} className="block">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-white transition-colors group-hover:text-[#E8C766]">
            {film.title}
          </h3>
          <p className="mb-4 text-[11px] text-white/40">{film.director}</p>
        </Link>

        {film.statusKey === 'en-vote' ? (
          film.votable && film.filmId ? (
            <div className="mt-auto space-y-3">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-white/40">
                    {film.progress.count.toLocaleString('fr-FR')} / {film.progress.threshold.toLocaleString('fr-FR')} votes
                  </span>
                  <span className="font-medium text-[#C9A227]">{Math.round(film.progress.pct)}%</span>
                </div>
                <div className="relative h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-700 ease-out"
                    style={{ width: `${film.progress.pct}%` }}
                  />
                </div>
              </div>
              <VotePanel filmId={film.filmId} filmTitle={film.title} track={film.track} initialProgress={film.progress} compact />
            </div>
          ) : (
            <Link
              href={`/films/${film.slug}`}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.08] py-2.5 text-xs font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.16]"
            >
              <Vote className="h-3.5 w-3.5" />
              Voir la fiche et voter
            </Link>
          )
        ) : (
          <Link
            href={`/films/${film.slug}`}
            className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px]"
          >
            <span className="inline-flex items-center gap-1.5 text-white/50">
              <StatusIcon className="h-3.5 w-3.5 text-[#C9A227]/70" />
              {FILM_STATUSES[film.statusKey].label}
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-[#C9A227]/0 transition-all duration-300 group-hover:text-[#C9A227]">
              Voir la fiche
              <ChevronRight className="h-4 w-4 -translate-x-1 text-[#C9A227]/50 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#C9A227]" />
            </span>
          </Link>
        )}
      </div>
    </div>
  )
}

/* ── Section Header ── */

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <h2 className="text-xl font-bold text-white sm:text-2xl">{title}</h2>
      <span className="rounded-full border border-white/[0.06] bg-white/[0.06] px-2.5 py-0.5 text-xs text-white/40">
        {count}
      </span>
    </div>
  )
}

/* ── Main Component ── */

export default function FilmCategories({ model }: { model: CatalogModel }) {
  const [activeTab, setActiveTab] = useState<FilmStatusKey>('en-vote')
  const films = model[activeTab]

  return (
    <section className="relative px-4 py-20 sm:px-8 md:px-16 lg:px-20">
      {/* Top separator */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="container mx-auto max-w-7xl">
        {/* Section title */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Catalogue{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #C9A227 0%, #E8C766 40%, #C9A227 70%, #B8960C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CINEGENY
            </span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-white/50">
            Le parcours d’un film sur CINEGENY : en vote, en production, puis à regarder.
          </p>
        </div>

        {/* ── Onglets du parcours (axe de navigation unique, 15.0 #6) ── */}
        <div className="sticky top-16 z-30 -mx-4 mb-12 border-b border-white/[0.06] bg-[#0A0A0A]/90 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8 md:-mx-16 md:px-16 lg:-mx-20 lg:px-20">
          <div className="scrollbar-hide overflow-x-auto">
            <div className="flex min-w-max gap-1">
              {FILM_STATUS_ORDER.map((key) => {
                const isActive = activeTab === key
                const Icon = STATUS_ICONS[key]
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`relative flex items-center gap-2 whitespace-nowrap px-5 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {FILM_STATUSES[key].label}
                    <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/40">
                      {model[key].length}
                    </span>
                    {isActive && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#C9A227]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Grille des films de l'onglet actif ── */}
        {films.length > 0 ? (
          <div className="mb-16">
            <SectionHeader title={FILM_STATUSES[activeTab].label} count={films.length} />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {films.map((film) => (
                <FilmCatalogCard key={film.slug} film={film} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
            <p className="text-sm text-white/40">{EMPTY_MESSAGES[activeTab]}</p>
          </div>
        )}
      </div>
    </section>
  )
}
