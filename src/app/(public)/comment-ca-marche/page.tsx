import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BRAND, HOW_IT_WORKS, VOTE, VOTE_TRACKS, POINTS } from '@/content/brand'

export const metadata: Metadata = {
  title: 'Comment ça marche — CINEGENY',
  description: BRAND.pitchShort,
}

const faq = [
  {
    q: 'Qui peut voter ?',
    a: 'Tout le monde. Vous pouvez voter sans compte : votre vote est enregistré immédiatement, puis une inscription rapide (email) le confirme et le rend définitif.',
  },
  {
    q: 'C\'est gratuit ?',
    a: `Oui. Vous avez droit à ${VOTE.freeVotesPerFilm} vote gratuit par film — aucune mise, aucun paiement demandé pour voter.`,
  },
  {
    q: 'Que gagne-t-on en votant ?',
    a: `Vous gagnez des ${POINTS.name} (récompenses, concours), et surtout : le pouvoir de faire exister un film. À ${VOTE.threshold.toLocaleString('fr-FR')} votes, ${VOTE_TRACKS.A.outcome.toLowerCase()}`,
  },
  {
    q: 'C\'est quoi un film IA ?',
    a: 'Un film écrit, dessiné et monté avec l\'aide de l\'intelligence artificielle, mais toujours guidé par des créateurs humains et choisi par le public — vous.',
  },
  {
    q: 'Quelle est la différence entre les deux compétitions ?',
    a: `« ${VOTE_TRACKS.A.name} » : ${VOTE_TRACKS.A.tagline} « ${VOTE_TRACKS.B.name} » : ${VOTE_TRACKS.B.tagline}`,
  },
]

export default function CommentCaMarchePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="container mx-auto max-w-3xl relative text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Comment ça <span className="text-shimmer">marche</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed">
            {BRAND.baseline}
          </p>
        </div>
      </section>

      {/* 3 ETAPES */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.title} className="relative text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center mx-auto mb-4 text-[#C9A227] font-bold text-lg">
                  {i + 1}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/films"
              className="golden-border-btn golden-border-always inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#C9A227] hover:bg-[#E8C766] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#C9A227]/20 hover:shadow-[#C9A227]/30 hover:scale-[1.02]"
            >
              Voir les films en vote
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* FAQ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 font-playfair text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer text-sm font-semibold text-white hover:text-[#C9A227] transition-colors">
                  {item.q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform duration-200 text-lg">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-white/50 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent" />

      {/* CTA final */}
      <section className="py-20 sm:py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
            Envie d&apos;aller plus loin ?
          </h2>
          <p className="text-white/40 mb-8">
            Découvrez comment devenir co-producteur d&apos;un film.
          </p>
          <Link
            href="/co-produire"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 text-white/70 hover:text-white hover:border-[#C9A227]/30 transition-all duration-300 text-sm font-medium"
          >
            Devenir co-producteur
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
