'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Vote, Clapperboard, PlayCircle, Film, ChevronLeft, ChevronRight } from 'lucide-react'
import { FILM_STATUSES, type FilmStatusKey } from '@/content/brand'
import type { CatalogFilmVM, CatalogModel } from '@/lib/films-catalog'

/**
 * Catalogue `/films` — refonte session 15.11.
 *
 * Tout le catalogue est remis en ligne et rangé façon Netflix : une rangée par
 * CATÉGORIE (genre), défilement horizontal MANUEL (aucune auto-animation). Un
 * filtre optionnel par étape du parcours (Tous / En vote / En production / À
 * regarder) reste disponible. Chaque carte est une affiche compacte qui mène à
 * la fiche du film (c'est là qu'on vote).
 */

/* ── Catégories : clé technique (FilmData.genre) → libellé FR, dans l'ordre ── */

const GENRE_ORDER: { key: string; label: string }[] = [
  { key: 'Pipeline 2026', label: 'À la une' },
  { key: 'Action', label: 'Action' },
  { key: 'Drama', label: 'Drame' },
  { key: 'Historical', label: 'Histoire' },
  { key: 'Sci-Fi', label: 'Science-fiction' },
  { key: 'Thriller', label: 'Thriller' },
  { key: 'Comedy', label: 'Comédie' },
  { key: 'Documentary', label: 'Documentaire' },
  { key: 'Animation', label: 'Animation' },
  { key: 'Romance', label: 'Romance' },
  { key: 'Fantasy', label: 'Fantastique' },
]

const STATUS_ICONS: Record<FilmStatusKey, typeof Vote> = {
  'en-vote': Vote,
  'en-production': Clapperboard,
  'a-regarder': PlayCircle,
}

const FILTERS: { key: 'all' | FilmStatusKey; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'en-vote', label: FILM_STATUSES['en-vote'].label },
  { key: 'en-production', label: FILM_STATUSES['en-production'].label },
  { key: 'a-regarder', label: FILM_STATUSES['a-regarder'].label },
]

function isUnsplash(url: string | null): boolean {
  return !!url && url.includes('unsplash.com')
}

/* ── Carte affiche compacte (façon Netflix) ─────────────────────────────── */

function PosterCard({ film }: { film: CatalogFilmVM }) {
  const StatusIcon = STATUS_ICONS[film.statusKey]
  return (
    <Link
      href={`/films/${film.slug}`}
      className="group relative w-[150px] shrink-0 snap-start sm:w-[172px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03] transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#C9A227]/40 group-hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.8)]">
        {film.coverImageUrl ? (
          <Image
            src={film.coverImageUrl}
            alt={`Affiche du film ${film.title}`}
            fill
            unoptimized={isUnsplash(film.coverImageUrl)}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            sizes="172px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film className="h-12 w-12 text-[#C9A227]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Puce d'étape en bas */}
        <div className="absolute inset-x-2 bottom-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
            <StatusIcon className="h-3 w-3 text-[#C9A227]" />
            {FILM_STATUSES[film.statusKey].label}
          </span>
        </div>

        {/* Progression du vote (films en vote) */}
        {film.statusKey === 'en-vote' && (
          <div className="absolute inset-x-0 top-0 h-0.5 bg-white/[0.06]">
            <div
              className="h-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A]"
              style={{ width: `${film.progress.pct}%` }}
            />
          </div>
        )}
      </div>

      <h3 className="mt-2 line-clamp-1 text-[13px] font-semibold text-white transition-colors group-hover:text-[#E8C766]">
        {film.title}
      </h3>
      <p className="line-clamp-1 text-[11px] text-white/40">
        {film.statusKey === 'en-vote'
          ? `${film.progress.count.toLocaleString('fr-FR')} / ${film.progress.threshold.toLocaleString('fr-FR')} votes`
          : film.director}
      </p>
    </Link>
  )
}

/* ── Rangée d'une catégorie (défilement manuel) ──────────────────────────── */

function GenreRow({ label, films }: { label: string; films: CatalogFilmVM[] }) {
  const railRef = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    railRef.current?.scrollBy({ left: dir === 'left' ? -560 : 560, behavior: 'smooth' })
  }

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center gap-3 px-4 sm:px-8 md:px-16 lg:px-20">
        <h2 className="text-lg font-bold text-white sm:text-xl">{label}</h2>
        <span className="rounded-full border border-white/[0.06] bg-white/[0.06] px-2 py-0.5 text-xs text-white/40">
          {films.length}
        </span>
        <div className="ml-auto hidden gap-1.5 sm:flex">
          <button
            onClick={() => scroll('left')}
            aria-label="Défiler à gauche"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Défiler à droite"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:px-8 md:px-16 lg:px-20"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {films.map((film) => (
          <PosterCard key={film.slug} film={film} />
        ))}
      </div>
    </section>
  )
}

/* ── Composant principal ─────────────────────────────────────────────────── */

export default function FilmCategories({ model }: { model: CatalogModel }) {
  const [filter, setFilter] = useState<'all' | FilmStatusKey>('all')

  const films: CatalogFilmVM[] =
    filter === 'all'
      ? [...model['en-vote'], ...model['en-production'], ...model['a-regarder']]
      : model[filter]

  // Rangées par genre, dans l'ordre défini ; puis tout genre non listé, à la fin.
  const known = new Set(GENRE_ORDER.map((g) => g.key))
  const orderedRows = GENRE_ORDER.map((g) => ({
    label: g.label,
    films: films.filter((f) => f.genre === g.key),
  })).filter((r) => r.films.length > 0)

  const extraGenres = [...new Set(films.filter((f) => !known.has(f.genre)).map((f) => f.genre))]
  const extraRows = extraGenres.map((genre) => ({
    label: genre,
    films: films.filter((f) => f.genre === genre),
  }))

  const rows = [...orderedRows, ...extraRows]

  return (
    <section className="relative py-16">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Titre de section */}
      <div className="mb-10 px-4 text-center sm:px-8">
        <h2 className="mb-3 font-playfair text-3xl font-bold text-white sm:text-5xl">
          Catalogue <span className="text-gold-brushed">CINEGENY</span>
        </h2>
        <p className="mx-auto max-w-xl text-sm text-white/50">
          Tout le catalogue, rangé par catégorie. Ouvrez une fiche pour voter et faire le film.
        </p>
      </div>

      {/* Filtre par étape du parcours */}
      <div className="mb-10 flex flex-wrap justify-center gap-2 px-4">
        {FILTERS.map((f) => {
          const isActive = filter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#C9A227] text-black'
                  : 'border border-white/10 bg-white/[0.03] text-white/60 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Rangées par catégorie */}
      {rows.length > 0 ? (
        rows.map((row) => <GenreRow key={row.label} label={row.label} films={row.films} />)
      ) : (
        <div className="mx-auto max-w-md rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <p className="text-sm text-white/40">Aucun film dans cette étape pour le moment.</p>
        </div>
      )}
    </section>
  )
}
