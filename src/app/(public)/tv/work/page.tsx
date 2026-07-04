'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ALL_TV_SHOWS, SHOWS_BY_GENRE, TV_GENRES } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'
import {
  Pencil,
  Monitor,
  Scissors,
  Paintbrush,
  Volume2,
  Video,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  Download,
  Play,
  Users,
  BarChart3,
  Briefcase,
  Filter,
  Tv,
} from 'lucide-react'

/* ── Simulate progress ── */
function getShowProgress(show: TvShowData) {
  const hash = show.id.charCodeAt(show.id.length - 1) + show.title.length
  return Math.min(5 + ((hash * 41) % 90), 99)
}

/* ── Task categories for TV ── */
const TASK_CATEGORIES = [
  { name: 'Écriture', icon: Pencil, desc: 'Tâches de script et dialogue', color: '#2563EB' },
  { name: 'Animation', icon: Monitor, desc: 'Présentation à l\'écran', color: '#60A5FA' },
  { name: 'Montage', icon: Scissors, desc: 'Tâches de post-production', color: '#8B5CF6' },
  { name: 'Graphisme', icon: Paintbrush, desc: 'Tâches de design visuel', color: '#10B981' },
  { name: 'Son', icon: Volume2, desc: 'Tâches audio et musique', color: '#F59E0B' },
  { name: 'Caméra', icon: Video, desc: 'Tournage et réalisation', color: '#EC4899' },
  { name: 'Recherche', icon: Search, desc: 'Tâches de recherche de contenu', color: '#6366F1' },
]

/* ── Difficulty system ── */
const DIFFICULTIES = ['Facile', 'Moyen', 'Difficile'] as const
const DIFFICULTY_COLORS: Record<string, string> = {
  Facile: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Moyen: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Difficile: 'text-red-400 bg-red-400/10 border-red-400/20',
}

/* ── Generate 16 tasks across 7 categories ── */
function generateTasks() {
  const tasks: {
    id: number
    name: string
    description: string
    category: string
    categoryIcon: React.ElementType
    categoryColor: string
    show: string
    showSlug: string
    rewardETH: string
    rewardCash: number
    difficulty: typeof DIFFICULTIES[number]
    deadline: string
  }[] = []

  const taskDefs: Record<string, { name: string; desc: string }[]> = {
    'Écriture': [
      { name: 'Écrire le monologue d\'ouverture', desc: 'Créez une ouverture comique de 90 secondes pour le prochain épisode.' },
      { name: 'Rédiger les questions d\'interview', desc: 'Préparez 15 questions pour le prochain segment avec un invité célèbre.' },
      { name: 'Scénariser les transitions', desc: 'Écrivez 5 transitions fluides entre segments avec des touches d\'humour.' },
    ],
    'Animation': [
      { name: 'Enregistrer une lecture au prompteur', desc: 'Effectuez une lecture nette au prompteur du script finalisé.' },
      { name: 'Improviser des réactions', desc: 'Enregistrez 10 plans de réaction naturels pour la bibliothèque de montage.' },
    ],
    'Montage': [
      { name: 'Monter une bande de moments forts', desc: 'Montez une bande de 3 minutes à partir des épisodes de la semaine dernière.' },
      { name: 'Étalonner les images du studio', desc: 'Appliquez un étalonnage cohérent sur 45 minutes de rushes.' },
      { name: 'Monter la bande-annonce', desc: 'Créez une bande-annonce promotionnelle de 30 secondes pour les réseaux sociaux.' },
    ],
    'Graphisme': [
      { name: 'Concevoir les bandeaux incrustés', desc: 'Créez des bandeaux animés pour présenter les invités.' },
      { name: 'Créer la miniature de l\'épisode', desc: 'Concevez une miniature accrocheuse pour YouTube et le streaming.' },
    ],
    'Son': [
      { name: 'Mixer l\'audio de l\'épisode', desc: 'Équilibrez les niveaux, supprimez les bruits, ajoutez une musique d\'intro/outro.' },
      { name: 'Composer le jingle de la série', desc: 'Créez un jingle énergique de 15 secondes pour les transitions de segments.' },
    ],
    'Caméra': [
      { name: 'Filmer des plans B-roll de la ville', desc: 'Capturez 20 plans d\'ensemble de la ville pour servir d\'arrière-plan.' },
    ],
    'Recherche': [
      { name: 'Rechercher les sujets tendance', desc: 'Compilez les 20 sujets tendance avec un score de pertinence pour l\'audience.' },
      { name: 'Vérifier les faits du script', desc: 'Vérifiez toutes les affirmations factuelles du script de cette semaine.' },
    ],
  }

  const rewards = [0.003, 0.005, 0.008, 0.01, 0.012, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.05]
  const cashRewards = [5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50]
  const deadlines = ['2 days', '3 days', '5 days', '1 week', '10 days', '2 weeks']

  let idx = 0
  for (const cat of TASK_CATEGORIES) {
    const defs = taskDefs[cat.name] || []
    for (const def of defs) {
      const show = ALL_TV_SHOWS[idx % ALL_TV_SHOWS.length]
      tasks.push({
        id: idx,
        name: def.name,
        description: def.desc,
        category: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        show: show.title,
        showSlug: show.slug,
        rewardETH: rewards[idx % rewards.length].toFixed(3),
        rewardCash: cashRewards[idx % cashRewards.length],
        difficulty: DIFFICULTIES[idx % 3],
        deadline: deadlines[idx % deadlines.length],
      })
      idx++
    }
  }
  return tasks
}

