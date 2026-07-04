import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { isInvestorsCookieValid, INVESTORS_COOKIE } from '@/lib/investors-gate'
import { InvestorsContent } from './investors-content'
import { InvestorsGateForm } from './investors-gate-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Espace investisseurs | CINEGENY' }

export default async function InvestorsPage() {
  const cookieStore = await cookies()
  const unlocked = await isInvestorsCookieValid(cookieStore.get(INVESTORS_COOKIE)?.value)

  if (!unlocked) return <InvestorsGateForm />
  return <InvestorsContent />
}
