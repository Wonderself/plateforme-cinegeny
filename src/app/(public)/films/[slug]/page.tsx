import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { Film, ArrowRight, Coins, Crown, Vote, TrendingUp, Bell, Clock, Users, Star, Calendar, Tag } from 'lucide-react'
import { FILM_STATUS_LABELS } from '@/lib/constants'
import { FilmTimeline } from '@/components/film-timeline'
import { SocialShare } from '@/components/social-share'
import { FilmReviews } from '@/components/film-reviews'
import { FilmVoteButton } from '@/components/film-vote-button'
import { WatchlistButton } from '@/components/watchlist-button'
import { FILMS_BY_SLUG, FILMS_BY_GENRE } from '@/data/films'
import { ARCHIVED_FILMS_BY_SLUG } from '@/data/archived-films'
import { getFilmCreditsAction } from '@/app/actions/credits'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const film = await prisma.film.findUnique({ where: { slug } })
  if (film) {
    return {
      title: `${film.title} — CINEGENY`,
      description: film.description || film.synopsis || `${film.title} on CINEGENY`,
      openGraph: {
        title: `${film.title} — CINEGENY`,
        description: film.description || film.synopsis || undefined,
        images: film.coverImageUrl ? [film.coverImageUrl] : undefined,
      },
    }
  }
  // Fallback to shared data (active slate or archived catalog)
  const fake = FILMS_BY_SLUG[slug] || ARCHIVED_FILMS_BY_SLUG[slug]
  if (fake) {
    return {
      title: `${fake.title} — CINEGENY`,
      description: fake.synopsis || `${fake.title} on CINEGENY`,
      openGraph: {
        title: `${fake.title} — CINEGENY`,
        description: fake.synopsis || undefined,
      },
    }
  }
  return { title: 'Film Not Found — CINEGENY' }
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params

  // Curated slate / archived catalogue → premium presentation (rich data
  // files: réalisation, casting, durée, tags…). These keep their high-end
  // page even though the films also exist as DB records (manageable in admin).
  const curated = FILMS_BY_SLUG[slug] || ARCHIVED_FILMS_BY_SLUG[slug]
  if (curated) return <CatalogFilmPage film={curated} />

  // Otherwise: a film managed entirely from the database (admin-created).
  const film = await prisma.film.findUnique({
    where: { slug, isPublic: true },
    include: {
      phases: {
        orderBy: { phaseOrder: 'asc' },
        include: {
          tasks: {
            where: { status: { in: ['AVAILABLE', 'CLAIMED', 'VALIDATED'] } },
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
          _count: { select: { tasks: true } },
        },
      },
      tokenOffering: true,
      _count: { select: { tasks: true, votes: true, backers: true } },
    },
  })

  if (film) {
    const { credits } = await getFilmCreditsAction(slug)
    return <DbFilmPage film={film} credits={credits} />
  }

  notFound()
}

/* ─────────────────────────────────────────────
   DB Film Page (full features)
   ───────────────────────────────────────────── */

