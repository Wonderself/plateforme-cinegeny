'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  Upload,
  Camera,
  Mic,
  BookOpen,
  Users,
  Sparkles,
  Play,
  Pause,
  Download,
  Share2,
  Check,
  Shield,
  ChevronDown,
  UserCircle,
  Tv,
  ArrowRight,
  Search,
  DollarSign,
  Lock,
  FileVideo,
  Image as ImageIcon,
  Radio,
  MonitorPlay,
  Eye,
} from 'lucide-react'
import { ALL_TV_SHOWS, TV_GENRES, SHOWS_BY_GENRE } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'

/* ── Types ── */

type Role = 'host' | 'cohost' | 'correspondent' | 'guest' | 'voice' | 'narrator'

type AnalysisStep = {
  label: string
  done: boolean
}

type ExportFormat = 'mp4-1080' | 'mp4-4k' | 'gif' | 'share'

/* ── Roles for TV ── */

const ROLES: {
  id: Role
  label: string
  icon: React.ElementType
  description: string
}[] = [
  { id: 'host', label: 'Host', icon: MonitorPlay, description: 'Lead the entire show' },
  { id: 'cohost', label: 'Co-Host', icon: Users, description: 'Share the spotlight' },
  { id: 'correspondent', label: 'Correspondent', icon: Radio, description: 'Report from the field' },
  { id: 'guest', label: 'Guest Star', icon: Star, description: 'Special episode appearance' },
  { id: 'voice', label: 'Voice Actor', icon: Mic, description: 'Lend your voice to characters' },
  { id: 'narrator', label: 'Narrator', icon: BookOpen, description: 'Tell the story in your voice' },
]

/* ── AI Avatar gallery ── */

const AI_AVATARS = [
  { name: 'Maya Chen', specialty: 'News Anchor', style: 'Professional, authoritative' },
  { name: 'Alex Rivera', specialty: 'Late Night Host', style: 'Witty, charming' },
  { name: 'Sam Taylor', specialty: 'Documentary Narrator', style: 'Warm, informative' },
  { name: 'Jordan Blake', specialty: 'Game Show Host', style: 'Energetic, fun' },
  { name: 'Riley Morgan', specialty: 'Talk Show Host', style: 'Empathetic, engaging' },
  { name: 'Casey Wren', specialty: 'Sports Commentator', style: 'Dynamic, passionate' },
  { name: 'Drew Palmer', specialty: 'Cooking Show Host', style: 'Friendly, instructive' },
  { name: 'Quinn Fox', specialty: 'Kids Show Presenter', style: 'Playful, educational' },
  { name: 'Reese Nova', specialty: 'Sci-Fi Narrator', style: 'Mysterious, deep' },
  { name: 'Avery Storm', specialty: 'Reality TV Host', style: 'Bold, dramatic' },
  { name: 'Harper Voss', specialty: 'Interview Specialist', style: 'Thoughtful, probing' },
  { name: 'Skyler Faye', specialty: 'Music Show VJ', style: 'Trendy, upbeat' },
]

/* ── Portfolio placeholders ── */

const PORTFOLIO_PLACEHOLDERS = [
  { title: 'The Midnight Algorithm', role: 'Host', character: 'Lead AI Host' },
  { title: 'Cinema Kitchen', role: 'Co-Host', character: 'Sous Chef Presenter' },
  { title: 'The Daily Glitch', role: 'Correspondent', character: 'Field Reporter' },
  { title: 'Pixel Pals', role: 'Voice', character: 'Character Voice' },
]

const SAMPLE_TEXT =
  'Good evening, and welcome to the show. Tonight, we have a truly extraordinary story that will change the way you see the world...'

const EXPORT_OPTIONS: { id: ExportFormat; label: string; detail: string; icon: React.ElementType }[] = [
  { id: 'mp4-1080', label: 'MP4 (1080p)', detail: 'Standard HD export', icon: FileVideo },
  { id: 'mp4-4k', label: 'MP4 (4K)', detail: 'Ultra HD broadcast quality', icon: FileVideo },
  { id: 'gif', label: 'GIF', detail: 'Animated preview clip', icon: ImageIcon },
  { id: 'share', label: 'Share Link', detail: 'Shareable public URL', icon: Share2 },
]

