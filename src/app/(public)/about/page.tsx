import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Film,
  Users,
  Heart,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Vote,
  TrendingUp,
  Eye,
  Lightbulb,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'À Propos — CINEGENY',
  description:
    'CINEGENY : le studio de cinéma IA où c\'est vous qui décidez du prochain film. Votez. 5 000 votes, et le film se fait. Transparence complète, compteurs réels.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative py-28 sm:py-36 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full bg-[#C9A227]/[0.02] blur-[200px]" />
        <div className="container mx-auto max-w-5xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#C9A227]/15 bg-[#C9A227]/[0.06] text-[#C9A227] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Vote className="h-3.5 w-3.5" />
            Le cinéma où vous décidez
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight font-playfair">
            <span className="text-shimmer">Regardez. Votez. Le film se fait.</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/45 max-w-3xl mx-auto leading-relaxed mb-4">
            CINEGENY est le studio de cinéma IA où la communauté décide du prochain film. Pas de votes truqués. Pas de stats inventées. Juste votre voix qui compte.
          </p>
          <p className="text-base sm:text-lg text-white/25 max-w-2xl mx-auto italic">
            5 000 votes, et le film part en production. Vous y étiez au début.
          </p>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent" />

      {/* ═══════════ MISSION ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div>
              <p className="text-[#C9A227] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">Notre Mission</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 tracking-tight font-playfair">
                Donner le <span className="text-gold-gradient">pouvoir au public</span>
              </h2>

              <div className="space-y-6">
                <div className="group p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0">
                      <Vote className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Vous décidez</h3>
                      <p className="text-sm text-white/45">Pas de comité, pas d'algorithme caché. Votre vote = la décision. Un film, un vote gratuit. C'est aussi simple que ça.</p>
                    </div>
                  </div>
                </div>

                <div className="group p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0">
                      <Eye className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Transparence totale</h3>
                      <p className="text-sm text-white/45">Les compteurs publics sont réels. Zéro chiffre inventé, zéro stat aléatoire. Ce que vous voyez, c'est ce qu'il y a.</p>
                    </div>
                  </div>
                </div>

                <div className="group p-6 rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 shrink-0">
                      <Film className="h-5 w-5 text-[#C9A227]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Le film se fait</h3>
                      <p className="text-sm text-white/45">5 000 votes, c'est la limite. À ce moment-là, le film part en production et vous suivez chaque étape.</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-white/25 text-sm italic">
                « La démocratie, c'est le cinéma. Et le cinéma, c'est vous. »
              </p>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#C9A227]/10 to-[#C9A227]/[0.02] border border-[#C9A227]/15 rounded-2xl sm:rounded-3xl p-8 sm:p-10 backdrop-blur-sm">
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-[#C9A227] text-xs font-medium uppercase tracking-widest mb-2">Le parcours d'un film</p>
                    <h3 className="text-2xl font-bold">3 étapes</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-[#C9A227]" />
                      </div>
                      <p className="text-sm font-semibold">En vote</p>
                      <p className="text-xs text-white/35 mt-1">La communauté vote. 1 vote gratuit par film.</p>
                      {/* Connecting line */}
                      <div className="absolute left-3 top-8 w-0.5 h-12 bg-gradient-to-b from-[#C9A227]/40 to-transparent" />
                    </div>

                    <div className="relative pl-8 pt-4">
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-[#C9A227]" />
                      </div>
                      <p className="text-sm font-semibold">En production</p>
                      <p className="text-xs text-white/35 mt-1">5 000 votes : le film part en production. Vous suivez.</p>
                      {/* Connecting line */}
                      <div className="absolute left-3 top-8 w-0.5 h-12 bg-gradient-to-b from-[#C9A227]/40 to-transparent" />
                    </div>

                    <div className="relative pl-8 pt-4">
                      <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-[#C9A227]" />
                      </div>
                      <p className="text-sm font-semibold">À regarder</p>
                      <p className="text-xs text-white/35 mt-1">Terminé et en streaming. Vous l'aviez choisi.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ POURQUOI CINEGENY ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[#C9A227] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">Pourquoi c'est différent</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight font-playfair">
              <span className="text-gold-gradient">Vous êtes le studio maintenant</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto leading-relaxed">
              Pendant des années, les studios décidaient seuls quels films se faisaient. CINEGENY renverse ça : c'est vous qui choisissez.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Heart className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Communauté, pas algorithme</h3>
              <p className="text-sm text-white/35 leading-relaxed">Pas de recommandations cachées. Les films en vote sont là pour tous, en même temps. À égalité.</p>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <TrendingUp className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compteurs réels</h3>
              <p className="text-sm text-white/35 leading-relaxed">4 327 votes. 8 956 votes. Ces chiffres viennent de vrais gens qui ont voté. Pas d'aléatoire.</p>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15 md:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Films IA, choix humains</h3>
              <p className="text-sm text-white/35 leading-relaxed">L'IA crée les films. Vous décidez lesquels se font. La meilleure des deux mondes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent" />

      {/* ═══════════ DEUX PISTES DE VOTE ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14 sm:mb-16">
            <p className="text-[#C9A227] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">Les deux chemins</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight font-playfair">
              <span className="text-gold-gradient">Votez pour le film que vous rêvez</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group glass rounded-2xl sm:rounded-3xl p-8 sm:p-9 hover-lift transition-all duration-500">
              <div className="h-14 w-14 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                <Sparkles className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Piste A — Bandes-annonces</h3>
              <p className="text-white/45 leading-relaxed mb-4">Des films au stade bande-annonce. Vous votez, 5 000 votes, et le film part en production.</p>
              <p className="text-sm text-white/25">Pour ceux qui veulent créer le film depuis le début.</p>
            </div>
            <div className="group glass rounded-2xl sm:rounded-3xl p-8 sm:p-9 hover-lift transition-all duration-500">
              <div className="h-14 w-14 rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-105">
                <Film className="h-6 w-6 text-[#C9A227]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Piste B — Films en compétition</h3>
              <p className="text-white/45 leading-relaxed mb-4">Des films développés. À 5 000 votes, ils entrent en Finale CINEGENY pour les prix de fin d'année.</p>
              <p className="text-sm text-white/25">Pour soutenir tes films préférés jusqu'au bout.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ POINTS & RÉCOMPENSES ═══════════ */}
      <section className="py-20 sm:py-28 px-4 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[#C9A227] text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">Votre engagement compte</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 tracking-tight font-playfair">
              Gagnez des <span className="text-gold-gradient">Points CINEGENY</span>
            </h2>
            <p className="text-white/35 max-w-2xl mx-auto leading-relaxed">
              La seule monnaie qui compte : vous en gagnez en votant, en participant, en parrainant. Elle vous ouvre l'accès aux récompenses et aux concours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Vote className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">En votant</h3>
              <p className="text-sm text-white/35 leading-relaxed">Chaque vote rapporte des Points. Plus vous votez, plus vous gagnez.</p>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Users className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">En participant</h3>
              <p className="text-sm text-white/35 leading-relaxed">Contribuer à la création d'un film ? Vous gagnez des Points pour chaque mission.</p>
            </div>

            <div className="group glass rounded-2xl sm:rounded-3xl p-7 sm:p-8 hover-lift transition-all duration-500 hover:border-[#C9A227]/15 md:col-span-2 lg:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 border border-[#C9A227]/20 mb-5 transition-transform duration-500 group-hover:scale-105">
                <Heart className="h-5 w-5 text-[#C9A227]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">En partageant</h3>
              <p className="text-sm text-white/35 leading-relaxed">Invitez vos amis à voter. Chaque parrainage vous rapporte des Points.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent" />

      {/* ═══════════ FINALE CINEGENY ═══════════ */}
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <p className="text-[#C9A227] text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">La récompense finale</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight font-playfair">
                <span className="text-gold-gradient">Finale CINEGENY</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-8">
                Chaque année, les films de la Piste B qui atteignent 5 000 votes entrent en Finale. En fin d'année, la communauté votante remporte des prix : des voyages, des expériences, et bien d'autres surprises.
              </p>
              <div className="space-y-4 mb-8 stagger-children">
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <Eye className="h-5 w-5 text-[#C9A227]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">Devenez juré</h4>
                    <p className="text-sm text-white/35 leading-relaxed">Votez pour vos films préférés et influencez la Finale.</p>
                  </div>
                </div>
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <Sparkles className="h-5 w-5 text-[#C9A227]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">Gagnez des prix</h4>
                    <p className="text-sm text-white/35 leading-relaxed">La communauté votante remporte le tirage au sort annuel.</p>
                  </div>
                </div>
                <div className="group flex gap-4 p-5 rounded-xl sm:rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:border-[#C9A227]/15 transition-all duration-500 hover-lift">
                  <TrendingUp className="h-5 w-5 text-[#C9A227]/70 shrink-0 mt-1 transition-transform duration-500 group-hover:scale-110" />
                  <div>
                    <h4 className="font-semibold mb-1.5">Soyez au cœur du cinéma</h4>
                    <p className="text-sm text-white/35 leading-relaxed">Vous avez créé ces films. C'est votre victoire.</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 rounded-xl sm:rounded-2xl bg-[#C9A227]/[0.04] border border-[#C9A227]/15 backdrop-blur-sm">
                <Lightbulb className="h-5 w-5 text-[#C9A227] shrink-0" />
                <p className="text-sm text-white/50"><strong className="text-[#C9A227]">Première Finale :</strong> À découvrir cette année.</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#C9A227]/10 to-[#C9A227]/[0.02] border border-[#C9A227]/15 rounded-2xl sm:rounded-3xl p-8 sm:p-10 backdrop-blur-sm">
                <div className="text-center space-y-6">
                  <div>
                    <p className="text-[#C9A227] text-sm font-medium uppercase tracking-widest mb-3">Le système CINEGENY</p>
                    <h3 className="text-xl font-bold">Transparence complète</h3>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-xs text-[#C9A227] font-medium uppercase tracking-widest mb-1">Compteurs réels</p>
                      <p className="text-sm text-white/45">Chaque chiffre que vous voyez vient de vrais votes.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-xs text-[#C9A227] font-medium uppercase tracking-widest mb-1">Zéro aléatoire</p>
                      <p className="text-sm text-white/45">Pas de stats inventées, pas de fausses progressions.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <p className="text-xs text-[#C9A227] font-medium uppercase tracking-widest mb-1">Équité</p>
                      <p className="text-sm text-white/45">Tous les films commencent à zéro. À vous de jouer.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* ═══════════ APPEL À L'ACTION ═══════════ */}
      <section className="py-24 sm:py-32 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#C9A227]/[0.03] blur-[200px]" />
        </div>
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 tracking-tight font-playfair max-w-3xl mx-auto">
              Prêt à <span className="text-shimmer">décider du prochain film IA ?</span>
            </h2>
            <p className="text-white/45 max-w-2xl mx-auto leading-relaxed mb-10">
              Rejoignez la communauté CINEGENY. Découvrez les films en compétition, votez pour vos préférés, et gagnez des Points.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/films"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#C9A227] hover:bg-[#E8C766] text-white font-semibold transition-all duration-500 shadow-lg shadow-[#C9A227]/20 hover:shadow-[#C9A227]/30 hover:scale-[1.02]"
              >
                Aller voter
                <Vote className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl border border-[#C9A227]/30 bg-white/[0.02] hover:bg-white/[0.05] text-white font-semibold transition-all duration-500 backdrop-blur-sm"
              >
                Créer un compte
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
