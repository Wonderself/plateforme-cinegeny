import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Trophy, Vote, Film as FilmIcon, ArrowRight, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { BRAND, FINALE, VOTE, VOTE_TRACKS } from '@/content/brand'
import { selectFinalists, type FinalistInput } from '@/lib/finale'
import { ALL_FILMS } from '@/data/films'
import { ARCHIVED_FILMS } from '@/data/archived-films'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: `${FINALE.name} — CINEGENY`,
  description: FINALE.description,
}

/**
 * Récupère les compteurs de votes RÉELS (confirmés) pour tous les films de la
 * slate + archives, afin d'en déduire les finalistes piste B (session 15.9,
 * logique pure dans `src/lib/finale.ts`). Aucun finaliste inventé : la liste
 * est vide tant qu'aucun film piste B n'a atteint les 5 000 votes.
 */
async function getFinalistInputs(): Promise<FinalistInput[]> {
  const films = [...ALL_FILMS, ...ARCHIVED_FILMS].filter((f) => f.track === 'B')
  if (films.length === 0) return []

  const slugs = films.map((f) => f.slug)
  const countByFilmId = new Map<string, number>()
  const filmIdBySlug = new Map<string, string>()

  try {
    const dbFilms = await prisma.film.findMany({
      where: { slug: { in: slugs } },
      select: { id: true, slug: true },
    })
    for (const f of dbFilms) filmIdBySlug.set(f.slug, f.id)

    const filmIds = dbFilms.map((f) => f.id)
    if (filmIds.length > 0) {
      const grouped = await prisma.filmVote.groupBy({
        by: ['filmId'],
        where: { filmId: { in: filmIds }, voteType: 'vote', confirmed: true },
        _count: { _all: true },
      })
      for (const g of grouped) countByFilmId.set(g.filmId, g._count._all)
    }
  } catch {
    // Base indisponible — aucun finaliste affiché plutôt qu'un chiffre inventé.
  }

  return films.map((film) => {
    const filmId = filmIdBySlug.get(film.slug) ?? null
    return {
      slug: film.slug,
      title: film.title,
      synopsis: film.synopsis,
      genre: film.genre,
      director: film.director,
      coverImageUrl: film.coverImageUrl,
      track: film.track,
      voteCount: filmId ? (countByFilmId.get(filmId) ?? 0) : 0,
    }
  })
}

export default async function FinalePage() {
  const inputs = await getFinalistInputs()
  const finalists = selectFinalists(inputs)

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
        <div className="container mx-auto max-w-3xl relative text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#C9A227]/15 bg-[#C9A227]/[0.06] text-[#C9A227] text-xs sm:text-sm font-medium mb-8 backdrop-blur-sm">
            <Trophy className="h-3.5 w-3.5" />
            Concours annuel
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-shimmer">{FINALE.name}</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto leading-relaxed">
            {FINALE.description}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/40 text-xs font-medium uppercase tracking-wider">
            Date annoncée prochainement
          </div>
        </div>
      </section>

      {/* PRINCIPE */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            <div className="relative text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
                <Vote className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white/30 mb-2">ÉTAPE 1</div>
              <h3 className="text-sm font-bold text-white mb-2">Vous votez</h3>
              <p className="text-xs text-white/40 leading-relaxed">{VOTE_TRACKS.B.tagline}</p>
            </div>
            <div className="relative text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white/30 mb-2">ÉTAPE 2</div>
              <h3 className="text-sm font-bold text-white mb-2">Le film entre en Finale</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                À {VOTE.threshold.toLocaleString('fr-FR')} votes confirmés, le film rejoint les finalistes de l&apos;année.
              </p>
            </div>
            <div className="relative text-center p-6 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-white/30 mb-2">ÉTAPE 3</div>
              <h3 className="text-sm font-bold text-white mb-2">Des prix à gagner</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                En fin d&apos;année, la communauté qui a voté pour les finalistes remporte des prix — dont des voyages.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* FINALISTES */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-playfair text-center">
            Les finalistes
          </h2>
          <p className="text-sm text-white/40 text-center mb-12">
            {VOTE_TRACKS.B.name} ayant atteint {VOTE.threshold.toLocaleString('fr-FR')} votes confirmés.
          </p>

          {finalists.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {finalists.map((f) => (
                <Link
                  key={f.slug}
                  href={`/films/${f.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#C9A227]/20 bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#C9A227]/40"
                >
                  <div className="relative aspect-[2/3] shrink-0 overflow-hidden bg-gradient-to-br from-[#C9A227]/[0.06] to-white/[0.03]">
                    {f.coverImageUrl ? (
                      <Image
                        src={f.coverImageUrl}
                        alt={`Affiche du film ${f.title}`}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <FilmIcon className="h-14 w-14 text-[#C9A227]/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#C9A227]/40 bg-[#0A0908]/80 px-2.5 py-0.5 text-[10px] font-medium text-[#E8C766]">
                      <Trophy className="h-3 w-3" /> Finaliste
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#E8C766] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-[11px] text-white/40 mt-1">
                      {f.progress.count.toLocaleString('fr-FR')} votes
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
              <Trophy className="h-10 w-10 text-[#C9A227]/20 mx-auto mb-4" />
              <p className="text-sm text-white/50 font-medium mb-1">Aucun finaliste encore — votez !</p>
              <p className="text-xs text-white/35 max-w-md mx-auto">
                Dès qu&apos;un film de la compétition « {VOTE_TRACKS.B.name} » atteint{' '}
                {VOTE.threshold.toLocaleString('fr-FR')} votes confirmés, il apparaît ici.
              </p>
              <Link
                href="/films"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C9A227] hover:bg-[#E8C766] text-white text-sm font-semibold transition-all duration-300"
              >
                Voir les films en vote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/10 to-transparent" />

      {/* PRIX */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-playfair">Les prix</h2>
          <p className="text-sm text-white/50 leading-relaxed max-w-xl mx-auto">
            En fin d&apos;année, la communauté qui a voté pour les films finalistes remporte des prix — dont des
            voyages. La nature exacte des prix et les conditions de participation seront communiquées avant
            l&apos;ouverture de la Finale.
          </p>
        </div>
      </section>

      {/* REGLEMENT */}
      <section className="py-16 sm:py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 font-playfair text-center">Règlement</h2>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-8 space-y-6 text-sm text-white/60 leading-relaxed">
            <p>
              Ce règlement présente les règles connues et validées de la Finale {BRAND.name}. La version complète et
              définitive — incluant la date exacte, la nature précise des prix et les conditions légales du jeu-
              concours — sera publiée avant l&apos;ouverture de la Finale, conformément à la réglementation française
              des jeux-concours.
            </p>
            <div>
              <h3 className="text-white font-semibold mb-2">Qui peut concourir</h3>
              <p>
                Tout film inscrit en « {VOTE_TRACKS.B.name} » sur {BRAND.name} et ayant réuni{' '}
                {VOTE.threshold.toLocaleString('fr-FR')} votes confirmés entre en Finale.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Qui peut voter</h3>
              <p>{VOTE.rule} Le vote est gratuit et ne nécessite aucun achat.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Qui gagne les prix</h3>
              <p>
                Les gagnants sont désignés parmi les membres de la communauté ayant voté pour les films finalistes.
                Les modalités précises de tirage et d&apos;attribution seront détaillées dans le règlement complet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 px-4">
        <div className="container mx-auto max-w-lg text-center">
          <Link
            href="/comment-ca-marche"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-[#E8C766]"
          >
            Comprendre comment fonctionne {BRAND.name} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