/* ── Helper ── */
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/* ── Component ── */

export default function TvActPage() {
  /* State */
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([
    { label: 'Face detected', done: false },
    { label: 'Features mapped', done: false },
    { label: 'Ready for generation', done: false },
  ])
  const [generated, setGenerated] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

  const [consentChecked, setConsentChecked] = useState(false)
  const [rightsOpen, setRightsOpen] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  /* Show selection state */
  const [showSearch, setShowSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('All')
  const [selectedShow, setSelectedShow] = useState<TvShowData | null>(null)

  /* Export state */
  const [selectedExport, setSelectedExport] = useState<ExportFormat>('mp4-1080')

  /* Animated ring rotation */
  const [ringRotation, setRingRotation] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setRingRotation((r) => (r + 2) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  /* Waveform bars */
  const BARS = 40
  const [barHeights, setBarHeights] = useState<number[]>(Array(BARS).fill(4))

  useEffect(() => {
    if (!isRecording) return
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: BARS }, () => Math.random() * 28 + 4))
    }, 120)
    return () => clearInterval(interval)
  }, [isRecording])

  /* Filtered shows */
  const filteredShows = useMemo(() => {
    let shows: TvShowData[] = []
    if (selectedGenre === 'All') {
      shows = [...ALL_TV_SHOWS]
    } else {
      shows = SHOWS_BY_GENRE[selectedGenre] || []
    }
    if (showSearch.trim()) {
      const q = showSearch.toLowerCase()
      shows = shows.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          s.host.toLowerCase().includes(q)
      )
    }
    return shows.slice(0, 24)
  }, [selectedGenre, showSearch])

  /* Handlers */

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedPhoto(url)
      setGenerated(false)
      setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file)
      setUploadedPhoto(url)
      setGenerated(false)
      setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))
    }
  }

  function handleGenerate() {
    if (!uploadedPhoto) return
    setIsAnalyzing(true)
    setGenerated(false)
    setAnalysisSteps((s) => s.map((step) => ({ ...step, done: false })))

    const delays = [800, 1800, 2800]
    delays.forEach((delay, i) => {
      setTimeout(() => {
        setAnalysisSteps((prev) =>
          prev.map((step, idx) => (idx <= i ? { ...step, done: true } : step))
        )
        if (i === delays.length - 1) {
          setTimeout(() => {
            setIsAnalyzing(false)
            setGenerated(true)
          }, 600)
        }
      }, delay)
    })
  }

  function toggleRecording() {
    if (isRecording) {
      setIsRecording(false)
      setHasRecording(true)
      if (recordingInterval.current) clearInterval(recordingInterval.current)
      return
    }
    setHasRecording(false)
    setIsPlaying(false)
    setRecordingSeconds(0)
    setIsRecording(true)
    recordingInterval.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1)
    }, 1000)
  }

  function togglePlayback() {
    setIsPlaying((p) => !p)
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  /* ── Render ── */

  return (
    <div className="min-h-screen bg-[#050A15] text-white">
      {/* ────────────────────── HERO ────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#2563EB]/[0.08] via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#2563EB]/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-[#60A5FA]/[0.08] rounded-full blur-[120px]" />

        <div className="relative container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] text-xs sm:text-sm mb-6">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>AI Actor Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Act In Your{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
              TV Show
            </span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Step into the spotlight. Use AI to place yourself in any TV show — as a host, a guest
            star, or a narrator.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('face-scan')}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              <Camera className="h-5 w-5" />
              Generate My Character
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo('voice-section')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-semibold transition-all duration-300"
            >
              <UserCircle className="h-5 w-5" />
              Submit My Profile
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────── 3-STEP PROCESS ────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Three simple steps to see yourself on screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: 'Upload Your Photo',
                desc: 'Upload a clear headshot. Our AI maps your facial features for realistic rendering.',
                step: '01',
                color: 'from-[#2563EB] to-blue-600',
              },
              {
                icon: Tv,
                title: 'Choose Your Show',
                desc: 'Browse our catalog and select the TV show you want to appear in.',
                step: '02',
                color: 'from-[#60A5FA] to-blue-500',
              },
              {
                icon: Star,
                title: 'Play Your Role',
                desc: 'AI generates scenes with you as the character in your chosen show.',
                step: '03',
                color: 'from-purple-500 to-purple-700',
              },
            ].map((card, idx) => (
              <div
                key={card.step}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 transition-all duration-300 hover:border-[#2563EB]/40 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(37,99,235,0.06)]"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-white/[0.04] group-hover:text-[#2563EB]/10 transition-colors">
                  {card.step}
                </span>
                <div className={cn(
                  'mb-5 inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br',
                  card.color,
                  'shadow-lg'
                )}>
                  <card.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>

                {idx < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-white/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────── AI AVATAR GALLERY ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] text-xs sm:text-sm mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Avatar Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Meet Our AI Hosts</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Choose from our library of AI-generated personas, or create your own custom avatar.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {AI_AVATARS.map((avatar, i) => (
              <div
                key={avatar.name}
                className="group p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-300 text-center hover:shadow-[0_0_30px_rgba(37,99,235,0.06)]"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB]/20 to-[#60A5FA]/20 border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-3">
                  <UserCircle className="h-8 w-8 text-[#60A5FA]/60" />
                </div>
                <p className="text-xs font-semibold text-white mb-0.5">{avatar.name}</p>
                <p className="text-[10px] text-[#60A5FA]">{avatar.specialty}</p>
                <p className="text-[9px] text-white/30 mt-1">{avatar.style}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────── UPLOAD & EXPORT PANELS ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] text-xs sm:text-sm mb-4">
              <Upload className="h-3.5 w-3.5" />
              <span>Insert Yourself</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Upload Your Photo &amp; Export</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Upload a headshot, choose your role, and download your TV appearance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── LEFT: Upload Your Photo ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] text-xs sm:text-sm mb-6">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Your Photo</span>
              </div>

              {/* Animated ring + upload icon */}
              <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 160 160"
                  style={{ transform: `rotate(${ringRotation}deg)` }}
                >
                  <defs>
                    <linearGradient id="ring-grad-blue-act" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity="1" />
                      <stop offset="50%" stopColor="#2563EB" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="80" cy="80" r="74"
                    fill="none" stroke="url(#ring-grad-blue-act)"
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="200 265"
                  />
                </svg>
                <div className="absolute inset-4 rounded-full border border-white/[0.06]" />
                {uploadedPhoto ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#2563EB]/40">
                    <Image src={uploadedPhoto} alt="Your photo" fill className="object-cover" />
                  </div>
                ) : (
                  <Upload className="h-10 w-10 text-[#2563EB]/60" />
                )}
              </div>

              <p className="text-white/40 text-sm mb-4">JPG, PNG or HEIC &mdash; Max 20MB</p>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]"
              >
                Browse Files
              </button>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  'mt-6 w-full rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer',
                  isDragging
                    ? 'border-[#2563EB] bg-[#2563EB]/[0.06]'
                    : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15]'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <p className="text-white/30 text-sm">or drag & drop your headshot here</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*,.heic" className="hidden" onChange={handleFileChange} />
            </div>

            {/* ── RIGHT: Export / Publish ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#60A5FA]/20 bg-[#60A5FA]/10 text-[#60A5FA] text-xs sm:text-sm mb-6">
                <Download className="h-3.5 w-3.5" />
                <span>Export Your Appearance</span>
              </div>

              <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 160 160"
                  style={{ transform: `rotate(${-ringRotation * 0.7}deg)` }}
                >
                  <defs>
                    <linearGradient id="ring-grad-light-act" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="1" />
                      <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="80" cy="80" r="74"
                    fill="none" stroke="url(#ring-grad-light-act)"
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="200 265"
                  />
                </svg>
                <div className="absolute inset-4 rounded-full border border-white/[0.06]" />
                <Download className="h-10 w-10 text-[#60A5FA]/60" />
              </div>

              <div className="w-full space-y-3 mb-6">
                {EXPORT_OPTIONS.map((opt) => {
                  const isActive = selectedExport === opt.id
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedExport(opt.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                        isActive
                          ? 'border-[#2563EB]/30 bg-[#2563EB]/[0.08]'
                          : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                      )}
                    >
                      <div className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        isActive ? 'border-[#2563EB] bg-[#2563EB]' : 'border-white/20'
                      )}>
                        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <opt.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-[#60A5FA]' : 'text-white/30')} />
                      <div>
                        <p className={cn('text-sm font-medium', isActive ? 'text-white' : 'text-white/60')}>{opt.label}</p>
                        <p className="text-xs text-white/30">{opt.detail}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                disabled={!generated}
                className={cn(
                  'w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
                  generated
                    ? 'bg-[#2563EB] hover:bg-[#3B82F6] text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] cursor-pointer'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                )}
              >
                <Download className="h-5 w-5" />
                Export Clip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── SHOW SELECTION GRID ────────────────────── */}
      <section id="show-selection" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#60A5FA]/20 bg-[#60A5FA]/10 text-[#60A5FA] text-xs sm:text-sm mb-4">
              <Tv className="h-3.5 w-3.5" />
              <span>Show Catalog</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Show</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Browse our catalog and select the TV show you want to appear in.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              value={showSearch}
              onChange={(e) => setShowSearch(e.target.value)}
              placeholder="Search shows by title, genre, or host..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563EB]/40 focus:bg-white/[0.05] transition-all"
            />
          </div>

          {/* Genre tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <button
              onClick={() => setSelectedGenre('All')}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                selectedGenre === 'All'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]'
              )}
            >
              All
            </button>
            {TV_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                  selectedGenre === genre
                    ? 'bg-[#2563EB] text-white'
                    : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.06]'
                )}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Show grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredShows.map((show) => {
              const isSelected = selectedShow?.id === show.id
              return (
                <button
                  key={show.id}
                  onClick={() => setSelectedShow(isSelected ? null : show)}
                  className={cn(
                    'group relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left',
                    isSelected
                      ? 'border-[#2563EB] shadow-[0_0_20px_rgba(37,99,235,0.35)] scale-[1.03]'
                      : 'border-transparent hover:border-white/[0.15] hover:scale-[1.02]'
                  )}
                >
                  <div className="relative aspect-[2/3] bg-gradient-to-br from-white/[0.04] to-white/[0.01]">
                    {show.coverImageUrl ? (
                      <Image src={show.coverImageUrl} alt={show.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"><Tv className="h-8 w-8 text-white/10" /></div>
                    )}
                    <div className={cn(
                      'absolute inset-0 transition-all duration-300',
                      isSelected
                        ? 'bg-gradient-to-t from-[#2563EB]/40 via-transparent to-[#2563EB]/10'
                        : 'bg-gradient-to-t from-black/70 via-transparent to-transparent'
                    )} />
                    {isSelected && (
                      <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#2563EB] flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-black/60 text-white/80 backdrop-blur-sm">
                        {show.genre}
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white/[0.02]">
                    <p className="text-xs font-semibold text-white/80 truncate group-hover:text-white transition-colors">
                      {show.title}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">{show.host} &middot; S{show.seasons}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredShows.length === 0 && (
            <div className="text-center py-16">
              <Tv className="h-12 w-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/30">No shows found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────── FACE SCAN ────────────────────── */}
      <section id="face-scan" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#60A5FA] text-xs sm:text-sm mb-4">
              <Camera className="h-3.5 w-3.5" />
              <span>Face Scan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Generate Your AI Character</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Upload a clear headshot and our AI will create a broadcast-ready version of you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload area */}
            <div className="space-y-6">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300 min-h-[320px]',
                  isDragging
                    ? 'border-[#2563EB] bg-[#2563EB]/[0.06]'
                    : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]'
                )}
              >
                {uploadedPhoto ? (
                  <div className="relative w-full h-full min-h-[260px]">
                    <Image src={uploadedPhoto} alt="Uploaded headshot" fill className="object-contain rounded-xl" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-[#050A15]/60 rounded-xl flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-10 w-10 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                          <span className="text-sm text-white/70">Analyzing face...</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-4 h-16 w-16 rounded-2xl bg-white/[0.04] flex items-center justify-center">
                      <Upload className="h-7 w-7 text-white/40" />
                    </div>
                    <p className="text-white/60 font-medium mb-1">Drag & drop your headshot here</p>
                    <p className="text-white/30 text-sm">or click to browse</p>
                  </>
                )}
              </div>

              {/* Analysis steps */}
              <div className="space-y-3">
                {analysisSteps.map((step, i) => (
                  <div
                    key={step.label}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500',
                      step.done
                        ? 'border-emerald-500/20 bg-emerald-500/[0.06]'
                        : 'border-white/[0.06] bg-white/[0.02]'
                    )}
                  >
                    <div className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500',
                      step.done ? 'bg-emerald-500 text-white' : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.done ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs">{i + 1}</span>}
                    </div>
                    <span className={cn('text-sm transition-colors', step.done ? 'text-emerald-400' : 'text-white/40')}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={!uploadedPhoto || isAnalyzing}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-300',
                  uploadedPhoto && !isAnalyzing
                    ? 'bg-[#2563EB] hover:bg-[#3B82F6] text-white hover:shadow-[0_0_30px_rgba(37,99,235,0.25)] cursor-pointer'
                    : 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                )}
              >
                <Sparkles className="h-5 w-5" />
                Generate AI Version
              </button>
            </div>

            {/* Result preview */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 flex flex-col items-center justify-center min-h-[480px]">
              {generated ? (
                <div className="w-full space-y-6">
                  <h3 className="text-lg font-semibold text-center mb-4">Before & After</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.06]">
                      <Image src={uploadedPhoto!} alt="Original" fill className="object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <span className="text-xs font-medium text-white/80">Original</span>
                      </div>
                    </div>
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#2563EB]/20">
                      <Image src={uploadedPhoto!} alt="AI Generated" fill className="object-cover" style={{ filter: 'saturate(1.3) contrast(1.15) brightness(0.95)' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2563EB]/20 via-transparent to-[#2563EB]/[0.05]" />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                        <span className="text-xs font-medium text-[#60A5FA]">AI Generated</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-sm font-medium transition-all">
                      <Download className="h-4 w-4" /> Download
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-sm font-medium transition-all">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-4 h-20 w-20 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-white/20" />
                  </div>
                  <p className="text-white/30 text-sm mb-1">Your AI character will appear here</p>
                  <p className="text-white/20 text-xs">Upload a photo and click generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── PRICING ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-xs sm:text-sm mb-4">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Choose the level of integration that fits your vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/[0.03] rounded-full blur-[60px]" />
              <p className="text-xs text-white/30 uppercase tracking-wider font-semibold mb-2">Basic Insertion</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-white/40 text-sm">per scene</span>
              </div>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Standard AI face swap into any TV show scene. Included free with an active subscription.
              </p>
              <ul className="space-y-3 mb-8">
                {['Basic face insertion', 'Standard lighting match', '1080p export', 'Included with subscription'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold transition-all">
                Get Started
              </button>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border border-[#2563EB]/30 bg-gradient-to-b from-[#2563EB]/[0.06] to-white/[0.02] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#2563EB]/[0.06] rounded-full blur-[80px]" />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#2563EB] text-white uppercase tracking-wider">Popular</span>
              </div>
              <p className="text-xs text-[#60A5FA] uppercase tracking-wider font-semibold mb-2">Featured Role</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">$29</span>
                <span className="text-white/40 text-sm">per scene</span>
              </div>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Full scene integration with advanced AI. Your character blends seamlessly into every frame.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Full scene integration',
                  'Advanced lighting & shadows',
                  '4K broadcast export',
                  'Expression matching',
                  'Multi-angle compositing',
                  'Priority rendering',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-white/60">
                    <Check className="h-4 w-4 text-[#2563EB] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.25)]">
                Go Premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── ROLE SELECTION ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              What kind of presence do you want in the show?
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {ROLES.map((role) => {
              const Icon = role.icon
              const isSelected = selectedRole === role.id
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-300 text-center',
                    isSelected
                      ? 'border-[#2563EB]/40 bg-[#2563EB]/[0.08] shadow-[0_0_30px_rgba(37,99,235,0.1)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  )}
                >
                  <div className={cn(
                    'absolute top-3 right-3 h-4 w-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center',
                    isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-white/20'
                  )}>
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>

                  <div className={cn(
                    'h-12 w-12 rounded-xl flex items-center justify-center transition-all',
                    isSelected
                      ? 'bg-[#2563EB]/20 text-[#60A5FA]'
                      : 'bg-white/[0.04] text-white/40 group-hover:text-white/60'
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className={cn('font-semibold text-sm transition-colors', isSelected ? 'text-white' : 'text-white/70')}>
                      {role.label}
                    </p>
                    <p className="text-white/30 text-xs mt-1">{role.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ────────────────────── VOICE RECORDING ────────────────────── */}
      <section id="voice-section" className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-xs sm:text-sm mb-4">
              <Mic className="h-3.5 w-3.5" />
              <span>Voice Capture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Record Your Voice</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Read the sample line below so our AI can capture your tone and style.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 sm:p-10 space-y-8">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-6">
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2 font-medium">Sample Line</p>
              <p className="text-white/80 italic leading-relaxed text-lg">&ldquo;{SAMPLE_TEXT}&rdquo;</p>
            </div>

            {/* Waveform */}
            <div className="flex items-end justify-center gap-[3px] h-10 px-4">
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 rounded-full transition-all',
                    isRecording ? 'bg-[#2563EB]' : hasRecording ? 'bg-white/20' : 'bg-white/[0.06]'
                  )}
                  style={{
                    height: isRecording ? `${h}px` : hasRecording ? `${Math.random() * 20 + 4}px` : '4px',
                    transition: isRecording ? 'height 0.1s ease' : 'height 0.3s ease',
                  }}
                />
              ))}
            </div>

            <div className="text-center">
              <span className="text-2xl font-mono text-white/60">{formatTime(recordingSeconds)}</span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={toggleRecording}
                className={cn(
                  'flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300',
                  isRecording
                    ? 'bg-[#2563EB] text-white animate-pulse'
                    : 'bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08]'
                )}
              >
                <Mic className="h-5 w-5" />
                {isRecording ? 'Stop Recording' : 'Record Your Voice'}
              </button>
              {hasRecording && (
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {isPlaying ? 'Pause' : 'Play Back'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── SMART CONTRACT NOTE ────────────────────── */}
      <section className="py-16 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6 sm:p-8 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-300 mb-1">On-Chain Likeness Record</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Your appearance in this show is recorded on-chain via smart contract. You retain full rights to your
                likeness. Revenue sharing is automatic: 25% creators / 25% investors / 25% platform / 25% workers.
                Every AI-generated scene is cryptographically signed and traceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────── RIGHTS & CONSENT ────────────────────── */}
      <section className="py-20 sm:py-28 border-t border-white/[0.04]">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <button
              onClick={() => setRightsOpen((o) => !o)}
              className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Rights & Consent</h3>
                  <p className="text-white/40 text-sm">AI likeness usage and your rights</p>
                </div>
              </div>
              <ChevronDown className={cn('h-5 w-5 text-white/30 transition-transform duration-300', rightsOpen && 'rotate-180')} />
            </button>

            <div className={cn('overflow-hidden transition-all duration-500', rightsOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0')}>
              <div className="px-8 pb-8 space-y-6 border-t border-white/[0.06] pt-6">
                <div className="space-y-4 text-sm text-white/50 leading-relaxed">
                  <p>
                    When you upload your photo or voice recording to CINEGENY TV, our AI processes your
                    likeness to generate a digital character. Here is what you should know:
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-2">
                    <li>Your original photos and recordings are encrypted and stored securely.</li>
                    <li>AI-generated likenesses are used only within shows you authorize.</li>
                    <li>You retain the right to request deletion of your data at any time.</li>
                    <li>Generated characters cannot be used by other users without your explicit permission.</li>
                    <li>You may revoke consent at any time through your account settings.</li>
                  </ul>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <button
                    onClick={() => setConsentChecked((c) => !c)}
                    className={cn(
                      'mt-0.5 h-5 w-5 rounded flex-shrink-0 border flex items-center justify-center transition-all duration-300',
                      consentChecked
                        ? 'bg-[#2563EB] border-[#2563EB]'
                        : 'border-white/20 bg-white/[0.03] group-hover:border-white/40'
                    )}
                  >
                    {consentChecked && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className="text-sm text-white/60 leading-relaxed">
                    I consent to AI generation of my likeness for CINEGENY TV productions. I understand
                    that I may revoke this consent at any time.
                  </span>
                </label>

                <Link
                  href="/legal/terms"
                  className="inline-flex items-center gap-1.5 text-sm text-[#60A5FA] hover:text-[#3B82F6] transition-colors"
                >
                  Read full Terms & Conditions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-16" />
    </div>
  )
}
