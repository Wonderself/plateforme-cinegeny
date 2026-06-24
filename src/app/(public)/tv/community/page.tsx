'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Users, MessageSquare, ThumbsUp, ArrowRight, Star,
  Tv, Mic2, Sparkles, Trophy, Flame, Crown,
  Lightbulb, Eye, Clock, TrendingUp, Heart,
  PenTool, Award, BookOpen, Film, Megaphone,
  Search, ChevronRight, Zap, Globe,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Discussion data
   ──────────────────────────────────────────────── */

interface Discussion {
  id: number
  title: string
  author: string
  category: 'Show Discussion' | 'Fan Theory' | 'Episode Review' | 'Creator Spotlight'
  replies: number
  upvotes: number
  timeAgo: string
  showTag?: string
  hot?: boolean
}

const DISCUSSIONS: Discussion[] = [
  { id: 1, title: 'The Midnight Algorithm S3 finale was INSANE - let\'s discuss', author: 'NightOwlFan', category: 'Show Discussion', replies: 234, upvotes: 1820, timeAgo: '2h ago', showTag: 'The Midnight Algorithm', hot: true },
  { id: 2, title: 'Theory: ALGO-1 is developing real consciousness', author: 'AIWatcher', category: 'Fan Theory', replies: 187, upvotes: 1450, timeAgo: '4h ago', showTag: 'The Midnight Algorithm', hot: true },
  { id: 3, title: 'Breaking Fake S3E20 review - Walter Blitz at his best', author: 'NewsJunkie', category: 'Episode Review', replies: 89, upvotes: 672, timeAgo: '6h ago', showTag: 'Breaking Fake' },
  { id: 4, title: 'Chef Reel\'s Cinema Kitchen: how food tells film stories', author: 'FoodieFilm', category: 'Creator Spotlight', replies: 56, upvotes: 890, timeAgo: '8h ago', showTag: 'Cinema Kitchen' },
  { id: 5, title: 'Night Owls needs to visit Tokyo - here\'s why', author: 'TravelBuff', category: 'Show Discussion', replies: 143, upvotes: 1120, timeAgo: '10h ago', showTag: 'Night Owls' },
  { id: 6, title: 'Fan theory: Deep Dive and Couch Talk exist in same universe', author: 'TheoryMaster', category: 'Fan Theory', replies: 98, upvotes: 780, timeAgo: '12h ago' },
  { id: 7, title: 'Scene It! S4 tournament predictions thread', author: 'TriviaKing', category: 'Show Discussion', replies: 201, upvotes: 950, timeAgo: '14h ago', showTag: 'Scene It!', hot: true },
  { id: 8, title: 'Creator House alumni: where are they now?', author: 'RealityCheck', category: 'Creator Spotlight', replies: 67, upvotes: 540, timeAgo: '16h ago', showTag: 'Creator House' },
  { id: 9, title: 'Plot Twist S3E18 - I screamed at the bad descriptions', author: 'ComedyLover', category: 'Episode Review', replies: 112, upvotes: 830, timeAgo: '18h ago', showTag: 'Plot Twist' },
  { id: 10, title: 'Street Eats Mexico City episode was a masterpiece', author: 'Wanderlust', category: 'Episode Review', replies: 78, upvotes: 620, timeAgo: '20h ago', showTag: 'Street Eats' },
  { id: 11, title: 'Hidden connections between all CINEGENY TV shows', author: 'EasterEggHunter', category: 'Fan Theory', replies: 256, upvotes: 2100, timeAgo: '1d ago', hot: true },
  { id: 12, title: 'Sierra Greenlight\'s pitch advice changed my career', author: 'IndieFilmmaker', category: 'Creator Spotlight', replies: 45, upvotes: 670, timeAgo: '1d ago', showTag: 'Pitch Perfect' },
  { id: 13, title: 'Signal Noise viral monologue - dissecting the genius', author: 'PopCultureNerd', category: 'Show Discussion', replies: 134, upvotes: 980, timeAgo: '1d ago', showTag: 'Signal Noise' },
  { id: 14, title: 'The Studio vs Network: which drama series is better?', author: 'DramaCritic', category: 'Show Discussion', replies: 189, upvotes: 1340, timeAgo: '2d ago' },
  { id: 15, title: 'Pixel Pals taught my kids to code - thank you!', author: 'ProudParent', category: 'Show Discussion', replies: 34, upvotes: 890, timeAgo: '2d ago', showTag: 'Pixel Pals' },
  { id: 16, title: 'Last Call bartender theory: Danny Pour was a spy', author: 'ConspiracyTV', category: 'Fan Theory', replies: 167, upvotes: 1230, timeAgo: '2d ago', showTag: 'Last Call' },
  { id: 17, title: 'Making Of documentary reveals mind-blowing AI secrets', author: 'TechDocFan', category: 'Episode Review', replies: 56, upvotes: 450, timeAgo: '3d ago', showTag: 'Making Of' },
]