type FilmCredit = Awaited<ReturnType<typeof getFilmCreditsAction>>['credits'][number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DbFilmPage({ film, credits }: { film: any; credits: FilmCredit[] }) {
  const availableTasks = 0 // Already counted in the main function for DB films

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis || film.description || undefined,
    genre: film.genre || undefined,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGENY Studio',
      url: 'https://cinegen.studio',
    },
    dateCreated: film.createdAt.toISOString(),
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill className="object-cover" sizes="100vw" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#C9A227]/10 via-purple-900/20 to-black flex items-center justify-center">
            <Film className="h-24 w-24 text-[#C9A227]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 container mx-auto max-w-5xl">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="default">{film.genre || 'Film IA'}</Badge>
                <Badge variant="secondary">{FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status}</Badge>
                {availableTasks > 0 && (
                  <Badge variant="success">{availableTasks} tâches disponibles</Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-playfair">
                {film.title}
              </h1>
              <div className="mt-3">
                <SocialShare
                  url={`https://cinegen.studio/films/${film.slug}`}
                  title={`${film.title} — Film en Production | CINEGENY`}
                  description={film.synopsis || film.description || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-4">
            {film.synopsis && (
              <div>
                <h2 className="text-lg font-semibold mb-3 text-[#C9A227]">Synopsis</h2>
                <p className="text-white/60 leading-relaxed">{film.synopsis}</p>
              </div>
            )}
            {film.description && !film.synopsis && (
              <p className="text-white/60 leading-relaxed">{film.description}</p>
            )}
          </div>

          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8">
              <h3 className="text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Progression globale</h3>
              <div className="text-5xl font-bold text-[#C9A227] mb-3 font-playfair">
                {Math.round(film.progressPct)}%
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8C766] rounded-full transition-all duration-1000"
                  style={{ width: `${film.progressPct}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-5 text-center">
                <div>
                  <div className="text-xl font-bold">{film.completedTasks}</div>
                  <div className="text-xs text-white/30">Validées</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{film.totalTasks}</div>
                  <div className="text-xs text-white/30">Total</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Tâches dispo', value: availableTasks },
                { label: 'Votes', value: film._count.votes },
                { label: 'Backers', value: film._count.backers },
                { label: 'Phases', value: film.phases.length },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-white/30 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Community voting */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Votre avis</p>
              <FilmVoteButton
                filmId={film.id}
                initialUpVotes={film._count.votes}
                className="justify-center"
              />
            </div>

            <WatchlistButton filmId={film.id} className="w-full justify-center" />

            <Link href={`/tasks?film=${film.id}`}>
              <Button className="w-full" size="lg">
                Voir les Tâches Disponibles
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Production Timeline */}
        <FilmTimeline phases={film.phases as never} />

        {/* Film Credits */}
        {credits.length > 0 && (
          <div>
            <h2 className="text-xl font-bold font-playfair text-white mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#C9A227]" />
              Générique
            </h2>
            <div className="space-y-8">
              {credits.map((group) => (
                <div key={group.phase}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">
                    {group.phase}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {group.tasks.map((task) =>
                      task.contributor ? (
                        <div
                          key={task.title}
                          className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                        >
                          {task.contributor.avatarUrl ? (
                            <Image
                              src={task.contributor.avatarUrl}
                              alt={task.contributor.displayName || ''}
                              width={36}
                              height={36}
                              className="rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                              <Users className="h-4 w-4 text-[#C9A227]/60" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {task.contributor.displayName || 'Contributeur'}
                            </p>
                            <p className="text-xs text-white/40 truncate">{task.title}</p>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Co-Producer Section */}
        <CoProducerSection film={film} />

        {/* Community Reviews */}
        <FilmReviews filmId={film.id} />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Catalog Film Page (fake film from shared data)
   ───────────────────────────────────────────── */

import type { FilmData } from '@/data/films'

const GENRE_COLORS: Record<string, string> = {
  'Action': '#C9A227',
  'Comedy': '#F59E0B',
  'Drama': '#8B5CF6',
  'Sci-Fi': '#3B82F6',
  'Documentary': '#10B981',
  'Thriller': '#6366F1',
  'Animation': '#EC4899',
  'Historical': '#D97706',
  'Romance': '#F43F5E',
  'Fantasy': '#A855F7',
}

const STATUS_NOTE: Record<string, string> = {
  DRAFT: 'En développement. Les votes de la communauté décident des projets qui passent en production.',
  PRE_PRODUCTION: "En pré-production — l'équipe prépare le tournage : scénario, storyboard, casting, repérages.",
  IN_PRODUCTION: 'En production — le film est créé phase par phase par la communauté et nos agents IA.',
  POST_PRODUCTION: 'En post-production — montage, VFX et mixage son. La bande-annonce arrive bientôt.',
  RELEASED: 'Disponible — le film est désormais visible en streaming.',
}

function CatalogFilmPage({ film }: { film: FilmData }) {
  const accentColor = GENRE_COLORS[film.genre] || '#C9A227'
  const statusLabel = FILM_STATUS_LABELS[film.status as keyof typeof FILM_STATUS_LABELS] || film.status
  const similarFilms = Object.values(FILMS_BY_GENRE[film.genre] || []).filter(f => f.slug !== film.slug).slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: film.title,
    description: film.synopsis,
    genre: film.genre,
    image: film.coverImageUrl || undefined,
    url: `https://cinegen.studio/films/${film.slug}`,
    director: { '@type': 'Person', name: film.director },
    duration: film.duration,
    dateCreated: `${film.year}-01-01`,
    productionCompany: {
      '@type': 'Organization',
      name: 'CINEGENY Studio',
      url: 'https://cinegen.studio',
    },
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Cinematic hero ── */}
      <section className="relative flex min-h-[60vh] items-end overflow-hidden md:min-h-[66vh]">
        {film.coverImageUrl ? (
          <Image src={film.coverImageUrl} alt={film.title} fill priority sizes="100vw" className="scale-105 object-cover object-center" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accentColor}1A, #0A0908 55%, ${accentColor}0D)` }} />
        )}
        {/* Cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/70 to-[#0A0908]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/85 via-transparent to-transparent" />
        {/* Accent glow */}
        <div className="pointer-events-none absolute -bottom-24 left-[18%] h-72 w-72 rounded-full opacity-25 blur-[130px]" style={{ background: accentColor }} />

        <div className="relative z-10 w-full">
          <div className="container mx-auto max-w-5xl px-6 pb-12 sm:px-10 md:px-16 md:pb-16">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-black" style={{ backgroundColor: accentColor }}>{film.genre}</span>
              <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/75 backdrop-blur-md">{statusLabel}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/45">{film.rating}</span>
            </div>
            <h1 className="max-w-3xl font-playfair text-4xl font-bold leading-[1.05] text-white md:text-6xl">
              {film.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/55">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[#C9A227]/70" /> {film.year}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#C9A227]/70" /> {film.duration}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#C9A227]/70" /> {film.director}</span>
            </div>
            <div className="mt-6">
              <SocialShare
                url={`https://cinegen.studio/films/${film.slug}`}
                title={`${film.title} — ${film.genre} | CINEGENY`}
                description={film.synopsis}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-6 sm:px-10 md:px-16 py-16 md:py-20 space-y-14 md:space-y-16">
        {/* Synopsis + Stats */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <div className="md:col-span-2 space-y-10">
            {/* Synopsis */}
            <section>
              <h2 className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                <span className="h-px w-6 bg-[#C9A227]/60" /> Synopsis
              </h2>
              <p className="text-[15px] leading-[1.85] text-white/65">{film.synopsis}</p>
            </section>

            {/* Casting & équipe */}
            <section>
              <h2 className="mb-4 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                <span className="h-px w-6 bg-[#C9A227]/60" /> Casting &amp; Équipe
              </h2>
              <dl className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-4 px-5 py-4">
                  <dt className="w-28 shrink-0 pt-0.5 text-xs uppercase tracking-wider text-white/30">Réalisation</dt>
                  <dd className="text-sm text-white/75">{film.director}</dd>
                </div>
                <div className="flex gap-4 border-t border-white/[0.06] px-5 py-4">
                  <dt className="w-28 shrink-0 pt-0.5 text-xs uppercase tracking-wider text-white/30">Distribution</dt>
                  <dd className="text-sm text-white/75">{film.cast.join(' · ')}</dd>
                </div>
              </dl>
            </section>

            {/* Tags */}
            {film.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-white/25" />
                {film.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-[11px] text-white/45">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Production status — single, on-brand */}
            <section className="rounded-2xl border border-[#C9A227]/15 bg-gradient-to-br from-[#C9A227]/[0.05] to-transparent p-6 md:p-7">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-[#C9A227]/25 bg-[#C9A227]/12">
                  <Clock className="h-3.5 w-3.5 text-[#C9A227]" />
                </span>
                <h3 className="text-sm font-semibold text-white">Où en est la production</h3>
                <span className="ml-auto text-[11px] font-medium text-[#E8C766]">{statusLabel}</span>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-white/50">{STATUS_NOTE[film.status] ?? ''}</p>
              <div className="mb-2 flex justify-between text-[11px]">
                <span className="text-white/40">Avancement</span>
                <span className="font-medium text-[#C9A227]">{Math.round(film.progressPct)}%</span>
              </div>
              <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-[#8A6A12] via-[#C9A227] to-[#F5D77A] transition-all duration-1000"
                  style={{ width: `${film.progressPct}%` }}
                >
                  <div className="absolute inset-0 animate-[shimmerSweep_2.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
              </div>
            </section>

          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {/* Production + financement */}
            <div className="space-y-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/40">Production</span>
                  <span className="font-playfair text-2xl font-bold text-[#E8C766]">{Math.round(film.progressPct)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#E8C766] transition-all duration-1000" style={{ width: `${film.progressPct}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/40">Financement</span>
                  <span className="font-playfair text-2xl font-bold text-emerald-300/90">{Math.round(film.fundingPct)}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000" style={{ width: `${Math.min(film.fundingPct, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Genre', value: film.genre, icon: Star },
                { label: 'Année', value: film.year, icon: Calendar },
                { label: 'Durée', value: film.duration, icon: Clock },
                { label: 'Classification', value: film.rating, icon: Tag },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-center">
                  <s.icon className="mx-auto mb-1.5 h-4 w-4 text-[#C9A227]/60" />
                  <div className="truncate text-sm font-semibold text-white">{s.value}</div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/30">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/invest" className="block">
              <Button className="w-full" size="lg">
                Soutenir ce film
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </aside>
        </div>

        {/* Co-Producteur — bande dorée raffinée */}
        <section className="relative overflow-hidden rounded-2xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/[0.07] via-[#0A0908] to-transparent p-8 md:p-10">
          <div className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-[#C9A227]/[0.06] blur-[90px]" />
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/12">
                <Crown className="h-5 w-5 text-[#C9A227]" />
              </span>
              <div>
                <h2 className="font-playfair text-2xl font-bold text-gold-metallic md:text-3xl">Devenez co-producteur</h2>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-[#C9A227]/60">Opportunité d&apos;investissement</p>
              </div>
            </div>

            <p className="mb-7 max-w-2xl text-[15px] leading-relaxed text-white/55">
              Investissez dès 10 € et recevez une part des revenus. Chaque token donne un droit de vote sur les
              décisions créatives et votre nom au générique.
            </p>

            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Coins, title: 'Dès 10 €', desc: 'Tokens de co-production accessibles à tous' },
                { icon: Vote, title: 'Droit de vote', desc: 'Pesez sur les choix créatifs du film' },
                { icon: Crown, title: 'Au générique', desc: 'Votre nom crédité + part des revenus' },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-[#C9A227]/10 bg-white/[0.02] p-4 transition-colors hover:border-[#C9A227]/25">
                  <b.icon className="mb-2 h-5 w-5 text-[#C9A227]/70" />
                  <h4 className="mb-1 text-sm font-semibold text-white">{b.title}</h4>
                  <p className="text-xs leading-relaxed text-white/35">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Link href="/tokenization">
                <Button size="lg" className="w-full sm:w-auto">
                  <Coins className="h-5 w-5" />
                  Devenir co-producteur
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/invest" className="inline-flex items-center justify-center gap-1.5 text-sm text-[#C9A227]/70 transition-colors hover:text-[#C9A227]">
                <Bell className="h-3.5 w-3.5" /> Voir toutes les offres
              </Link>
            </div>
          </div>
        </section>

        {/* Films similaires — défilement horizontal */}
        {similarFilms.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-white md:text-2xl">
                Dans le même genre
              </h2>
              <span className="text-[11px] uppercase tracking-wider text-white/30">{film.genre}</span>
            </div>
            <div className="relative group/row">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none opacity-0 group-hover/row:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
                {similarFilms.map((sf) => (
                  <Link key={sf.slug} href={`/films/${sf.slug}`} className="flex-shrink-0 w-[140px] md:w-[160px] group/card snap-start">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#141414] ring-1 ring-white/[0.06] mb-2.5 transition-all duration-300 group-hover/card:ring-2 group-hover/card:shadow-lg group-hover/card:shadow-black/40" style={{ ['--tw-ring-color' as string]: `${accentColor}40` }}>
                      {sf.coverImageUrl ? (
                        <Image src={sf.coverImageUrl} alt={sf.title} fill className="object-cover group-hover/card:scale-110 transition-transform duration-700 ease-out" sizes="160px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/[0.02] to-transparent">
                          <Film className="h-8 w-8 text-white/10" />
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider flex items-center gap-1">
                          <ArrowRight className="h-3 w-3" /> Voir
                        </span>
                      </div>
                      {/* Progress indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5">
                        <div className="h-full rounded-full" style={{ width: `${sf.progressPct}%`, backgroundColor: accentColor }} />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-white/60 truncate group-hover/card:text-white transition-colors duration-200">{sf.title}</p>
                    <p className="text-[10px] text-white/25 mt-0.5">{sf.year} &middot; {sf.progressPct}% achevé</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Co-Producer Section (shared between DB films)
   ───────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CoProducerSection({ film }: { film: any }) {
  return (
    <div className="rounded-2xl border border-[#C9A227]/20 bg-gradient-to-br from-[#C9A227]/[0.06] to-transparent p-8 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/[0.05] rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#C9A227]/15 border border-[#C9A227]/25 flex items-center justify-center">
            <Crown className="h-5 w-5 text-[#C9A227]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-playfair">
            Devenez Co-Producteur
          </h2>
        </div>

        <p className="text-white/50 mb-8 max-w-2xl text-lg leading-relaxed">
          Investissez dans ce film et recevez une part des revenus.
          Chaque token vous donne un droit de vote sur les decisions creatives.
        </p>

        {film.tokenOffering && film.tokenOffering.status === 'OPEN' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div className="rounded-xl border border-[#C9A227]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-[#C9A227] font-playfair">
                  {film.tokenOffering.tokenPrice}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Prix / token</div>
              </div>
              <div className="rounded-xl border border-[#C9A227]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364;
                </div>
                <div className="text-xs text-white/30 mt-1">Leves</div>
              </div>
              <div className="rounded-xl border border-[#C9A227]/10 bg-white/[0.03] p-4 text-center">
                <div className="text-2xl font-bold text-white font-playfair">
                  {film.tokenOffering.tokensSold}
                </div>
                <div className="text-xs text-white/30 mt-1">Tokens vendus</div>
              </div>
              {film.tokenOffering.projectedROI && (
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 font-playfair">
                    ~{film.tokenOffering.projectedROI}%
                  </div>
                  <div className="text-xs text-white/30 mt-1">ROI estime</div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-white/50">Progression de la levee</span>
                <span className="text-[#C9A227] font-semibold">
                  {film.tokenOffering.hardCap > 0 ? Math.round((film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8C766] rounded-full transition-all duration-1000"
                  style={{ width: `${film.tokenOffering.hardCap > 0 ? Math.min(100, (film.tokenOffering.raised / film.tokenOffering.hardCap) * 100) : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-white/30">
                <span>{Math.round(film.tokenOffering.raised).toLocaleString('fr-FR')}&#8364; leves</span>
                <span>Objectif : {Math.round(film.tokenOffering.hardCap).toLocaleString('fr-FR')}&#8364;</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: TrendingUp, label: 'Revenus partages' },
                { icon: Vote, label: 'Droit de vote' },
                { icon: Crown, label: 'Nom au generique' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-xs text-white/40">
                  <b.icon className="h-3.5 w-3.5 text-[#C9A227]" />
                  {b.label}
                </div>
              ))}
            </div>

            <Link href={`/tokenization/${film.id}`}>
              <Button size="lg" className="w-full sm:w-auto group">
                <Coins className="h-5 w-5" />
                Investir dans ce Film
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Coins, title: 'Investissez des 10\u20AC', desc: 'Tokens de co-production accessibles a tous' },
                { icon: Vote, title: 'Votez', desc: 'Participez aux decisions creatives du film' },
                { icon: Crown, title: 'Au Generique', desc: 'Votre nom credite comme co-producteur' },
              ].map((b) => (
                <div key={b.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                  <b.icon className="h-6 w-6 text-[#C9A227]/60 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-white mb-1">{b.title}</h4>
                  <p className="text-xs text-white/30">{b.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/40 mb-4">
                L&apos;offre de co-production sera bientot disponible.
                Suivez ce film pour etre notifie des son ouverture.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/tokenization">
                  <Button variant="outline" className="group">
                    <Bell className="h-4 w-4" />
                    Voir les Offres Disponibles
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
