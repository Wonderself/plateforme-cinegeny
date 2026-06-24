'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  MessageSquare,
  Send,
  Lock,
  Bell,
  BellOff,
  ChevronRight,
  Calendar,
  Clock,
  Users,
  Tv,
  Star,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ALL_TV_SHOWS, SHOWS_BY_GENRE, TV_GENRES, type TvShowData } from '@/data/tv-shows'

/* ── Schedule Types ── */

interface ScheduleSlot {
  time: string
  hour: number
  genre: string
  show: TvShowData | null
  showTitle: string
  duration: number // minutes
}

interface ChatMessage {
  id: number
  username: string
  message: string
  timestamp: string
  color: string
}

/* ── Schedule Data ── */

const SCHEDULE_TEMPLATE: { time: string; hour: number; genre: string; duration: number }[] = [
  { time: '06:00', hour: 6, genre: 'Kids & Animation', duration: 120 },
  { time: '08:00', hour: 8, genre: 'News Parody', duration: 60 },
  { time: '09:00', hour: 9, genre: 'Talk Show', duration: 60 },
  { time: '10:00', hour: 10, genre: 'Cooking Show', duration: 60 },
  { time: '11:00', hour: 11, genre: 'Game Show', duration: 60 },
  { time: '12:00', hour: 12, genre: 'Documentary', duration: 60 },
  { time: '13:00', hour: 13, genre: 'Drama Series', duration: 60 },
  { time: '14:00', hour: 14, genre: 'Reality Competition', duration: 60 },
  { time: '15:00', hour: 15, genre: 'Kids & Animation', duration: 60 },
  { time: '16:00', hour: 16, genre: 'Sketch Comedy', duration: 60 },
  { time: '17:00', hour: 17, genre: 'Talk Show', duration: 60 },
  { time: '18:00', hour: 18, genre: 'News Parody', duration: 60 },
  { time: '19:00', hour: 19, genre: 'Drama Series', duration: 60 },
  { time: '20:00', hour: 20, genre: 'Reality Competition', duration: 60 },
  { time: '21:00', hour: 21, genre: 'Late Night Comedy', duration: 60 },
  { time: '22:00', hour: 22, genre: 'Late Night Comedy', duration: 60 },
  { time: '23:00', hour: 23, genre: 'Documentary', duration: 60 },
  { time: '00:00', hour: 0, genre: 'Sketch Comedy', duration: 60 },
  { time: '01:00', hour: 1, genre: 'Replay', duration: 300 },
]

function buildSchedule(): ScheduleSlot[] {
  return SCHEDULE_TEMPLATE.map((slot) => {
    const genreShows = SHOWS_BY_GENRE[slot.genre]
    const show = genreShows?.[Math.floor(Math.random() * genreShows.length)] ?? null
    return {
      ...slot,
      show,
      showTitle: show?.title ?? `Best of ${slot.genre}`,
    }
  })
}

const CHAT_COLORS = ['#2563EB', '#60A5FA', '#3B82F6', '#93C5FD', '#1D4ED8', '#BFDBFE', '#2563EB', '#818CF8', '#6366F1', '#A78BFA']

const SIMULATED_CHAT: ChatMessage[] = [
  { id: 1, username: 'PixelFan42', message: 'This episode is incredible!', timestamp: '2 min ago', color: CHAT_COLORS[0] },
  { id: 2, username: 'AIMovieBuff', message: 'The production quality keeps getting better', timestamp: '2 min ago', color: CHAT_COLORS[1] },
  { id: 3, username: 'NeuralNerd', message: 'Anyone know if they are dropping a new season?', timestamp: '1 min ago', color: CHAT_COLORS[2] },
  { id: 4, username: 'CineBot3000', message: 'CINEGENY TV >>> everything else', timestamp: '1 min ago', color: CHAT_COLORS[3] },
  { id: 5, username: 'StreamQueen', message: 'That plot twist though...', timestamp: '1 min ago', color: CHAT_COLORS[4] },
  { id: 6, username: 'TokenHolder', message: 'Glad I invested in this platform', timestamp: '45s ago', color: CHAT_COLORS[5] },
  { id: 7, username: 'RenderWolf', message: 'The AI acting has gotten so natural', timestamp: '30s ago', color: CHAT_COLORS[6] },
  { id: 8, username: 'GlitchGirl', message: 'Late Night with Neural Ned is next!!', timestamp: '20s ago', color: CHAT_COLORS[7] },
  { id: 9, username: 'ByteMe', message: 'Can we get subtitles in French?', timestamp: '10s ago', color: CHAT_COLORS[8] },
  { id: 10, username: 'PromptMaster', message: 'Best live channel on the internet, period.', timestamp: 'just now', color: CHAT_COLORS[9] },
]

