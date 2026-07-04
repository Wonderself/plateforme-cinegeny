'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

/**
 * Session 15.11 — Matière / références d'un projet Mini Studio.
 *
 * Chaque projet du Mini Studio possède un dossier de matière rangé en
 * sous-dossiers (script, visuels, sons, docs). Ce dossier vit DANS le Mini
 * Studio, par projet, et sert de source aussi bien au générateur de bande-
 * annonce qu'à la fabrique de documents. Quand le projet est rattaché à un
 * film (TrailerProject.filmId), la matière suit le film.
 */

const FOLDERS = ['SCRIPT', 'VISUALS', 'AUDIO', 'DOCS', 'OTHER'] as const

const addFileSchema = z.object({
  projectId: z.string().min(1).max(100),
  folder: z.enum(FOLDERS).default('DOCS'),
  name: z.string().min(1, 'Nom requis').max(300),
  url: z.string().url('URL invalide').max(2000),
  fileKey: z.string().max(500).optional().or(z.literal('')),
  mimeType: z.string().max(200).optional().or(z.literal('')),
  sizeBytes: z.coerce.number().int().min(0).max(2_000_000_000).optional(),
  note: z.string().max(500).optional().or(z.literal('')),
})

export interface ProjectFileResult {
  success: boolean
  error?: string
}

/** Vérifie que l'utilisateur possède le projet (ou est admin). */
async function requireProjectAccess(projectId: string) {
  const session = await auth()
  if (!session?.user) return { ok: false as const, error: 'Non authentifié' }
  const project = await prisma.trailerProject.findUnique({
    where: { id: projectId },
    select: { userId: true },
  })
  if (!project) return { ok: false as const, error: 'Projet introuvable' }
  if (project.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return { ok: false as const, error: 'Accès refusé' }
  }
  return { ok: true as const, userId: session.user.id }
}

/** Liste la matière d'un projet, regroupée par sous-dossier. */
export async function getProjectFilesAction(projectId: string) {
  const access = await requireProjectAccess(projectId)
  if (!access.ok) return []
  return prisma.projectFile.findMany({
    where: { projectId },
    orderBy: [{ folder: 'asc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      folder: true,
      name: true,
      url: true,
      mimeType: true,
      sizeBytes: true,
      note: true,
      createdAt: true,
    },
  })
}

/** Ajoute un fichier de matière à un sous-dossier du projet. */
export async function addProjectFileAction(input: unknown): Promise<ProjectFileResult> {
  const parsed = addFileSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Entrée invalide' }
  }
  const data = parsed.data

  const access = await requireProjectAccess(data.projectId)
  if (!access.ok) return { success: false, error: access.error }

  await prisma.projectFile.create({
    data: {
      projectId: data.projectId,
      uploadedById: access.userId,
      folder: data.folder,
      name: data.name,
      url: data.url,
      fileKey: data.fileKey || null,
      mimeType: data.mimeType || null,
      sizeBytes: data.sizeBytes ?? null,
      note: data.note || null,
    },
  })

  revalidatePath(`/mini-studio/${data.projectId}`)
  return { success: true }
}

/** Retire un fichier de matière. */
export async function removeProjectFileAction(fileId: string): Promise<ProjectFileResult> {
  if (!fileId) return { success: false, error: 'ID requis' }
  const file = await prisma.projectFile.findUnique({
    where: { id: fileId },
    select: { projectId: true },
  })
  if (!file) return { success: false, error: 'Fichier introuvable' }

  const access = await requireProjectAccess(file.projectId)
  if (!access.ok) return { success: false, error: access.error }

  await prisma.projectFile.delete({ where: { id: fileId } })
  revalidatePath(`/mini-studio/${file.projectId}`)
  return { success: true }
}
