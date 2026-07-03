import Link from 'next/link'
import type { Metadata } from 'next'
import { Trophy, Vote, Users, Gift, Award, ArrowRight, Sparkles } from 'lucide-react'
import { POINTS, FINALE, VOTE } from '@/content/brand'

export const metadata: Metadata = {
  title: 'Récompenses — CINEGENY',
  description: POINTS.description,
}

const EARN_METHODS = [
  { label: 'Voter pour un film', detail: VOTE.rule, icon: Vote },
  { label: 'Participer à un projet', detail: 'Contribuez à une production et gagnez des Points CINEGENY.', icon: Sparkles },
  { label: 'Parrainer un ami', detail: 'Chaque filleul inscrit vous rapporte des Points CINEGENY.', icon: Users },
]

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 mb-6">
            <Trophy className="h-4 w-4 text-[#C9A227]" />
            <span className="text-sm font-medium text-[#C9A227]">Récompenses</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            {POINTS.name}
          </h1>
          <p className="text-white/50 max-w-lg mx-auto">
            {POINTS.description}
          </p>
        </div>

        {/* Comment gagner des Points */}
        <div className="mb-14">
          <h2 className="text-lg font-semibold text-white mb-5">Comment gagner des Points CINEGENY</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EARN_METHODS.map((method) => (
              <div key={method.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mb-4">
                  <method.icon className="h-5 w-5 text-[#C9A227]" />
                </div>
                <p className="text-sm font-semibold text-white mb-1.5">{method.label}</p>
                <p className="text-xs text-white/50 leading-relaxed">{method.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* À quoi servent les Points */}
        <div className="mb-14 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center shrink-0">
              <Gift className="h-5 w-5 text-[#C9A227]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">À quoi servent vos Points</h2>
              <p className="text-sm text-white/50 leading-relaxed">
                Vos Points CINEGENY ouvrent droit aux récompenses de la plateforme et vous
                donnent des chances supplémentaires de gagner les prix de la {FINALE.name}.
                {' '}{FINALE.description}
              </p>
            </div>
          </div>
        </div>

        {/* Parrainage */}
        <div className="mb-14 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 text-[#C9A227]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white mb-2">Programme de parrainage</h2>
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                Invitez vos amis sur CINEGENY : vous et votre filleul gagnez tous les deux des
                Points CINEGENY à l&apos;inscription.
              </p>
              <Link
                href="/referral"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C9A227] hover:text-[#E8C766] transition-colors"
              >
                Voir mon lien de parrainage
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/5 p-10">
          <h2 className="text-xl font-bold text-white mb-2">Prêt à commencer ?</h2>
          <p className="text-sm text-white/50 mb-6">
            Votez pour un film et gagnez vos premiers Points CINEGENY.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/films"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#E8C766] text-white text-sm font-semibold transition-colors"
            >
              Voter pour un film
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/points"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-white/70 hover:text-white hover:border-white/30 text-sm font-medium transition-colors"
            >
              Voir mes Points
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
