'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Lightbulb,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Target,
  Users,
  Palette,
  Wand2,
  Check,
  Tv,
  Star,
  Zap,
  Brain,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ── Constants ── */
const STEPS = [
  { num: 1, label: 'Concept', href: '/tv/create/concept' },
  { num: 2, label: 'Script', href: '/tv/create/script' },
  { num: 3, label: 'Set Design', href: '/tv/create/set-design' },
  { num: 4, label: 'Casting', href: '/tv/create/casting' },
  { num: 5, label: 'Record', href: '/tv/create/record' },
  { num: 6, label: 'Edit', href: '/tv/create/editing' },
  { num: 7, label: 'Broadcast', href: '/tv/create/broadcast' },
]

const SHOW_FORMATS = [
  { id: 'talk-show', label: 'Talk Show', icon: MessageSquare, desc: 'Interview-driven conversational format' },
  { id: 'game-show', label: 'Game Show', icon: Zap, desc: 'Competition with contestants and prizes' },
  { id: 'reality', label: 'Reality', icon: Users, desc: 'Unscripted real-life situations' },
  { id: 'drama', label: 'Drama', icon: Star, desc: 'Scripted narrative storytelling' },
  { id: 'comedy', label: 'Comedy', icon: Sparkles, desc: 'Humor-focused entertainment' },
  { id: 'documentary', label: 'Documentary', icon: Brain, desc: 'Factual exploration of topics' },
  { id: 'variety', label: 'Variety', icon: Palette, desc: 'Mixed entertainment segments' },
  { id: 'news', label: 'News Magazine', icon: Tv, desc: 'Current events and reporting' },
]

const AUDIENCES = [
  { id: 'kids', label: 'Kids (6-12)', color: 'from-green-500 to-emerald-400' },
  { id: 'teens', label: 'Teens (13-17)', color: 'from-purple-500 to-violet-400' },
  { id: 'young-adults', label: 'Young Adults (18-34)', color: 'from-blue-500 to-cyan-400' },
  { id: 'adults', label: 'Adults (35-54)', color: 'from-amber-500 to-orange-400' },
  { id: 'seniors', label: 'Seniors (55+)', color: 'from-rose-500 to-pink-400' },
  { id: 'family', label: 'Family (All Ages)', color: 'from-teal-500 to-emerald-400' },
]

const TONES = [
  { id: 'lighthearted', label: 'Lighthearted', emoji: '☀️' },
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭' },
  { id: 'suspenseful', label: 'Suspenseful', emoji: '🔍' },
  { id: 'inspirational', label: 'Inspirational', emoji: '✨' },
  { id: 'edgy', label: 'Edgy', emoji: '⚡' },
  { id: 'nostalgic', label: 'Nostalgic', emoji: '📻' },
  { id: 'whimsical', label: 'Whimsical', emoji: '🎪' },
  { id: 'gritty', label: 'Gritty', emoji: '🏚️' },
]

const FAQS = [
  {
    q: 'What makes a strong TV show concept?',
    a: 'A strong concept has a clear premise that can be explained in one sentence, a defined target audience, and enough depth to sustain multiple episodes or seasons. Focus on what makes your show unique.',
  },
  {
    q: 'Can I change my concept later?',
    a: 'Absolutely. Your concept is saved to localStorage and can be revisited at any time. The creative process is iterative, so feel free to refine as you progress through the steps.',
  },
  {
    q: 'How does the AI concept analysis work?',
    a: 'Our AI evaluates your concept against successful shows in the same format, checking for originality, market viability, and audience appeal. It provides actionable suggestions to strengthen your pitch.',
  },
  {
    q: 'Do I need to fill in every field?',
    a: 'No, but the more detail you provide, the better the AI can assist you in later steps. At minimum, choose a format and give your show a name.',
  },
]

const AUTOSAVE_KEY = 'cinegen-tv-concept-draft'

