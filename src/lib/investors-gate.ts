import { createHmac, randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

export const INVESTORS_COOKIE = 'investors_access'
const INVESTORS_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 jours

/** Genere un mot de passe lisible (evite les caracteres ambigus 0/O, 1/l/I). */
function generatePassword(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const bytes = randomBytes(10)
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

/** Jeton derive du mot de passe courant : change automatiquement si le mot de passe change. */
function deriveToken(password: string): string {
  const secret = process.env.AUTH_SECRET || 'cinegeny-investors-gate'
  return createHmac('sha256', secret).update(password).digest('hex')
}

/** Retourne le mot de passe courant de l'Espace investisseurs, en le generant s'il n'existe pas encore. */
export async function getOrCreateInvestorsPassword(): Promise<string> {
  const settings = await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton' },
    update: {},
    select: { investorsPassword: true },
  })

  if (settings.investorsPassword) return settings.investorsPassword

  const password = generatePassword()
  await prisma.adminSettings.update({
    where: { id: 'singleton' },
    data: { investorsPassword: password },
  })
  return password
}

export function investorsCookieOptions() {
  return {
    path: '/investors',
    maxAge: INVESTORS_COOKIE_MAX_AGE,
    sameSite: 'lax' as const,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
}

export async function checkInvestorsPassword(input: string): Promise<{ ok: boolean; token?: string }> {
  const password = await getOrCreateInvestorsPassword()
  if (input.trim() !== password) return { ok: false }
  return { ok: true, token: deriveToken(password) }
}

export async function isInvestorsCookieValid(cookieValue: string | undefined): Promise<boolean> {
  const password = await getOrCreateInvestorsPassword()
  return !!cookieValue && cookieValue === deriveToken(password)
}
