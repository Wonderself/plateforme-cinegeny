'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Tv, Users, Star, Search, ChevronDown, Film, Layers, MonitorPlay } from 'lucide-react'
import { ALL_TV_SHOWS, SHOWS_BY_GENRE, TV_GENRES } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'

/* ── Status mapping ── */
const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  ongoing: { label: 'Airing', color: 'text-green-400', bg: 'bg-green-500/15 border-green-500/25' },
  upcoming: { label: 'In Development', color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/25' },
  completed: { label: 'Completed', color: 'text-white/40', bg: 'bg-white/[0.06] border-white/10' },
}

/* ── Sort options ── */
type SortKey = 'popular' | 'newest' | 'az'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'az', label: 'A-Z' },
]

/* ── Unsplash posters by index ── */
const POSTER_URLS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1685910715615-577928e2450e?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1563905463861-7d77975b3a44?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1576238956869-2098f3d26eb2?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1612186001725-36c96d7e46f8?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1545092961-6d9b6f46dcc4?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1609561026486-f5d4a3c4c660?auto=format&fit=crop&w=400&h=600&q=80',
  'https://images.unsplash.com/photo-1649289659650-b154e82505db?auto=format&fit=crop&w=400&h=600&q=80',
]

function getPosterUrl(show: TvShowData, index: number): string {
  return show.coverImageUrl || POSTER_URLS[index % POSTER_URLS.length]
}

const PAGE_SIZE = 24

