'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ALL_TV_SHOWS } from '@/data/tv-shows'
import type { TvShowData } from '@/data/tv-shows'
import {
  ArrowRight,
  Tv,
  Users,
  Heart,
  TrendingUp,
  DollarSign,
  Shield,
  CreditCard,
  Coins,
  FileText,
  Rocket,
  Target,
  Handshake,
  Play,
  Monitor,
  PieChart,
} from 'lucide-react'

/* ── Helpers ── */

/** Simulate funding data for TV shows (not in base data) */
function getShowFunding(show: TvShowData) {
  const hash = show.id.charCodeAt(show.id.length - 1) + show.title.length
  const fundingPct = Math.min(5 + ((hash * 37) % 90), 99)
  const target = 30000 + fundingPct * 250
  const raised = Math.round((target * fundingPct) / 100)
  return { fundingPct, target, raised }
}

const openShows = ALL_TV_SHOWS.filter((s) => {
  const { fundingPct } = getShowFunding(s)
  return fundingPct < 100
})

function formatUsd(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`
}

/* ── Feature cards ── */

const features = [
  {
    icon: FileText,
    title: 'Create Your Concept',
    desc: 'Submit your show format, pilot episode concept, or series bible. Our AI pipeline helps shape your vision into a production-ready TV package.',
  },
  {
    icon: Target,
    title: 'Crowdfund Your Show',
    desc: 'Set a funding goal per season and let the community invest. Backers receive production shares backed by smart contracts on Ethereum.',
  },
  {
    icon: Users,
    title: 'Build Your Audience',
    desc: 'Grow viewership before your show even launches. Rally writers, designers, and fans around your concept to build anticipation.',
  },
]

/* ── How it works steps ── */

const steps = [
  { num: '1', title: 'Submit your show concept', desc: 'Upload your series bible, pilot script, or pitch deck to the platform.', icon: FileText },
  { num: '2', title: 'Set funding goal per season', desc: 'Define your per-season budget and timeline. Smart contracts lock the terms.', icon: Target },
  { num: '3', title: 'Community invests', desc: 'Backers purchase production shares on Ethereum. Funds held in escrow until milestones are met.', icon: Handshake },
  { num: '4', title: 'First episode airs on CINEGENY TV', desc: 'Once funded, your show enters the AI-powered production pipeline and airs on the network.', icon: Rocket },
]

/* ── Revenue sharing breakdown ── */

const revenueShares = [
  { label: 'Investors', pct: 25, color: 'bg-emerald-500' },
  { label: 'Show Creator / Writer', pct: 25, color: 'bg-[#2563EB]' },
  { label: 'Workers', pct: 25, color: 'bg-amber-500' },
  { label: 'Platform', pct: 25, color: 'bg-blue-400' },
]

/* ── Payment options ── */

const paymentOptions = [
  { icon: CreditCard, title: 'Fiat (Stripe)', desc: 'Credit card, bank transfer, Apple Pay. Instant settlement in USD/EUR.' },
  { icon: Coins, title: 'Crypto (Ethereum)', desc: 'USDC, ETH, or ERC-20 tokens. Secured on Ethereum mainnet + L2.' },
  { icon: PieChart, title: 'Production Shares', desc: 'Workers can be paid in shares. Revenue distributed proportionally via smart contracts.' },
]

/* ═══════════════════════════════════════════════════════════════
   TV PRODUCE PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function TvProducePage() {
  return (
    <div className="min-h-screen bg-[#050A15]">

      {/* ═══ HERO ═══ */}
      <section className="relative py-28 sm:py-36 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-radial from-[#2563EB]/[0.08] via-transparent to-transparent opacity-60" />
        <div className="absolute top-10 left-1/4 w-[400px] h-[400px] rounded-full bg-[#2563EB]/[0.04] blur-[180px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-400/[0.02] blur-[200px]" />

        {/* Decorative TV icons */}
        <div className="absolute top-20 left-[10%] text-white/[0.03]">
          <Tv className="h-32 w-32" />
        </div>
        <div className="absolute bottom-20 right-[10%] text-white/[0.03]">
          <Monitor className="h-28 w-28" />
        </div>

        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#2563EB] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Tv className="h-3.5 w-3.5" />
            TV Production
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-shimmer">Produce Your TV Show</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-10">
            Turn your TV concept into reality. Launch and crowdfund your show
            with the power of community on CINEGENY TV.
          </p>

          <Link
            href="/tv/create"
            className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 hover:scale-[1.02]"
          >
            Start Your Show
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#2563EB]/15 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                  <f.icon className="h-5 w-5 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It <span className="text-blue-gradient">Works</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="relative text-center p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/25 flex items-center justify-center mx-auto mb-3 text-[#2563EB] font-bold text-lg">
                  {s.num}
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ OPEN TV SHOW PROJECTS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair">
                Open TV Show Projects
              </h2>
              <p className="text-sm text-white/40 mt-2">
                Support the next generation of television.
              </p>
            </div>
            <Link
              href="/tv/replay"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:text-[#3B82F6] font-medium transition-colors"
            >
              Explore Shows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {openShows.slice(0, 5).map((show) => {
              const { fundingPct, target, raised } = getShowFunding(show)
              return (
                <Link
                  key={show.slug}
                  href={`/tv/shows/${show.slug}`}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#2563EB]/20 transition-all duration-300"
                >
                  <div className="relative h-36 bg-[#0A1020]">
                    {show.coverImageUrl ? (
                      <Image
                        src={show.coverImageUrl}
                        alt={show.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Tv className="h-10 w-10 text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-xs font-bold text-white">{show.title}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                      <span>{show.genre}</span>
                      <span className="text-emerald-400 font-bold">
                        {fundingPct}% funded
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        style={{ width: `${Math.min(fundingPct, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60 font-medium">
                        {formatUsd(raised)} raised
                      </span>
                      <span className="text-white/30">
                        of {formatUsd(target)}
                      </span>
                    </div>
                    <div className="mt-2 text-[10px] text-white/25">
                      {show.episodeCount} episodes &middot; Season planned
                    </div>
                  </div>
                </Link>
              )
            })}

            {/* YOUR SHOW card */}
            <Link
              href="/tv/create"
              className="group rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] hover:border-[#2563EB]/30 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center min-h-[280px]"
            >
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <DollarSign className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">YOUR SHOW</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4 max-w-[200px]">
                Have a show concept? Launch your project and let the community fund it.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] font-medium group-hover:gap-2.5 transition-all">
                Start Your Show
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>

          {/* Mobile explore link */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/tv/replay"
              className="inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:text-[#3B82F6] font-medium transition-colors"
            >
              Explore Shows
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ REVENUE SHARING ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Economics
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Revenue <span className="text-blue-gradient">Sharing</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto mt-4">
              Equal revenue sharing: IP is as valuable as investment. Views generate ad revenue
              plus subscription allocation. All shares are utility tokens on Ethereum,
              self-executing smart contracts. No resale — buyback by platform only.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Visual breakdown */}
            <div className="p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">
                Revenue Distribution
              </h3>
              <div className="space-y-4">
                {revenueShares.map((share) => (
                  <div key={share.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-white/70 font-medium">{share.label}</span>
                      <span className="text-white font-bold">{share.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${share.color} transition-all duration-700`}
                        style={{ width: `${share.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Combined bar */}
              <div className="mt-6 flex h-3 rounded-full overflow-hidden">
                {revenueShares.map((share) => (
                  <div
                    key={share.label}
                    className={`${share.color} first:rounded-l-full last:rounded-r-full`}
                    style={{ width: `${share.pct}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {revenueShares.map((share) => (
                  <div key={share.label} className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <div className={`h-2 w-2 rounded-full ${share.color}`} />
                    {share.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Description cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Investor Returns</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% of all revenue is distributed to investors proportionally to their shares. Quarterly payouts via smart contract on Ethereum.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center shrink-0">
                    <Play className="h-4 w-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Show Creator / Writer IP</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% goes to the show creator/writer. IP is the real value — your concept earns as much as the investment. 5% base, up to 10% if your show reaches Top 10 votes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Worker Shares</h4>
                    <p className="text-xs text-white/40 leading-relaxed">
                      25% is allocated to contributors. AI calculates fair share based on estimated work value. Workers can choose cash or production shares (2x value).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Tiers */}
            <div className="mt-8 p-6 rounded-2xl border border-[#2563EB]/10 bg-[#2563EB]/[0.02]">
              <h3 className="text-sm font-bold text-[#2563EB] mb-4 uppercase tracking-wider">Show Creator Revenue Tiers</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-center">
                  <p className="text-2xl font-black text-white">5%</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Base Tier</p>
                  <p className="text-xs text-white/30 mt-2">Net revenue share for every accepted show concept</p>
                </div>
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] text-center">
                  <p className="text-2xl font-black text-amber-400">7%</p>
                  <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mt-1">Challenge Tier</p>
                  <p className="text-xs text-white/30 mt-2">Complete challenges + earn votes from the community</p>
                </div>
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
                  <p className="text-2xl font-black text-emerald-400">10%</p>
                  <p className="text-[10px] text-emerald-400/60 uppercase tracking-wider mt-1">Top 10 Tier</p>
                  <p className="text-xs text-white/30 mt-2">Show reaches Top 10 votes at least once</p>
                </div>
              </div>
              <p className="text-[10px] text-white/25 mt-3 text-center">
                Admin may adjust percentages based on specific conditions. All tiers backed by smart contracts on Ethereum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ CREATOR PLATFORM FEES ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-amber-400 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Independent Creators
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Creator <span className="text-shimmer">Platform Fees</span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto mt-3 text-sm">
              Built your show yourself via /tv/create? Submit it for community vote.
              Once approved, you keep your revenue minus the platform fee.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] text-center">
              <p className="text-4xl font-black text-emerald-400">25%</p>
              <p className="text-sm font-bold text-white mt-2">Exclusive to CINEGENY TV</p>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Your show is only available on CINEGENY TV. You keep 75% of all revenue.
                Verified by our AI monitoring agent.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] text-center">
              <p className="text-4xl font-black text-amber-400">33%</p>
              <p className="text-sm font-bold text-white mt-2">Distributed Elsewhere Too</p>
              <p className="text-xs text-white/40 mt-2 leading-relaxed">
                Your show is also distributed on other platforms. You keep 67% of CINEGENY revenue.
                AI agent verifies external distribution automatically.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-white/20 text-center mt-4">
            Platform fee applies after community vote approval. AI dashboard agent monitors distribution status in real-time.
          </p>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══ PAYMENT OPTIONS ═══ */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-[#2563EB] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
              Flexible Payments
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Payment <span className="text-blue-gradient">Options</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {paymentOptions.map((opt) => (
              <div
                key={opt.title}
                className="group p-7 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#2563EB]/15 transition-all duration-500 text-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center mb-5 mx-auto transition-transform duration-500 group-hover:scale-105">
                  <opt.icon className="h-5 w-5 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{opt.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>

          {/* Smart contract note */}
          <div className="mt-8 p-6 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-400 mb-1">
                Smart Contract Integration
              </h4>
              <p className="text-sm text-white/50 leading-relaxed">
                All funding, revenue distribution, and production shares are managed by
                audited smart contracts on <span className="text-white/70 font-medium">Ethereum</span>.
                Funds are held in escrow and released only when production milestones are
                verified on-chain. Every transaction is transparent and immutable.
                Tokens are non-transferable utility tokens — no resale, platform buyback only.
                Governed by <span className="text-white/70 font-medium">Israeli Ltd</span> with planned <span className="text-white/70 font-medium">Delaware C-Corp</span> for US operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#2563EB]/10 to-transparent" />

      {/* ═══ CTA ═══ */}
      <section className="py-24 sm:py-32 px-4 sm:px-8 md:px-16 lg:px-20 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#2563EB]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-3xl relative text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to{' '}
            <span className="text-shimmer">Start Your Show?</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
            Your show concept deserves to be seen. Launch your TV project today and let the
            CINEGENY community bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tv/create"
              className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-[#3B82F6] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#2563EB]/20 hover:shadow-[#2563EB]/30 hover:scale-[1.02]"
            >
              Start Your Show
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/tv/replay"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-medium"
            >
              Browse TV Shows
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