const TASKS = generateTasks()

/* ── Hero shows (high progress) ── */
const HERO_SHOWS = ALL_TV_SHOWS
  .map((s) => ({ ...s, _progress: getShowProgress(s) }))
  .filter((s) => s._progress >= 40)
  .slice(0, 3)

/* ── Coming soon shows ── */
const COMING_SOON = ALL_TV_SHOWS
  .map((s) => ({ ...s, _progress: getShowProgress(s) }))
  .filter((s) => s._progress < 25)
  .slice(0, 6)

/* ── Stats ── */
const TOTAL_TASKS = TASKS.length
const AVG_PAY = Math.round(TASKS.reduce((s, t) => s + t.rewardCash, 0) / TASKS.length)
const ACTIVE_WORKERS = 347

export default function TvWorkPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = dir === 'left' ? -400 : 400
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const filteredTasks = activeCategory
    ? TASKS.filter((t) => t.category === activeCategory)
    : TASKS

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#2563EB]/[0.08] via-transparent to-transparent opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2563EB]/[0.04] blur-[200px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[#60A5FA]/[0.03] blur-[150px]" />

        <div className="container mx-auto max-w-6xl relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#60A5FA] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                Gagnez de l&apos;argent en créant
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                Tâches de production{' '}
                <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                  TV
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-4">
                Réalisez des tâches de production TV, soyez payé pour chaque contribution.
              </p>
              <p className="text-base text-white/35 leading-relaxed mb-10">
                Choisissez une série, téléchargez le kit de tâches, donnez-lui vie et gagnez des revenus.
                Choisissez entre un paiement en espèces immédiat ou des parts de production valant 2 fois plus.
              </p>
              <Link
                href="/tv"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 hover:scale-[1.02]"
              >
                Commencer à gagner de l&apos;argent
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Right: 3 featured show cards */}
            <div className="flex gap-4 justify-center lg:justify-end">
              {HERO_SHOWS.map((show) => (
                <Link
                  key={show.slug}
                  href={`/tv/shows/${show.slug}`}
                  className="group relative w-[140px] sm:w-[160px] rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]"
                >
                  <div className="relative aspect-[2/3] bg-[#0A1628]">
                    {show.coverImageUrl ? (
                      <Image
                        src={show.coverImageUrl}
                        alt={show.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="160px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv className="h-10 w-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/10">
                      <span className="text-[10px] font-bold text-[#60A5FA]">{show._progress}%</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-bold text-white leading-tight line-clamp-2">{show.title}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                          style={{ width: `${show._progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-6 px-4 sm:px-8 md:px-16 lg:px-20 border-y border-white/[0.04]">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Briefcase, label: 'Tâches au total', value: `${TOTAL_TASKS}+` },
              { icon: DollarSign, label: 'Rémunération moyenne', value: `${AVG_PAY} $` },
              { icon: Users, label: 'Contributeurs actifs', value: `${ACTIVE_WORKERS}` },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 justify-center p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <stat.icon className="h-4 w-4 text-[#2563EB]" />
                <div>
                  <p className="text-sm font-bold text-[#60A5FA]">{stat.value}</p>
                  <p className="text-[10px] text-white/30">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comment ça marche
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trois étapes pour{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                commencer à gagner
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { step: '1', title: 'Choisissez une série', desc: 'Parcourez les séries TV disponibles et choisissez un projet qui vous inspire.', icon: Play },
              { step: '2', title: 'Téléchargez le kit', desc: 'Récupérez les ressources, consignes et brief créatif de la tâche.', icon: Download },
              { step: '3', title: 'Soyez payé', desc: 'Soumettez votre travail, obtenez l\'approbation, recevez le paiement instantanément.', icon: DollarSign },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 md:-right-6 w-8 md:w-12 h-px bg-gradient-to-r from-[#2563EB]/40 to-transparent" />
                )}
                <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-5 w-5 text-[#2563EB]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center mx-auto mb-3 text-[#60A5FA] font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ AVAILABLE SHOWS (scrollable) ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Available Shows
              </h2>
              <p className="text-sm text-white/40 mt-2">Pick a TV show and start working on tasks</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-white/50" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-white/50" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ALL_TV_SHOWS.slice(0, 30).map((show) => {
              const progressPct = getShowProgress(show)
              const isAiring = show.status === 'ongoing'
              return (
                <Link
                  key={show.slug}
                  href={`/tv/shows/${show.slug}`}
                  className="group flex-shrink-0 w-[160px] sm:w-[180px] snap-start rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)]"
                >
                  <div className="relative aspect-[2/3] bg-[#0A1628]">
                    {show.coverImageUrl ? (
                      <Image
                        src={show.coverImageUrl}
                        alt={show.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="180px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv className="h-10 w-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          isAiring
                            ? 'bg-[#2563EB]/20 text-[#60A5FA] border-[#2563EB]/30'
                            : 'bg-white/10 text-white/60 border-white/10'
                        }`}
                      >
                        {show.status === 'ongoing' ? 'LIVE' : show.status === 'completed' ? 'DONE' : 'DEV'}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-xs font-bold text-white leading-tight line-clamp-2 mb-1">{show.title}</p>
                      <p className="text-[10px] text-white/40">{show.genre}</p>
                      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-white/30">{progressPct}% complete</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ TASK MARKETPLACE ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Task Marketplace
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Active{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                Production Tasks
              </span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Browse available tasks across all active TV productions. Pick a task, complete it, and earn.
            </p>
          </div>

          {/* Filter sidebar as horizontal pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeCategory === null
                  ? 'border-[#2563EB]/40 bg-[#2563EB]/10 text-[#60A5FA]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] text-white/60'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span className="text-xs font-medium">All ({TASKS.length})</span>
            </button>
            {TASK_CATEGORIES.map((cat) => {
              const count = TASKS.filter((t) => t.category === cat.name).length
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.name
                      ? 'border-[#2563EB]/40 bg-[#2563EB]/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                  }`}
                >
                  <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                  <span className="text-xs font-medium text-white/60">{cat.name} ({count})</span>
                </button>
              )
            })}
          </div>

          {/* Task grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-500 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(37,99,235,0.08)]"
              >
                {/* Category + difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${task.categoryColor}15`, border: `1px solid ${task.categoryColor}30` }}
                    >
                      <task.categoryIcon className="h-4 w-4" style={{ color: task.categoryColor }} />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/30 font-medium">{task.category}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${DIFFICULTY_COLORS[task.difficulty]}`}>
                    {task.difficulty}
                  </span>
                </div>

                {/* Task name + description */}
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                  {task.name}
                </h3>
                <p className="text-xs text-white/35 mb-2 line-clamp-2">{task.description}</p>
                <p className="text-xs text-white/30 mb-4">
                  Show: <span className="text-white/50">{task.show}</span>
                </p>

                {/* Reward + deadline */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">${task.rewardCash}</span>
                    <span className="text-[10px] text-white/25">/ {task.rewardETH} ETH</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30">
                    <Clock className="h-3 w-3" />
                    <span className="text-[10px]">{task.deadline}</span>
                  </div>
                </div>

                {/* Apply button */}
                <button className="mt-4 w-full py-2 rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/[0.06] text-[#60A5FA] text-xs font-semibold hover:bg-[#2563EB]/15 hover:border-[#2563EB]/40 transition-all duration-300">
                  Apply for Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ PAYMENT OPTIONS ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Your Choice
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Payment{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                Options
              </span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Choose how you want to be paid. Cash, production shares, or a mix of both.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* Cash */}
            <div className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/20 transition-all duration-500 text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                <DollarSign className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cash</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Immediate payment via Stripe or Crypto. Get paid as soon as your task is approved.
              </p>
              <div className="text-2xl font-bold text-emerald-400 mb-2">$5 — $50</div>
              <p className="text-[10px] text-white/25">per task</p>
            </div>

            {/* Shares */}
            <div className="group relative p-7 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/[0.03] hover:border-[#2563EB]/30 transition-all duration-500 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                2x VALUE
              </div>
              <div className="h-14 w-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="h-6 w-6 text-[#2563EB]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Production Shares</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Get 2x value in production shares. Tokens locked until show release, potential 5-10x return.
              </p>
              <div className="text-2xl font-bold text-[#60A5FA] mb-2">$10 — $100</div>
              <p className="text-[10px] text-white/25">in share value per task</p>
            </div>

            {/* Mix */}
            <div className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/20 transition-all duration-500 text-center">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Mix</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">
                Split your payment: 50% cash + 50% production shares. Best of both worlds.
              </p>
              <div className="text-2xl font-bold text-amber-400 mb-2">Custom</div>
              <p className="text-[10px] text-white/25">you decide the split</p>
            </div>
          </div>

          {/* Smart contract note */}
          <div className="mt-8 p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-sm text-white/50 text-center sm:text-left">
              <span className="text-emerald-400 font-semibold">Smart contract backed</span> — All payments are on Ethereum mainnet,
              transparent, automatic, and verified on blockchain. Revenue split: 25% creators / 25% investors / 25% platform / 25% workers.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ HOW PAYMENT WORKS ═══ */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comparison
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How Payment{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cash path */}
            <div className="p-7 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-400">Cash Payment</h3>
                  <p className="text-xs text-white/30">Immediate &amp; guaranteed</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Complete a task and submit',
                  'AI + human review (24-48h)',
                  'Payment via Stripe or Crypto',
                  'Funds in your account instantly',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-white/50">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/10 text-center">
                <span className="text-xs text-emerald-400 font-medium">Receive $5 — $50 per task</span>
              </div>
            </div>

            {/* Shares path */}
            <div className="p-7 rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#60A5FA]">Production Shares</h3>
                  <p className="text-xs text-white/30">Higher potential return</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  'Complete a task and submit',
                  'AI + human review (24-48h)',
                  'Tokens minted to your wallet',
                  'Locked until show air date',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#2563EB]/15 flex items-center justify-center shrink-0">
                      {i < 3 ? (
                        <CheckCircle className="h-3.5 w-3.5 text-[#60A5FA]" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-[#60A5FA]" />
                      )}
                    </div>
                    <span className="text-sm text-white/50">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl bg-[#2563EB]/[0.05] border border-[#2563EB]/10 text-center">
                <span className="text-xs text-[#60A5FA] font-medium">Potential 5-10x return on release</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ UPCOMING SHOWS ═══ */}
      {COMING_SOON.length > 0 && (
        <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
                Pipeline
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Next Shows Coming Soon
              </h2>
              <p className="text-sm text-white/40 mt-2">More shows, more tasks, more earnings</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {COMING_SOON.map((show) => (
                <Link
                  key={show.slug}
                  href={`/tv/shows/${show.slug}`}
                  className="group rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="relative aspect-[2/3] bg-[#0A1628]">
                    {show.coverImageUrl ? (
                      <Image
                        src={show.coverImageUrl}
                        alt={show.title}
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                        sizes="(max-width: 640px) 50vw, 16vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv className="h-8 w-8 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/20">
                        SOON
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-[11px] font-bold text-white leading-tight line-clamp-2">{show.title}</p>
                      <p className="text-[9px] text-white/30 mt-1">{show.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/[0.04] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Ready to{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
              Start Earning
            </span>
            ?
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Join hundreds of creators already earning from TV production tasks.
            No experience needed — we provide everything you need to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tv"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 hover:scale-[1.02]"
            >
              Start Earning
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/tv/shows"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              Browse All Shows
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/20">
            Smart contract backed &middot; Instant payments &middot; No minimum withdrawal
          </p>
        </div>
      </section>
    </div>
  )
}
