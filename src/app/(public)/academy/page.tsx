import Link from 'next/link'
import { GraduationCap, PenLine, Wand2, Clapperboard, Scissors, Sparkles, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Academy',
  description:
    "CINEGENY Academy — apprenez à créer des films avec l'IA : écriture, direction artistique, production, VFX et distribution.",
  openGraph: {
    title: 'CINEGENY Academy',
    description: "Apprenez à créer des films avec l'IA, de l'idée à la projection.",
  },
}

const MODULES = [
  { icon: PenLine, title: 'Écriture & Scénario', desc: "Structurer une histoire et écrire un scénario assisté par l'IA." },
  { icon: Wand2, title: 'Direction & Prompting', desc: 'Le langage du prompt : cadrage, lumière, style, cohérence visuelle.' },
  { icon: Clapperboard, title: 'Production IA', desc: "Storyboard, previz et génération de plans étape par étape." },
  { icon: Sparkles, title: 'VFX & Esthétique', desc: 'Compositing, effets et signature visuelle de niveau cinéma.' },
  { icon: Scissors, title: 'Montage & Son', desc: 'Rythme, montage, sound design et mixage pour captiver.' },
  { icon: GraduationCap, title: 'Distribution', desc: 'Diffuser, monétiser et bâtir une audience pour vos films.' },
]

export default async function AcademyPage() {
  const session = await auth()
  const loggedIn = !!session?.user
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 sm:px-10 md:px-16 lg:px-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/4 top-16 h-96 w-96 rounded-full bg-[#C9A227]/[0.06] blur-[120px]" />
          <div className="absolute right-1/4 top-10 h-80 w-80 rounded-full bg-[#C9A227]/[0.04] blur-[100px]" />
        </div>

        <div className="relative container mx-auto max-w-5xl text-center">
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-4 py-1.5 text-sm text-[#E8C766]">
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium">CINEGENY Academy</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[13px] font-semibold text-emerald-300">
              <Check className="h-3.5 w-3.5" />
              {loggedIn ? 'Incluse dans votre compte' : '100% gratuite'}
            </div>
          </div>

          <h1 className="mb-6 font-playfair text-4xl font-bold leading-[1.1] text-white sm:text-5xl md:text-6xl">
            Apprenez le <span className="text-gold-metallic">cinéma de demain</span>
          </h1>

          {loggedIn ? (
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
              <span className="font-semibold text-emerald-300">Votre accès est débloqué.</span> L&apos;Academy
              est <span className="text-white">100% gratuite</span> et incluse dans votre compte — apprenez en
              créant, de l&apos;écriture à la distribution.
            </p>
          ) : (
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/55">
              De l&apos;idée à la projection : maîtrisez l&apos;écriture, la direction artistique, la production
              et la post-production assistées par l&apos;IA.{' '}
              <span className="font-semibold text-emerald-300">Gratuite dès l&apos;inscription.</span>
            </p>
          )}

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {loggedIn ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg">
                    Accéder à mon espace
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/films">
                  <Button size="lg" variant="outline">Voir les productions</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg">
                    Créer un compte gratuit
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">Se connecter</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="px-6 py-16 sm:px-10 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10 flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#C9A227]/60" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Le parcours</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => (
              <div
                key={m.title}
                className="group hover-lift rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-[#C9A227]/30 hover:bg-white/[0.03]"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/10 transition-all duration-500 group-hover:scale-110 group-hover:border-[#C9A227]/50 group-hover:shadow-[0_0_20px_rgba(201,162,39,0.25)]">
                  <m.icon className="h-5 w-5 text-[#C9A227]" />
                </div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-playfair text-sm text-[#C9A227]/50">0{i + 1}</span>
                  <h3 className="text-base font-semibold text-white">{m.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white/50">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 sm:px-10 md:px-16 lg:px-20">
        <div className="container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/[0.07] via-[#0A0908] to-transparent p-8 text-center md:p-12">
            <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-[#C9A227]/[0.06] blur-[90px]" />
            <div className="relative">
              <h2 className="mb-3 font-playfair text-2xl font-bold text-white md:text-3xl">
                Prêt à réaliser votre premier film ?
              </h2>
              <p className="mx-auto mb-7 max-w-xl text-white/55">
                {loggedIn
                  ? 'Votre accès Academy est déjà actif — apprenez en créant et participez à de vraies productions.'
                  : 'Créez un compte gratuit : l’Academy est incluse, sans frais. Apprenez en créant et participez à de vraies productions.'}
              </p>
              <Link href={loggedIn ? '/dashboard' : '/register'}>
                <Button size="lg">
                  {loggedIn ? 'Continuer' : 'Rejoindre gratuitement'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
