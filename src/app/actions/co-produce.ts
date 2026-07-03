'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { hashIp } from '@/lib/votes'
import { coProduceWaitlistLimiter } from '@/lib/rate-limit'
import { sendCoProducerWaitlistEmail } from '@/lib/email'

const waitlistSchema = z.object({
  email: z.string().email('Email invalide'),
  intentAmount: z
    .number()
    .int('Montant entier requis')
    .min(10, 'Minimum 10 €')
    .max(1_000_000, 'Montant trop eleve'),
})

async function getClientIp(): Promise<string> {
  const hdrs = await headers()
  return (
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
  )
}

export interface JoinCoProducerWaitlistResult {
  success: boolean
  error?: string
  alreadyRegistered?: boolean
}

/**
 * Inscrit une intention de co-production en liste d'attente (session 15.7).
 * Aucun paiement : capture email + montant d'intention, confirmee par email.
 */
export async function joinCoProducerWaitlistAction(
  input: unknown
): Promise<JoinCoProducerWaitlistResult> {
  const parsed = waitlistSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'Donnees invalides' }
  }
  const { email, intentAmount } = parsed.data

  const ip = await getClientIp()
  const limit = await coProduceWaitlistLimiter.check(`co-produce:${ip}`)
  if (!limit.allowed) {
    return {
      success: false,
      error: `Trop de tentatives. Reessayez dans ${limit.retryAfterSeconds}s.`,
    }
  }

  const existing = await prisma.coProducerWaitlistEntry.findUnique({ where: { email } })
  if (existing) {
    return { success: true, alreadyRegistered: true }
  }

  await prisma.coProducerWaitlistEntry.create({
    data: {
      email,
      intentAmount,
      ipHash: hashIp(ip),
    },
  })

  const sent = await sendCoProducerWaitlistEmail(email, intentAmount)
  if (sent) {
    await prisma.coProducerWaitlistEntry.update({
      where: { email },
      data: { confirmationSentAt: new Date() },
    })
  }

  return { success: true }
}
