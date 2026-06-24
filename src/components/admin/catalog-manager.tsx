'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { Film, Search, Check, Archive, Sparkles, Eye } from 'lucide-react'
import Link from 'next/link'
import { ALL_FILMS, type FilmData } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'
import { useActiveArchivedSlugs, setArchivedActive } from '@/lib/catalog-state'

function PosterThumb({ film }: { film: FilmData }) {
  return (
    <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#C9A227]/10 to-black ring-1 ring-white/10">
      {film.coverImageUrl ? (
        <Image
          src={film.coverImageUrl}
          alt={film.title}
          fill
          unoptimized={film.coverImageUrl.includes('unsplash.com')}
          className="object-cover"
          sizes="44px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Film className="h-5 w-5 text-[#C9A227]/30" />
        </div>
      )}
    </div>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition-all duration-300 ${
        on
          ? 'border-[#C9A227]/60 bg-gradient-to-r from-[#8A6A12] to-[#C9A227] shadow-[0_0_16px_rgba(201,162,39,0.35)]'
          : 'border-white/15 bg-white/[0.06]'
      }`}
    >
      <span
        className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-all duration-300 ${
          on ? 'left-[26px]' : 'left-1'
        }`}
      />
    </button>
  )
}

function FilmRow({
  film,
  on,
  onToggle,
  locked,
}: {
  film: FilmData
  on: boolean
  onToggle?: () => void
  locked?: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-300 hover:border-[#C9A227]/25 hover:bg-white/[0.03]">
      <PosterThumb film={film} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-white">{film.title}</h3>
          {on && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-0.5 text-[10px] font-semibold text-[#E8C766]">
              <Sparkles className="h-2.5 w-2.5" /> Actif
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-white/40">
          {film.genre} · {film.director} · {film.year}
        </p>
      </div>
      <Link
        href={`/films/${film.slug}`}
        target="_blank"
        className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/70 sm:flex"
        title="Voir la fiche"
      >
        <Eye className="h-4 w-4" />
      </Link>
      {locked ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3 py-1 text-[11px] font-semibold text-[#E8C766]">
          <Check className="h-3 w-3" /> Slate
        </span>
      ) : (
        <Toggle on={on} onClick={onToggle!} />
      )}
    </div>
  )
}

export function CatalogManager() {
  const activeSlugs = useActiveArchivedSlugs()
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<string>('Tous')
  const [error, setError] = useState<string | null>(null)

  const genres = useMemo(
    () => ['Tous', ...Array.from(new Set(ARCHIVED_FILMS.map((f) => f.genre)))],
    []
  )

  const filteredArchived = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ARCHIVED_FILMS.filter((f) => {
      if (genre !== 'Tous' && f.genre !== genre) return false
      if (!q) return true
      return (
        f.title.toLowerCase().includes(q) ||
        f.director.toLowerCase().includes(q) ||
        f.genre.toLowerCase().includes(q)
      )
    })
  }, [query, genre])

  const activeCount = activeSlugs.size

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold sm:text-4xl">
          <span className="text-gold-metallic">Catalogue</span> — Actif / Archivé
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50">
          La slate active (6 films réels) est toujours publiée. Réactivez n&apos;importe quel film
          archivé pour le faire réapparaître dans le catalogue public.
        </p>
        {error && (
          <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-3 sm:max-w-xl">
        {[
          { label: 'Slate active', value: ALL_FILMS.length, icon: Sparkles },
          { label: 'Archivés réactivés', value: activeCount, icon: Check },
          { label: 'En archive', value: ARCHIVED_FILMS.length, icon: Archive },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
          >
            <s.icon className="mx-auto mb-1.5 h-4 w-4 text-[#C9A227]" />
            <div className="text-2xl font-bold text-[#E8C766]">{s.value}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/40">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active slate */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">Slate active</h2>
          <span className="rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2.5 py-0.5 text-xs text-[#E8C766]">
            {ALL_FILMS.length}
          </span>
        </div>
        <div className="space-y-2.5">
          {ALL_FILMS.map((f) => (
            <FilmRow key={f.slug} film={f} on locked />
          ))}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      {/* Archived catalog */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-bold text-white">Catalogue archivé</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
            {ARCHIVED_FILMS.length}
          </span>
        </div>

        {/* Search + genre filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un titre, réalisateur, genre…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:border-[#C9A227]/40 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  genre === g
                    ? 'border-[#C9A227]/50 bg-[#C9A227]/15 text-[#E8C766]'
                    : 'border-white/10 bg-white/[0.03] text-white/50 hover:text-white/80'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredArchived.map((f) => {
            const on = activeSlugs.has(f.slug)
            return (
              <FilmRow
                key={f.slug}
                film={f}
                on={on}
                onToggle={() => {
                  setError(null)
                  setArchivedActive(f.slug, !on).catch((err) =>
                    setError(err instanceof Error ? err.message : 'Erreur inconnue')
                  )
                }}
              />
            )
          })}
          {filteredArchived.length === 0 && (
            <div className="py-14 text-center text-white/40">
              <Archive className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>Aucun film archivé ne correspond.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
