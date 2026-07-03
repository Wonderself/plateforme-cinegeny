'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SHOWS_BY_GENRE, TV_GENRES, ALL_TV_SHOWS, type TvShowData } from '@/data/tv-shows'
import {
  ArrowRight, ChevronLeft, ChevronRight, Play, TrendingUp,
  Tv, Radio, Star, Clock, Flame, Laugh,
  Drama, BookOpen, Ghost, Wand2, Swords,
  Briefcase, DollarSign, Sparkles, Eye,
  Monitor, Rocket, Users, Heart, Film, Mic,
} from 'lucide-react'
import { toast } from 'sonner'

/* ────────────────────────────────────────────────
   Genre config (icons + colors) — TV BLUE THEME
   ──────────────────────────────────────────────── */

const GENRE_CONFIG: Record<string, { icon: typeof Flame; color: string; colorLight: string; image: string }> = {
  'Talk Show':             { icon: Radio,      color: '#2563EB', colorLight: '#60A5FA', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&h=400&q=80' },
  'News Parody':           { icon: Laugh,      color: '#F59E0B', colorLight: '#FCD34D', image: 'https://images.unsplash.com/photo-1504711434969-e33886168d9c?auto=format&fit=crop&w=800&h=400&q=80' },
  'Sketch Comedy':         { icon: Drama,      color: '#EC4899', colorLight: '#F9A8D4', image: 'https://images.unsplash.com/photo-1585168373682-c7e50adc2e55?auto=format&fit=crop&w=800&h=400&q=80' },
  'Late Night Comedy':     { icon: Star,       color: '#8B5CF6', colorLight: '#C4B5FD', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&h=400&q=80' },
  'Reality Competition':   { icon: Eye,        color: '#EF4444', colorLight: '#FCA5A5', image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&h=400&q=80' },
  'Drama Series':          { icon: Ghost,      color: '#6366F1', colorLight: '#A5B4FC', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&h=400&q=80' },
  'Documentary':           { icon: BookOpen,   color: '#10B981', colorLight: '#6EE7B7', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=400&q=80' },
  'Game Show':             { icon: Swords,     color: '#0EA5E9', colorLight: '#7DD3FC', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&h=400&q=80' },
  'Cooking Show':          { icon: Flame,      color: '#F97316', colorLight: '#FDBA74', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&h=400&q=80' },
  'Kids & Animation':      { icon: Wand2,      color: '#A855F7', colorLight: '#D8B4FE', image: 'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&h=400&q=80' },
}

/* ────────────────────────────────────────────────
   Live counter hook
   ──────────────────────────────────────────────── */

function useLiveCounter(base: number) {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(base)
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3))
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])
  return mounted ? count : null
}

/* ────────────────────────────────────────────────
   Scroll helper
   ──────────────────────────────────────────────── */

function useScrollRow() {
  const ref = useRef<HTMLDivElement>(null)
  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return
    ref.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' })
  }
  return { ref, scroll }
}

/* ────────────────────────────────────────────────
   TV Show Card
   ──────────────────────────────────────────────── */

function ShowCard({ show, index }: { show: TvShowData; index?: number }) {
  return (
    <Link
      href={`/tv/shows/${show.slug}`}
      className="group/card flex-shrink-0 snap-start w-[140px] md:w-[160px]"
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-500 group-hover/card:border-[#2563EB]/40 group-hover/card:shadow-[0_0_20px_rgba(37,99,235,0.15)] group-hover/card:scale-[1.05] group-hover/card:-translate-y-1">
        {show.coverImageUrl ? (
          <Image
            src={show.coverImageUrl}
            alt={show.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
            sizes="160px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A2E] to-[#050A15]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

        {/* Status badge */}
        {show.status === 'ongoing' && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-600/90 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            <span className="text-[8px] font-bold text-white uppercase">Live</span>
          </div>
        )}

        {/* Hover info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-y-2 group-hover/card:translate-y-0">
          <p className="text-[10px] text-white/70 line-clamp-2 leading-relaxed">{show.synopsis}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px] text-[#2563EB] font-semibold">{show.episodeCount} eps</span>
            <span className="text-[8px] text-white/30">|</span>
            <span className="text-[8px] text-white/40">{show.duration}min</span>
          </div>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] md:text-[12px] font-semibold text-white/80 truncate group-hover/card:text-white transition-colors">{show.title}</p>
      <p className="text-[9px] text-white/30 truncate">{show.genre}</p>
    </Link>
  )
}

/* ────────────────────────────────────────────────
   Show Row (horizontal scroll per genre)
   ──────────────────────────────────────────────── */

function ShowRow({ genre, shows }: { genre: string; shows: TvShowData[] }) {
  const { ref, scroll } = useScrollRow()
  const cfg = GENRE_CONFIG[genre] || { icon: Star, color: '#2563EB', colorLight: '#60A5FA', image: '' }

  return (
    <section className="relative mb-6 md:mb-8" id={`genre-${genre.toLowerCase().replace(/[^a-z]/g, '')}`}>
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-20 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: cfg.color }} />
          <h2 className="text-sm md:text-base lg:text-lg font-bold text-white/90 tracking-tight">{genre}</h2>
          <span className="text-[10px] text-white/25 font-medium">{shows.length} shows</span>
        </div>
        <Link
          href={`/tv/shows?genre=${encodeURIComponent(genre)}`}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
        >
          See All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:bg-black/90"
        >
          <ChevronLeft className="h-4 w-4 text-white/70" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:bg-black/90"
        >
          <ChevronRight className="h-4 w-4 text-white/70" />
        </button>

        <div
          ref={ref}
          className="flex gap-3 md:gap-4 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {shows.map((show, i) => (
            <ShowCard key={show.id} show={show} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ────────────────────────────────────────────────
   Main TV Homepage
   ──────────────────────────────────────────────── */

export default function TvHomePage() {
  const viewerCount = useLiveCounter(14832)
  const showCount = useLiveCounter(847)

  /* Derived data */
  const featuredShow = ALL_TV_SHOWS.find(s => s.status === 'ongoing') || ALL_TV_SHOWS[0]

  const trendingShows = [...ALL_TV_SHOWS]
    .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
    .slice(0, 10)

  const devShows = ALL_TV_SHOWS.filter(
    s => s.status === 'upcoming'
  ).slice(0, 12)

  const comingSoonRef = useRef<HTMLDivElement>(null)
  const scrollComingSoon = (dir: 'left' | 'right') => {
    if (!comingSoonRef.current) return
    comingSoonRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#050A15] text-white">

      {/* ═══════════════════════════════════════════
          A. HERO BANNER
          ═══════════════════════════════════════════ */}
      <section className="relative w-full" style={{ height: '55vh', minHeight: '380px' }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1920&h=1080&q=80)' }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050A15] via-[#050A15]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-[#050A15]/30 to-transparent" />
        {/* Blue ambient glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[300px] bg-[#2563EB]/[0.06] rounded-full blur-[120px]" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end pb-16 md:pb-20 px-4 sm:px-8 md:px-16 lg:px-20">
          {/* LIVE badge */}
          {featuredShow.status === 'ongoing' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 mb-4 w-fit animate-[subtlePulse_3s_ease-in-out_infinite]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider">Live Now</span>
            </div>
          )}

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] max-w-2xl mb-3">
            {featuredShow.title}
          </h1>
          <p className="text-sm md:text-base text-white/50 max-w-xl mb-6 leading-relaxed line-clamp-3">
            {featuredShow.synopsis}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/tv/shows/${featuredShow.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-[#2563EB]/25 hover:shadow-[#2563EB]/40 hover:-translate-y-0.5"
            >
              <Play className="h-4 w-4" fill="white" /> Watch Now
            </Link>
            <button
              onClick={() => toast.success(`"${featuredShow.title}" ajouté à votre liste`)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/[0.08] transition-all duration-300 hover:-translate-y-0.5"
            >
              + Add to List
            </button>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-4 text-[11px] text-white/30">
            <span className="flex items-center gap-1"><Tv className="h-3 w-3" /> {featuredShow.episodeCount} Episodes</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {featuredShow.duration}min</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400/60" /> {featuredShow.rating}</span>
            <span className="px-1.5 py-0.5 rounded border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] font-semibold">{featuredShow.genre}</span>
          </div>
        </div>
      </section>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════════
            C. GENRE PILLS
            ═══════════════════════════════════════════ */}
        <section className="relative pt-6 pb-4 md:pt-8 md:pb-5">
          {/* Activity bar */}
          <div className="flex items-center gap-4 px-4 sm:px-8 md:px-16 lg:px-20 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563EB] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563EB]" />
              </span>
              <span className="text-[10px] text-white/30 font-medium">{viewerCount !== null ? viewerCount.toLocaleString() : '---'} viewers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor className="h-3 w-3 text-[#2563EB]/60" />
              <span className="text-[10px] text-white/30 font-medium">{showCount !== null ? showCount.toLocaleString() : '---'} shows streaming</span>
            </div>
          </div>

          <div
            className="flex items-stretch gap-2.5 md:gap-3 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory py-3"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {TV_GENRES.map((genre, gi) => {
              const cfg = GENRE_CONFIG[genre] || { icon: Star, color: '#2563EB', colorLight: '#60A5FA', image: '' }
              const Icon = cfg.icon
              const count = (SHOWS_BY_GENRE[genre] || []).length
              return (
                <Link
                  key={genre}
                  href={`#genre-${genre.toLowerCase().replace(/[^a-z]/g, '')}`}
                  className="group/pill flex-shrink-0 snap-start relative w-[130px] md:w-[160px] h-[80px] md:h-[100px] rounded-xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.04] overflow-hidden"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                    border: `1px solid ${cfg.color}25`,
                  }}
                >
                  {/* Background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/pill:scale-110"
                    style={{ backgroundImage: `url(${cfg.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover/pill:bg-black/35 transition-all duration-500" />
                  <div
                    className="absolute inset-0 opacity-30 group-hover/pill:opacity-50 transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}40, transparent 70%)` }}
                  />

                  {/* Flash sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute top-0 h-full w-[50%] opacity-15 group-hover/pill:opacity-40"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cfg.color}30, rgba(255,255,255,0.12), ${cfg.color}30, transparent)`,
                        animation: `glintSweep ${2.5 + gi * 0.15}s ease-in-out infinite`,
                        animationDelay: `${gi * 0.3}s`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2">
                    <div
                      className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center transition-all duration-500 group-hover/pill:scale-110 group-hover/pill:rotate-3"
                      style={{
                        background: `linear-gradient(135deg, ${cfg.color}60, ${cfg.color}30)`,
                        boxShadow: `0 2px 12px ${cfg.color}40`,
                        backdropFilter: 'blur(6px)',
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" style={{ filter: `drop-shadow(0 0 4px ${cfg.color})` }} />
                    </div>
                    <span className="text-[11px] md:text-[12px] font-bold text-white tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{genre}</span>
                    <span className="text-[8px] text-white/40 font-medium">{count} shows</span>
                  </div>

                  {/* Count badge */}
                  <div
                    className="absolute top-1.5 right-1.5 text-[7px] font-black px-1 py-0.5 rounded backdrop-blur-sm"
                    style={{ background: `${cfg.color}BB`, color: '#fff' }}
                  >
                    {count}
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
                    <div
                      className="h-full w-0 group-hover/pill:w-full transition-all duration-700 ease-out"
                      style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, ${cfg.colorLight}, ${cfg.color}, transparent)` }}
                    />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            D. SHOW ROWS — One per genre
            ═══════════════════════════════════════════ */}
        {TV_GENRES.slice(0, 5).map(genre => {
          const shows = SHOWS_BY_GENRE[genre] || []
          if (shows.length === 0) return null
          return <ShowRow key={genre} genre={genre} shows={shows} />
        })}

        {/* ═══════════════════════════════════════════
            E. "YOUR SHOW AWAITS" — Create Section
            ═══════════════════════════════════════════ */}
        <section className="relative my-10 md:my-14 mx-4 sm:mx-8 md:mx-16 lg:mx-20 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-[#050A15] to-[#2563EB]/5" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1920&h=600&q=60')] bg-cover bg-center opacity-[0.04]" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#2563EB]/[0.08] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-[#2563EB]/[0.05] rounded-full blur-[80px]" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/[0.08]" />

          <div className="relative z-10 px-8 sm:px-10 md:px-14 py-10 md:py-14">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 mb-5 animate-[subtlePulse_3s_ease-in-out_infinite]">
                <Tv className="h-3.5 w-3.5 text-[#2563EB]" />
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">CINEGENY TV Studios</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight leading-[1.1]">
                Your Show Awaits
              </h2>
              <p className="text-sm md:text-base text-white/40 max-w-lg mb-8 leading-relaxed">
                Build the next great series. Create original content, fund productions, or contribute your talents to shows being made right now.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {[
                  {
                    icon: Sparkles,
                    title: 'CREATE',
                    desc: 'Write, direct, and produce your own original series on CINEGENY TV.',
                    href: '/tv/create',
                    accent: '#2563EB',
                    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=500&q=80',
                  },
                  {
                    icon: DollarSign,
                    title: 'PRODUCE',
                    desc: 'Crowdfund your show. Rally the community to back your vision.',
                    href: '/tv/produce',
                    accent: '#10B981',
                    image: 'https://images.unsplash.com/photo-1504711434969-e33886168d9c?auto=format&fit=crop&w=400&h=500&q=80',
                  },
                  {
                    icon: Briefcase,
                    title: 'WORK',
                    desc: 'Contribute scripts, music, VFX, and more. Earn for every task.',
                    href: '/tv/work',
                    accent: '#F59E0B',
                    image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=400&h=500&q=80',
                  },
                ].map((card) => (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden border border-amber-500/10 hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
                  >
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {/* Golden top line */}
                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-amber-500/0 group-hover:via-amber-500/40 to-transparent transition-all duration-700" />

                    <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg border border-amber-500/20"
                        style={{ background: `${card.accent}22` }}
                      >
                        <card.icon className="h-5 w-5" style={{ color: card.accent }} />
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-white tracking-wide mb-1">{card.title}</h3>
                      <p className="text-[11px] md:text-[12px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors line-clamp-2">{card.desc}</p>
                      <div className="flex items-center gap-1.5 mt-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="text-[11px] font-semibold" style={{ color: card.accent }}>Explore</span>
                        <ArrowRight className="h-3 w-3" style={{ color: card.accent }} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            Remaining genre rows
            ═══════════════════════════════════════════ */}
        {TV_GENRES.slice(5).map(genre => {
          const shows = SHOWS_BY_GENRE[genre] || []
          if (shows.length === 0) return null
          return <ShowRow key={genre} genre={genre} shows={shows} />
        })}

        {/* ═══════════════════════════════════════════
            F. TRENDING on CINEGENY TV — Top 10
            ═══════════════════════════════════════════ */}
        <section className="relative py-8 md:py-12">
          <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

          <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-6 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                <TrendingUp className="h-3 w-3" />
                Trending
              </span>
            </div>
            <h2 className="text-base md:text-lg lg:text-xl font-black text-white/90 tracking-tight">
              Trending on CINEGENY TV
            </h2>
            <p className="text-[11px] text-white/30 mt-1">The most-watched shows right now</p>
          </div>

          <div
            className="flex gap-4 md:gap-5 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {trendingShows.map((show, i) => (
              <Link
                key={`trending-${show.id}`}
                href={`/tv/shows/${show.slug}`}
                className="group/top flex-shrink-0 snap-start relative flex items-end w-[200px] md:w-[240px]"
              >
                {/* Large number */}
                <span
                  className="absolute -left-2 md:-left-3 bottom-0 text-[50px] sm:text-[80px] md:text-[100px] font-black leading-none select-none pointer-events-none"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(37, 99, 235, 0.4)',
                    textShadow: '0 0 30px rgba(37, 99, 235, 0.1)',
                  }}
                >
                  {i + 1}
                </span>

                {/* Poster */}
                <div className="relative ml-8 md:ml-10 w-[120px] md:w-[140px] aspect-[2/3] rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-500 group-hover/top:border-[#2563EB]/40 group-hover/top:shadow-[0_0_24px_rgba(37,99,235,0.2)] group-hover/top:scale-[1.03]">
                  {show.coverImageUrl ? (
                    <Image
                      src={show.coverImageUrl}
                      alt={show.title}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="140px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A2E] to-[#050A15]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-[10px] font-bold text-white truncate">{show.title}</p>
                    <p className="text-[8px] text-white/40">{show.genre}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            G. COMING SOON / IN DEVELOPMENT
            ═══════════════════════════════════════════ */}
        <section className="relative py-8 md:py-10 mb-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">
                <Rocket className="h-3 w-3" />
                Coming Soon
              </span>
            </div>
            <h2 className="text-base md:text-lg lg:text-xl font-black text-white/90 tracking-tight">
              In Development
            </h2>
            <p className="text-[11px] text-white/30 mt-1 mb-4">Shows in early stages — vote, invest, or volunteer to work on them</p>
          </div>

          <div className="relative group/dev">
            <button
              onClick={() => scrollComingSoon('left')}
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/dev:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronLeft className="h-4 w-4 text-white/70" />
            </button>
            <button
              onClick={() => scrollComingSoon('right')}
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover/dev:opacity-100 transition-opacity duration-300 hover:bg-black/90"
            >
              <ChevronRight className="h-4 w-4 text-white/70" />
            </button>

            <div
              ref={comingSoonRef}
              className="flex gap-3 md:gap-4 overflow-x-auto px-4 sm:px-8 md:px-16 lg:px-20 scroll-smooth snap-x snap-mandatory pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {devShows.map((show, idx) => {
                const fundingPct = Math.min(95, 10 + idx * 8)
                const raised = Math.round((fundingPct / 100) * 150000)
                const goal = 150000
                return (
                  <div
                    key={show.id}
                    className="flex-shrink-0 snap-start w-[280px] md:w-[360px] rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-all duration-300 hover:border-[#2563EB]/20"
                  >
                    {/* 16:9 poster area */}
                    <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                      {show.coverImageUrl ? (
                        <Image
                          src={show.coverImageUrl}
                          alt={show.title}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="360px"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A2E] to-[#050A15]" />
                      )}
                      <div className="absolute inset-0 bg-black/50" />
                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-lg shadow-[#2563EB]/30">
                          <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#2563EB]/80 text-white backdrop-blur-sm">
                          Coming Soon
                        </span>
                      </div>
                      {/* Bottom overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[13px] font-bold text-white truncate">{show.title}</p>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-semibold bg-white/10 text-white/60">{show.genre}</span>
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="p-3 space-y-2">
                      <p className="text-[10px] text-white/40 line-clamp-2 leading-relaxed">{show.synopsis}</p>
                      <div className="flex items-center gap-1.5">
                        <Link href="/community" className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-colors">Vote</Link>
                        <Link href="/invest" className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-colors">Invest</Link>
                        <Link href="/work" className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB]/25 transition-colors">Work</Link>
                        <button onClick={() => toast.success(`"${show.title}" ajouté à votre liste`)} className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-white/50 border border-white/10 hover:bg-white/20 transition-colors">+ Liste</button>
                      </div>
                      {/* Funding bar */}
                      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${fundingPct}%` }} />
                      </div>
                      <p className="text-[10px] text-white/25">${raised.toLocaleString()} raised of ${goal.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            H. EXPLORE CINEGENY TV — Quick-links
            ═══════════════════════════════════════════ */}
        <section className="relative py-10 md:py-14">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <div className="px-4 sm:px-8 md:px-16 lg:px-20 mt-8">
            <h2 className="text-base md:text-lg font-black text-white/90 tracking-tight mb-6">
              Explore CINEGENY TV
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {[
                { icon: Film, label: 'All Shows', href: '/tv/shows', color: '#2563EB' },
                { icon: Play, label: 'Replay', href: '/tv/replay', color: '#8B5CF6' },
                { icon: Sparkles, label: 'Create a Show', href: '/tv/create', color: '#2563EB' },
                { icon: DollarSign, label: 'Produce', href: '/tv/produce', color: '#10B981' },
                { icon: Briefcase, label: 'Work on Shows', href: '/tv/work', color: '#F59E0B' },
                { icon: TrendingUp, label: 'Invest', href: '/tv/invest', color: '#6366F1' },
                { icon: Mic, label: 'Act in Shows', href: '/tv/act', color: '#EC4899' },
                { icon: Users, label: 'TV Hosts', href: '/tv/hosts', color: '#0EA5E9' },
                { icon: Heart, label: 'Community', href: '/tv/community', color: '#F97316' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <item.icon className="h-4 w-4 flex-shrink-0 text-white/30 group-hover:text-white/70 transition-colors" style={{ color: undefined }} />
                  <span className="text-[12px] font-medium text-white/40 group-hover:text-white/80 transition-colors">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* Glint animation keyframes */}
      <style jsx global>{`
        @keyframes glintSweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(300%); }
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
