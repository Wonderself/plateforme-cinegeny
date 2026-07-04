import Image from 'next/image'
import { Clapperboard, Gem, Armchair } from 'lucide-react'
import type { GeneriqueEntry } from '@/app/actions/credits'

/**
 * Session 15.11 — Le générique à 2 rôles (« la chaise dorée »).
 *
 * Deux familles clairement différenciées :
 *  - ARTISTES    : les créateurs / participants au film.
 *  - PRODUCTEURS : les apporteurs d'argent (coproducteurs).
 *
 * Une personne présente dans les deux (ex. travail contre parts de production)
 * porte le badge « Artiste & Producteur » dans chaque section.
 */

function Seat({ entry, accent }: { entry: GeneriqueEntry; accent: 'artist' | 'producer' }) {
  const FallbackIcon = accent === 'artist' ? Clapperboard : Gem
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#C9A227]/15 bg-gradient-to-br from-[#C9A227]/[0.06] to-transparent p-3">
      {entry.avatarUrl ? (
        <Image
          src={entry.avatarUrl}
          alt={entry.name}
          width={40}
          height={40}
          className="rounded-full object-cover shrink-0 ring-1 ring-[#C9A227]/30"
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0 ring-1 ring-[#C9A227]/20">
          <FallbackIcon className="h-4 w-4 text-[#C9A227]/70" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">{entry.name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {entry.roleLabel && (
            <span className="text-xs text-white/45 truncate">{entry.roleLabel}</span>
          )}
          {entry.isDual && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#E8C766] bg-[#C9A227]/10 border border-[#C9A227]/25 rounded-full px-1.5 py-0.5">
              Artiste &amp; Producteur
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export function FilmGenerique({
  artists,
  producers,
}: {
  artists: GeneriqueEntry[]
  producers: GeneriqueEntry[]
}) {
  if (artists.length === 0 && producers.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-bold font-playfair text-white mb-2 flex items-center gap-2">
        <Armchair className="h-5 w-5 text-[#C9A227]" />
        Générique
      </h2>
      <p className="text-sm text-white/40 mb-6">
        Une chaise dorée pour chaque nom : les artistes qui font le film, les producteurs qui le rendent possible.
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {artists.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-3 flex items-center gap-1.5">
              <Clapperboard className="h-3.5 w-3.5 text-[#C9A227]/70" />
              Artistes
            </h3>
            <div className="grid gap-3">
              {artists.map((entry) => (
                <Seat key={`a-${entry.key}`} entry={entry} accent="artist" />
              ))}
            </div>
          </section>
        )}

        {producers.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-3 flex items-center gap-1.5">
              <Gem className="h-3.5 w-3.5 text-[#C9A227]/70" />
              Producteurs
            </h3>
            <div className="grid gap-3">
              {producers.map((entry) => (
                <Seat key={`p-${entry.key}`} entry={entry} accent="producer" />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
