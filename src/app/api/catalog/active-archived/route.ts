import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/catalog/active-archived
 * Public — returns the slugs of archived (legacy) films that have been
 * re-activated by an admin and should appear in the public live catalog.
 */
export async function GET() {
  try {
    const rows = await prisma.catalogActivation.findMany({
      where: { active: true },
      select: { slug: true },
    })
    return NextResponse.json({ slugs: rows.map((r) => r.slug) })
  } catch {
    // Fail soft — an unavailable DB should never break the public catalog.
    return NextResponse.json({ slugs: [] })
  }
}
