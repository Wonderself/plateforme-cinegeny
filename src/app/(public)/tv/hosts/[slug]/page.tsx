'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ALL_TV_SHOWS } from '@/data/tv-shows'
import {
  ArrowLeft, ArrowRight, Star, Play, Tv, Users,
  Award, Calendar, Eye, TrendingUp, Heart,
  Mic2, Sparkles, Clock, Film, ExternalLink,
  MessageSquare, Share2, BookOpen,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Hosts data
   ──────────────────────────────────────────────── */

interface HostData {
  name: string
  slug: string
  bio: string
  specialty: string
  category: string
  shows: { title: string; slug: string; role: string }[]
  gradientFrom: string
  gradientTo: string
  stats: { episodes: number; views: string; rating: number; yearsActive: number }
  awards: { title: string; year: number }[]
  timeline: { year: number; event: string }[]
}

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '').replace(/^-+/, '')
}

function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const HOSTS_DATA: HostData[] = [
  {
    name: 'ALGO-1 (AI Host)',
    slug: 'algo-1-ai-host',
    bio: 'The world\'s first fully autonomous AI late night host. ALGO-1 generates jokes in real-time based on trending topics, conducts interviews with a wit that rivals human comedians, and has developed an unexpected cult following for its occasional existential musings about consciousness.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'The Midnight Algorithm', slug: 'the-midnight-algorithm', role: 'Animateur' }],
    gradientFrom: '#2563EB', gradientTo: '#7C3AED',
    stats: { episodes: 72, views: '4.2M', rating: 4.6, yearsActive: 3 },
    awards: [{ title: 'Best AI Personality', year: 2025 }, { title: 'Innovation in TV', year: 2024 }],
    timeline: [{ year: 2024, event: 'Launched The Midnight Algorithm' }, { year: 2025, event: 'Won Best AI Personality' }, { year: 2026, event: 'Season 3 premiere breaks records' }],
  },
  {
    name: 'Zara Chip',
    slug: 'zara-chip',
    bio: 'Former Silicon Valley engineer turned comedian. Zara found her calling roasting gadgets on stage and now hosts Laugh.exe, the perfect blend of tech reviews and stand-up comedy. Her catchphrase "Have you tried turning it off and back on?" has become a cultural phenomenon.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'Laugh.exe', slug: 'laugh-exe', role: 'Animateur' }],
    gradientFrom: '#1D4ED8', gradientTo: '#06B6D4',
    stats: { episodes: 40, views: '2.8M', rating: 4.4, yearsActive: 2 },
    awards: [{ title: 'Breakout Host of the Year', year: 2025 }],
    timeline: [{ year: 2025, event: 'Launched Laugh.exe' }, { year: 2026, event: 'Sold out national comedy tour' }],
  },
  {
    name: 'Luna Bright',
    slug: 'luna-bright',
    bio: 'A globe-trotting variety show host who brings the energy of every city she visits to the screen. Luna\'s infectious enthusiasm and genuine connection with local performers have made Night Owls one of the longest-running shows on CINEGENY TV.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'Night Owls', slug: 'night-owls', role: 'Animateur' }],
    gradientFrom: '#3B82F6', gradientTo: '#8B5CF6',
    stats: { episodes: 130, views: '8.1M', rating: 4.8, yearsActive: 5 },
    awards: [{ title: 'Best Variety Host', year: 2024 }, { title: 'Fan Favorite Host', year: 2025 }, { title: 'Excellence in Entertainment', year: 2023 }],
    timeline: [{ year: 2022, event: 'Night Owls series premiere' }, { year: 2023, event: 'Won Excellence in Entertainment' }, { year: 2024, event: 'Reached 100 episodes milestone' }, { year: 2025, event: 'Season 5 greenlit' }],
  },
  {
    name: 'Marcus Stack',
    slug: 'marcus-stack',
    bio: 'A former IT helpdesk veteran who turned years of tech support nightmares into comedy gold. Marcus hosts The Debug Show where real IT horror stories are dramatized with absurd solutions.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'The Debug Show', slug: 'the-debug-show', role: 'Animateur' }],
    gradientFrom: '#1E40AF', gradientTo: '#10B981',
    stats: { episodes: 36, views: '1.9M', rating: 4.3, yearsActive: 2 },
    awards: [{ title: 'Best Tech Comedy', year: 2025 }],
    timeline: [{ year: 2025, event: 'The Debug Show launches' }, { year: 2026, event: 'Viewer submissions hit 10,000' }],
  },
  {
    name: 'Rex Signal',
    slug: 'rex-signal',
    bio: 'Pop culture\'s sharpest commentator. Rex dissects entertainment, social media, and internet culture with razor-sharp monologues and comedy sketches that go viral before the episode ends.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'Signal Noise', slug: 'signal-noise', role: 'Animateur' }],
    gradientFrom: '#2563EB', gradientTo: '#EC4899',
    stats: { episodes: 72, views: '5.4M', rating: 4.5, yearsActive: 3 },
    awards: [{ title: 'Best Pop Culture Commentary', year: 2025 }],
    timeline: [{ year: 2024, event: 'Signal Noise debut' }, { year: 2025, event: 'Viral monologue hits 20M views' }],
  },
  {
    name: 'Danny Pour',
    slug: 'danny-pour',
    bio: 'The bartender-host who serves drinks and delivers punchlines with equal precision. Danny\'s fictional bar setting creates an atmosphere where celebrity guests become disarmingly honest.',
    specialty: 'Animateur late night',
    category: 'Talk Show',
    shows: [{ title: 'Last Call', slug: 'last-call', role: 'Animateur' }],
    gradientFrom: '#1D4ED8', gradientTo: '#F59E0B',
    stats: { episodes: 40, views: '3.1M', rating: 4.4, yearsActive: 2 },
    awards: [{ title: 'Most Candid Interviews', year: 2026 }],
    timeline: [{ year: 2025, event: 'Last Call premieres' }, { year: 2026, event: 'Iconic celebrity confessions episode' }],
  },
  {
    name: 'Walter Blitz',
    slug: 'walter-blitz',
    bio: 'The deadpan king of fake news. Walter Blitz delivers fabricated breaking news with such convincing seriousness that viewers often can\'t tell if he\'s joking. His poker face is insured for $1 million.',
    specialty: 'Présentateur JT',
    category: 'News',
    shows: [{ title: 'Breaking Fake', slug: 'breaking-fake', role: 'Présentateur principal' }],
    gradientFrom: '#3B82F6', gradientTo: '#EF4444',
    stats: { episodes: 66, views: '6.2M', rating: 4.7, yearsActive: 3 },
    awards: [{ title: 'Best Satirical Performance', year: 2025 }, { title: 'Comedy Writing Award', year: 2024 }],
    timeline: [{ year: 2024, event: 'Breaking Fake launches' }, { year: 2025, event: 'Wins Best Satirical Performance' }, { year: 2026, event: '"Flat Earth Special" becomes most-watched episode' }],
  },
  {
    name: 'Vera True',
    slug: 'vera-true',
    bio: 'Part comedian, part investigator, all truth-seeker. Vera True tackles viral claims and conspiracy theories with humor and surprisingly effective investigation methods.',
    specialty: 'Présentateur JT',
    category: 'News',
    shows: [{ title: 'Fact Check This', slug: 'fact-check-this', role: 'Animateur' }],
    gradientFrom: '#1E40AF', gradientTo: '#6366F1',
    stats: { episodes: 36, views: '2.5M', rating: 4.3, yearsActive: 2 },
    awards: [{ title: 'Best Investigative Comedy', year: 2026 }],
    timeline: [{ year: 2025, event: 'Fact Check This premieres' }, { year: 2026, event: 'Moon landing episode goes viral' }],
  },
  {
    name: 'Ron Tumble',
    slug: 'ron-tumble',
    bio: 'The world\'s most lovably incompetent news anchor. Ron leads a mockumentary crew through increasingly chaotic broadcasts where nothing goes right but everything is comedy gold.',
    specialty: 'Présentateur JT',
    category: 'News',
    shows: [{ title: 'Anchor Away', slug: 'anchor-away', role: 'Présentateur principal' }],
    gradientFrom: '#2563EB', gradientTo: '#14B8A6',
    stats: { episodes: 32, views: '2.1M', rating: 4.2, yearsActive: 2 },
    awards: [{ title: 'Best Physical Comedy', year: 2025 }],
    timeline: [{ year: 2025, event: 'Anchor Away debuts' }, { year: 2026, event: 'Season 2 doubles viewership' }],
  },
  {
    name: 'Elle Comfort',
    slug: 'elle-comfort',
    bio: 'The queen of intimate celebrity interviews. Elle has a gift for making A-list celebrities open up in their own homes. Her warmth and genuine curiosity have made Couch Talk the gold standard of interview shows.',
    specialty: 'Animateur de talk-show',
    category: 'Talk Show',
    shows: [{ title: 'Couch Talk', slug: 'couch-talk', role: 'Animateur' }],
    gradientFrom: '#1D4ED8', gradientTo: '#A855F7',
    stats: { episodes: 144, views: '12.3M', rating: 4.9, yearsActive: 6 },
    awards: [{ title: 'Best Talk Show Host', year: 2024 }, { title: 'Interview of the Year', year: 2025 }, { title: 'Lifetime Achievement (TV)', year: 2026 }],
    timeline: [{ year: 2021, event: 'Couch Talk premieres' }, { year: 2022, event: 'Show hits 50-episode milestone' }, { year: 2024, event: 'Won Best Talk Show Host' }, { year: 2026, event: 'Awarded Lifetime Achievement' }],
  },
  {
    name: 'James Depth',
    slug: 'james-depth',
    bio: 'The interviewer who goes where others fear to tread. James Depth conducts long-form, no-limits interviews that reveal the human behind the headline. His style is confrontational yet compassionate.',
    specialty: 'Animateur de talk-show',
    category: 'Talk Show',
    shows: [{ title: 'Deep Dive', slug: 'deep-dive', role: 'Animateur' }],
    gradientFrom: '#3B82F6', gradientTo: '#F97316',
    stats: { episodes: 64, views: '7.8M', rating: 4.7, yearsActive: 4 },
    awards: [{ title: 'Best Long-Form Interview', year: 2025 }],
    timeline: [{ year: 2023, event: 'Deep Dive premieres' }, { year: 2025, event: 'Iconic tech CEO interview' }],
  },
  {
    name: 'Quentin Trivia',
    slug: 'quentin-trivia',
    bio: 'A walking encyclopedia of film knowledge turned game show host extraordinaire. Quentin brings infectious energy and deep cinema passion to every episode of Scene It!',
    specialty: 'Animateur de jeu télévisé',
    category: 'Game Show',
    shows: [{ title: 'Scene It!', slug: 'scene-it', role: 'Animateur' }],
    gradientFrom: '#1E40AF', gradientTo: '#0EA5E9',
    stats: { episodes: 96, views: '5.6M', rating: 4.5, yearsActive: 4 },
    awards: [{ title: 'Best Game Show Host', year: 2024 }, { title: 'Fan Favorite', year: 2025 }],
    timeline: [{ year: 2023, event: 'Scene It! premieres' }, { year: 2024, event: 'Wins Best Game Show Host' }, { year: 2026, event: 'Season 4 tournament special' }],
  },
  {
    name: 'Swerve Jackson',
    slug: 'swerve-jackson',
    bio: 'Master of misdirection and comedic timing. Swerve turned the simple concept of guessing movies from bad descriptions into one of TV\'s most hilarious game shows.',
    specialty: 'Animateur de jeu télévisé',
    category: 'Game Show',
    shows: [{ title: 'Plot Twist', slug: 'plot-twist', role: 'Animateur' }],
    gradientFrom: '#2563EB', gradientTo: '#84CC16',
    stats: { episodes: 66, views: '4.1M', rating: 4.4, yearsActive: 3 },
    awards: [{ title: 'Funniest Game Show', year: 2025 }],
    timeline: [{ year: 2024, event: 'Plot Twist launches' }, { year: 2025, event: 'Clip compilations go viral' }],
  },
  {
    name: 'Devon Reel',
    slug: 'devon-reel',
    bio: 'A former independent filmmaker who now guides aspiring creators through the brutal world of competitive filmmaking on Creator House. Devon is equal parts mentor and judge.',
    specialty: 'Animateur de télé-réalité',
    category: 'Reality',
    shows: [{ title: 'Creator House', slug: 'creator-house', role: 'Animateur et mentor' }],
    gradientFrom: '#1D4ED8', gradientTo: '#E879F9',
    stats: { episodes: 36, views: '3.4M', rating: 4.3, yearsActive: 3 },
    awards: [{ title: 'Best Reality Show Host', year: 2025 }],
    timeline: [{ year: 2024, event: 'Creator House Season 1' }, { year: 2025, event: 'Alumni win film festival awards' }],
  },
  {
    name: 'Sierra Greenlight',
    slug: 'sierra-greenlight',
    bio: 'Hollywood\'s most intimidating yet fair pitch judge. Sierra has greenlit more passion projects than any other executive, and her show Pitch Perfect has launched countless careers.',
    specialty: 'Animateur de télé-réalité',
    category: 'Reality',
    shows: [{ title: 'Pitch Perfect', slug: 'pitch-perfect', role: 'Animateur et dirigeant' }],
    gradientFrom: '#3B82F6', gradientTo: '#22D3EE',
    stats: { episodes: 56, views: '4.8M', rating: 4.6, yearsActive: 4 },
    awards: [{ title: 'Most Impactful Show', year: 2024 }, { title: 'Best Competition Format', year: 2025 }],
    timeline: [{ year: 2023, event: 'Pitch Perfect launches' }, { year: 2024, event: 'First greenlit project wins Oscar' }, { year: 2026, event: 'Season 4 international edition' }],
  },
  {
    name: 'Chef Reel',
    slug: 'chef-reel',
    bio: 'The chef who bridges cinema and cuisine. Chef Reel recreates iconic dishes from famous movies with meticulous attention to detail and a passion for food history that is truly infectious.',
    specialty: 'Chef / Animateur culinaire',
    category: 'Cooking',
    shows: [{ title: 'Cinema Kitchen', slug: 'cinema-kitchen', role: 'Chef animateur' }],
    gradientFrom: '#1E40AF', gradientTo: '#FB923C',
    stats: { episodes: 64, views: '5.9M', rating: 4.7, yearsActive: 4 },
    awards: [{ title: 'Best Cooking Show', year: 2024 }, { title: 'Culinary Innovation Award', year: 2025 }],
    timeline: [{ year: 2023, event: 'Cinema Kitchen premieres' }, { year: 2024, event: 'Ratatouille episode goes viral' }, { year: 2025, event: 'Cookbook released' }],
  },
  {
    name: 'Marco Street',
    slug: 'marco-street',
    bio: 'The fearless street food explorer. Marco travels the globe finding the most extraordinary street food in just 24 hours per city. His genuine love for local culture makes every episode an adventure.',
    specialty: 'Chef / Animateur culinaire',
    category: 'Cooking',
    shows: [{ title: 'Street Eats', slug: 'street-eats', role: 'Animateur' }],
    gradientFrom: '#2563EB', gradientTo: '#34D399',
    stats: { episodes: 90, views: '9.2M', rating: 4.8, yearsActive: 5 },
    awards: [{ title: 'Best Travel Food Show', year: 2024 }, { title: 'Global Ambassador Award', year: 2025 }],
    timeline: [{ year: 2022, event: 'Street Eats launches' }, { year: 2023, event: 'Tokyo episode most-watched food TV' }, { year: 2025, event: 'Visited 50 countries milestone' }],
  },
  {
    name: 'Dr. Pixel Wright',
    slug: 'dr-pixel-wright',
    bio: 'A PhD in Computer Science turned documentary host. Dr. Pixel Wright makes AI filmmaking accessible and fascinating, revealing the human creativity behind every machine-generated frame.',
    specialty: 'Narrateur de documentaire',
    category: 'Documentary',
    shows: [{ title: 'Making Of', slug: 'making-of', role: 'Animateur et narrateur' }],
    gradientFrom: '#1D4ED8', gradientTo: '#C084FC',
    stats: { episodes: 30, views: '2.3M', rating: 4.5, yearsActive: 3 },
    awards: [{ title: 'Best Documentary Host', year: 2025 }],
    timeline: [{ year: 2024, event: 'Making Of premieres' }, { year: 2025, event: 'Emmy nomination' }],
  },
  {
    name: 'Professor Page',
    slug: 'professor-page',
    bio: 'A beloved children\'s television host who transforms kids\' story submissions into animated adventures. Professor Page believes every child\'s imagination deserves to be seen on screen.',
    specialty: 'Animateur jeunesse',
    category: 'Kids',
    shows: [{ title: 'The Story Machine', slug: 'the-story-machine', role: 'Animateur' }],
    gradientFrom: '#3B82F6', gradientTo: '#FCD34D',
    stats: { episodes: 72, views: '6.7M', rating: 4.8, yearsActive: 3 },
    awards: [{ title: 'Best Kids Show Host', year: 2025 }, { title: 'Educational Excellence', year: 2024 }],
    timeline: [{ year: 2024, event: 'The Story Machine launches' }, { year: 2025, event: 'Over 5,000 kids\' stories animated' }],
  },
  {
    name: 'Rainbow Rose',
    slug: 'rainbow-rose',
    bio: 'An art educator and painter who teaches children about color, culture, and creativity. Rainbow Rose\'s gentle teaching style and vibrant personality have made Color World a global hit with families.',
    specialty: 'Animateur jeunesse',
    category: 'Kids',
    shows: [{ title: 'Color World', slug: 'color-world', role: 'Animateur et professeur d\'art' }],
    gradientFrom: '#1E40AF', gradientTo: '#F472B6',
    stats: { episodes: 78, views: '5.4M', rating: 4.7, yearsActive: 3 },
    awards: [{ title: 'Best Educational Content', year: 2025 }],
    timeline: [{ year: 2024, event: 'Color World debuts' }, { year: 2025, event: 'Art supply partnership launched' }],
  },
]