export default function TvShowsCatalogPage() {
  const [genre, setGenre] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('popular')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  /* ── Computed totals ── */
  const totalShows = ALL_TV_SHOWS.length
  const totalEpisodes = ALL_TV_SHOWS.reduce((sum, s) => sum + s.episodeCount, 0)
  const totalGenres = TV_GENRES.length

  /* ── Filtered + sorted shows ── */
  const filtered = useMemo(() => {
    let shows: TvShowData[] = genre === 'All' ? [...ALL_TV_SHOWS] : (SHOWS_BY_GENRE[genre] || [])

    // Status filter
    if (statusFilter !== 'All') {
      const statusKey = statusFilter === 'Airing' ? 'ongoing' : statusFilter === 'In Development' ? 'upcoming' : 'completed'
      shows = shows.filter(s => s.status === statusKey)
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      shows = shows.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.host.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
      )
    }

    // Sort
    if (sort === 'popular') shows.sort((a, b) => b.viewCount - a.viewCount)
    else if (sort === 'newest') shows.sort((a, b) => b.premiered.localeCompare(a.premiered))
    else shows.sort((a, b) => a.title.localeCompare(b.title))

    return shows
  }, [genre, statusFilter, search, sort])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050A15' }}>
      {/* ================================================================ */}
      {/* HERO STATS                                                       */}
      {/* ================================================================ */}
      <section className="relative pt-28 pb-20 px-6 sm:px-10 md:px-16 lg:px-20 overflow-hidden bg-gradient-to-b from-[#2563EB]/[0.06] to-transparent">
        {/* Ambient blur circles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#2563EB]/[0.06] rounded-full blur-[120px]" />
          <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#2563EB]/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-[15%] left-[20%] w-1 h-1 rounded-full bg-[#2563EB]/40 animate-pulse" />
          <div className="absolute top-[25%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#2563EB]/30 animate-pulse [animation-delay:0.5s]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#2563EB]/25 animate-pulse [animation-delay:1s]" />
          <div className="absolute top-[40%] right-[20%] w-1 h-1 rounded-full bg-[#2563EB]/30 animate-pulse [animation-delay:1.5s]" />
        </div>

        <div className="relative container mx-auto max-w-7xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] text-sm mb-8">
            <MonitorPlay className="h-4 w-4" />
            <span className="font-medium">CINEGENY TV Shows</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-white">
            TV Shows &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #60A5FA 40%, #2563EB 70%, #1D4ED8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Series
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-lg max-w-2xl mx-auto mb-14 leading-relaxed">
            Browse our complete catalog of AI-powered TV shows, from gripping dramas to hilarious comedies and cutting-edge documentaries.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-6 sm:gap-10 max-w-2xl mx-auto">
            {[
              { label: 'Shows', value: totalShows, icon: Tv },
              { label: 'Episodes', value: totalEpisodes, icon: Layers },
              { label: 'Genres', value: totalGenres, icon: Film },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.03] p-5 sm:p-6 text-center transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 mx-auto mb-2">
                  <stat.icon className="h-4 w-4 text-[#2563EB]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#2563EB]">
                  {stat.value > 0 ? stat.value.toLocaleString('en-US') : '--'}
                </div>
                <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider font-medium mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade separator */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </section>

      {/* ================================================================ */}
      {/* FILTER BAR                                                       */}
      {/* ================================================================ */}
      <div className="relative px-6 sm:px-10 md:px-16 lg:px-20 pb-20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="container mx-auto max-w-7xl">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pt-8">
            {/* Genre tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', ...TV_GENRES].map((g) => (
                <button
                  key={g}
                  onClick={() => { setGenre(g); setVisibleCount(PAGE_SIZE) }}
                  className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                    genre === g
                      ? 'bg-[#2563EB] border-[#2563EB] text-white'
                      : 'bg-white/[0.06] border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {g === 'All' ? 'All Genres' : g}
                </button>
              ))}
            </div>
          </div>

          {/* Second row: status, search, sort */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setVisibleCount(PAGE_SIZE) }}
                className="appearance-none bg-white/[0.06] border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              >
                <option value="All">All Status</option>
                <option value="Airing">Airing</option>
                <option value="In Development">In Development</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Search shows..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
                className="w-full bg-white/[0.06] border border-white/10 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="appearance-none bg-white/[0.06] border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 pr-9 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30 pointer-events-none" />
            </div>
          </div>

          {/* ================================================================ */}
          {/* SHOW GRID                                                        */}
          {/* ================================================================ */}
          {visible.length === 0 ? (
            <div className="text-center py-24 text-white/40">
              <Tv className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl text-white/50">No shows found</p>
              <p className="text-sm mt-2 text-white/40">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {visible.map((show, idx) => {
                const statusInfo = STATUS_MAP[show.status] || STATUS_MAP.completed
                const viewersPct = Math.min(100, Math.round((show.viewCount / 700000) * 100))
                return (
                  <Link key={show.id} href={`/tv/shows/${show.slug}`}>
                    <div className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#2563EB]/30 transition-all duration-500 h-full flex flex-col">
                      {/* Poster */}
                      <div className="relative aspect-[2/3] bg-gradient-to-br from-[#2563EB]/[0.06] to-white/[0.03] shrink-0 overflow-hidden">
                        <Image
                          src={getPosterUrl(show, idx)}
                          alt={show.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-transparent to-transparent" />

                        {/* Status badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Rating badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-0.5">
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-white">{show.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-sm sm:text-base mb-1 text-white group-hover:text-[#2563EB] transition-colors line-clamp-2">
                          {show.title}
                        </h3>

                        <p className="text-xs text-white/40 mb-1.5">{show.host}</p>

                        {/* Genre badge */}
                        <div className="mb-3">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/20 font-medium">
                            {show.genre}
                          </span>
                        </div>

                        {/* Episodes */}
                        <p className="text-[10px] text-white/30 mb-3">
                          {show.episodeCount} episodes &middot; {show.duration} min
                        </p>

                        {/* Viewers progress bar */}
                        <div className="space-y-1.5 mt-auto">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-white/30">Viewers</span>
                            <span className="text-[#2563EB] font-medium">{viewersPct}%</span>
                          </div>
                          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-700"
                              style={{ width: `${viewersPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {/* ================================================================ */}
          {/* PAGINATION — Load More                                           */}
          {/* ================================================================ */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
                className="px-8 py-3 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold text-sm transition-colors duration-300"
              >
                Load More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}

          {/* Result count */}
          <div className="text-center mt-6">
            <p className="text-xs text-white/25">
              Showing {visible.length} of {filtered.length} shows
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
