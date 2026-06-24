import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { CatalogManager } from '@/components/admin/catalog-manager'

export const metadata: Metadata = { title: 'Admin — Catalogue (Actif / Archivé)' }

export default async function AdminFilmsCatalogPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  return <CatalogManager />
}
