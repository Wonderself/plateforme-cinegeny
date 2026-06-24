'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Sun,
  CreditCard,
  FileText,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Film,
  Clapperboard,
  DollarSign,
  MessageSquare,
  Star,
  Briefcase,
  Tv,
  Play,
  Radio,
} from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'
import { AnimatePresence, MotionDiv } from '@/components/ui/motion'
import { NotificationBell } from '@/components/layout/notification-bell'
import { SearchOverlay } from '@/components/search-overlay'
import { Logo } from '@/components/layout/logo'
import { LocaleSwitcher } from '@/components/layout/locale-switcher'

/* ── Dropdown item component ── */
function NavDropdown({
  label,
  items,
  isActive,
  badge,
}: {
  label: string
  items: { href: string; label: string; icon: React.ElementType; desc?: string; badge?: string }[]
  isActive: boolean
  badge?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          'flex items-center gap-1 text-[12.5px] tracking-wide px-3 py-1.5 rounded-md transition-all duration-300',
          isActive ? 'text-white' : 'text-white/55 hover:text-white'
        )}
      >
        {label}
        {badge && (
          <span className="ml-0.5 rounded bg-[#C9A227]/15 px-1 py-0 text-[8px] font-bold uppercase tracking-wider text-[#E8C766] ring-1 ring-[#C9A227]/30">
            {badge}
          </span>
        )}
        <ChevronDown className={cn('h-3 w-3 opacity-50 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            onMouseLeave={() => setOpen(false)}
            className="absolute top-full left-0 mt-2 min-w-[290px] overflow-hidden rounded-xl border border-white/10 bg-[#0C0B09]/98 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85)] backdrop-blur-2xl z-50"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
            <div className="p-1.5">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group/item flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all hover:bg-white/[0.06]"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/40 transition-colors group-hover/item:border-[#C9A227]/30 group-hover/item:text-[#C9A227]">
                    <item.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-white/85 group-hover/item:text-white">
                      {item.label}
                      {item.badge && (
                        <span className="rounded bg-[#C9A227]/15 px-1 text-[8px] font-bold uppercase tracking-wider text-[#E8C766]">
                          {item.badge}
                        </span>
                      )}
                    </span>
                    {item.desc && (
                      <span className="mt-0.5 block truncate text-[11px] text-white/35">{item.desc}</span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NetflixHeader() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  const isAdmin = session?.user?.role === 'ADMIN'
  const userName = session?.user?.name || session?.user?.email || ''

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ──────────────────────────────────────────────────────────
     Navigation — 4 univers clairs : Regarder · Participer · Investir
     (+ Films en accès direct, Communauté en lien direct).
     Chaque intention utilisateur a UNE place évidente.
     ────────────────────────────────────────────────────────── */
  const watchItems = [
    { href: '/watch', label: t('streaming'), icon: Play, desc: 'Tous les films en streaming' },
    { href: '/tv', label: t('tv'), icon: Tv, desc: 'Chaînes & émissions' },
    { href: '/tv/live', label: t('live_tv'), icon: Radio, desc: 'Diffusion en direct' },
    { href: '/tv/replay', label: t('replay'), icon: Play, desc: 'Rediffusions à la demande' },
  ]

  const participateItems = [
    { href: '/create', label: t('start_film'), icon: Clapperboard, desc: 'Lancez votre propre projet' },
    { href: '/act', label: t('act_in_film'), icon: Star, desc: 'Jouez dans un film IA' },
    { href: '/work', label: t('missions'), icon: Briefcase, desc: 'Micro-tâches rémunérées' },
    { href: '/produce', label: t('produce'), icon: Film, desc: 'Co-produisez la slate' },
    { href: '/trailer-studio', label: t('trailer_studio'), icon: Sparkles, desc: 'Créez une bande-annonce', badge: 'NEW' },
    { href: '/community/scenarios/new', label: t('submit_scenario'), icon: FileText, desc: 'Proposez votre scénario' },
  ]

  const investItems = [
    { href: '/invest', label: t('coproduce'), icon: DollarSign, desc: 'Financez un film, gagnez des parts' },
    { href: '/investors', label: t('investor_space'), icon: TrendingUp, desc: 'Tokenisation & opportunités', badge: 'OPEN' },
  ]

  const mobileSections = [
    {
      title: t('watch'),
      links: [
        { href: '/films', label: t('films'), icon: Film },
        ...watchItems.map(({ href, label, icon }) => ({ href, label, icon })),
      ],
    },
    { title: t('participate'), links: participateItems.map(({ href, label, icon }) => ({ href, label, icon })) },
    { title: t('invest'), links: investItems.map(({ href, label, icon }) => ({ href, label, icon })) },
    { title: t('community'), links: [{ href: '/community', label: t('community'), icon: MessageSquare }] },
  ]

  const isWatchActive =
    pathname.startsWith('/watch') || pathname.startsWith('/tv') || pathname.startsWith('/streaming')
  const isParticipateActive =
    pathname.startsWith('/create') || pathname.startsWith('/act') || pathname.startsWith('/work') ||
    pathname.startsWith('/produce') || pathname.startsWith('/trailer-studio') || pathname.startsWith('/community/scenarios')
  const isInvestActive = pathname.startsWith('/invest')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-[0_1px_12px_rgba(0,0,0,0.5)]'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
      )}
    >
      <div className="flex h-14 md:h-[56px] items-center justify-between px-5 md:px-10 lg:px-16 mt-1">
        {/* Left: Logo */}
        <Logo height={46} priority />

        {/* Center: Desktop nav — 5 repères clairs */}
        <nav className="hidden lg:flex items-center gap-0.5">
          <Link
            href="/films"
            className={cn(
              'text-[12.5px] tracking-wide px-3 py-1.5 rounded-md transition-all duration-300',
              pathname.startsWith('/films') ? 'text-white' : 'text-white/55 hover:text-white'
            )}
          >
            {t('films')}
          </Link>
          <NavDropdown label={t('watch')} items={watchItems} isActive={isWatchActive} />
          <NavDropdown label={t('participate')} items={participateItems} isActive={isParticipateActive} />
          <NavDropdown label={t('invest')} items={investItems} isActive={isInvestActive} badge="OPEN" />
          <Link
            href="/community"
            className={cn(
              'text-[12.5px] tracking-wide px-3 py-1.5 rounded-md transition-all duration-300',
              pathname.startsWith('/community') ? 'text-white' : 'text-white/55 hover:text-white'
            )}
          >
            {t('community')}
          </Link>
        </nav>

        {/* Right: Search + Lang + Profile + Hamburger */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <SearchOverlay />
          <LocaleSwitcher />

          {session?.user ? (
            <div className="hidden lg:flex items-center gap-1.5">
              <NotificationBell />
              <Link href="/lumens" className="flex items-center gap-1.5 px-2 py-1 rounded text-sm text-white/50 hover:text-[#C9A227] transition-all" aria-label="My Lumens">
                <Sun className="h-3.5 w-3.5 text-[#C9A227]" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded px-1 py-1 hover:bg-white/5 transition-all outline-none" aria-label="Profile menu">
                    <Avatar className="h-7 w-7 rounded">
                      {session.user.image && <AvatarImage src={session.user.image} alt={userName} />}
                      <AvatarFallback className="text-[10px] rounded bg-[#C9A227]/20 text-[#C9A227]">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-3 w-3 text-white/30" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{userName}</p>
                      <p className="text-xs text-white/40">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <LayoutDashboard className="h-4 w-4" /> {t('dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <User className="h-4 w-4" /> {t('profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/payments" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <CreditCard className="h-4 w-4" /> {t('payments')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lumens" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                      <Sun className="h-4 w-4" /> {t('lumens')}
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as { role?: string }).role === 'SCREENWRITER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/screenplays" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                        <FileText className="h-4 w-4" /> Screenplays
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white">
                          <Settings className="h-4 w-4" /> Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> {t('sign_out')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="text-[12px] font-medium text-white/60 hover:text-white px-4 py-2 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all duration-300"
              >
                {t('sign_in')}
              </Link>
              <Link
                href="/register"
                className="relative text-[12px] font-bold px-5 py-2 rounded-lg text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(201,162,39,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #C9A227 0%, #B20710 100%)' }}
              >
                <span className="relative z-10">{t('sign_up')}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700" />
              </Link>
            </div>
          )}

          {/* Hamburger — visible on mobile + tablet (below lg) */}
          <button
            className="lg:hidden text-white/60 hover:text-white p-1.5 rounded transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <MotionDiv
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-[#0A0A0A]/98 backdrop-blur-xl overflow-hidden border-t border-white/5"
          >
            <div className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              {mobileSections.map((section) => (
                <div key={section.title} className="space-y-0.5">
                  <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {section.title}
                  </p>
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                        pathname.startsWith(link.href) && link.href !== '/'
                          ? 'text-[#C9A227] bg-[#C9A227]/10'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <link.icon className="h-4 w-4 text-white/40" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}

              <div className="h-px bg-white/5 my-2" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <LayoutDashboard className="h-4 w-4" /> {t('dashboard')}
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <User className="h-4 w-4" /> {t('profile')}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                      <Settings className="h-4 w-4" /> {t('admin')}
                    </Link>
                  )}
                  <button
                    onClick={async () => { await signOut({ redirect: false }); window.location.href = '/' }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg w-full transition-all"
                  >
                    <LogOut className="h-4 w-4" /> {t('sign_out')}
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm text-white/60 border border-white/10 rounded-full py-2.5 hover:bg-white/5 transition-all">
                    {t('sign_in')}
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-sm font-semibold text-white rounded-full py-2.5" style={{ background: 'linear-gradient(135deg, #C9A227, #B20710)' }}>
                    {t('sign_up')}
                  </Link>
                </div>
              )}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </header>
  )
}
