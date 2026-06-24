'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ALL_TV_SHOWS } from '@/data/tv-shows'
import {
  Search, Star, Tv, Users, Film, Play, ArrowRight,
  Mic2, Radio, Gamepad2, ChefHat, Baby, BookOpen,
  Eye, Laugh, Filter, TrendingUp, Award, Sparkles,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Host data extracted from TV shows
   ──────────────────────────────────────────────── */

interface HostCard {
  name: string
  slug: string
  specialty: string
  category: string
  shows: string[]
  showSlugs: string[]
  rating: number
  episodes: number
  initials: string
  gradientFrom: string
  gradientTo: string
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '')
}

function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const GRADIENT_PAIRS = [
  ['#2563EB', '#7C3AED'],
  ['#1D4ED8', '#06B6D4'],
  ['#3B82F6', '#8B5CF6'],
  ['#1E40AF', '#10B981'],
  ['#2563EB', '#EC4899'],
  ['#1D4ED8', '#F59E0B'],
  ['#3B82F6', '#EF4444'],
  ['#1E40AF', '#6366F1'],
  ['#2563EB', '#14B8A6'],
  ['#1D4ED8', '#A855F7'],
  ['#3B82F6', '#F97316'],
  ['#1E40AF', '#0EA5E9'],
  ['#2563EB', '#84CC16'],
  ['#1D4ED8', '#E879F9'],
  ['#3B82F6', '#22D3EE'],
  ['#1E40AF', '#FB923C'],
  ['#2563EB', '#34D399'],
  ['#1D4ED8', '#C084FC'],
  ['#3B82F6', '#FCD34D'],
  ['#1E40AF', '#F472B6'],
  ['#2563EB', '#38BDF8'],
  ['#1D4ED8', '#A3E635'],
  ['#3B82F6', '#FB7185'],
  ['#1E40AF', '#818CF8'],
]

const SPECIALTY_MAP: Record<string, string> = {
  'Late Night Comedy': 'Late Night Host',
  'News Parody': 'News Anchor',
  'Talk Shows': 'Talk Show Host',
  'Reality / Competition': 'Reality Host',
  'Game Shows': 'Game Show Host',
  'Cooking Shows': 'Chef / Culinary Host',
  'Documentary Series': 'Documentary Narrator',
  'Kids & Animation': 'Kids Show Host',
  'Sketch Comedy': 'Sketch Performer',
  'Drama Series': 'Drama Presenter',
}

const CATEGORY_MAP: Record<string, string> = {
  'Late Night Comedy': 'Talk Show',
  'News Parody': 'News',
  'Talk Shows': 'Talk Show',
  'Reality / Competition': 'Reality',
  'Game Shows': 'Game Show',
  'Cooking Shows': 'Cooking',
  'Documentary Series': 'Documentary',
  'Kids & Animation': 'Kids',
  'Sketch Comedy': 'Talk Show',
  'Drama Series': 'Reality',
}

function buildHosts(): HostCard[] {
  const hostMap = new Map<string, { shows: string[]; showSlugs: string[]; genre: string; episodes: number }>()

  for (const show of ALL_TV_SHOWS) {
    const hostName = show.host
    if (!hostName || hostName === 'N/A' || hostName.startsWith('Various') || hostName.startsWith('Dual hosts') || hostName.startsWith('The ') || hostName.startsWith('Host:')) continue

    const existing = hostMap.get(hostName)
    const totalEps = show.seasons * show.episodesPerSeason
    if (existing) {
      existing.shows.push(show.title)
      existing.showSlugs.push(show.slug)
      existing.episodes += totalEps
    } else {
      hostMap.set(hostName, {
        shows: [show.title],
        showSlugs: [show.slug],
        genre: show.genre,
        episodes: totalEps,
      })
    }
  }

  const hosts: HostCard[] = []
  let i = 0
  for (const [name, data] of hostMap) {
    const pair = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]
    hosts.push({
      name,
      slug: toSlug(name),
      specialty: SPECIALTY_MAP[data.genre] || 'TV Host',
      category: CATEGORY_MAP[data.genre] || 'All',
      shows: data.shows,
      showSlugs: data.showSlugs,
      rating: parseFloat((3.5 + (i * 0.07) % 1.5).toFixed(1)),
      episodes: data.episodes,
      initials: getInitials(name),
      gradientFrom: pair[0],
      gradientTo: pair[1],
    })
    i++
  }
  return hosts
}

const ALL_HOSTS = buildHosts()

const CATEGORIES = ['All', 'Talk Show', 'News', 'Game Show', 'Reality', 'Documentary', 'Cooking', 'Kids'] as const

const CATEGORY_ICONS: Record<string, typeof Mic2> = {
  'All': Users,
  'Talk Show': Mic2,
  'News': Radio,
  'Game Show': Gamepad2,
  'Reality': Eye,
  'Cooking': ChefHat,
  'Documentary': BookOpen,
  'Kids': Baby,
}

/* ────────────────────────────────────────────────
   Page component
   ──────────────────────────────────────────────── */