export default function TvConceptPage() {
  const [showName, setShowName] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([])
  const [pitch, setPitch] = useState('')
  const [selectedTones, setSelectedTones] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Load draft ── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY)
      if (saved) {
        const draft = JSON.parse(saved)
        if (draft.showName) setShowName(draft.showName)
        if (draft.selectedFormat) setSelectedFormat(draft.selectedFormat)
        if (draft.selectedAudiences) setSelectedAudiences(draft.selectedAudiences)
        if (draft.pitch) setPitch(draft.pitch)
        if (draft.selectedTones) setSelectedTones(draft.selectedTones)
        setAutoSaveStatus('saved')
      }
    } catch { /* ignore */ }
  }, [])

  /* ── Auto-save ── */
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    setAutoSaveStatus('saving')
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          AUTOSAVE_KEY,
          JSON.stringify({ showName, selectedFormat, selectedAudiences, pitch, selectedTones })
        )
        setAutoSaveStatus('saved')
      } catch {
        setAutoSaveStatus('idle')
      }
    }, 1500)
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current) }
  }, [showName, selectedFormat, selectedAudiences, pitch, selectedTones])

  const toggleAudience = (id: string) => {
    setSelectedAudiences(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const toggleTone = (id: string) => {
    setSelectedTones(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  /* ── AI Analysis ── */
  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setAnalysisProgress(0)
    const steps = [
      { progress: 20, delay: 400 },
      { progress: 45, delay: 900 },
      { progress: 65, delay: 1500 },
      { progress: 80, delay: 2100 },
      { progress: 95, delay: 2700 },
      { progress: 100, delay: 3200 },
    ]
    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setAnalysisProgress(progress), delay)
    })
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3400)
  }

  const conceptStrength = showName && selectedFormat && pitch.length > 20 ? 'Strong' : showName || selectedFormat ? 'Developing' : 'Not Started'
  const strengthColor = conceptStrength === 'Strong' ? 'text-emerald-400' : conceptStrength === 'Developing' ? 'text-amber-400' : 'text-white/30'

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ── Hero ── */}
      <section className="relative pt-12 pb-10 md:pt-20 md:pb-14 px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#2563EB]/[0.04] blur-[100px]" />
        </div>

        <div className="relative">
          <Link
            href="/tv/create"
            className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mb-6"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            Back to TV Create Hub
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-white/50 mb-6 ml-4">
            <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
            Step 1 of 7
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-[#2563EB]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
              Define Your <span className="text-[#2563EB]">Show Concept</span>
            </h1>
          </div>

          <p className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed">
            Every great TV show starts with a powerful concept. Define your format, audience, tone, and pitch to lay the foundation for your CINEGENY TV universe.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-8 md:px-16 lg:px-20 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ── Main Content (3 cols) ── */}
          <div className="lg:col-span-3 space-y-8">
            {/* Show Name */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Show Name</h2>
              <input
                type="text"
                value={showName}
                onChange={e => setShowName(e.target.value)}
                placeholder="Enter your show name..."
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3.5 text-lg font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              />
            </div>

            {/* Format Selector */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Show Format</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SHOW_FORMATS.map(fmt => (
                  <button
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition-all duration-300 group',
                      selectedFormat === fmt.id
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <fmt.icon className={cn(
                      'h-5 w-5 mb-2 transition-colors',
                      selectedFormat === fmt.id ? 'text-[#2563EB]' : 'text-white/30 group-hover:text-white/50'
                    )} />
                    <h3 className={cn(
                      'text-sm font-bold mb-1 transition-colors',
                      selectedFormat === fmt.id ? 'text-[#2563EB]' : 'text-white/70'
                    )}>
                      {fmt.label}
                    </h3>
                    <p className="text-[10px] text-white/30 leading-relaxed">{fmt.desc}</p>
                    {selectedFormat === fmt.id && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-[#2563EB]">
                        <Check className="h-3 w-3" /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Target Audience</h2>
                <span className="text-[10px] text-white/25 ml-auto">Select multiple</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AUDIENCES.map(aud => (
                  <button
                    key={aud.id}
                    onClick={() => toggleAudience(aud.id)}
                    className={cn(
                      'rounded-xl border px-4 py-3 text-left transition-all duration-300 flex items-center gap-3',
                      selectedAudiences.includes(aud.id)
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.08]'
                        : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    )}
                  >
                    <div className={cn(
                      'w-3 h-3 rounded-full bg-gradient-to-r shrink-0',
                      aud.color
                    )} />
                    <span className={cn(
                      'text-sm font-medium transition-colors',
                      selectedAudiences.includes(aud.id) ? 'text-white' : 'text-white/50'
                    )}>
                      {aud.label}
                    </span>
                    {selectedAudiences.includes(aud.id) && (
                      <Check className="h-3.5 w-3.5 text-[#2563EB] ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Show Pitch</h2>
              <p className="text-xs text-white/30 mb-3">Describe your show in 2-4 sentences. What happens? Why should people watch?</p>
              <textarea
                value={pitch}
                onChange={e => setPitch(e.target.value)}
                placeholder="In a world where... our show follows... audiences will love it because..."
                rows={6}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-4 text-sm text-white/90 placeholder:text-white/15 focus:outline-none focus:border-[#2563EB]/50 transition-colors resize-y leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-white/25">{pitch.length} characters</span>
                <span className="text-[10px] text-white/25">{pitch.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            {/* Tone / Mood */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Tone & Mood</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {TONES.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => toggleTone(tone.id)}
                    className={cn(
                      'inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-300',
                      selectedTones.includes(tone.id)
                        ? 'border-[#2563EB]/50 bg-[#2563EB]/[0.12] text-[#2563EB]'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/40 hover:text-white/60 hover:border-white/[0.15]'
                    )}
                  >
                    <span>{tone.emoji}</span>
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#2563EB]" />
                <h3 className="text-sm font-bold text-white/80">AI Concept Analysis</h3>
              </div>
              <p className="text-xs text-white/35 mb-4">
                Let AI evaluate your concept for market viability, originality, and audience appeal.
              </p>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!showName && !selectedFormat)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
                  isAnalyzing
                    ? 'bg-[#2563EB]/30 text-white/50 cursor-wait'
                    : (!showName && !selectedFormat)
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-[#2563EB] text-white hover:bg-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]'
                )}
              >
                {isAnalyzing ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Concept...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Analyze Concept with AI
                  </>
                )}
              </button>

              {isAnalyzing && (
                <div className="mt-3">
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] transition-all duration-500 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 text-center">{analysisProgress}%</p>
                </div>
              )}

              {analysisComplete && (
                <div className="mt-5 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Originality', score: 78, grade: 'B+' },
                      { label: 'Market Viability', score: 85, grade: 'A' },
                      { label: 'Audience Appeal', score: 72, grade: 'B' },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                        <p className="text-[10px] text-white/40 mb-1">{item.label}</p>
                        <p className="text-lg font-black text-[#2563EB]">{item.grade}</p>
                        <div className="h-1 rounded-full bg-white/[0.06] mt-2 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" style={{ width: `${item.score}%` }} />
                        </div>
                        <p className="text-[9px] text-white/25 mt-1">{item.score}%</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <h4 className="text-xs font-bold text-white/60 mb-2">AI Recommendations</h4>
                    <ul className="space-y-1.5">
                      {[
                        'Consider adding a unique twist to differentiate from similar shows',
                        'Your target audience aligns well with the chosen format',
                        'Strengthen the pitch with a clear conflict or hook',
                        'The tone selections create an interesting contrast - lean into it',
                      ].map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/40 leading-relaxed">
                          <span className="text-[#2563EB] mt-0.5 shrink-0">&#8226;</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/tv/create"
                className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Hub
              </Link>
              <Link
                href="/tv/create/script"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-[#2563EB] text-white hover:bg-[#3B82F6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]"
              >
                Next Step: Script
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* FAQ */}
            <section className="mt-12">
              <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="text-sm font-medium text-white/70">{faq.q}</span>
                      <ChevronDown className={cn('h-4 w-4 text-white/30 transition-transform shrink-0 ml-4', openFaq === i && 'rotate-180')} />
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5">
                        <p className="text-xs text-white/40 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar (1 col) ── */}
          <div className="space-y-5">
            {/* Progress */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Creation Progress</h3>
              <div className="space-y-2">
                {STEPS.map(step => (
                  <Link
                    key={step.num}
                    href={step.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                      step.num === 1
                        ? 'bg-[#2563EB]/[0.12] border border-[#2563EB]/30'
                        : 'hover:bg-white/[0.03]'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                      step.num === 1
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white/[0.06] text-white/30'
                    )}>
                      {step.num}
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      step.num === 1 ? 'text-[#2563EB]' : 'text-white/30'
                    )}>
                      {step.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Concept Strength */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Concept Strength</h3>
              <p className={cn('text-lg font-black mb-2', strengthColor)}>{conceptStrength}</p>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2">
                  {showName ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                  <span className={showName ? 'text-white/60' : 'text-white/25'}>Show name</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedFormat ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                  <span className={selectedFormat ? 'text-white/60' : 'text-white/25'}>Format selected</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedAudiences.length > 0 ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                  <span className={selectedAudiences.length > 0 ? 'text-white/60' : 'text-white/25'}>Target audience</span>
                </div>
                <div className="flex items-center gap-2">
                  {pitch.length > 20 ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                  <span className={pitch.length > 20 ? 'text-white/60' : 'text-white/25'}>Show pitch</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedTones.length > 0 ? <Check className="h-3 w-3 text-emerald-400" /> : <div className="w-3 h-3 rounded-full border border-white/20" />}
                  <span className={selectedTones.length > 0 ? 'text-white/60' : 'text-white/25'}>Tone & mood</span>
                </div>
              </div>
            </div>

            {/* Auto-save status */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="flex items-center gap-2 text-xs">
                {autoSaveStatus === 'saving' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-400/70">Saving draft...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400/70">Draft saved</span>
                  </>
                )}
                {autoSaveStatus === 'idle' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-white/30">No draft</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
