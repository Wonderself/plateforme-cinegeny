'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Check,
  ArrowRight,
  Sparkles,
  Tv,
  Plus,
  Trash2,
  ChevronDown,
  HelpCircle,
  FileText,
  Home,
  UserCircle,
  Mic,
  Scissors,
  Radio,
  Lightbulb,
  Vote,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── TV Show Steps ── */
interface TvStep {
  id: string
  number: number
  title: string
  description: string
  href: string
  icon: typeof FileText
  unsplashImage: string
  cta: string
}

const TV_STEPS: TvStep[] = [
  {
    id: 'concept',
    number: 1,
    title: 'Concept',
    description: 'Define your show format, genre, target audience, and overall vision for your TV production.',
    href: '/tv/create/concept',
    icon: Lightbulb,
    unsplashImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Define Concept',
  },
  {
    id: 'script',
    number: 2,
    title: 'Script',
    description: 'Write episode scripts with proper formatting, dialogue, scene headings, and action lines.',
    href: '/tv/create/script',
    icon: FileText,
    unsplashImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Write Script',
  },
  {
    id: 'set-design',
    number: 3,
    title: 'Set Design',
    description: 'Design your studio, sets, and locations. Build the visual world of your TV show.',
    href: '/tv/create/set-design',
    icon: Home,
    unsplashImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Design Sets',
  },
  {
    id: 'casting',
    number: 4,
    title: 'Casting',
    description: 'Choose AI presenters, actors, and voice talent. Build your on-screen team.',
    href: '/tv/create/casting',
    icon: UserCircle,
    unsplashImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Cast Talent',
  },
  {
    id: 'recording',
    number: 5,
    title: 'Recording',
    description: 'Record or generate episodes with AI. Capture footage in virtual studios.',
    href: '/tv/create/record',
    icon: Mic,
    unsplashImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Start Recording',
  },
  {
    id: 'editing',
    number: 6,
    title: 'Editing',
    description: 'Cut, add graphics, transitions, and lower thirds. Polish your episodes to broadcast quality.',
    href: '/tv/create/editing',
    icon: Scissors,
    unsplashImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Edit Episodes',
  },
  {
    id: 'broadcast',
    number: 7,
    title: 'Broadcast',
    description: 'Schedule, publish, and go live on CINEGENY TV. Reach your audience worldwide.',
    href: '/tv/create/broadcast',
    icon: Radio,
    unsplashImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&h=500&q=80',
    cta: 'Go Live',
  },
]

/* ── My Shows localStorage ── */
const SHOWS_STORAGE_KEY = 'cinegen-my-shows'

interface UserShow {
  id: string
  title: string
  format: string
  createdAt: string
  completedSteps: string[]
  thumbnail: string
}

const SHOW_THUMBNAILS = [
  'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1574375927938-d5a98e8d7e28?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=400&h=225&q=80',
  'https://images.unsplash.com/photo-1468164016595-6108e4a8c3b5?auto=format&fit=crop&w=400&h=225&q=80',
]

const FAQ_ITEMS = [
  {
    q: 'How long does it take to create a TV show?',
    a: 'A single episode typically takes 6-12 hours across the 7 steps. A full season of 6-10 episodes can be produced in 2-4 weeks with consistent work.',
  },
  {
    q: 'Do I need TV production experience?',
    a: 'Not at all! Our AI guides you through every step from concept to broadcast. The tools are designed for complete beginners and professionals alike.',
  },
  {
    q: 'What show formats are supported?',
    a: 'We support sitcoms (22min), dramas (45min), late night shows (60min), short-form content (10min), and custom formats. Each comes with tailored templates.',
  },
  {
    q: 'Can my show go live on CINEGENY TV?',
    a: 'Yes! After completing all 7 steps, submit your show for community review. Approved shows are scheduled for broadcast on the CINEGENY TV network.',
  },
  {
    q: 'How much does it cost?',
    a: 'All AI generation tools are included with your subscription. Broadcasting on CINEGENY TV is free for approved shows. Premium time slots are available for a fee.',
  },
]

