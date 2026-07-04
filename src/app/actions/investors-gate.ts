'use server'

import { cookies } from 'next/headers'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import {
  INVESTORS_COOKIE,
  checkInvestorsPassword,
  getOrCreateInvestorsPassword,
  investorsCookieOptions,
} from '@/lib/investors-gate'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')
  return session
}

/** Ecran de saisie public de /investors : verifie le mot de passe partage et pose le cookie d'acces. */
export async function verifyInvestorsPasswordAction(password: string) {
  const parsed = z.string().min(1).max(200).safeParse(password)
  if (!parsed.success) return { success: false, error: 'Mot de passe requis' }

  const { ok, token } = await checkInvestorsPassword(parsed.data)
  if (!ok || !token) return { success: false, error: 'Mot de passe incorrect' }

  const cookieStore = await cookies()
  cookieStore.set(INVESTORS_COOKIE, token, investorsCookieOptions())
  return { success: true }
}

/** Admin uniquement : mot de passe courant de l'Espace investisseurs (genere au besoin). */
export async function getInvestorsPasswordAction() {
  await requireAdmin()
  const password = await getOrCreateInvestorsPassword()
  return { success: true, password }
}

const setPasswordSchema = z.string().trim().min(4, 'Minimum 4 caractères').max(200)

/** Admin uniquement : change le mot de passe partage de /investors. */
export async function setInvestorsPasswordAction(newPassword: string) {
  await requireAdmin()
  const parsed = setPasswordSchema.safeParse(newPassword)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message || 'Mot de passe invalide' }

  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', investorsPassword: parsed.data },
    update: { investorsPassword: parsed.data },
  })
  revalidatePath('/admin')
  return { success: true, password: parsed.data }
}

/** Admin uniquement : regenere un mot de passe aleatoire pour /investors. */
export async function regenerateInvestorsPasswordAction(): Promise<{ success: boolean; password?: string; error?: string }> {
  await requireAdmin()
  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', investorsPassword: null },
    update: { investorsPassword: null },
  })
  const password = await getOrCreateInvestorsPassword()
  revalidatePath('/admin')
  return { success: true, password }
}