const WEEKLY_PRIME_TIME: { day: string; showIndex: number }[] = [
  { day: 'Mon', showIndex: 5 },
  { day: 'Tue', showIndex: 4 },
  { day: 'Wed', showIndex: 3 },
  { day: 'Thu', showIndex: 10 },
  { day: 'Fri', showIndex: 19 },
  { day: 'Sat', showIndex: 12 },
  { day: 'Sun', showIndex: 6 },
]

/* ── Genre badge color helper ── */

function genreColor(genre: string): string {
  const map: Record<string, string> = {
    'Talk Show': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'News Parody': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Sketch Comedy': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    'Late Night Comedy': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Reality Competition': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Drama Series': 'bg-red-500/20 text-red-300 border-red-500/30',
    Documentary: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Game Show': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Cooking Show': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    'Kids & Animation': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    Replay: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  }
  return map[genre] ?? 'bg-white/10 text-white/60 border-white/20'
}

/* ── Main Component ── */

export default function TvLivePage() {
  const [schedule, setSchedule] = useState<ScheduleSlot[]>([])
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progressPct, setProgressPct] = useState(35)
  const [reminders, setReminders] = useState<Set<string>>(new Set())
  const [visibleChats, setVisibleChats] = useState<ChatMessage[]>(SIMULATED_CHAT.slice(0, 5))
  const scheduleRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const videoAreaRef = useRef<HTMLDivElement>(null)

  // Build schedule on mount
  useEffect(() => {
    const s = buildSchedule()
    setSchedule(s)
    // Determine current slot based on hour
    const now = new Date()
    const h = now.getHours()
    const idx = s.findIndex((slot, i) => {
      const nextSlot = s[i + 1]
      if (!nextSlot) return true
      if (slot.hour <= h && (nextSlot.hour > h || nextSlot.hour < slot.hour)) return true
      return false
    })
    setCurrentSlotIndex(idx >= 0 ? idx : 0)
    // Simulate progress
    setProgressPct(Math.floor((now.getMinutes() / 60) * 100))
  }, [])

  // Load saved reminders
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cinegen-tv-reminders')
      if (saved) setReminders(new Set(JSON.parse(saved)))
    } catch { /* ignore */ }
  }, [])

  // Simulate chat messages appearing
  useEffect(() => {
    if (visibleChats.length >= SIMULATED_CHAT.length) return
    const timer = setTimeout(() => {
      setVisibleChats((prev) => [...prev, SIMULATED_CHAT[prev.length]])
    }, 3000 + Math.random() * 2000)
    return () => clearTimeout(timer)
  }, [visibleChats])

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleChats])

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgressPct((p) => (p >= 100 ? 0 : p + 0.5))
    }, 1800)
    return () => clearInterval(timer)
  }, [])

  const toggleReminder = useCallback((slotTime: string) => {
    setReminders((prev) => {
      const next = new Set(prev)
      if (next.has(slotTime)) next.delete(slotTime)
      else next.add(slotTime)
      try { localStorage.setItem('cinegen-tv-reminders', JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
  }, [])

  const handleFullscreen = useCallback(() => {
    const el = videoAreaRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
        toast.info('Plein écran non disponible')
      })
    } else {
      document.exitFullscreen()
    }
  }, [])

  const currentShow = schedule[currentSlotIndex]
  const nextShow = schedule[currentSlotIndex + 1] ?? schedule[0]

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ─── A. LIVE PLAYER ─── */}
      <div className="relative">
        <div className={`flex flex-col lg:flex-row`}>
          {/* Video Area */}
          <div className={`relative flex-1 ${chatOpen ? 'lg:mr-[360px]' : ''} transition-all duration-300`}>
            <div ref={videoAreaRef} className="relative aspect-video bg-gradient-to-br from-[#0A1628] via-[#050A15] to-[#0A1225] overflow-hidden">
              {/* Fake video content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2563EB]/[0.08] via-transparent to-transparent" />
                <div className="relative text-center">
                  <Tv className="h-20 w-20 text-[#2563EB]/30 mx-auto mb-4" />
                  <p className="text-white/20 text-lg">CINEGENY TV — Live Stream</p>
                </div>
              </div>

              {/* LIVE badge */}
              <div className="absolute top-4 left-4 flex items-center gap-3 z-10">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]" />
                  </span>
                  <span className="text-[#EF4444] font-bold text-sm tracking-wider">LIVE</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
                  <Users className="h-3.5 w-3.5 text-white/50" />
                  <span className="text-white/70 text-sm">1,247 watching</span>
                </div>
              </div>

              {/* Channel badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="px-3 py-1.5 rounded-lg bg-[#2563EB]/20 backdrop-blur-sm border border-[#2563EB]/30">
                  <span className="text-[#2563EB] font-bold text-sm">CINEGENY TV</span>
                </div>
              </div>

              {/* Show title overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 z-10">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Now Playing</p>
                <h2 className="text-white text-xl sm:text-2xl font-bold">
                  {currentShow?.showTitle ?? 'Loading...'}
                </h2>
                {currentShow?.show && (
                  <p className="text-white/50 text-sm mt-1">Hosted by {currentShow.show.host}</p>
                )}
              </div>

              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Progress bar */}
                <div className="h-1 bg-white/10 w-full">
                  <div className="h-full bg-[#2563EB] transition-all duration-1000" style={{ width: `${progressPct}%` }} />
                </div>
                <div className="flex items-center justify-between px-4 py-2 bg-black/70 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)} className="text-white/80 hover:text-white transition-colors">
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white transition-colors">
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </button>
                    <span className="text-white/40 text-xs">{currentShow?.time ?? '--:--'} — Live</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChatOpen(!chatOpen)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm transition-colors ${
                        chatOpen ? 'bg-[#2563EB]/20 text-[#2563EB]' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Chat</span>
                    </button>
                    <button
                      onClick={() => toast.info('Paramètres bientôt disponibles')}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleFullscreen}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <Maximize className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── B. LIVE CHAT SIDEBAR ─── */}
          {chatOpen && (
            <div className="lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:w-[360px] bg-[#0A1020] border-l border-white/[0.06] flex flex-col z-30">
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h3 className="text-white font-semibold text-sm">Live Chat</h3>
                <button onClick={() => setChatOpen(false)} className="text-white/40 hover:text-white text-xs">
                  Close
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {visibleChats.map((msg) => (
                  <div key={msg.id} className="flex gap-2 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="font-semibold shrink-0" style={{ color: msg.color }}>
                      {msg.username}
                    </span>
                    <span className="text-white/70">{msg.message}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 border-t border-white/[0.06]">
                <div className="relative">
                  <input
                    disabled
                    placeholder="Type a message..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/30 placeholder:text-white/20 text-sm cursor-not-allowed"
                  />
                  <Send className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/15" />
                </div>
                <p className="flex items-center gap-1 text-[11px] text-white/30 mt-2">
                  <Lock className="h-3 w-3" /> Login to chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 py-10">
        {/* ─── C. NOW PLAYING INFO BAR ─── */}
        <div className="rounded-2xl border border-[#2563EB]/30 bg-[#2563EB]/[0.05] p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EF4444]" />
                </span>
                <span className="text-[#EF4444] font-medium text-sm">On Air Now</span>
              </div>
              <h3 className="text-white text-xl font-bold mb-1">{currentShow?.showTitle ?? 'Loading...'}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/50">
                {currentShow?.show && (
                  <>
                    <span>Host: {currentShow.show.host}</span>
                    <span className="text-white/20">|</span>
                    <span>Episode {Math.floor(Math.random() * 50) + 1}</span>
                    <span className="text-white/20">|</span>
                  </>
                )}
                <Badge className={`text-[10px] ${genreColor(currentShow?.genre ?? '')}`}>
                  {currentShow?.genre}
                </Badge>
              </div>
              {/* Progress bar */}
              <div className="mt-4">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[11px] text-white/30">
                  <span>{Math.floor(progressPct * 0.6)} min elapsed</span>
                  <span>{60 - Math.floor(progressPct * 0.6)} min remaining</span>
                </div>
              </div>
            </div>
            <div className="md:text-right shrink-0">
              <p className="text-white/40 text-sm mb-1">Next Up</p>
              <p className="text-white font-semibold">{nextShow?.showTitle ?? '...'}</p>
              <p className="text-[#2563EB] text-sm">at {nextShow?.time ?? '--:--'}</p>
              <button
                onClick={() => toast.success('Ajouté à votre calendrier')}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/30 text-[#2563EB] text-sm font-medium hover:bg-[#2563EB]/20 transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" /> Add to Calendar
              </button>
            </div>
          </div>
        </div>

        {/* ─── D. TODAY'S SCHEDULE ─── */}
        <section ref={scheduleRef} className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
              Today&apos;s Schedule
            </h2>
            <span className="text-white/30 text-sm flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <div className="space-y-1">
            {schedule.map((slot, i) => {
              const isCurrent = i === currentSlotIndex
              const isPast = i < currentSlotIndex
              return (
                <div
                  key={slot.time}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                    isCurrent
                      ? 'border border-[#2563EB]/30 bg-[#2563EB]/[0.05] shadow-[0_0_20px_rgba(37,99,235,0.1)]'
                      : i % 2 === 0
                        ? 'bg-white/[0.01]'
                        : 'bg-white/[0.03]'
                  } ${isPast ? 'opacity-50' : ''}`}
                >
                  {/* Time */}
                  <div className="w-16 shrink-0 text-center">
                    <span className={`text-sm font-mono font-semibold ${isCurrent ? 'text-[#2563EB]' : 'text-white/50'}`}>
                      {slot.time}
                    </span>
                  </div>

                  {/* Live indicator for current */}
                  <div className="w-6 shrink-0 flex justify-center">
                    {isCurrent ? (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EF4444] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EF4444]" />
                      </span>
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-white/10" />
                    )}
                  </div>

                  {/* Show info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold truncate ${isCurrent ? 'text-white' : 'text-white/70'}`}>
                      {slot.showTitle}
                    </h4>
                    {slot.show && (
                      <p className="text-white/30 text-xs mt-0.5 truncate">
                        {slot.show.host} &middot; {slot.duration} min
                      </p>
                    )}
                  </div>

                  {/* Genre badge */}
                  <Badge className={`hidden sm:flex text-[10px] shrink-0 ${genreColor(slot.genre)}`}>
                    {slot.genre}
                  </Badge>

                  {/* Reminder button */}
                  {!isPast && !isCurrent && (
                    <button
                      onClick={() => toggleReminder(slot.time)}
                      className={`shrink-0 p-2 rounded-lg transition-colors ${
                        reminders.has(slot.time)
                          ? 'bg-[#2563EB]/20 text-[#2563EB]'
                          : 'text-white/20 hover:text-white/50 hover:bg-white/5'
                      }`}
                      title={reminders.has(slot.time) ? 'Remove reminder' : 'Set reminder'}
                    >
                      {reminders.has(slot.time) ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </button>
                  )}

                  {isCurrent && (
                    <span className="shrink-0 px-3 py-1 rounded-full bg-[#EF4444]/20 text-[#EF4444] text-xs font-semibold">
                      LIVE
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── E. WEEKLY SCHEDULE PREVIEW ─── */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
            This Week on CINEGENY TV
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {WEEKLY_PRIME_TIME.map(({ day, showIndex }) => {
              const show = ALL_TV_SHOWS[showIndex] ?? ALL_TV_SHOWS[0]
              const isToday = day === ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
              return (
                <div
                  key={day}
                  className={`rounded-2xl border p-4 transition-all ${
                    isToday
                      ? 'border-[#2563EB]/40 bg-[#2563EB]/[0.08]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  <p className={`text-xs font-semibold mb-2 ${isToday ? 'text-[#2563EB]' : 'text-white/40'}`}>
                    {day} {isToday && '(Today)'}
                  </p>
                  <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Prime Time 20:00</p>
                  <h4 className="text-white text-sm font-semibold truncate">{show.title}</h4>
                  <Badge className={`mt-2 text-[9px] ${genreColor(show.genre)}`}>{show.genre}</Badge>
                  {show.rating >= 4.5 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400/70 text-[10px]">{show.rating}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── ABOUT CINEGENY TV ─── */}
        <section className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">
                About CINEGENY TV
              </h2>
              <p className="text-white/50 leading-relaxed max-w-2xl">
                CINEGENY TV is the world&apos;s first 24/7 AI-generated television channel. From talk shows
                to dramas, game shows to late-night comedy — every frame is created by artificial intelligence.
                Tune in live or catch up on replay.
              </p>
            </div>
            <Link
              href="/tv/replay"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#3B82F6] transition-colors shrink-0"
            >
              Browse Replays <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