function useMyShows() {
  const [shows, setShows] = useState<UserShow[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SHOWS_STORAGE_KEY)
      if (saved) setShows(JSON.parse(saved))
    } catch { /* ignore */ }
    setLoaded(true)
  }, [])

  function saveShows(next: UserShow[]) {
    setShows(next)
    try { localStorage.setItem(SHOWS_STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function addShow(title: string, format: string) {
    const newShow: UserShow = {
      id: Date.now().toString(36),
      title,
      format,
      createdAt: new Date().toISOString(),
      completedSteps: [],
      thumbnail: SHOW_THUMBNAILS[Math.floor(Math.random() * SHOW_THUMBNAILS.length)],
    }
    saveShows([newShow, ...shows])
    return newShow
  }

  function deleteShow(id: string) {
    saveShows(shows.filter(s => s.id !== id))
  }

  return { shows, addShow, deleteShow, loaded }
}

/* ── Animated golden border keyframes ── */
const GOLDEN_KEYFRAMES = `
@keyframes goldenBorderRotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
`

export default function TvCreatePage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const myShows = useMyShows()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [showNewShow, setShowNewShow] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newFormat, setNewFormat] = useState('Drama')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  function updateScrollState() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  function scroll(dir: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector<HTMLElement>('[data-card]')?.offsetWidth || 340
    el.scrollBy({ left: dir === 'left' ? -cardWidth - 16 : cardWidth + 16, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#050A15]">
      <style dangerouslySetInnerHTML={{ __html: GOLDEN_KEYFRAMES }} />

      {/* ── Hero ── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto text-center">
        {/* Background image */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1400&h=600&q=80"
            alt="TV Studio"
            fill
            className="object-cover opacity-10"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050A15] via-[#050A15]/80 to-[#050A15]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/[0.06] blur-[120px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
            AI-Powered TV Production
          </div>

          <h1 className="section-title-flash text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-6">
            Create Your{' '}
            <span className="text-[#2563EB]">TV Show</span>
          </h1>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-8">
            From concept to broadcast &mdash; AI-powered TV production.
            Build your show step by step with the most advanced tools available.
          </p>

          {/* Start Creating CTA with golden border */}
          <Link
            href="#steps"
            className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-[1.03]"
            style={{
              border: '2px solid transparent',
              backgroundClip: 'padding-box',
              boxShadow: '0 0 0 2px #C4A030, 0 0 15px rgba(196,160,48,0.2)',
            }}
          >
            <Tv className="h-5 w-5" />
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ── Step Cards Carousel ── */}
      <section id="steps" className="relative pb-20 md:pb-28">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-5 px-4 sm:px-8 md:px-16 lg:px-20 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {TV_STEPS.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              data-card
              className={cn(
                'group relative flex-shrink-0 snap-start rounded-xl overflow-hidden transition-all duration-500',
                'w-[280px] sm:w-[320px] md:w-[340px]',
                'hover:scale-[1.03]',
              )}
            >
              {/* Golden border on hover */}
              <div
                className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #C4A030, #FFD700, #C4A030, #B8860B, #C4A030)',
                  backgroundSize: '300% 300%',
                  animation: 'goldenBorderRotate 3s ease infinite',
                }}
              />

              <div className="relative bg-[#0A1628] rounded-xl overflow-hidden z-20 m-[1px]">
                <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
                  <Image
                    src={step.unsplashImage}
                    alt={step.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="340px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/40 to-transparent" />

                  {/* Step number badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-xs font-bold text-[#2563EB]">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-white/70" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#2563EB] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed mb-5 line-clamp-2">
                    {step.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 bg-[#2563EB] text-white group-hover:bg-[#3B82F6] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                    {step.cta}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* Broadcast card */}
          <div
            data-card
            className="group relative flex-shrink-0 snap-start rounded-xl overflow-hidden w-[280px] sm:w-[320px] md:w-[340px]"
          >
            <div className="relative bg-gradient-to-br from-[#2563EB]/20 to-[#0A1628] rounded-xl overflow-hidden border border-[#2563EB]/20 h-full flex flex-col items-center justify-center p-8 text-center min-h-[380px]">
              <div className="w-16 h-16 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-center justify-center mb-5">
                <Sparkles className="h-8 w-8 text-[#2563EB]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Publish Your Show</h3>
              <p className="text-sm text-white/40 mb-6 max-w-[240px]">
                Complete all 7 steps and publish your AI-generated TV show to the world.
              </p>
              <div className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-white/5 text-white/30 border border-white/[0.06]">
                <Lock className="h-3.5 w-3.5 inline mr-2" />
                Complete All Steps
              </div>
            </div>
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {TV_STEPS.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className="w-2 h-2 rounded-full bg-white/15 hover:bg-white/30 transition-all duration-300"
            />
          ))}
        </div>
      </section>

      {/* ── My Shows ── */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title-flash text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
              <Tv className="h-6 w-6 text-[#2563EB]" />
              My Shows
              {myShows.shows.length > 0 && (
                <span className="text-sm font-normal text-white/30">({myShows.shows.length}/2 free)</span>
              )}
            </h2>
            <button
              onClick={() => setShowNewShow(!showNewShow)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <Plus className="h-4 w-4" />
              New Show
            </button>
          </div>

          {/* New show form */}
          {showNewShow && (
            <div className="mb-6 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Start a new show</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Show title..."
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#2563EB]/40 transition-colors"
                />
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value)}
                  className="px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 focus:outline-none focus:border-[#2563EB]/40 transition-colors appearance-none cursor-pointer"
                >
                  {['Drama', 'Sitcom', 'Late Night', 'Talk Show', 'Reality', 'Documentary', 'Game Show', 'Variety', 'News', 'Anthology'].map(f => (
                    <option key={f} value={f} className="bg-[#0A1628]">{f}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (!newTitle.trim()) return
                    myShows.addShow(newTitle.trim(), newFormat)
                    setNewTitle('')
                    setShowNewShow(false)
                  }}
                  disabled={!newTitle.trim()}
                  className={cn(
                    'px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                    newTitle.trim()
                      ? 'bg-[#2563EB] text-white hover:bg-[#3B82F6]'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  )}
                >
                  Create
                </button>
              </div>
            </div>
          )}

          {/* Shows grid */}
          {myShows.loaded && myShows.shows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] p-12 text-center">
              <Tv className="h-12 w-12 text-white/10 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-white/40 mb-2">No shows yet</h3>
              <p className="text-sm text-white/25 max-w-md mx-auto mb-6">
                Start your first AI TV show project. You get 2 free shows to create with all tools included.
              </p>
              <button
                onClick={() => setShowNewShow(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Your First Show
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myShows.shows.map((show) => {
                const progress = Math.round((show.completedSteps.length / TV_STEPS.length) * 100)
                return (
                  <div
                    key={show.id}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={show.thumbnail}
                        alt={show.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-transparent to-transparent" />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white/60 border border-white/10">
                        {show.format}
                      </span>
                      <button
                        onClick={() => myShows.deleteShow(show.id)}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-white mb-1 truncate">{show.title}</h4>
                      <p className="text-[10px] text-white/30 mb-3">
                        Created {new Date(show.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/40 shrink-0">{progress}%</span>
                      </div>
                      <Link
                        href="/tv/create/script"
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all"
                      >
                        Continue
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-20 pb-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title-flash text-xl sm:text-2xl font-bold text-white mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Create',
                description: 'Define your concept, write scripts, design sets, and cast your talent using AI-powered tools.',
                step: '01',
              },
              {
                icon: Vote,
                title: 'Submit to Vote',
                description: 'Submit your completed show to the CINEGENY community for review and approval.',
                step: '02',
              },
              {
                icon: Play,
                title: 'Go Live',
                description: 'Approved shows are scheduled for broadcast on CINEGENY TV. Reach audiences worldwide.',
                step: '03',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center hover:border-[#2563EB]/30 hover:bg-[#2563EB]/[0.02] transition-all duration-300"
              >
                <div className="text-xs font-bold text-[#2563EB]/40 mb-4">{item.step}</div>
                <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-5">
                  <item.icon className="h-7 w-7 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 sm:px-8 md:px-16 lg:px-20 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-title-flash text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-white/40" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-medium text-white/70">{item.q}</span>
                  <ChevronDown className={cn(
                    'h-4 w-4 text-white/30 shrink-0 ml-4 transition-transform duration-200',
                    openFaq === i && 'rotate-180'
                  )} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 pt-0">
                    <p className="text-xs text-white/40 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
