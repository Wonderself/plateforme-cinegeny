import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { updateCatalogFilmAction, deleteCatalogFilmAction } from '@/app/actions/catalog'
import { FILM_DURATION } from '@/content/atelier'
import { Film, Save, Trash2, ArrowLeft, Star, Clock, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Admin — Éditer un film' }

const inputCls =
  'mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-[#C9A227]/50'
const labelCls = 'text-xs font-medium text-white/50'

export default async function AdminCatalogEditPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user || (session.user as { role?: string }).role !== 'ADMIN') redirect('/dashboard')

  const { id } = await props.params
  const film = await prisma.catalogFilm.findUnique({
    where: { id },
    include: { submittedBy: { select: { displayName: true, email: true } } },
  })
  if (!film) notFound()

  const durationMinutes = film.duration ? Math.round(film.duration / 60) : ''

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <Link
        href="/admin/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-[#E8C766]"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au catalogue
      </Link>

      {/* En-tête */}
      <div className="flex items-start gap-5">
        <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {(film.posterUrl || film.thumbnailUrl) ? (
            <Image
              src={(film.posterUrl || film.thumbnailUrl) as string}
              alt={`Affiche — ${film.title}`}
              fill
              unoptimized
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Film className="h-8 w-8 text-white/15" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-playfair text-2xl font-bold text-white sm:text-3xl">{film.title}</h1>
          <p className="mt-1 text-sm text-white/40">
            Proposé par {film.submittedBy.displayName || film.submittedBy.email} · statut{' '}
            <span className="text-[#E8C766]">{film.status}</span>
            {film.tags.includes('proposition-onboarding') && ' · proposition onboarding'}
          </p>
          <Link
            href={`/streaming/${film.slug}`}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-[#E8C766]"
          >
            Voir la page publique <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Édition */}
      <form action={updateCatalogFilmAction} className="space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
        <input type="hidden" name="filmId" value={film.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Titre</label>
            <input name="title" defaultValue={film.title} required className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Synopsis</label>
            <textarea name="synopsis" defaultValue={film.synopsis ?? ''} rows={4} className={`${inputCls} resize-none`} />
          </div>
          <div>
            <label className={labelCls}>Genre</label>
            <input name="genre" defaultValue={film.genre ?? ''} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>
              <Clock className="mr-1 inline h-3 w-3" /> Durée (minutes) — {FILM_DURATION.label}
            </label>
            <input name="durationMinutes" type="number" defaultValue={durationMinutes} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Année</label>
            <input name="year" type="number" defaultValue={film.year ?? ''} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Langue</label>
            <input name="language" defaultValue={film.language} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Affiche / poster (URL)</label>
            <input name="posterUrl" type="url" defaultValue={film.posterUrl ?? ''} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Miniature (URL — reprend l’affiche si vide)</label>
            <input name="thumbnailUrl" type="url" defaultValue={film.thumbnailUrl ?? ''} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Bande-annonce (URL)</label>
            <input name="trailerUrl" type="url" defaultValue={film.trailerUrl ?? ''} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Film complet (URL)</label>
            <input name="videoUrl" type="url" defaultValue={film.videoUrl ?? ''} className={inputCls} />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#C9A227]/20 bg-[#C9A227]/[0.05] px-4 py-3">
          <input type="checkbox" name="featured" value="true" defaultChecked={film.featured} className="accent-[#C9A227]" />
          <span className="flex items-center gap-2 text-sm text-white/80">
            <Star className="h-4 w-4 text-[#C9A227]" /> Mettre en vedette (hero du streaming)
          </span>
        </label>

        <button
          type="submit"
          className="bg-gold-brushed btn-sheen inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold transition-all"
        >
          <Save className="h-4 w-4" /> Enregistrer les modifications
        </button>
      </form>

      {/* Zone dangereuse */}
      <form
        action={deleteCatalogFilmAction}
        className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <input type="hidden" name="filmId" value={film.id} />
        <div>
          <p className="text-sm font-semibold text-red-300">Supprimer ce film</p>
          <p className="mt-1 text-xs text-white/40">
            Définitif : le film, ses vues et son contrat sont effacés.
          </p>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-white/60">
            <input type="checkbox" name="confirmDelete" value="true" required className="accent-red-400" />
            Je confirme la suppression définitive
          </label>
        </div>
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
        >
          <Trash2 className="h-4 w-4" /> Supprimer
        </button>
      </form>
    </div>
  )
}
