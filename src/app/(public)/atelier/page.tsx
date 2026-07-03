import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Clapperboard,
  Wand2,
  Upload,
  Vote,
  ArrowRight,
  Clock,
  Film,
  LayoutList,
  Palette,
  Cpu,
  PlayCircle,
  Coins,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react'
import {
  ATELIER,
  FILM_DURATION,
  TRAILER_TOOL_HREF,
  TRAILER_TOOL_IS_EXTERNAL,
} from '@/content/atelier'
import { BRAND, VOTE } from '@/content/brand'

export const metadata: Metadata = {
  title: 'L’Atelier — Créez votre bande-annonce, lancez votre film | CINEGENY',
  description: ATELIER.tagline,
  openGraph: {
    title: 'L’Atelier CINEGENY — bande-annonce & film',
    description: ATELIER.tagline,
  },
}

/* ── Bouton vers l'outil de création (externe si KULTY est branché) ───────── */

function CreateToolCta({ className }: { className: string }) {
  if (TRAILER_TOOL_IS_EXTERNAL) {
    return (
      <a href={TRAILER_TOOL_HREF} target="_blank" rel="noopener noreferrer" className={className}>
        <Wand2 className="h-4 w-4" />
        {ATELIER.paths.create.cta}
        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
      </a>
    )
  }
  return (
    <Link href={TRAILER_TOOL_HREF} className={className}>
      <Wand2 className="h-4 w-4" />
      {ATELIER.paths.create.cta}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}

/* ── Les capacités de l'outil (app bande-annonce / KULTY) ─────────────────── */

const TOOL_FEATURES = [
  {
    icon: LayoutList,
    title: 'Structure & storyboard',
    desc: 'Le copilot découpe votre histoire en actes puis en plans, prêts à générer.',
  },
  {
    icon: Palette,
    title: 'Moodboard & direction artistique',
    desc: 'Fixez l’ambiance visuelle : références, lumières, palette — plan par plan.',
  },
  {
    icon: Cpu,
    title: 'Les meilleurs moteurs vidéo IA',
    desc: 'Chaque plan est généré avec le moteur le plus adapté : Veo, Kling, Seedance.',
  },
  {
    icon: PlayCircle,
    title: 'Timeline & export',
    desc: 'Assemblez, comparez les versions, exportez votre bande-annonce finale.',
  },
] as const

/* ── Le parcours après l'Atelier ──────────────────────────────────────────── */

const JOURNEY = [
  {
    icon: Clapperboard,
    title: 'Créez ou insérez',
    desc: 'Travaillez votre bande-annonce dans l’Atelier, ou insérez directement votre création.',
  },
  {
    icon: Vote,
    title: 'La communauté vote',
    desc: `${VOTE.freeVotesPerFilm} vote gratuit par personne. À ${VOTE.threshold.toLocaleString('fr-FR')} votes, le film part en production.`,
  },
  {
    icon: Coins,
    title: 'Le film vit — vous gagnez',
    desc: 'Votre film est diffusé en streaming et vous touchez des revenus à chaque vue.',
  },
] as const

export default function AtelierPage() {
  return (
    <div className="min-h-screen bg-[#0A0908] text-white">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero-vignette relative overflow-hidden px-4 pb-20 pt-24 sm:px-8 md:px-16 md:pb-24 md:pt-32 lg:px-20">
        {/* Halo ambiant */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#C9A227]/[0.07] blur-[140px]" />
          <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#E11D2A]/[0.03] blur-[110px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.08] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C766] backdrop-blur-md">
            <Clapperboard className="h-3.5 w-3.5" />
            {ATELIER.name} {BRAND.name}
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-playfair text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
            Créez la <span className="text-gold-brushed">bande-annonce</span>.
            <br />
            Le public lance le <span className="text-gold-brushed">film</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            {ATELIER.tagline}
          </p>

          {/* Règle de format — visible immédiatement */}
          <div className="mt-8 flex justify-center">
            <span className="meta-chip !px-4 !py-1.5 !text-xs">
              <Clock className="h-3.5 w-3.5" />
              Format des films : {FILM_DURATION.label}
            </span>
          </div>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CreateToolCta className="bg-gold-brushed btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all sm:w-auto" />
            <Link
              href="/streaming/submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766] sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              {ATELIER.paths.insert.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ══ LES DEUX PORTES ═══════════════════════════════════════════════ */}
      <section className="relative px-4 py-14 sm:px-8 md:px-16 md:py-16 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {/* Porte 1 — Créer avec l'outil */}
          <article className="border-gold-brushed group relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#C9A227]/[0.07] via-[#110F0B] to-[#0A0908] p-8 md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#C9A227]/[0.09] blur-[80px] transition-opacity duration-700 group-hover:opacity-100" />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/10">
              <Wand2 className="h-6 w-6 text-[#E8C766]" />
            </span>
            <h2 className="mt-5 font-playfair text-2xl font-bold text-white md:text-3xl">
              {ATELIER.paths.create.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {ATELIER.paths.create.description}
            </p>

            <ul className="mt-7 grid gap-4 sm:grid-cols-2">
              {TOOL_FEATURES.map((f) => (
                <li key={f.title} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-[#C9A227]/25">
                  <f.icon className="h-5 w-5 text-[#C9A227]" />
                  <p className="mt-2.5 text-[13px] font-semibold text-white">{f.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">{f.desc}</p>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CreateToolCta className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all" />
            </div>
          </article>

          {/* Porte 2 — Insérer directement */}
          <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] via-[#0E0D0A] to-[#0A0908] p-8 transition-colors hover:border-[#C9A227]/25 md:p-10">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/[0.04] blur-[80px]" />
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05]">
              <Upload className="h-6 w-6 text-white/80" />
            </span>
            <h2 className="mt-5 font-playfair text-2xl font-bold text-white md:text-3xl">
              {ATELIER.paths.insert.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {ATELIER.paths.insert.description}
            </p>

            <ul className="mt-7 space-y-3.5">
              {[
                'Bande-annonce → elle entre en compétition « Bandes-annonces » : le public vote pour lancer la production.',
                'Film terminé → il entre en compétition « Films » et peut rejoindre le streaming.',
                `Format des films : ${FILM_DURATION.label}.`,
                '50 % de revenus créateur par défaut, +10 % en exclusivité CINEGENY.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3 text-[13px] leading-relaxed text-white/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                href="/streaming/submit"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C9A227]/35 bg-[#C9A227]/[0.10] px-6 py-3 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.20]"
              >
                <Upload className="h-4 w-4" />
                {ATELIER.paths.insert.cta}
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ══ RÈGLE DE FORMAT — bandeau dédié ═══════════════════════════════ */}
      <section className="px-4 py-6 sm:px-8 md:px-16 lg:px-20">
        <div className="border-gold-brushed relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-[#C9A227]/[0.09] via-[#0E0D0A] to-transparent px-7 py-8 md:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-5">
              <span className="bg-gold-brushed inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
                <Clock className="h-7 w-7" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A227]/70">
                  La règle du format
                </p>
                <p className="mt-1 font-playfair text-xl font-bold text-gold-brushed sm:text-2xl">
                  Un film : {FILM_DURATION.label}
                </p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-white/55 md:ml-auto">
              {FILM_DURATION.rule}
            </p>
          </div>
        </div>
      </section>

      {/* ══ LE PARCOURS ═══════════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-8 md:px-16 md:py-20 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
              De l’Atelier à l’écran
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">{BRAND.baseline}</p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {JOURNEY.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-[#C9A227]/25"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10">
                    <step.icon className="h-5 w-5 text-[#C9A227]" />
                  </span>
                  <span className="font-playfair text-4xl font-bold text-[#C9A227]/25">{i + 1}</span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════════════ */}
      <section className="px-4 pb-20 text-center sm:px-8 md:px-16 lg:px-20">
        <div className="mx-auto max-w-2xl">
          <Film className="mx-auto h-8 w-8 text-[#C9A227]/60" />
          <h2 className="mt-4 font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl">
            Votre film mérite d’exister.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">
            Commencez par la bande-annonce : c’est elle qui convainc la communauté de voter.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CreateToolCta className="bg-gold-brushed btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all sm:w-auto" />
            <Link
              href="/films"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white sm:w-auto"
            >
              <Vote className="h-4 w-4" /> Voir les films en vote
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
