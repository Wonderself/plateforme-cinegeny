'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Play, Star, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown,
  Eye, Vote, DollarSign, Film, Tv, TrendingUp, Sparkles,
} from 'lucide-react'

import { ALL_FILMS, type FilmData } from '@/data/films'
import { ALL_TV_SHOWS, type TvShowData } from '@/data/tv-shows'

/* ═══════════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════ */

const RED  = '#C9A227'
const BLUE = '#2563EB'
const BG   = '#0A0A0A'

/* ═══════════════════════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════════════════ */

function ratingToStars(r: string | number): number {
  if (typeof r === 'number') return r
  const map: Record<string, number> = {
    'G': 3.5, 'PG': 3.8, 'PG-13': 4.0, 'R': 4.3, 'NC-17': 4.5,
    'TV-G': 3.5, 'TV-PG': 3.8, 'TV-14': 4.1, 'TV-MA': 4.4,
  }
  return map[r] ?? 4.0
}

function StarsDisplay({ rating }: { rating: string | number }) {
  const n = ratingToStars(rating)
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={
            i <= Math.floor(n)
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-600'
          }
        />
      ))}
      <span className="text-[10px] text-gray-400 ml-1">{n.toFixed(1)}</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Horizontal-scroll row with arrows
   ═══════════════════════════════════════════════════════════════ */

