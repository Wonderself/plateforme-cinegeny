import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { listFilmsForCreditsAction, getFilmCuratedCreditsAction } from '@/app/actions/credits-admin'
import { GeneriqueManager } from './generique-manager'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Générique — Admin CINEGENY' }

export default async function AdminGeneriquePage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/dashboard')

  const films = await listFilmsForCreditsAction()
  const initialCredits = films[0] ? await getFilmCuratedCreditsAction(films[0].id) : []

  return (
    <div className="max-w-3xl">
      <GeneriqueManager films={films} initialCredits={initialCredits} />
    </div>
  )
}
