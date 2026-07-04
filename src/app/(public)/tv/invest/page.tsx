'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ALL_TV_SHOWS, TV_GENRES } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'
import {
  TrendingUp,
  Tv,
  Shield,
  Globe,
  Cpu,
  Users,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Zap,
  BookOpen,
  Landmark,
  Mail,
  DollarSign,
  Lock,
  Monitor,
  Star,
  Play,
  Radio,
  Coins,
} from 'lucide-react'

/* ── Key metrics ── */
const highlights = [
  { value: '15K€', label: 'Budget moyen par série', icon: Tv },
  { value: '80+', label: 'Séries en préparation', icon: BarChart3 },
  { value: '500+', label: 'Micro-tâches par série', icon: Zap },
  { value: '3', label: 'Continents couverts', icon: Globe },
]

/* ── Helpers ── */
function getShowFunding(show: TvShowData) {
  const hash = show.id.charCodeAt(show.id.length - 1) + show.title.length
  const fundingPct = Math.min(5 + ((hash * 37) % 90), 99)
  const target = 30000 + fundingPct * 250
  const raised = Math.round((target * fundingPct) / 100)
  return { fundingPct, target, raised }
}

function formatUsd(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

/* ── Shows open for investment ── */
const INVESTABLE_SHOWS = ALL_TV_SHOWS.filter((s) => {
  const { fundingPct } = getShowFunding(s)
  return fundingPct < 100
}).slice(0, 6)

/* ── Why invest advantages ── */
const advantages = [
  {
    icon: Cpu,
    title: 'Production propulsée par l\'IA',
    desc: 'Notre workflow propriétaire utilise l\'IA pour réduire les coûts de production TV de 95% par rapport aux studios traditionnels, tout en conservant une qualité broadcast.',
  },
  {
    icon: Users,
    title: 'Communauté mondiale de contributeurs',
    desc: 'Plus de 500 micro-tâches par série, réalisées par une communauté de créateurs à travers le monde. Chaque contribution est validée par l\'IA et une revue humaine.',
  },
  {
    icon: Shield,
    title: 'Blockchain et traçabilité',
    desc: 'Chaque contribution est hachée en SHA-256 et horodatée. Tokenisation sur Ethereum : co-production, gouvernance, revenus partagés.',
  },
  {
    icon: BookOpen,
    title: 'Propriété intellectuelle partagée (Editions Ruppin)',
    desc: 'Participation de 33% dans Editions Ruppin. Accord de premier regard sur chaque biographie et récit historique. Pipeline intégré du livre à l\'écran.',
  },
  {
    icon: TrendingUp,
    title: 'Double moteur de croissance',
    desc: 'Studio Services (trésorerie à court terme via du contenu de marque) + Séries originales (propriété intellectuelle à long terme via la TV originale). Deux sources de revenus complémentaires.',
  },
  {
    icon: Landmark,
    title: 'Cadre juridique structuré',
    desc: 'Ltd israélienne (holding). C-Corp du Delaware prévue pour l\'acquisition américaine. Tokenisation basée sur Ethereum. Conseil consultatif FinTech et juridique.',
  },
]

/* ── Revenue streams ── */
const revenueStreams = [
  { icon: Monitor, title: 'Revenus publicitaires', desc: 'Publicités pre-roll, mid-roll et display sur toutes les pages et flux des séries.', pct: '40%' },
  { icon: Star, title: 'Abonnements', desc: 'Les abonnés premium génèrent des revenus récurrents alloués aux séries qu\'ils regardent.', pct: '30%' },
  { icon: Play, title: 'Replay à la demande', desc: 'Paiement à la séance pour les épisodes premium, spéciaux et contenus exclusifs.', pct: '20%' },
  { icon: Radio, title: 'Licences', desc: 'Accords de syndication et de licence avec des plateformes et chaînes tierces.', pct: '10%' },
]

/* ── Timeline ── */
const timeline = [
  { phase: 'Phase 1', title: 'Plateforme et pipeline', desc: '80 séries en préproduction, communauté active, IA opérationnelle', status: 'done' },
  { phase: 'Phase 2', title: 'Diffusion des premières séries', desc: 'Lancement des 10 premières séries, diffusion en ligne, premiers revenus', status: 'current' },
  { phase: 'Phase 3', title: 'Tokenisation', desc: 'Lancement des tokens de séries sur Ethereum, co-production décentralisée', status: 'next' },
  { phase: 'Phase 4', title: 'Expansion internationale', desc: 'Distribution mondiale, partenariats avec Hollywood, plus de 100 séries par an', status: 'next' },
]

export default function TvInvestPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen bg-[#050A15]">
      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#2563EB]/[0.08] via-transparent to-transparent opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#2563EB]/[0.03] blur-[200px]" />
        <div className="absolute top-20 left-[10%] text-white/[0.03]">
          <BarChart3 className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 right-[10%] text-white/[0.03]">
          <Tv className="h-28 w-28" />
        </div>

        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#60A5FA] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <TrendingUp className="h-3.5 w-3.5" />
            Investisseurs et partenaires
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white">
            Investir dans les{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
              séries TV
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-10">
            CINEGENY TV réinvente la production télévisuelle grâce à l&apos;IA,
            la blockchain et une communauté mondiale de créateurs.
          </p>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm text-center"
              >
                <h.icon className="h-5 w-5 text-[#2563EB] mx-auto mb-2" />
                <div className="text-2xl font-bold text-[#60A5FA]">{h.value}</div>
                <div className="text-xs text-white/35 mt-1">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW TO INVEST ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Comment investir</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { step: '1', title: 'Choisir une série', desc: 'Parcourez notre catalogue et sélectionnez une série TV qui vous inspire.' },
              { step: '2', title: 'Investir dès 10 €', desc: 'Achetez des tokens de co-production à partir de dix euros seulement.' },
              { step: '3', title: 'Recevoir vos tokens', desc: 'Recevez vos tokens sur Ethereum. Suivez la progression depuis votre tableau de bord.' },
              { step: '4', title: 'Toucher des revenus', desc: 'Recevez votre part des revenus de la série : streaming, publicité, licences.' },
            ].map((s) => (
              <div key={s.step} className="relative text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center mx-auto mb-3 text-[#60A5FA] font-bold text-lg">{s.step}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ SHOWS OPEN FOR INVESTMENT ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Opportunités en cours
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Séries en recherche de{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                financement
              </span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Choisissez une série et devenez co-producteur. Chaque investissement est garanti par des smart contracts sur Ethereum.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INVESTABLE_SHOWS.map((show) => {
              const { fundingPct, target, raised } = getShowFunding(show)
              return (
                <div
                  key={show.slug}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#2563EB]/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.08)]"
                >
                  <div className="relative h-32 bg-[#0A1628]">
                    {show.coverImageUrl ? (
                      <Image src={show.coverImageUrl} alt={show.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"><Tv className="h-10 w-10 text-white/10" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                      <span className="text-sm font-bold text-white">{show.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30 font-bold">
                        {show.genre}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-white/40 leading-relaxed mb-4 line-clamp-2">{show.synopsis}</p>
                    <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                      <span>{show.seasons} saisons</span>
                      <span className="text-[#60A5FA] font-bold">{fundingPct}% financé</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA]" style={{ width: `${Math.min(fundingPct, 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-white/60 font-medium">{formatUsd(raised)} collectés</span>
                      <span className="text-white/30">sur {formatUsd(target)}</span>
                    </div>
                    <Link
                      href={`/tv/shows/${show.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#60A5FA] text-sm font-medium hover:bg-[#2563EB]/20 transition-all duration-300"
                    >
                      Investir maintenant
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ REVENUE MODEL ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Modèle de revenus
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-white">
              Répartition{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                25/25/25/25
              </span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto">
              Un partage des revenus juste et transparent entre toutes les parties prenantes.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Créateurs', pct: '25%', color: '#2563EB', icon: Cpu, desc: 'Réalisateurs, scénaristes, showrunners' },
              { label: 'Investisseurs', pct: '25%', color: '#60A5FA', icon: TrendingUp, desc: 'Détenteurs de tokens et soutiens' },
              { label: 'Plateforme', pct: '25%', color: '#8B5CF6', icon: Tv, desc: 'Infrastructure et opérations CINEGENY' },
              { label: 'Contributeurs', pct: '25%', color: '#10B981', icon: Users, desc: 'Contributeurs de tâches et équipe' },
            ].map((slice) => (
              <div key={slice.label} className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${slice.color}15`, border: `1px solid ${slice.color}30` }}>
                  <slice.icon className="h-5 w-5" style={{ color: slice.color }} />
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: slice.color }}>{slice.pct}</div>
                <h3 className="text-sm font-semibold text-white mb-1">{slice.label}</h3>
                <p className="text-[10px] text-white/30">{slice.desc}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <div className="mt-8 h-4 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#2563EB]" style={{ width: '25%' }} />
            <div className="h-full bg-[#60A5FA]" style={{ width: '25%' }} />
            <div className="h-full bg-[#8B5CF6]" style={{ width: '25%' }} />
            <div className="h-full bg-[#10B981]" style={{ width: '25%' }} />
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-white/30">
            <span>Créateurs</span>
            <span>Investisseurs</span>
            <span>Plateforme</span>
            <span>Contributeurs</span>
          </div>

          {/* Revenue streams */}
          <div className="mt-12 grid sm:grid-cols-2 gap-5">
            {revenueStreams.map((rs) => (
              <div key={rs.title} className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#2563EB]/40 transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                    <rs.icon className="h-5 w-5 text-[#2563EB]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-bold text-white">{rs.title}</h3>
                      <span className="text-sm font-bold text-[#60A5FA]">{rs.pct}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">{rs.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ MARKET COMPARISON ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Comparaison
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              CINEGENY TV face au{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                marché
              </span>
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left p-4 text-white/40 font-medium" />
                  <th className="p-4 text-white/40 font-medium text-center">TV traditionnelle</th>
                  <th className="p-4 text-white/40 font-medium text-center">Netflix</th>
                  <th className="p-4 text-center font-bold text-[#60A5FA] bg-[#2563EB]/[0.05]">CINEGENY TV</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ['Budget moyen', '1-10M$', '5-30M$', '15K€'],
                  ['Temps de production', '1 à 3 ans', '6 à 18 mois', '2 à 4 mois'],
                  ['Participation', 'Fermée', 'Fermée', 'Ouverte à tous'],
                  ['Usage de l\'IA', 'Minimal', 'Recommandation', 'Production complète'],
                  ['Blockchain', 'Non', 'Non', 'Traçabilité complète'],
                  ['Partage des revenus', 'Chaînes uniquement', 'Netflix uniquement', 'Tous les contributeurs'],
                ].map(([label, trad, netflix, cinegen]) => (
                  <tr key={label}>
                    <td className="p-4 text-white/60 font-medium">{label}</td>
                    <td className="p-4 text-white/30 text-center">{trad}</td>
                    <td className="p-4 text-white/30 text-center">{netflix}</td>
                    <td className="p-4 text-[#60A5FA] text-center font-semibold bg-[#2563EB]/[0.03]">{cinegen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ WHY INVEST ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Pourquoi investir
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight text-white">
              Un{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                modèle unique
              </span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto">
              La combinaison de l&apos;IA, des micro-tâches et de la blockchain crée un avantage compétitif inégalé.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="group p-7 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#2563EB]/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.06)]"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                  <adv.icon className="h-5 w-5 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{adv.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ TIMELINE ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Feuille de route
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                Où nous en sommes
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {timeline.map((step, i) => (
              <div
                key={step.phase}
                className={`flex gap-5 p-6 rounded-2xl border transition-all duration-300 ${
                  step.status === 'done'
                    ? 'border-green-500/20 bg-green-500/[0.03]'
                    : step.status === 'current'
                      ? 'border-[#2563EB]/20 bg-[#2563EB]/[0.05]'
                      : 'border-white/[0.06] bg-white/[0.02]'
                }`}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.status === 'done'
                        ? 'bg-green-500/20 text-green-400'
                        : step.status === 'current'
                          ? 'bg-[#2563EB]/20 text-[#60A5FA]'
                          : 'bg-white/5 text-white/30'
                    }`}
                  >
                    {step.status === 'done' ? <CheckCircle className="h-5 w-5" /> : i + 1}
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-full min-h-[20px] bg-white/[0.06] mt-2" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-wider">{step.phase}</span>
                    {step.status === 'current' && (
                      <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/20 text-[#60A5FA] text-[10px] font-bold">EN COURS</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-white/40">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ FAQ ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Quel est le montant minimum d\'investissement ?', a: 'Vous pouvez investir dès 10 € en achetant des tokens de co-production. Chaque token représente une part de la série.' },
              { q: 'Comment les revenus sont-ils distribués ?', a: 'Les revenus sont partagés proportionnellement aux tokens détenus : 25% créateurs, 25% investisseurs, 25% plateforme, 25% contributeurs. Les distributions ont lieu après chaque cycle d\'exploitation (streaming, publicité, licences).' },
              { q: 'Quel est le cadre juridique ?', a: 'CINEGENY est une Ltd israélienne avec une C-Corp du Delaware prévue pour le marché américain. Les investissements sont régis par le droit israélien des valeurs mobilières, avec une traçabilité blockchain sur le mainnet Ethereum et Arbitrum L2.' },
              { q: 'Quand vais-je recevoir mes gains ?', a: 'Les premiers gains arrivent généralement entre 6 et 12 mois après la fin de la production, pendant la phase d\'exploitation commerciale (streaming, publicité, syndication).' },
              { q: 'Puis-je revendre mes tokens ?', a: 'Les tokens sont des utility tokens non transférables. CINEGENY propose un mécanisme de rachat par la plateforme. Aucun marché secondaire. Cette structure garantit la conformité réglementaire.' },
              { q: 'Mon investissement est-il garanti ?', a: 'Comme tout investissement créatif, il comporte des risques. Cependant, notre modèle de production par IA réduit les coûts de 95% par rapport à la TV traditionnelle, ce qui limite fortement le risque de perte.' },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-white hover:text-[#60A5FA] transition-colors">
                  {faq.q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ LEGAL & SECURITY ═══ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Sécurité
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Cadre juridique et{' '}
              <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
                technique
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Landmark, title: 'Ltd israélienne', desc: 'Société holding enregistrée en Israël. C-Corp du Delaware prévue pour le marché américain et les acquisitions.' },
              { icon: Shield, title: 'Utility tokens', desc: 'Tokens utilitaires non transférables sur Ethereum. Aucune revente — rachat par la plateforme uniquement. Smart contracts auto-exécutables.' },
              { icon: Cpu, title: 'Ethereum + Arbitrum', desc: 'Mainnet pour la gouvernance, Arbitrum L2 pour des micro-transactions rapides. Chaque transaction est vérifiable on-chain.' },
              { icon: BookOpen, title: 'Valeurs mobilières israéliennes', desc: 'Investissement conforme aux directives de l\'ISA (Israel Securities Authority). Delaware Corp prévue pour les investisseurs américains.' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] text-center">
            <p className="text-sm text-white/50">
              <span className="text-emerald-400 font-semibold">100% traçable</span> — Chaque euro investi est suivi sur la blockchain.
              Rapports trimestriels, tableau de bord investisseur en temps réel, et audit externe annuel.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ KEY FIGURES ═══ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-5xl relative">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-10 text-center">Le marché TV en chiffres</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '250Mds$+', label: 'Marché TV mondial', sub: 'Croissance de 6% par an' },
              { value: '95%', label: 'Réduction des coûts via l\'IA', sub: 'vs production traditionnelle' },
              { value: '4 mois', label: 'Cycle de production', sub: 'vs 1 à 3 ans en moyenne' },
              { value: '∞', label: 'Scalabilité', sub: 'Aucune limite physique' },
            ].map((stat) => (
              <div key={stat.label} className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                <div className="text-3xl font-bold text-[#60A5FA] mb-1">{stat.value}</div>
                <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                <div className="text-[10px] text-white/30 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ CTA WITH EMAIL ═══ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/[0.04] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
            Parlons de{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] bg-clip-text text-transparent">
              votre investissement
            </span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Que vous soyez investisseur, partenaire ou distributeur, nous serions ravis d&apos;échanger
            sur des opportunités de collaboration dans l&apos;univers TV.
          </p>

          {/* Email signup */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white placeholder:text-white/30 focus:outline-none focus:border-[#2563EB]/40 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-300 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 text-sm whitespace-nowrap"
            >
              {submitted ? 'Envoyé !' : 'Demander des infos'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:invest@cinegen.studio"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 hover:scale-[1.02]"
            >
              Nous contacter
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              href="/tv"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              Retour à CINEGENY TV
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/20">
            invest@cinegen.studio &middot; Ethereum Mainnet + Arbitrum L2
          </p>
        </div>
      </section>
    </div>
  )
}
