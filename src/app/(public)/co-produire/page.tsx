import type { Metadata } from 'next'
import Link from 'next/link'
import { Handshake, ArrowRight, Vote, Film, Gift } from 'lucide-react'
import { BRAND } from '@/content/brand'
import { WaitlistForm } from '@/components/co-produire/waitlist-form'

export const metadata: Metadata = {
  title: 'Devenir co-producteur — CINEGENY',
  description:
    'Rejoignez la liste d\'attente co-producteurs CINEGENY. Les co-productions ouvrent après la première sélection de films.',
}

const steps = [
  {
    icon: Vote,
    title: 'Les films se qualifient par le vote',
    desc: `${BRAND.name} produit les films que la communauté choisit — 5 000 votes et le film part en production.`,
  },
  {
    icon: Film,
    title: 'Une première sélection est faite',
    desc: 'Les co-productions ouvrent une fois les premiers films sélectionnés — pas avant.',
  },
  {
    icon: Gift,
    title: 'Vous êtes prévenu en premier',
    desc: 'Inscrit en liste d\'attente, vous recevez l\'accès aux co-productions dès leur ouverture.',
  },
]

export default function CoProduirePage() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="container mx-auto max-w-3xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#C9A227]/15 bg-[#C9A227]/[0.06] text-[#C9A227] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Handshake className="h-3.5 w-3.5" />
            Co-production
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Devenez <span className="text-shimmer">co-producteur</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed">
            Les co-productions ouvrent après la première sélection de films — pas avant.
            Inscrivez-vous en liste d&apos;attente pour être prévenu en premier.
          </p>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="text-xs font-bold text-white/30 mb-2">ÉTAPE {i + 1}</div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* FORMULAIRE */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center font-playfair">
            Rejoindre la liste d&apos;attente
          </h2>
          <p className="text-sm text-white/40 text-center mb-8">
            Aucun paiement aujourd&apos;hui. On vous écrit à l&apos;ouverture.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* CTA secondaire */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <Link
            href="/comment-ca-marche"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-[#E8C766]"
          >
            Comprendre comment fonctionne CINEGENY <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