export default function TVHostsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filteredHosts = useMemo(() => {
    return ALL_HOSTS.filter((host) => {
      const matchesSearch =
        search === '' ||
        host.name.toLowerCase().includes(search.toLowerCase()) ||
        host.specialty.toLowerCase().includes(search.toLowerCase()) ||
        host.shows.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = activeCategory === 'All' || host.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const totalEpisodes = ALL_HOSTS.reduce((sum, h) => sum + h.episodes, 0)

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/[0.06] via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#2563EB]/[0.04] rounded-full blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
              <Users className="h-7 w-7 text-[#2563EB]" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            TV Hosts &{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Presenters
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Discover the talented hosts and presenters who bring CINEGENY TV to life.
            From late night comedy to culinary adventures, meet the faces of our universe.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              placeholder="Search hosts, shows, or specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-[#2563EB]/40 focus:ring-1 focus:ring-[#2563EB]/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-20 space-y-10">

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Hosts', value: ALL_HOSTS.length, icon: Users, color: '#2563EB' },
            { label: 'Shows Produced', value: ALL_TV_SHOWS.length, icon: Tv, color: '#7C3AED' },
            { label: 'Episodes Aired', value: totalEpisodes.toLocaleString(), icon: Film, color: '#06B6D4' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <stat.icon className="h-5 w-5 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] || Users
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 min-h-[40px] ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:border-[#2563EB]/30 hover:text-[#2563EB]'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat}
              </button>
            )
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Filter className="h-4 w-4" />
          <span>{filteredHosts.length} host{filteredHosts.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Hosts Grid */}
        {filteredHosts.length === 0 ? (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No hosts match your search</p>
            <p className="text-white/25 text-sm mt-1">Try a different search term or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredHosts.map((host) => (
              <div
                key={host.slug}
                className="group relative p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 hover:bg-[#2563EB]/[0.03] hover:-translate-y-1 transition-all duration-500"
              >
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${host.gradientFrom}, ${host.gradientTo})`,
                    }}
                  >
                    {host.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-[#2563EB] transition-colors duration-300 truncate">
                      {host.name}
                    </h3>
                    <p className="text-xs text-white/40 truncate">{host.specialty}</p>
                  </div>
                </div>

                {/* Shows */}
                <div className="mb-3">
                  <p className="text-xs text-white/30 mb-1.5">Shows</p>
                  <div className="flex flex-wrap gap-1">
                    {host.shows.slice(0, 2).map((show) => (
                      <span
                        key={show}
                        className="inline-block px-2 py-0.5 rounded-md bg-[#2563EB]/[0.08] text-[#60A5FA] text-[10px] font-medium truncate max-w-[140px]"
                      >
                        {show}
                      </span>
                    ))}
                    {host.shows.length > 2 && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 text-[10px]">
                        +{host.shows.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-[#2563EB]" />
                    <span className="text-white/60 font-medium">{host.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-3 w-3" />
                    <span>{host.episodes} eps</span>
                  </div>
                </div>

                {/* View Profile button */}
                <Link
                  href={`/tv/hosts/${host.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#2563EB]/[0.08] border border-[#2563EB]/20 text-[#60A5FA] text-sm font-medium hover:bg-[#2563EB]/20 transition-all duration-300"
                >
                  View Profile
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Top Rated Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-[#2563EB]" />
            <h2 className="text-2xl font-bold text-white">
              Trending Hosts
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_HOSTS.sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((host, idx) => (
                <Link
                  key={host.slug}
                  href={`/tv/hosts/${host.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 transition-all duration-500"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-sm font-bold text-[#2563EB] shrink-0">
                    {idx + 1}
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${host.gradientFrom}, ${host.gradientTo})`,
                    }}
                  >
                    {host.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors truncate">
                      {host.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">{host.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[#2563EB] shrink-0">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-bold">{host.rating}</span>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Awards Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-[#2563EB]" />
            <h2 className="text-2xl font-bold text-white">
              Host Awards 2026
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Best Late Night Host', winner: ALL_HOSTS[0]?.name || 'TBA', icon: Mic2 },
              { title: 'Best Game Show Host', winner: ALL_HOSTS.find(h => h.category === 'Game Show')?.name || 'TBA', icon: Gamepad2 },
              { title: 'Best News Anchor', winner: ALL_HOSTS.find(h => h.category === 'News')?.name || 'TBA', icon: Radio },
              { title: 'Fan Favorite', winner: ALL_HOSTS[2]?.name || 'TBA', icon: Sparkles },
            ].map((award) => (
              <div
                key={award.title}
                className="p-5 rounded-xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.05] to-transparent"
              >
                <award.icon className="h-5 w-5 text-[#2563EB] mb-3" />
                <p className="text-xs text-white/40 mb-1">{award.title}</p>
                <p className="text-sm font-semibold text-white">{award.winner}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* CTA */}
        <div className="text-center p-8 sm:p-12 rounded-2xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.05] to-[#050A15] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/[0.06] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7C3AED]/[0.05] rounded-full blur-[60px] pointer-events-none" />
          <Sparkles className="h-8 w-8 text-[#2563EB] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">
            Become a TV Host
          </h2>
          <p className="text-white/50 mb-6 text-sm max-w-md mx-auto">
            Have what it takes to host a CINEGENY TV show? Submit your audition
            and join our growing roster of talented presenters.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/tv/act"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#2563EB]/20"
            >
              <Mic2 className="h-4 w-4" />
              Apply Now
            </Link>
            <Link
              href="/tv/shows"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#2563EB]/30 text-[#60A5FA] font-semibold hover:bg-[#2563EB]/[0.06] transition-all duration-300"
            >
              <Tv className="h-4 w-4" />
              Browse Shows
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