const CATEGORIES = ['All', 'Show Discussion', 'Fan Theory', 'Episode Review', 'Creator Spotlight'] as const

const CATEGORY_ICONS: Record<string, typeof MessageSquare> = {
  'All': MessageSquare,
  'Show Discussion': Tv,
  'Fan Theory': Lightbulb,
  'Episode Review': Star,
  'Creator Spotlight': Sparkles,
}

const CATEGORY_COLORS: Record<string, string> = {
  'Show Discussion': '#2563EB',
  'Fan Theory': '#7C3AED',
  'Episode Review': '#F59E0B',
  'Creator Spotlight': '#06B6D4',
}

/* ────────────────────────────────────────────────
   Leaderboard data
   ──────────────────────────────────────────────── */

const TOP_CONTRIBUTORS = [
  { name: 'EasterEggHunter', points: 12480, posts: 234, badge: 'Legend' },
  { name: 'NightOwlFan', points: 9870, posts: 189, badge: 'Elite' },
  { name: 'TheoryMaster', points: 8340, posts: 156, badge: 'Expert' },
  { name: 'AIWatcher', points: 7210, posts: 143, badge: 'Expert' },
  { name: 'ComedyLover', points: 6890, posts: 128, badge: 'Pro' },
  { name: 'TriviaKing', points: 5670, posts: 112, badge: 'Pro' },
  { name: 'FoodieFilm', points: 4980, posts: 98, badge: 'Rising' },
  { name: 'PopCultureNerd', points: 4320, posts: 87, badge: 'Rising' },
]

const BADGE_COLORS: Record<string, string> = {
  'Legend': '#F59E0B',
  'Elite': '#7C3AED',
  'Expert': '#2563EB',
  'Pro': '#06B6D4',
  'Rising': '#10B981',
}

/* ────────────────────────────────────────────────
   Contest data
   ──────────────────────────────────────────────── */

const CONTESTS = [
  { title: 'Best Episode of 2026', description: 'Vote for the most memorable episode across all CINEGENY TV shows this year.', entries: 1240, deadline: 'Mar 31, 2026', icon: Trophy, active: true },
  { title: 'Best TV Host', description: 'Who deserves the crown? Vote for your favorite CINEGENY TV host.', entries: 3480, deadline: 'Apr 15, 2026', icon: Crown, active: true },
  { title: 'Fan Art Contest', description: 'Create fan art inspired by any CINEGENY TV show. Top 10 get featured on-air.', entries: 567, deadline: 'May 1, 2026', icon: PenTool, active: true },
  { title: 'Best Fan Theory', description: 'Submit and vote on the most creative fan theories about CINEGENY TV shows.', entries: 890, deadline: 'Apr 30, 2026', icon: Lightbulb, active: true },
]

/* ────────────────────────────────────────────────
   Page component
   ──────────────────────────────────────────────── */

