import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles, Vote } from 'lucide-react'
import { COMING_SOON, type ComingSoonFilm } from '@/data/coming-soon'
import { ALL_FILMS } from '@/data/films'

/**
 * Mur d'affiches « Prochainement » — accueil + /films.
 *
 * Deux rangées d'affiches qui défilent lentement en sens opposés (CSS pur,
 * transform GPU, pause au survol) : l'impression d'un catalogue qui déborde.
 * Slate actuelle + titres en développement (`src/data/coming-soon.ts`) ;
 * aucun compteur inventé — uniquement affiches et titres.
 */

interface WallPoster {
  title: string
  genre: string
  posterUrl: string
  soon: boolean
}

function buildPosters(): { rowA: WallPoster[]; rowB: WallPoster[] } {
  const slate: WallPoster[] = ALL_FILMS.filter((f) => f.coverImageUrl).map((f) => ({
    title: f.title,
    genre: f.genre,
    posterUrl: f.coverImageUrl as string,
    soon: false,
  }))
  const soon: WallPoster[] = COMING_SOON.map((f: ComingSoonFilm) => ({ ...f, soon: true }))

  // Deux rangées entrelacées pour que chaque rangée mêle slate et « Bientôt ».
  const mixed = [...slate, ...soon]
  const rowA = mixed.filter((_, i) => i % 2 === 0)
  const rowB = mixed.filter((_, i) => i % 2 === 1)
  return { rowA, rowB }
}

function PosterTile({ film }: { film: WallPoster }) {
  return (
    <div className="cine-poster relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] sm:w-44">
      <Image
        src={film.posterUrl}
        alt={`Affiche — ${film.title}`}
        fill
        loading="lazy"
        className="object-cover"
        sizes="176px"
      />
      {film.soon && (
        <span className="absolute left-2 top-2 z-10 rounded-full border border-[#C9A227]/30 bg-[#0A0908]/75 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#E8C766] backdrop-blur-md">
          Bientôt
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
        <p className="line-clamp-1 text-[11px] font-semibold text-white/90">{film.title}</p>
        <p className="text-[9px] uppercase tracking-wider text-white/40">{film.genre}</p>
      </div>
    </div>
  )
}

function MarqueeRow({ films, reverse = false }: { films: WallPoster[]; reverse?: boolean }) {
  return (
    <div className="poster-marquee-row rail-fade overflow-hidden">
      <div className={`poster-marquee ${reverse ? 'poster-marquee-reverse' : ''} py-2`}>
        {/* Contenu dupliqué : boucle sans couture */}
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-4" aria-hidden={dup === 1}>
            {films.map((film) => (
              <PosterTile key={`${dup}-${film.title}`} film={film} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ComingSoonWall() {
  const { rowA, rowB } = buildPosters()

  return (
    <section className="relative overflow-hidden border-y border-white/[0.05] bg-[#080706] py-16 md:py-20">
      {/* Halo ambiant */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-[#C9A227]/[0.05] blur-[120px]" />

      <div className="relative mb-10 px-4 text-center sm:px-8 md:px-16 lg:px-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/[0.08] px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8C766]">
          <Sparkles className="h-3 w-3" /> Prochainement
        </span>
        <h2 className="mx-auto mt-4 max-w-2xl font-playfair text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
          Des dizaines de films <span className="text-gold-brushed">arrivent</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/50 sm:text-[15px]">
          Une centaine de films à terme — et c’est vous qui décidez lesquels se font.
          Votez pour vos préférés, ils passent en production.
        </p>
      </div>

      <div className="relative space-y-4">
        <MarqueeRow films={rowA} />
        <MarqueeRow films={rowB} reverse />
      </div>

      <div className="relative mt-10 flex flex-col items-center justify-center gap-3 px-4 sm:flex-row">
        <Link
          href="/films"
          className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold transition-all"
        >
          <Vote className="h-4 w-4" /> Voter pour le prochain film
        </Link>
        <Link
          href="/atelier"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-[#C9A227]/30 hover:text-[#E8C766]"
        >
          Proposer le vôtre <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
