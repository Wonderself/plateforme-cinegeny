import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Clapperboard, Wand2, Upload, Vote, ArrowRight, Clock, Trophy,
  Users, Share2, Sparkles, GraduationCap, Coins, Film, Megaphone,
} from 'lucide-react'
import { ATELIER, FILM_DURATION } from '@/content/atelier'
import { VOTE } from '@/content/brand'

export const metadata: Metadata = {
  title: 'Réalisateurs & créateurs IA — votre communauté devient votre studio | CINEGENY',
  description:
    'Insérez votre bande-annonce, mobilisez votre communauté : à 5 000 votes, votre film est produit et diffusé — avec 50 % des revenus pour vous. Novices bienvenus : l’Atelier vous emmène de zéro à la bande-annonce.',
  openGraph: {
    title: 'CINEGENY — votre communauté devient votre studio',
    description: 'La compétition où le public produit les films IA. 5 000 votes, et votre film se fait.',
  },
}

/* ── Le pitch en 3 étapes — ce que le créateur retient et répète ──────────── */

const STEPS = [
  {
    icon: Upload,
    title: 'Insérez votre bande-annonce',
    desc: 'Déjà prête ? Deux minutes suffisent. Sinon, l’Atelier vous accompagne du script au montage, plan par plan.',
  },
  {
    icon: Share2,
    title: 'Mobilisez votre communauté',
    desc: `Chaque vote est gratuit. Chaque fiche film génère sa carte de partage or — votre lien est magnifique partout où il circule.`,
  },
  {
    icon: Trophy,
    title: `${VOTE.threshold.toLocaleString('fr-FR')} votes → le film se fait`,
    desc: 'Production lancée, diffusion en streaming sur CINEGENY, et 50 % des revenus pour vous (+10 % en exclusivité).',
  },
] as const

