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

/**
 * Tailles par palier (plus le producteur investit, plus son nom est grand).
 * `grand` ≥ 10 000 € · `moyen` ≥ 500 € · `petit` ≥ 100 €. Les artistes utilisent
 * toujours le gabarit moyen.
 */
const TIER_STYLE: Record<'grand' | 'moyen' | 'petit', {
  avatar: number
  box: string
  name: string
}> = {
  grand: { avatar: 56, box: 'p-4 gap-4', name: 'text-lg font-semibold' },
  moyen: { avatar: 40, box: 'p-3 gap-3', name: 'text-sm font-medium' },
  petit: { avatar: 30, box: 'p-2.5 gap-2.5', name: 'text-xs font-medium' },
}

function Seat({ entry, accent }: { entry: GeneriqueEntry; accent: 'artist' | 'producer' }) {
  const FallbackIcon = accent === 'artist' ? Clapperboard : Gem
  const tier = accent === 'producer' ? (entry.tier ?? 'petit') : 'moyen'
  const s = TIER_STYLE[tier]
  return (
    <div className={`flex items-center rounded-xl border border-[#C9A227]/15 bg-gradient-to-br from-[#C9A227]/[0.06] to-transparent ${s.box}`}>
      {entry.avatarUrl ? (
        <Image
          src={entry.avatarUrl}
          alt={entry.name}
          width={s.avatar}
          height={s.avatar}
          style={{ width: s.avatar, height: s.avatar }}
          className="rounded-full object-cover shrink-0 ring-1 ring-[#C9A227]/30"
        />
      ) : (
        <div
          style={{ width: s.avatar, height: s.avatar }}
          className="rounded-full bg-[#C9A227]/10 flex items-center justify-center shrink-0 ring-1 ring-[#C9A227]/20"
        >
          <FallbackIcon className="h-4 w-4 text-[#C9A227]/70" />
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-white truncate ${s.name}`}>{entry.name}</p>
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