export default function TVCommunityPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDiscussions = useMemo(() => {
    return DISCUSSIONS.filter((d) => {
      const matchesCategory = activeCategory === 'All' || d.category === activeCategory
      const matchesSearch =
        searchQuery === '' ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.showTag && d.showTag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

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
            TV{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            Join thousands of fans discussing shows, sharing theories, reviewing episodes, and celebrating the creators behind CINEGENY TV.
          </p>

          {/* Quick nav */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/tv/shows"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#2563EB]/[0.04] transition-all duration-300 min-h-[44px]"
            >
              <Tv className="h-4 w-4" />
              Shows
            </Link>
            <Link
              href="/tv/hosts"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-white/70 hover:border-[#2563EB]/30 hover:text-[#2563EB] hover:bg-[#2563EB]/[0.04] transition-all duration-300 min-h-[44px]"
            >
              <Mic2 className="h-4 w-4" />
              Hosts
            </Link>
            <Link
              href="/tv/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2563EB] text-white text-sm font-semibold hover:bg-[#1D4ED8] transition-all duration-300 min-h-[44px]"
            >
              <Sparkles className="h-4 w-4" />
              Create a Show
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 pb-20 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Members', value: '24.8K', icon: Users, color: '#2563EB' },
            { label: 'Discussions', value: '12.4K', icon: MessageSquare, color: '#7C3AED' },
            { label: 'Fan Theories', value: '3.2K', icon: Lightbulb, color: '#F59E0B' },
            { label: 'Episode Reviews', value: '8.9K', icon: Star, color: '#06B6D4' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <stat.icon className="h-5 w-5 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Discussions section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-[#2563EB]" />
              <h2 className="text-2xl font-bold text-white">
                Discussions
              </h2>
            </div>
            <div className="text-sm text-white/40">
              {filteredDiscussions.length} thread{filteredDiscussions.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#2563EB]/40 transition-all"
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || MessageSquare
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/60 hover:border-[#2563EB]/30 hover:text-[#2563EB]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Discussion cards */}
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/40">No discussions match your search</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDiscussions.map((d) => (
                <div
                  key={d.id}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/20 hover:bg-[#2563EB]/[0.02] transition-all duration-500 cursor-pointer"
                >
                  {/* Upvote column */}
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <ThumbsUp className="h-4 w-4 text-white/20 group-hover:text-[#2563EB] transition-colors" />
                    <span className="text-xs font-bold text-white/50">{d.upvotes >= 1000 ? `${(d.upvotes / 1000).toFixed(1)}k` : d.upvotes}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {d.hot && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                          <Flame className="h-3 w-3" />
                          HOT
                        </span>
                      )}
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[d.category] || '#2563EB'}15`,
                          color: CATEGORY_COLORS[d.category] || '#2563EB',
                        }}
                      >
                        {d.category}
                      </span>
                      {d.showTag && (
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.04] text-white/40 text-[10px]">
                          {d.showTag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors line-clamp-1">
                      {d.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/30">
                      <span>{d.author}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {d.timeAgo}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {d.replies} replies
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-white/10 group-hover:text-[#2563EB]/50 transition-colors shrink-0 mt-2" />
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Community Contests */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-[#2563EB]" />
              <h2 className="text-2xl font-bold text-white">
                Community Contests
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {CONTESTS.map((contest) => (
              <div
                key={contest.title}
                className="group p-5 rounded-xl border border-[#2563EB]/15 bg-gradient-to-br from-[#2563EB]/[0.04] to-transparent hover:border-[#2563EB]/30 hover:-translate-y-1 transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center shrink-0">
                    <contest.icon className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors">
                        {contest.title}
                      </h3>
                      {contest.active && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/40 line-clamp-2 mb-3">{contest.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {contest.entries.toLocaleString()} entries
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Ends {contest.deadline}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Leaderboard */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-[#2563EB]" />
              <h2 className="text-2xl font-bold text-white">
                Top Contributors
              </h2>
            </div>
          </div>
          <div className="space-y-2">
            {TOP_CONTRIBUTORS.map((user, idx) => (
              <div
                key={user.name}
                className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/20 transition-all duration-300"
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  idx === 0 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  idx === 1 ? 'bg-[#94A3B8]/10 text-[#94A3B8]' :
                  idx === 2 ? 'bg-[#CD7F32]/10 text-[#CD7F32]' :
                  'bg-white/[0.04] text-white/30'
                }`}>
                  {idx + 1}
                </div>

                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-white/30">{user.posts} posts</p>
                </div>

                <span
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: `${BADGE_COLORS[user.badge] || '#2563EB'}15`,
                    color: BADGE_COLORS[user.badge] || '#2563EB',
                  }}
                >
                  {user.badge}
                </span>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#2563EB]">{user.points.toLocaleString()}</p>
                  <p className="text-[10px] text-white/30">points</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Quick Links */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#2563EB]" />
            Explore CINEGENY TV
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Browse Shows', description: 'Explore 80+ original TV shows across 10 genres', href: '/tv/shows', icon: Tv },
              { title: 'Meet the Hosts', description: 'Discover the presenters behind your favorite shows', href: '/tv/hosts', icon: Mic2 },
              { title: 'Create a Show', description: 'Submit your own TV show concept to CINEGENY', href: '/tv/create', icon: Zap },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/30 hover:-translate-y-1 transition-all duration-500"
              >
                <link.icon className="h-6 w-6 text-[#2563EB] mb-3" />
                <h3 className="text-sm font-semibold text-white group-hover:text-[#2563EB] transition-colors mb-1">
                  {link.title}
                </h3>
                <p className="text-xs text-white/40">{link.description}</p>
                <div className="flex items-center gap-1 mt-3 text-[#60A5FA] text-xs">
                  Explore <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/15 to-transparent" />

        {/* Submit Show Idea CTA */}
        <div className="text-center p-8 sm:p-12 rounded-2xl border border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/[0.05] to-[#050A15] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/[0.06] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7C3AED]/[0.05] rounded-full blur-[60px] pointer-events-none" />
          <Megaphone className="h-8 w-8 text-[#2563EB] mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-3 text-white">
            Submit Your Show Idea
          </h2>
          <p className="text-white/50 mb-6 text-sm max-w-lg mx-auto">
            Have a concept for the next big TV show? The CINEGENY community votes on the best ideas.
            Your show could be greenlit by thousands of fans.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/tv/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#2563EB]/20"
            >
              <PenTool className="h-4 w-4" />
              Submit a Show Idea
            </Link>
            <Link
              href="/tv/hosts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#2563EB]/30 text-[#60A5FA] font-semibold hover:bg-[#2563EB]/[0.06] transition-all duration-300"
            >
              <Award className="h-4 w-4" />
              Become a Host
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