export default function CreateursPage() {
  return (
    <div className="min-h-screen bg-[#0A0908] text-white">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero-vignette relative overflow-hidden px-4 pb-20 pt-24 sm:px-8 md:px-16 md:pb-24 md:pt-32 lg:px-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[#C9A227]/[0.08] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.08] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E8C766] backdrop-blur-md">
            <Megaphone className="h-3.5 w-3.5" />
            Réalisateurs & créateurs IA — Saison de lancement
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-playfair text-4xl font-bold leading-[1.06] sm:text-5xl md:text-6xl">
            Votre communauté devient
            <br />
            votre <span className="text-gold-brushed">studio</span>.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            Vous faites des films avec l’IA — ou vous rêvez d’en faire un premier ?
            Insérez votre bande-annonce : le public vote, et à{' '}
            {VOTE.threshold.toLocaleString('fr-FR')} votes votre film est produit,
            diffusé, et rémunéré. Pas de commission de sélection, pas de piston :{' '}
            <span className="text-[#E8C766]">le public décide</span>.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/streaming/submit"
              className="bg-gold-brushed btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all sm:w-auto"
            >
              <Upload className="h-4 w-4" /> Insérer ma bande-annonce
            </Link>
            <Link
              href={ATELIER.href}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766] sm:w-auto"
            >
              <Wand2 className="h-4 w-4" /> Je pars de zéro — ouvrir l’Atelier
            </Link>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40">
            <Clock className="h-3.5 w-3.5 text-[#C9A227]/70" />
            Format des films : {FILM_DURATION.label}
          </p>
        </div>
      </section>

      {/* ══ LA RÉSIDENCE — la voie royale ═════════════════════════════════ */}
      <section className="px-4 pt-2 sm:px-8 md:px-16 lg:px-20">
        <Link
          href="/residence"
          className="border-gold-brushed group relative mx-auto flex max-w-5xl flex-col items-start gap-5 overflow-hidden rounded-3xl bg-gradient-to-r from-[#C9A227]/[0.10] via-[#0E0D0A] to-transparent p-7 transition-all hover:-translate-y-0.5 sm:p-8 md:flex-row md:items-center"
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#C9A227]/[0.09] blur-[70px]" />
          <span className="bg-gold-brushed relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
            <Trophy className="h-7 w-7" />
          </span>
          <div className="relative flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]/70">
              La voie royale — promotion limitée
            </p>
            <h2 className="mt-1 font-playfair text-xl font-bold text-gold-brushed sm:text-2xl">
              La Résidence CINEGENY
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-white/55">
              Dix réalisateurs par saison, sélectionnés sur l’idée. Le Mini Studio offert,
              l’exclusivité, la course publique — et vos votants au générique.
            </p>
          </div>
          <span className="relative inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#E8C766] transition-transform group-hover:translate-x-0.5">
            Découvrir <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </section>

      {/* ══ LES 3 ÉTAPES ══════════════════════════════════════════════════ */}
      <section className="px-4 py-14 sm:px-8 md:px-16 lg:px-20">
        <ol className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {STEPS.map((step, i) => (
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
              <h2 className="mt-4 text-base font-semibold text-white">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{step.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ DEUX PROFILS, UNE COMPÉTITION ═════════════════════════════════ */}
      <section className="px-4 py-10 sm:px-8 md:px-16 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {/* Réalisateurs confirmés */}
          <article className="border-gold-brushed relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#C9A227]/[0.07] via-[#110F0B] to-[#0A0908] p-8 md:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/10">
              <Clapperboard className="h-6 w-6 text-[#E8C766]" />
            </span>
            <h2 className="mt-5 font-playfair text-2xl font-bold md:text-3xl">
              Vous réalisez déjà des films IA
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Vos films dorment sur les réseaux entre deux posts ? Ici, ils ont une salle,
              un compteur, un enjeu. Votre audience ne fait plus que regarder :
              elle <span className="text-[#E8C766]">produit</span>.
            </p>
            <ul className="mt-6 space-y-3 text-[13px] leading-relaxed text-white/60">
              {[
                'Votre bande-annonce entre en compétition en quelques minutes.',
                'Chaque vote de votre communauté est gratuit — aucune friction.',
                'Votre fiche film génère automatiquement sa carte de partage or (X, WhatsApp, LinkedIn).',
                '50 % des revenus à chaque vue, +10 % en exclusivité CINEGENY.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/streaming/submit"
              className="bg-gold-brushed btn-sheen mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all"
            >
              <Upload className="h-4 w-4" /> Entrer en compétition
            </Link>
          </article>

          {/* Novices */}
          <article className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] via-[#0E0D0A] to-[#0A0908] p-8 transition-colors hover:border-[#C9A227]/25 md:p-10">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.05]">
              <GraduationCap className="h-6 w-6 text-white/80" />
            </span>
            <h2 className="mt-5 font-playfair text-2xl font-bold md:text-3xl">
              Vous n’avez encore jamais réalisé
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              C’est précisément pour vous que l’Atelier existe. Aucun matériel, aucun
              prérequis : une idée suffit. Le premier film de votre vie peut être
              celui que {VOTE.threshold.toLocaleString('fr-FR')} personnes ont choisi de lancer.
            </p>
            <ul className="mt-6 space-y-3 text-[13px] leading-relaxed text-white/60">
              {[
                'L’Atelier découpe votre histoire en plans et les génère avec les meilleurs moteurs vidéo IA (Veo, Kling, Seedance).',
                'L’Academy vous apprend le cinéma IA, de l’idée à la projection.',
                'Vous gardez la main sur chaque image — et tous les droits de créateur.',
                'Mêmes règles, même compétition, mêmes revenus que les confirmés.',
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ATELIER.href}
                className="inline-flex items-center gap-2 rounded-xl border border-[#C9A227]/35 bg-[#C9A227]/[0.10] px-6 py-3 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.20]"
              >
                <Wand2 className="h-4 w-4" /> Ouvrir l’Atelier
              </Link>
              <Link
                href="/academy"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                <GraduationCap className="h-4 w-4" /> Découvrir l’Academy
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ══ POURQUOI ÇA VA FAIRE DU BRUIT ═════════════════════════════════ */}
      <section className="px-4 py-14 sm:px-8 md:px-16 lg:px-20">
        <div className="border-gold-brushed relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#C9A227]/[0.08] via-[#0E0D0A] to-transparent p-8 md:p-12">
          <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full bg-[#C9A227]/[0.08] blur-[90px]" />
          <div className="relative">
            <h2 className="font-playfair text-2xl font-bold md:text-3xl">
              La course aux <span className="text-gold-brushed">{VOTE.threshold.toLocaleString('fr-FR')} votes</span> est un spectacle en soi
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/55 md:text-[15px]">
              Un compteur public qui monte en direct, des créateurs qui mobilisent leurs communautés,
              un seuil qui déclenche une production réelle : chaque film en compétition est une histoire
              à suivre — et à raconter. C’est exactement le genre de course que l’on partage,
              que l’on commente, et que l’on revient vérifier chaque jour.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Vote, title: 'Zéro friction', desc: `${VOTE.freeVotesPerFilm} vote gratuit par film, sans compte pour commencer.` },
                { icon: Users, title: 'Enjeu réel', desc: 'Le seuil atteint = production lancée. Pas une promesse : une règle.' },
                { icon: Coins, title: 'Créateurs payés', desc: '50 % des revenus au créateur. Le public choisit, le créateur vit.' },
              ].map((it) => (
                <div key={it.title} className="rounded-2xl border border-white/[0.07] bg-[#0A0908]/60 p-5">
                  <it.icon className="h-5 w-5 text-[#C9A227]" />
                  <p className="mt-2.5 text-sm font-semibold text-white">{it.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">{it.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ MÉDIAS ════════════════════════════════════════════════════════ */}
      <section className="px-4 pb-20 sm:px-8 md:px-16 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <Film className="mx-auto h-8 w-8 text-[#C9A227]/60" />
          <h2 className="mt-4 font-playfair text-2xl font-bold md:text-3xl">Vous êtes média ou créateur de contenu IA ?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50">
            Le pitch tient en une phrase :{' '}
            <span className="text-[#E8C766]">
              « CINEGENY est le studio de cinéma où le public lance les films IA —
              {' '}{VOTE.threshold.toLocaleString('fr-FR')} votes, et le film se fait. »
            </span>{' '}
            Suivez une course en direct, interviewez un créateur en compétition, ou lancez
            la vôtre devant votre audience.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/films"
              className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all"
            >
              <Vote className="h-4 w-4" /> Voir la compétition en direct
            </Link>
            <Link
              href="/comment-ca-marche"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-[#C9A227]/30 hover:text-[#E8C766]"
            >
              Comment ça marche <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