function ScrollRow({
  children,
  label,
  accent,
  icon,
}: {
  children: React.ReactNode
  label: string
  accent: string
  icon: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }

  return (
    <section className="relative py-8 px-4 md:px-10">
      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: accent }}
        />
        {icon}
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {label}
        </h2>
      </div>

      {/* left arrow */}
      <button
        aria-label="Scroll left"
        onClick={() => scroll(-1)}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 bg-black/70
                   hover:bg-black p-2 rounded-full text-white backdrop-blur
                   hidden md:flex items-center justify-center"
      >
        <ChevronLeft size={22} />
      </button>

      {/* right arrow */}
      <button
        aria-label="Scroll right"
        onClick={() => scroll(1)}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 bg-black/70
                   hover:bg-black p-2 rounded-full text-white backdrop-blur
                   hidden md:flex items-center justify-center"
      >
        <ChevronRight size={22} />
      </button>

      {/* scrollable track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Film card  (2:3 poster)
   ═══════════════════════════════════════════════════════════════ */

function FilmCard({ film }: { film: FilmData }) {
  return (
    <Link
      href={`/films/${film.slug}`}
      className="group flex-shrink-0 w-[170px] md:w-[200px] rounded-xl overflow-hidden
                 bg-[#141414] border border-transparent hover:border-[#C9A227]/60
                 transition-all duration-300 hover:scale-[1.03]
                 hover:shadow-[0_0_24px_rgba(201,162,39,0.25)]"
    >
      {/* poster */}
      <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
        {film.coverImageUrl ? (
          <Image
            src={film.coverImageUrl}
            alt={film.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="200px"
            unoptimized={film.coverImageUrl.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Film size={40} className="text-gray-600" />
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#C9A227]/90 text-white">
          {film.genre}
        </span>
      </div>

      {/* info */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-white truncate">{film.title}</h3>
        <StarsDisplay rating={film.rating} />
        <p className="text-[10px] text-gray-500 truncate">
          {film.director} &middot; {film.year}
        </p>
        {/* quick actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link href={`/streaming/${film.slug}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#C9A227] transition-colors">
            <Eye size={12} /> Watch
          </Link>
          <Link href="/community" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-yellow-400 transition-colors">
            <Vote size={12} /> Vote
          </Link>
          <Link href="/invest" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-green-400 transition-colors">
            <DollarSign size={12} /> Invest
          </Link>
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   TV Show card  (2:3 portrait)
   ═══════════════════════════════════════════════════════════════ */

function TvCard({ show }: { show: TvShowData }) {
  return (
    <Link
      href={`/tv/shows/${show.slug}`}
      className="group flex-shrink-0 w-[170px] md:w-[200px] rounded-xl overflow-hidden
                 bg-[#141414] border border-transparent hover:border-[#2563EB]/60
                 transition-all duration-300 hover:scale-[1.03]
                 hover:shadow-[0_0_24px_rgba(37,99,235,0.25)]"
    >
      <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
        {show.coverImageUrl ? (
          <Image
            src={show.coverImageUrl}
            alt={show.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="200px"
            unoptimized={show.coverImageUrl.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <Tv size={40} className="text-gray-600" />
          </div>
        )}
        <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-[#2563EB]/90 text-white">
          {show.genre}
        </span>
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-semibold text-white truncate">{show.title}</h3>
        <StarsDisplay rating={show.rating} />
        <p className="text-[10px] text-gray-500 truncate">
          {show.host} &middot; {show.year}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Link href={`/tv/shows/${show.slug}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-[#2563EB] transition-colors">
            <Eye size={12} /> Watch
          </Link>
          <Link href="/community" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-yellow-400 transition-colors">
            <Vote size={12} /> Vote
          </Link>
          <Link href="/invest" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-green-400 transition-colors">
            <DollarSign size={12} /> Invest
          </Link>
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Trailer card  (16:9)
   ═══════════════════════════════════════════════════════════════ */

function TrailerCard({
  item,
  accent,
  badge,
  href,
}: {
  item: { title: string; coverImageUrl: string | null; genre: string }
  accent: string
  badge: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="group flex-shrink-0 w-[280px] md:w-[340px] rounded-xl overflow-hidden
                 bg-[#141414] border border-transparent transition-all duration-300
                 hover:scale-[1.02]"
    >
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {item.coverImageUrl ? (
          <Image
            src={item.coverImageUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="340px"
            unoptimized={(item.coverImageUrl ?? '').startsWith('http')}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}

        {/* play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm"
            style={{ background: `${accent}cc` }}
          >
            <Play size={26} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* badge */}
        <span
          className="absolute top-3 right-3 text-[10px] font-bold px-3 py-1 rounded-full text-white"
          style={{ background: accent }}
        >
          {badge}
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
        <p className="text-[10px] text-gray-500">{item.genre}</p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Vote card  (mixed films + TV)
   ═══════════════════════════════════════════════════════════════ */

function VoteCard({
  title,
  genre,
  synopsis,
  coverImageUrl,
  isFilm,
  fundingPct,
  href,
}: {
  title: string
  genre: string
  synopsis: string
  coverImageUrl: string | null
  isFilm: boolean
  fundingPct: number
  href: string
}) {
  const accent  = isFilm ? RED : BLUE
  const approve = fundingPct
  const reject  = 100 - fundingPct

  return (
    <Link
      href={href}
      className="flex-shrink-0 w-[260px] md:w-[300px] rounded-xl overflow-hidden
                 bg-[#141414] border border-white/5 hover:border-white/20
                 transition-all duration-300"
    >
      <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="300px"
            unoptimized={(coverImageUrl ?? '').startsWith('http')}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded text-white"
          style={{ background: accent }}
        >
          {isFilm ? 'FILM' : 'TV'}
        </span>
      </div>

      <div className="p-3 space-y-2">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <p className="text-[10px] text-gray-400 line-clamp-2">{synopsis}</p>
        <p className="text-[10px] text-gray-500">{genre}</p>

        {/* approve / reject bars */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px]">
            <ThumbsUp size={11} className="text-green-400" />
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${approve}%` }}
              />
            </div>
            <span className="text-green-400 w-8 text-right">{approve}%</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <ThumbsDown size={11} className="text-red-400" />
            <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: `${reject}%` }}
              />
            </div>
            <span className="text-red-400 w-8 text-right">{reject}%</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Mixed card  (Trending / New Releases)
   ═══════════════════════════════════════════════════════════════ */

function MixedCard({
  title,
  genre,
  coverImageUrl,
  rating,
  year,
  isFilm,
  href,
}: {
  title: string
  genre: string
  coverImageUrl: string | null
  rating: string | number
  year: number
  isFilm: boolean
  href: string
}) {
  const accent = isFilm ? RED : BLUE

  return (
    <Link
      href={href}
      className="group flex-shrink-0 w-[170px] md:w-[200px] rounded-xl overflow-hidden
                 bg-[#141414] border border-transparent transition-all duration-300
                 hover:scale-[1.03]"
      style={{ borderColor: 'transparent' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${accent}60`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      <div className="relative aspect-[2/3] bg-gray-900 overflow-hidden">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="200px"
            unoptimized={(coverImageUrl ?? '').startsWith('http')}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {isFilm ? (
              <Film size={32} className="text-gray-600" />
            ) : (
              <Tv size={32} className="text-gray-600" />
            )}
          </div>
        )}
        <span
          className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded text-white"
          style={{ background: accent }}
        >
          {isFilm ? 'FILM' : 'TV'}
        </span>
      </div>

      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <StarsDisplay rating={rating} />
        <p className="text-[10px] text-gray-500">
          {genre} &middot; {year}
        </p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Split Hero
   ═══════════════════════════════════════════════════════════════ */

function SplitHero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
      {/* two halves */}
      <div className="absolute inset-0 flex">
        {/* films half */}
        <div className="w-1/2 relative bg-gradient-to-br from-[#C9A227]/30 via-[#0A0A0A] to-[#0A0A0A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(201,162,39,0.25)_0%,transparent_70%)]" />
          <div className="absolute bottom-16 left-6 md:left-12">
            <div className="flex items-center gap-2 mb-2">
              <Film size={20} className="text-[#C9A227]" />
              <span className="text-[#C9A227] font-bold text-sm tracking-widest uppercase">
                Films
              </span>
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-[200px]">
              {ALL_FILMS.length} original films from visionary creators
            </p>
          </div>
        </div>

        {/* TV half */}
        <div className="w-1/2 relative bg-gradient-to-bl from-[#2563EB]/30 via-[#0A0A0A] to-[#0A0A0A]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(37,99,235,0.25)_0%,transparent_70%)]" />
          <div className="absolute bottom-16 right-6 md:right-12 text-right">
            <div className="flex items-center gap-2 justify-end mb-2">
              <span className="text-[#2563EB] font-bold text-sm tracking-widest uppercase">
                TV Shows
              </span>
              <Tv size={20} className="text-[#2563EB]" />
            </div>
            <p className="text-gray-400 text-xs md:text-sm max-w-[200px] ml-auto">
              {ALL_TV_SHOWS.length} original series across every genre
            </p>
          </div>
        </div>
      </div>

      {/* centre divider + title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent absolute" />
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none mb-3">
            Watch{' '}
            <span className="bg-gradient-to-r from-[#C9A227] to-[#2563EB] bg-clip-text text-transparent">
              Everything
            </span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
            Cinema and Television, together. Scroll endlessly through the CINEGEN universe.
          </p>
        </div>
      </div>

      {/* bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   Prepare data slices  (stable, computed once at module level)
   ═══════════════════════════════════════════════════════════════ */

const popularFilms = ALL_FILMS.slice(0, 20)
const popularShows = ALL_TV_SHOWS.slice(0, 20)

const trailerFilms = ALL_FILMS
  .filter((f) => f.status === 'IN_DEVELOPMENT')
  .slice(0, 15)

const trailerShows = ALL_TV_SHOWS
  .filter((s) => s.status === 'upcoming')
  .slice(0, 15)

/* votes: interleave films and shows */
const voteFilmPool = ALL_FILMS
  .filter((f) => f.fundingPct > 30 && f.fundingPct < 85)
  .slice(0, 10)
const voteShowPool = ALL_TV_SHOWS
  .filter((s) => s.fundingPct > 30 && s.fundingPct < 85)
  .slice(0, 10)

type VoteItem =
  | { type: 'film'; data: FilmData }
  | { type: 'tv'; data: TvShowData }

const voteItems: VoteItem[] = []
for (let i = 0; i < Math.max(voteFilmPool.length, voteShowPool.length); i++) {
  if (i < voteFilmPool.length)
    voteItems.push({ type: 'film', data: voteFilmPool[i] })
  if (i < voteShowPool.length)
    voteItems.push({ type: 'tv', data: voteShowPool[i] })
}

/* trending: top-rated mixed, sorted newest first */
const trendingMixed = [
  ...ALL_FILMS
    .filter((f) => f.rating === 'R' || f.rating === 'PG-13')
    .slice(0, 10)
    .map((f) => ({ ...f, isFilm: true as const })),
  ...ALL_TV_SHOWS
    .filter((s) => s.rating >= 4.3)
    .slice(0, 10)
    .map((s) => ({ ...s, isFilm: false as const })),
].sort((a, b) => b.year - a.year)

/* new releases */
const newReleases = [
  ...ALL_FILMS
    .filter((f) => f.year >= 2025)
    .slice(0, 10)
    .map((f) => ({ ...f, isFilm: true as const })),
  ...ALL_TV_SHOWS
    .filter((s) => s.year >= 2025)
    .slice(0, 10)
    .map((s) => ({ ...s, isFilm: false as const })),
]

/* ═══════════════════════════════════════════════════════════════════
   Main page component
   ═══════════════════════════════════════════════════════════════ */

export default function WatchPage() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [loopCount, setLoopCount] = useState(0)

  /* Infinite loop via IntersectionObserver ────────────────────── */
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setLoopCount((c) => c + 1)
      }
    },
    [],
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleIntersect])

  /* ── Render ──────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* ── 1. Split Hero ──────────────────────────────────────── */}
      <SplitHero />

      {/* ── 2. Popular Films ───────────────────────────────────── */}
      <ScrollRow
        label="Popular Films"
        accent={RED}
        icon={<Film size={18} className="text-[#C9A227]" />}
      >
        {popularFilms.map((f) => (
          <FilmCard key={f.id} film={f} />
        ))}
      </ScrollRow>

      {/* ── 3. Popular TV Shows ────────────────────────────────── */}
      <ScrollRow
        label="Popular TV Shows"
        accent={BLUE}
        icon={<Tv size={18} className="text-[#2563EB]" />}
      >
        {popularShows.map((s) => (
          <TvCard key={s.id} show={s} />
        ))}
      </ScrollRow>

      {/* ── 4. Film Trailers (16:9) ────────────────────────────── */}
      <ScrollRow
        label="Film Trailers"
        accent={RED}
        icon={<Play size={18} className="text-[#C9A227]" />}
      >
        {trailerFilms.map((f) => (
          <TrailerCard
            key={f.id}
            item={f}
            accent={RED}
            badge="In Development"
            href={`/films/${f.slug}`}
          />
        ))}
      </ScrollRow>

      {/* ── 5. TV Trailers (16:9) ──────────────────────────────── */}
      <ScrollRow
        label="TV Trailers"
        accent={BLUE}
        icon={<Play size={18} className="text-[#2563EB]" />}
      >
        {trailerShows.map((s) => (
          <TrailerCard
            key={s.id}
            item={s}
            accent={BLUE}
            badge="Coming Soon"
            href={`/tv/shows/${s.slug}`}
          />
        ))}
      </ScrollRow>

      {/* ── 6. Community Votes ─────────────────────────────────── */}
      <ScrollRow
        label="Community Votes"
        accent="#F59E0B"
        icon={<Vote size={18} className="text-yellow-500" />}
      >
        {voteItems.map((item) =>
          item.type === 'film' ? (
            <VoteCard
              key={`vf-${item.data.id}`}
              title={item.data.title}
              genre={item.data.genre}
              synopsis={item.data.synopsis}
              coverImageUrl={item.data.coverImageUrl}
              isFilm
              fundingPct={item.data.fundingPct}
              href={`/films/${item.data.slug}`}
            />
          ) : (
            <VoteCard
              key={`vt-${item.data.id}`}
              title={item.data.title}
              genre={item.data.genre}
              synopsis={item.data.synopsis}
              coverImageUrl={item.data.coverImageUrl}
              isFilm={false}
              fundingPct={item.data.fundingPct}
              href={`/tv/shows/${item.data.slug}`}
            />
          ),
        )}
      </ScrollRow>

      {/* ── 7. Trending Now ────────────────────────────────────── */}
      <ScrollRow
        label="Trending Now"
        accent="#F59E0B"
        icon={<TrendingUp size={18} className="text-yellow-500" />}
      >
        {trendingMixed.map((item) => (
          <MixedCard
            key={`tr-${item.id}`}
            title={item.title}
            genre={item.genre}
            coverImageUrl={item.coverImageUrl}
            rating={item.rating}
            year={item.year}
            isFilm={item.isFilm}
            href={
              item.isFilm
                ? `/films/${item.slug}`
                : `/tv/shows/${item.slug}`
            }
          />
        ))}
      </ScrollRow>

      {/* ── 8. New Releases ────────────────────────────────────── */}
      <ScrollRow
        label="New Releases"
        accent="#10B981"
        icon={<Sparkles size={18} className="text-emerald-400" />}
      >
        {newReleases.map((item) => (
          <MixedCard
            key={`nr-${item.id}`}
            title={item.title}
            genre={item.genre}
            coverImageUrl={item.coverImageUrl}
            rating={item.rating}
            year={item.year}
            isFilm={item.isFilm}
            href={
              item.isFilm
                ? `/films/${item.slug}`
                : `/tv/shows/${item.slug}`
            }
          />
        ))}
      </ScrollRow>

      {/* ═══ Duplicate first 2 sections for seamless loop ═══════ */}
      <div aria-hidden="true">
        <ScrollRow
          label="Popular Films"
          accent={RED}
          icon={<Film size={18} className="text-[#C9A227]" />}
        >
          {popularFilms.map((f) => (
            <FilmCard key={`dup-f-${f.id}`} film={f} />
          ))}
        </ScrollRow>

        <ScrollRow
          label="Popular TV Shows"
          accent={BLUE}
          icon={<Tv size={18} className="text-[#2563EB]" />}
        >
          {popularShows.map((s) => (
            <TvCard key={`dup-t-${s.id}`} show={s} />
          ))}
        </ScrollRow>
      </div>

      {/* ═══ Sentinel for IntersectionObserver ═══════════════════ */}
      <div ref={sentinelRef} className="h-1" aria-hidden="true" />

      {/* Hidden loop counter for accessibility / debug */}
      <div className="sr-only" aria-live="polite">
        Loop count: {loopCount}
      </div>
    </div>
  )
}