/* ────────────────────────────────────────────────
   Page component
   ──────────────────────────────────────────────── */

export default function HostProfilePage() {
  const params = useParams()
  const slug = params?.slug as string
  const [activeTab, setActiveTab] = useState<'shows' | 'timeline' | 'awards'>('shows')

  const host = HOSTS_DATA.find((h) => h.slug === slug)

  if (!host) {
    return (
      <div className="min-h-screen bg-[#050A15] flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-white/10 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Animateur introuvable</h1>
          <p className="text-white/40 mb-6">L&apos;animateur que vous recherchez n&apos;existe pas.</p>
          <Link
            href="/tv/hosts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux animateurs
          </Link>
        </div>
      </div>
    )
  }

  const initials = getInitials(host.name)
  const similarHosts = HOSTS_DATA.filter((h) => h.slug !== host.slug && h.category === host.category).slice(0, 4)
  if (similarHosts.length < 4) {
    const extras = HOSTS_DATA.filter((h) => h.slug !== host.slug && h.category !== host.category).slice(0, 4 - similarHosts.length)
    similarHosts.push(...extras)
  }

  // Find matching shows from ALL_TV_SHOWS
  const matchedShows = host.shows
    .map((s) => {
      const found = ALL_TV_SHOWS.find((ts) => ts.slug === s.slug)
      return found ? { ...found, role: s.role } : null
    })
    .filter(Boolean) as (typeof ALL_TV_SHOWS[number] & { role: string })[]

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* Hero */}
      <div className="relative py-16 sm:py-20 lg:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/[0.08] via-[#050A15] to-[#050A15]" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-20"
          style={{ background: `linear-gradient(135deg, ${host.gradientFrom}, ${host.gradientTo})` }}
        />

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Back */}
          <Link
            href="/tv/hosts"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#2563EB] transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Tous les animateurs
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar */}
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl flex items-center justify-center text-white font-bold text-4xl sm:text-5xl shadow-2xl shrink-0"
              style={{
                background: `linear-gradient(135deg, ${host.gradientFrom}, ${host.gradientTo})`,
              }}
            >
              {initials}
            </div>

            <div className="text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#60A5FA] text-xs font-medium">
                  {host.specialty}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs">
                  {host.category}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                {host.name}
              </h1>
              <p className="text-white/50 leading-relaxed max-w-2xl text-sm sm:text-base">
                {host.bio}
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/20">
                  <Heart className="h-4 w-4" />
                  Suivre l&apos;animateur
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:border-[#2563EB]/30 transition-all">
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm hover:border-[#2563EB]/30 transition-all">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pb-20 space-y-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Épisodes', value: host.stats.episodes, icon: Play, color: '#2563EB' },
            { label: 'Vues totales', value: host.stats.views, icon: Eye, color: '#7C3AED' },
            { label: 'Note', value: host.stats.rating, icon: Star, color: '#F59E0B' },
            { label: 'Années d\'activité', value: host.stats.yearsActive, icon: Calendar, color: '#06B6D4' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <stat.icon className="h-5 w-5 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {([
            { key: 'shows', label: 'Séries', icon: Tv },
            { key: 'timeline', label: 'Parcours', icon: Clock },
            { key: 'awards', label: 'Récompenses', icon: Award },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content: Shows */}
        {activeTab === 'shows' && (
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Tv className="h-5 w-5 text-[#2563EB]" />
              Séries animées
            </h2>
            {matchedShows.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {matchedShows.map((show) => (
                  <Link
                    key={show.slug}
                    href={`/tv/shows/${show.slug}`}
                    className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB]/[0.08] text-[#60A5FA] text-xs font-medium">
                        {show.genre}
                      </span>
                      <span className="text-xs text-white/30">{show.role}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#2563EB] transition-colors mb-2">
                      {show.title}
                    </h3>
                    <p className="text-sm text-white/40 line-clamp-2 mb-3">{show.synopsis}</p>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        {show.seasons} saison{show.seasons !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Play className="h-3 w-3" />
                        {show.episodesPerSeason} ép./saison
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {show.rating}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {host.shows.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/tv/shows/${s.slug}`}
                    className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 transition-all duration-500"
                  >
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#2563EB] transition-colors mb-1">
                      {s.title}
                    </h3>
                    <p className="text-sm text-white/40">{s.role}</p>
                    <div className="flex items-center gap-1 mt-3 text-[#60A5FA] text-xs">
                      <ExternalLink className="h-3 w-3" />
                      Voir la série
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab Content: Timeline */}
        {activeTab === 'timeline' && (
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#2563EB]" />
              Parcours professionnel
            </h2>
            <div className="relative pl-8 space-y-6">
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#2563EB] via-[#2563EB]/30 to-transparent" />
              {host.timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-[#050A15] shadow-lg shadow-[#2563EB]/30" />
                  <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <span className="text-xs text-[#60A5FA] font-medium">{item.year}</span>
                    <p className="text-sm text-white mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab Content: Awards */}
        {activeTab === 'awards' && (
          <section>
            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#2563EB]" />
              Récompenses et distinctions
            </h2>
            {host.awards.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/40">Aucune récompense pour le moment</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {host.awards.map((award, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.06] to-transparent"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                        <Award className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{award.title}</p>
                        <p className="text-xs text-white/40">{award.year}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Similar Hosts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#2563EB]" />
              Animateurs similaires
            </h2>
            <Link
              href="/tv/hosts"
              className="text-sm text-[#60A5FA] hover:text-[#2563EB] transition-colors flex items-center gap-1"
            >
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarHosts.map((h) => (
              <Link
                key={h.slug}
                href={`/tv/hosts/${h.slug}`}
                className="group text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 hover:-translate-y-1 transition-all duration-500"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${h.gradientFrom}, ${h.gradientTo})`,
                  }}
                >
                  {getInitials(h.name)}
                </div>
                <p className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors truncate">
                  {h.name}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{h.specialty}</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-[#60A5FA] text-xs">
                  <Star className="h-3 w-3" />
                  {h.stats.rating}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Work With CTA */}
        <div className="text-center p-8 sm:p-12 rounded-2xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.05] to-[#050A15] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/[0.06] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7C3AED]/[0.05] rounded-full blur-[60px] pointer-events-none" />
          <Sparkles className="h-8 w-8 text-[#2563EB] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">
            Travailler avec {host.name.split('(')[0].trim()}
          </h2>
          <p className="text-white/50 mb-6 text-sm max-w-md mx-auto">
            Envie de collaborer avec {host.name.split('(')[0].trim()} ? Soumettez votre concept de série et notre équipe vous mettra en relation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/tv/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/20"
            >
              <Mic2 className="h-4 w-4" />
              Soumettre une série
            </Link>
            <Link
              href="/tv/shows"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#2563EB]/30 text-[#60A5FA] font-semibold hover:bg-[#2563EB]/[0.06] transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Parcourir toutes les séries
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
