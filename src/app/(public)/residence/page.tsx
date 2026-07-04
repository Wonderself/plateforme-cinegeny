import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Crown, Wand2, Vote, ArrowRight, Clock, Trophy, Users, Share2,
  Sparkles, Film, ScrollText, Gem, Megaphone, Clapperboard,
} from 'lucide-react'
import { FILM_DURATION } from '@/content/atelier'
import { VOTE } from '@/content/brand'

export const metadata: Metadata = {
  title: 'La Résidence CINEGENY — 10 réalisateurs par saison, le public produit | CINEGENY',
  description:
    'Une promotion limitée de réalisateurs IA par saison. Le Mini Studio offert, l’exclusivité, la course aux 5 000 votes — et le nom des premiers votants au générique.',
  openGraph: {
    title: 'La Résidence CINEGENY',
    description: '10 réalisateurs par saison. Le Mini Studio offert. Le public produit.',
  },
}

/* ── Les privilèges de résident — ce qui rend la sélection désirable ──────── */

const PRIVILEGES = [
  {
    icon: Crown,
    title: 'Une place, pas un dépôt',
    desc: 'La Résidence est une promotion limitée par saison. On ne « poste » pas son film ici : on est sélectionné. Et une sélection, ça s’annonce à son audience.',
  },
  {
    icon: Wand2,
    title: 'Le Mini Studio offert',
    desc: 'Chaque résident reçoit la production d’une à deux bandes-annonces avec le Mini Studio — script, storyboard, moteurs vidéo IA. Vous apportez l’idée, nous produisons l’étincelle.',
  },
  {
    icon: Gem,
    title: 'L’exclusivité qui rapporte',
    desc: 'Votre film est une Exclusivité CINEGENY : 50 % des revenus, +10 % d’exclusivité. Il n’est nulle part ailleurs — c’est ici qu’on vient le voir.',
  },
  {
    icon: Share2,
    title: 'Une course publique',
    desc: 'Compteur en direct, cartes de partage or générées pour chaque film : chaque partage de votre communauté est une affiche de votre course.',
  },
  {
    icon: ScrollText,
    title: 'Vos votants au générique',
    desc: `Les ${VOTE.threshold.toLocaleString('fr-FR')} premiers votants d’un film produit sont inscrits à son générique. Chaque fan a une raison personnelle de voter — et de le dire.`,
  },
  {
    icon: Users,
    title: 'Une promotion, pas des rivaux',
    desc: 'Les résidents d’une saison se répondent, se partagent, s’affrontent en direct. La saison est un feuilleton — et vous en êtes un personnage.',
  },
] as const

const STEPS = [
  { title: 'Candidatez', desc: 'Une idée de film, quelques lignes de synopsis — deux minutes suffisent.' },
  { title: 'Entrez en Résidence', desc: 'Sélectionné, vous produisez votre bande-annonce avec le Mini Studio, accompagné.' },
  { title: 'Lancez la course', desc: `Votre communauté vote. À ${VOTE.threshold.toLocaleString('fr-FR')} votes, le film est produit — et vos votants entrent au générique.` },
] as const

export default function ResidencePage() {
  return (
    <div className="min-h-screen bg-[#0A0908] text-white">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="hero-vignette relative overflow-hidden px-4 pb-20 pt-24 text-center sm:px-8 md:px-16 md:pb-24 md:pt-32 lg:px-20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[440px] w-[780px] -translate-x-1/2 rounded-full bg-[#C9A227]/[0.09] blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/[0.10] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E8C766] backdrop-blur-md">
            <Crown className="h-3.5 w-3.5" />
            Saison 1 — promotion limitée
          </span>

          <h1 className="mx-auto mt-6 font-playfair text-4xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
            La <span className="text-gold-brushed">Résidence</span>
          </h1>
          <p className="mt-3 font-playfair text-lg text-[#E8C766]/80 sm:text-xl">
            Dix réalisateurs par saison. Le public produit.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base">
            La Résidence CINEGENY réunit chaque saison une promotion de réalisateurs —
            créateurs IA reconnus et talents qui n’ont encore jamais tourné. Chacun reçoit
            la production de sa bande-annonce avec le Mini Studio, l’exclusivité de la
            plateforme, et une course publique aux {VOTE.threshold.toLocaleString('fr-FR')} votes
            que sa communauté peut faire gagner.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/bienvenue"
              className="bg-gold-brushed btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all sm:w-auto"
            >
              <Clapperboard className="h-4 w-4" /> Candidater à la Résidence
            </Link>
            <Link
              href="/films"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur-md transition-colors hover:border-[#C9A227]/40 hover:text-[#E8C766] sm:w-auto"
            >
              <Vote className="h-4 w-4" /> Suivre la compétition
            </Link>
          </div>

          <p className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40">
            <Clock className="h-3.5 w-3.5 text-[#C9A227]/70" />
            Format des films : {FILM_DURATION.label}
          </p>
        </div>
      </section>

      {/* ══ LES PRIVILÈGES ════════════════════════════════════════════════ */}
      <section className="px-4 py-14 sm:px-8 md:px-16 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-3xl font-bold sm:text-4xl">
              Ce que reçoit un <span className="text-gold-brushed">résident</span>
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRIVILEGES.map((p) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227]/30"
              >
                <span className="bg-gold-brushed inline-flex h-11 w-11 items-center justify-center rounded-xl">
                  <p.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-playfair text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POURQUOI C'EST IMBATTABLE ═════════════════════════════════════ */}
      <section className="px-4 py-10 sm:px-8 md:px-16 lg:px-20">
        <div className="border-gold-brushed relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#C9A227]/[0.09] via-[#0E0D0A] to-transparent p-8 md:p-12">
          <div className="pointer-events-none absolute -right-14 -top-14 h-64 w-64 rounded-full bg-[#C9A227]/[0.08] blur-[90px]" />
          <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <h2 className="font-playfair text-2xl font-bold md:text-3xl">
                Ailleurs, on poste. Ici, on <span className="text-gold-brushed">règne</span>.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55 md:text-[15px]">
                Sur les réseaux, un film IA vit trois jours dans un flux. En Résidence, il a
                une salle à son nom, un compteur qui monte, une communauté qui a son nom au
                générique, et un studio qui le produit s’il gagne. Ce n’est pas une
                plateforme de plus : c’est la seule où l’audience d’un créateur devient
                littéralement son studio de production.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { icon: Trophy, text: 'Une distinction qui s’annonce' },
                { icon: Film, text: 'Une œuvre exclusive, pas un post' },
                { icon: Megaphone, text: 'Un feuilleton à raconter chaque semaine' },
              ].map((it) => (
                <div key={it.text} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0A0908]/60 px-4 py-3">
                  <it.icon className="h-4 w-4 shrink-0 text-[#C9A227]" />
                  <span className="text-sm text-white/70">{it.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CANDIDATER ════════════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-8 md:px-16 md:py-20 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-3xl font-bold sm:text-4xl">Entrer en Résidence</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/50">
              Confirmé ou novice : la sélection se fait sur l’idée, pas sur le CV.
            </p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-[#C9A227]/25">
                <span className="font-playfair text-4xl font-bold text-[#C9A227]/25">{i + 1}</span>
                <h3 className="mt-2 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">{step.desc}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link
              href="/bienvenue"
              className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-bold transition-all"
            >
              <Sparkles className="h-4 w-4" /> Déposer ma candidature
            </Link>
            <p className="mx-auto mt-4 max-w-md text-xs text-white/30">
              Votre proposition de film vaut candidature — elle est examinée par l’équipe
              pour la prochaine promotion de la Résidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
