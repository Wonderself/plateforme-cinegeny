'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

/**
 * Session 15.11 — Gestion admin du générique curé (FilmCredit).
 *
 * Le générique d'un film est dérivé automatiquement (tâches validées =
 * artistes, scénario gagnant). Ces actions permettent à l'admin d'AJOUTER à la
 * main les crédits qui ne sont pas encore portés par une donnée système —
 * surtout les producteurs / coproducteurs (apporteurs d'argent), et les noms
 * hors-plateforme. Le modèle coprod complet (auto-crédit depuis les parts de
 * production) est prévu en roadmap (ROADMAP §15.12).
 */

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

const addCreditSchema = z.object({
  filmId: z.string().min(1, 'Film requis').max(100),
  userId: z.string().max(100).optional().or(z.literal('')),
  name: z.string().min(1, 'Nom requis').max(200),
  role: z.enum(['ARTIST', 'PRODUCER', 'ARTIST_PRODUCER']).default('PRODUCER'),
  roleLabel: z.string().max(120).optional().or(z.literal('')),
  note: z.string().max(500).optional().or(z.literal('')),
  order: z.coerce.number().int().min(0).max(9999).default(0),
})

export interface CreditActionResult {
  success: boolean
  error?: string
}

/** Liste les films (pour le sélecteur admin du générique). */
export async function listFilmsForCreditsAction() {
  await requireAdmin()
  const films = await prisma.film.findMany({
    select: { id: true, title: true, slug: true },
    orderBy: { updatedAt: 'desc' },
    take: 200,
  })
  return films
}

/** Liste les crédits curés d'un film (vue admin — inclut les notes privées). */
export async function getFilmCuratedCreditsAction(filmId: string) {
  await requireAdmin()
  return prisma.filmCredit.findMany({
    where: { filmId },
    orderBy: [{ role: 'asc' }, { order: 'asc' }, { createdAt: 'asc' }],
    select: {
      id: true,
      name: true,
      role: true,
      roleLabel: true,
      note: true,
      order: true,
      isPublic: true,
      userId: true,
      user: { select: { displayName: true, avatarUrl: true } },
    },
  })
}

/** Ajoute une ligne de générique (artiste, producteur, ou les deux). */
export async function addFilmCreditAction(input: unknown): Promise<CreditActionResult> {
  await requireAdmin()
  const parsed = addCreditSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Entrée invalide' }
  }
  const data = parsed.data

  const film = await prisma.film.findUnique({ where: { id: data.filmId }, select: { slug: true } })
  if (!film) return { success: false, error: 'Film introuvable' }

  // Si un userId est fourni, vérifier qu'il existe (crédit rattaché à un compte).
  if (data.userId) {
    const user = await prisma.user.findUnique({ where: { id: data.userId }, select: { id: true } })
    if (!user) return { success: false, error: 'Utilisateur introuvable' }
  }

  await prisma.filmCredit.create({
    data: {
      filmId: data.filmId,
      userId: data.userId || null,
      name: data.name,
      role: data.role,
      roleLabel: data.roleLabel || null,
      note: data.note || null,
      order: data.order,
    },
  })

  revalidatePath(`/films/${film.slug}`)
  revalidatePath('/admin/generique')
  return { success: true }
}

/** Supprime une ligne de générique curée. */
export async function removeFilmCreditAction(creditId: string): Promise<CreditActionResult> {
  await requireAdmin()
  if (!creditId) return { success: false, error: 'ID requis' }

  const credit = await prisma.filmCredit.findUnique({
    where: { id: creditId },
    select: { film: { select: { slug: true } } },
  })
  if (!credit) return { success: false, error: 'Crédit introuvable' }

  await prisma.filmCredit.delete({ where: { id: creditId } })

  revalidatePath(`/films/${credit.film.slug}`)
  revalidatePath('/admin/generique')
  return { success: true }
}
