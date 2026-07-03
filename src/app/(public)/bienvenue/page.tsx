import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Vote, Clapperboard, PlayCircle, ArrowRight, Sparkles } from 'lucide-react'
import { BRAND, VOTE } from '@/content/brand'
import { ProposeFilmForm } from '@/components/onboarding/propose-film-form'

export const metadata: Metadata = {
  title: 'Bienvenue sur CINEGENY',
  description: 'Votre compte est prêt : votez, proposez votre film, suivez sa production.',
  robots: { index: false },
}

/**
 * Onboarding post-inscription : accueil chaleureux, les 3 gestes clés, et la
 * proposition de film facultative (affiche, bande-annonce, film complet).
 * Les propositions arrivent en attente dans /admin/catalog.
 */
export default async function BienvenuePage() {
  const session = await auth()
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent('/bienvenue')}`)

  const firstName = (session.user.name || '').split(' ')[0]

  const gestures = [
    {
      icon: Vote,
      title: 'Votez',
      desc: `${VOTE.freeVotesPerFilm} vote gratuit par film. À ${VOTE.threshold.toLocaleString('fr-FR')} votes, le film se fait.`,
      href: '/films',
      cta: 'Voir les films en vote',
    },
    {
      icon: Clapperboard,
      title: 'Créez',
      desc: 'L’Atelier vous accompagne du script à la bande-annonce, plan par plan.',
      href: '/atelier',
      cta: 'Ouvrir l’Atelier',
    },
    {
      icon: PlayCircle,
      title: 'Regardez',
      desc: 'Les films terminés arrivent en streaming — vous y êtes pour quelque chose.',
      href: '/streaming',
      cta: 'Explorer le streaming',
    },
  ] as const

  return (
    <div className="min-h-screen bg-[#0A0908] text-white">
      {/* ══ Accueil ═══════════════════════════════════════════════════════ */}
      <section className="hero-vignette relative overflow-hidden px-4 pb-14 pt-20 text-center sm:px-8 md:px-16 md:pt-28 lg:px-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-[#C9A227]/[0.08] blur-[130px]" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.08] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C766]">
            <Sparkles className="h-3.5 w-3.5" />
            Compte créé
          </span>
          <h1 className="mt-6 font-playfair text-4xl font-bold leading-[1.06] sm:text-5xl md:text-6xl">
            Bienvenue{firstName ? ` ${firstName}` : ''} dans le{' '}
            <span className="text-gold-brushed">studio</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
            {BRAND.baseline} Ici, votre voix lance des films — et si vous en portez un,
            c’est le moment de nous le proposer.
          </p>
        </div>
      </section>

      {/* ══ Les 3 gestes ══════════════════════════════════════════════════ */}
      <section className="px-4 pb-6 sm:px-8 md:px-16 lg:px-20">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {gestures.map((g) => (
            <Link
              key={g.title}
              href={g.href}
              className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/30"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
                <g.icon className="h-5 w-5 text-[#C9A227]" />
              </span>
              <h2 className="mt-4 font-playfair text-lg font-bold text-white">{g.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{g.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A227]/80 transition-all group-hover:gap-2.5 group-hover:text-[#E8C766]">
                {g.cta} <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══ Proposition de film ═══════════════════════════════════════════ */}
      <section className="px-4 py-12 sm:px-8 md:px-16 md:py-16 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <ProposeFilmForm />
          <p className="mt-6 text-center text-xs text-white/25">
            Vous pouvez passer cette étape —{' '}
            <Link href="/films" className="text-white/45 underline-offset-2 hover:text-[#E8C766] hover:underline">
              aller directement aux films en vote
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
