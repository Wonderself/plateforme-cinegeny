import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/catalog-activations — admin-only
 * Full activation map (every toggled archived film + its state).
 */
export async function GET() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const rows = await prisma.catalogActivation.findMany({
    select: { slug: true, active: true },
  })
  return NextResponse.json({ activations: rows })
}

/**
 * POST /api/admin/catalog-activations — admin-only
 * Body: { slug: string, active: boolean }
 * Upserts the activation state of a single archived film.
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { slug?: unknown; active?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { slug, active } = body
  if (typeof slug !== 'string' || !slug.trim() || typeof active !== 'boolean') {
    return NextResponse.json(
      { error: 'Expected { slug: string, active: boolean }' },
      { status: 400 }
    )
  }

  await prisma.catalogActivation.upsert({
    where: { slug },
    update: { active },
    create: { slug, active },
  })

  return NextResponse.json({ slug, active })
}
