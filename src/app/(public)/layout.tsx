import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-80px)] pb-4">{children}</main>
      <Footer />
    </>
  )
}
