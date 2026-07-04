import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Search, Star, Eye, Clock, Film, Coins, Crown, ArrowRight, Wand2, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ATELIER, FILM_DURATION } from '@/content/atelier'
import { ComingSoonWall } from '@/components/films/coming-soon-wall'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Streaming — Films IA en continu',
  description:
    "Découvrez et regardez des films créés par l'intelligence artificielle. Catalogue de courts et longs métrages IA, bandes-annonces exclusives.",
  openGraph: {
    title: 'Streaming — Films IA en continu | CINEGENY',
    description: "Découvrez et regardez des films créés par l'intelligence artificielle.",
  },
}

const GENRES = ['Tous', 'Sci-Fi', 'Drame', 'Action', 'Comédie', 'Thriller', 'Animation', 'Documentaire', 'Horreur', 'Romance']

function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  if (totalMinutes < 60) return `${totalMinutes} min`
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return m > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

export default async function StreamingPage(props: { searchParams: Promise<{ genre?: string; q?: string }> }) {
  const searchParams = await props.searchParams
  const genre = searchParams.genre
  const query = searchParams.q

  const where: Record<string, unknown> = { status: 'LIVE' }
  if (genre && genre !== 'Tous') where.genre = genre
  if (query) where.title = { contains: query, mode: 'insensitive' }

  // Base indisponible (build/preview) — la page reste rendue, catalogue vide.
  let films: Awaited<ReturnType<typeof prisma.catalogFilm.findMany<{
    where: Record<string, unknown>
    include: { submittedBy: { select: { displayName: true } } }
  }>>> = []
  let featured: (typeof films)[number] | null = null
  try {
    ;[films, featured] = await Promise.all([
      prisma.catalogFilm.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { viewCount: 'desc' }],
        include: { submittedBy: { select: { displayName: true } } },
      }),
      prisma.catalogFilm.findFirst({
        where: { status: 'LIVE', featured: true },
        include: { submittedBy: { select: { displayName: true } } },
      }),
    ])
  } catch {
    // Compteurs et catalogue à zéro : l'expérience reste navigable.
  }

  return (
    <div className="min-h-screen bg-[#0A0908]">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      {featured ? (
        <div className="hero-vignette relative h-[72vh] min-h-[480px] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="kenburns absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: featured.posterUrl ? `url(${featured.posterUrl})` : 'linear-gradient(135deg, #1a1611, #0A0908)' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/45 to-[#0A0908]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/85 via-[#0A0908]/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 z-10 p-5 sm:p-8 md:p-12 lg:p-16">
            <Badge className="mb-5 border-[#C9A227]/30 bg-[#0A0908]/60 text-[#E8C766] backdrop-blur-md">
              <Star className="mr-1 h-3 w-3 fill-[#C9A227] text-[#C9A227]" /> En vedette
            </Badge>
            <h1 className="mb-4 max-w-3xl font-playfair text-3xl font-bold leading-[1.05] text-white sm:text-5xl md:text-7xl">
              {featured.title}
            </h1>
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              {featured.genre && <span className="meta-chip">{featured.genre}</span>}
              {featured.duration && (
                <span className="meta-chip">
                  <Clock className="h-3 w-3" /> {formatDuration(featured.duration)}
                </span>
              )}
              {featured.year && <span className="meta-chip">{featured.year}</span>}
              <span className="meta-chip">
                <Eye className="h-3 w-3" /> {featured.viewCount.toLocaleString('fr-FR')} vues
              </span>
            </div>
            <p className="mb-8 line-clamp-2 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">{featured.synopsis}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/streaming/${featured.slug}`}
                className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-bold transition-all sm:px-8 sm:text-lg"
              >
                <Play className="h-5 w-5 fill-current" /> Regarder
              </Link>
              {featured.submittedBy.displayName && (
                <span className="text-sm text-white/40">
                  par <span className="text-white/70">{featured.submittedBy.displayName}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-vignette relative flex h-[42vh] min-h-[320px] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#C9A227]/[0.05] via-transparent to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A227]/[0.05] blur-[120px]" />
          <div className="relative z-10 px-4 text-center">
            <h1 className="mb-4 font-playfair text-4xl font-bold md:text-6xl">
              <span className="text-gold-brushed">Streaming</span>
            </h1>
            <p className="mx-auto max-w-xl text-lg text-white/50">
              Découvrez les films créés par la communauté et l&apos;intelligence artificielle.
            </p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 sm:py-16 md:px-16 lg:px-20">
        {/* ══ Recherche & filtres ═══════════════════════════════════════════ */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row">
          <form action="/streaming" method="GET" className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            {genre && genre !== 'Tous' && <input type="hidden" name="genre" value={genre} />}
            <input
              name="q"
              defaultValue={query}
              placeholder="Rechercher un film..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-white backdrop-blur-md placeholder:text-white/30 focus:border-[#C9A227]/50 focus:outline-none"
            />
          </form>
          <div className="flex flex-wrap gap-2.5">
            {GENRES.map((g) => {
              const active = genre === g || (!genre && g === 'Tous')
              return (
                <Link
                  key={g}
                  href={g === 'Tous' ? '/streaming' : `/streaming?genre=${g}`}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? 'bg-gold-brushed font-semibold'
                      : 'border border-white/[0.07] bg-white/[0.03] text-white/50 hover:border-[#C9A227]/25 hover:text-[#E8C766]'
                  }`}
                >
                  {g}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ══ L'Atelier — créer ou insérer ══════════════════════════════════ */}
        <div className="border-gold-brushed relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-[#C9A227]/[0.09] via-[#0E0D0A] to-transparent p-7 sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#C9A227]/[0.08] blur-[70px]" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-playfair text-xl font-bold text-white sm:text-2xl">
                Vous avez un film en vous ?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">
                Créez votre bande-annonce avec l’Atelier, ou insérez directement votre création.
                Format des films : <span className="text-[#E8C766]">{FILM_DURATION.label}</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ATELIER.href}
                className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all"
              >
                <Wand2 className="h-4 w-4" /> Ouvrir l’Atelier
              </Link>
              <Link
                href="/streaming/submit"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/[0.08] px-5 py-2.5 text-sm font-semibold text-[#E8C766] transition-colors hover:bg-[#C9A227]/[0.16]"
              >
                <Upload className="h-4 w-4" /> Insérer un film
              </Link>
            </div>
          </div>
        </div>

        {/* ══ Grille de films ═══════════════════════════════════════════════ */}
        {films.length === 0 ? (
          <div className="py-20 text-center">
            <Film className="mx-auto mb-4 h-16 w-16 text-white/10" />
            <p className="text-lg text-white/30">Aucun film trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {films.map((film) => (
              <Link key={film.id} href={`/streaming/${film.slug}`} className="group">
                <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:border-[#C9A227]/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(201,162,39,0.08)]">
                  <div className="cine-poster relative aspect-[2/3] bg-gradient-to-br from-[#C9A227]/[0.05] to-transparent">
                    {film.thumbnailUrl ? (
                      <Image src={film.thumbnailUrl} alt={film.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Film className="h-12 w-12 text-white/10" />
                      </div>
                    )}
                    {/* Lecture au survol */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="bg-gold-brushed flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                        <Play className="ml-0.5 h-6 w-6 fill-current" />
                      </span>
                    </div>
                    {film.genre && (
                      <span className="meta-chip absolute left-2.5 top-2.5 z-10 !px-2.5 !text-[10px]">
                        {film.genre}
                      </span>
                    )}
                    {film.duration && (
                      <span className="meta-chip absolute bottom-2.5 right-2.5 z-10 !px-2.5 !text-[10px]">
                        <Clock className="h-2.5 w-2.5" /> {formatDuration(film.duration)}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-[#E8C766]">
                      {film.title}
                    </h3>
                    <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/30">
                      <span className="truncate">{film.submittedBy.displayName || 'Anonyme'}</span>
                      <span className="ml-2 flex shrink-0 items-center gap-1">
                        <Eye className="h-3 w-3" /> {film.viewCount.toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>

      {/* ══ Prochainement — mur d'affiches ══════════════════════════════════ */}
      <ComingSoonWall />

      <div className="mx-auto max-w-7xl px-6 pb-14 sm:px-10 sm:pb-16 md:px-16 lg:px-20">
        {/* ══ Devenez Producteur ════════════════════════════════════════════ */}
        <div className="relative mt-20 overflow-hidden rounded-3xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/[0.08] via-[#C9A227]/[0.03] to-transparent p-8 md:p-12 lg:p-14">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#C9A227]/[0.06] blur-[80px]" />
          <div className="relative flex flex-col items-center gap-8 md:flex-row">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/15">
                  <Crown className="h-5 w-5 text-[#C9A227]" />
                </div>
                <h2 className="font-playfair text-2xl font-bold md:text-3xl">
                  <span className="text-gold-brushed">Devenez Producteur</span>
                </h2>
              </div>
              <p className="max-w-lg leading-relaxed text-white/50">
                Ne vous contentez pas de regarder. Co-produisez les films de demain dès 10&#8364;,
                recevez des revenus et voyez votre nom au générique.
              </p>
            </div>
            <Link
              href="/invest"
              className="bg-gold-brushed btn-sheen inline-flex shrink-0 items-center gap-2 rounded-xl px-8 py-4 text-lg font-bold transition-all"
            >
              <Coins className="h-5 w-5" />
              Devenir co-producteur
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
