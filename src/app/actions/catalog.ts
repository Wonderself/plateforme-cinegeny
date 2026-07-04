'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { generateFilmContract } from '@/lib/contracts'
import { FILM_DURATION, isValidFilmDuration } from '@/content/atelier'

export async function submitFilmAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const title = formData.get('title') as string
  const synopsis = formData.get('synopsis') as string
  const genre = formData.get('genre') as string
  const videoUrl = formData.get('videoUrl') as string
  const trailerUrl = formData.get('trailerUrl') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  // Durée : le formulaire envoie des minutes (`durationMinutes`) ; l'ancien
  // champ `duration` (secondes) reste accepté pour compatibilité.
  const durationMinutesRaw = formData.get('durationMinutes') as string | null
  const duration = durationMinutesRaw
    ? Math.round(parseFloat(durationMinutesRaw) * 60)
    : parseInt(formData.get('duration') as string || '0', 10)
  const language = formData.get('language') as string || 'fr'
  const year = parseInt(formData.get('year') as string || '0', 10)
  const isContest = formData.get('isContest') === 'true'
  const exclusivity = formData.get('exclusivity') === 'true'
  const acceptTerms = formData.get('acceptTerms') === 'true'

  if (!title || !synopsis || !videoUrl) {
    return { error: 'Titre, synopsis et URL de la vidéo sont requis' }
  }
  // Règle de format CINEGENY : un film dure entre 10 minutes et 1 h 00
  // (source de vérité : src/content/atelier.ts).
  if (!duration) {
    return { error: `La durée du film est requise (${FILM_DURATION.label}).` }
  }
  if (!isValidFilmDuration(duration)) {
    return { error: `Format non conforme : les films durent ${FILM_DURATION.label}. ${FILM_DURATION.rule}` }
  }
  if (!acceptTerms) {
    return { error: 'Vous devez accepter les conditions du contrat' }
  }

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { displayName: true, email: true },
  })

  const revenueSharePct = 50
  const exclusivityBonus = exclusivity ? 10 : 0

  const film = await prisma.catalogFilm.create({
    data: {
      title,
      slug,
      synopsis,
      genre,
      videoUrl,
      trailerUrl: trailerUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      duration: duration || null,
      language,
      year: year || null,
      isContest,
      revenueSharePct: revenueSharePct + exclusivityBonus,
      submittedById: session.user.id,
    },
  })

  // Auto-generate contract
  const contractTerms = generateFilmContract({
    creatorName: user?.displayName || user?.email || 'Créateur',
    filmTitle: title,
    revenueSharePct,
    exclusivity,
    exclusivityBonus,
    signDate: new Date().toLocaleDateString('fr-FR'),
  })

  await prisma.catalogContract.create({
    data: {
      filmId: film.id,
      userId: session.user.id,
      terms: contractTerms,
      revenueSharePct: revenueSharePct + exclusivityBonus,
      promotionClause: true,
      exclusivity,
      exclusivityBonus,
      status: 'SIGNED',
      signedAt: new Date(),
    },
  })

  revalidatePath('/streaming')
  return { success: true }
}

/**
 * Proposition de film déposée pendant l'onboarding (/bienvenue).
 * Plus légère que la soumission complète : titre + synopsis suffisent,
 * l'affiche / la bande-annonce / le film sont facultatifs. Si le film complet
 * est fourni, la règle de format s'applique (10 min – 1 h). La proposition
 * arrive en statut PENDING dans /admin/catalog, où l'équipe la complète,
 * la modifie ou la supprime.
 */
export async function proposeFilmAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Connectez-vous pour proposer un film.' }

  const title = (formData.get('title') as string || '').trim()
  const synopsis = (formData.get('synopsis') as string || '').trim()
  const genre = (formData.get('genre') as string || '').trim()
  const posterUrl = (formData.get('posterUrl') as string || '').trim()
  const trailerUrl = (formData.get('trailerUrl') as string || '').trim()
  const videoUrl = (formData.get('videoUrl') as string || '').trim()
  const durationMinutesRaw = (formData.get('durationMinutes') as string || '').trim()
  const duration = durationMinutesRaw ? Math.round(parseFloat(durationMinutesRaw) * 60) : 0

  if (!title || !synopsis) {
    return { error: 'Le titre et le synopsis sont requis.' }
  }
  // Film complet fourni → la règle de format s'applique dès la proposition.
  if (videoUrl) {
    if (!duration) {
      return { error: `Indiquez la durée du film (${FILM_DURATION.label}).` }
    }
    if (!isValidFilmDuration(duration)) {
      return { error: `Format non conforme : les films durent ${FILM_DURATION.label}.` }
    }
  }

  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36)

  await prisma.catalogFilm.create({
    data: {
      title,
      slug,
      synopsis,
      genre: genre || null,
      videoUrl: videoUrl || null,
      trailerUrl: trailerUrl || null,
      thumbnailUrl: posterUrl || null,
      posterUrl: posterUrl || null,
      duration: duration || null,
      tags: ['proposition-onboarding'],
      submittedById: session.user.id,
    },
  })

  revalidatePath('/admin/catalog')
  return { success: true }
}

/**
 * Mise à jour d'un film du catalogue par l'admin (/admin/catalog/[id]) :
 * infos, affiche, bande-annonce, vidéo, durée, mise en vedette.
 */
export async function updateCatalogFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  const durationMinutesRaw = (formData.get('durationMinutes') as string || '').trim()
  const duration = durationMinutesRaw ? Math.round(parseFloat(durationMinutesRaw) * 60) : null
  const year = parseInt(formData.get('year') as string || '0', 10)

  const str = (name: string) => {
    const v = (formData.get(name) as string || '').trim()
    return v || null
  }

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: {
      title: (formData.get('title') as string || '').trim() || undefined,
      synopsis: str('synopsis'),
      genre: str('genre'),
      videoUrl: str('videoUrl'),
      trailerUrl: str('trailerUrl'),
      thumbnailUrl: str('thumbnailUrl'),
      posterUrl: str('posterUrl'),
      duration,
      year: year || null,
      language: (formData.get('language') as string || '').trim() || 'fr',
      featured: formData.get('featured') === 'true',
    },
  })

  revalidatePath('/admin/catalog')
  revalidatePath('/streaming')
  const { redirect } = await import('next/navigation')
  redirect('/admin/catalog')
}

/** Suppression définitive d'un film du catalogue (admin, avec confirmation). */
export async function deleteCatalogFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  const confirmed = formData.get('confirmDelete') === 'true'
  if (!filmId || !confirmed) return

  await prisma.catalogFilm.delete({ where: { id: filmId } })

  revalidatePath('/admin/catalog')
  revalidatePath('/streaming')
  const { redirect } = await import('next/navigation')
  redirect('/admin/catalog')
}

export async function approveFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { status: 'LIVE' },
  })

  revalidatePath('/admin/catalog')
  revalidatePath('/streaming')
}

export async function rejectFilmAction(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') return

  const filmId = formData.get('filmId') as string
  if (!filmId) return

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { status: 'REJECTED' },
  })

  revalidatePath('/admin/catalog')
}

export async function recordFilmViewAction(filmId: string) {
  const session = await auth()

  await prisma.filmView.create({
    data: {
      filmId,
      userId: session?.user?.id || null,
      watchDuration: 0,
      completionPct: 0,
    },
  })

  await prisma.catalogFilm.update({
    where: { id: filmId },
    data: { viewCount: { increment: 1 }, monthlyViews: { increment: 1 } },
  })
}
