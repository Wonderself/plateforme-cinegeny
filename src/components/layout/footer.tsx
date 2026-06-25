'use client'

import Link from 'next/link'
import {
  Film, Tv, Play, Radio, Clapperboard, Star, Briefcase, Sparkles, FileText,
  MessageSquare, Trophy, Users, DollarSign, TrendingUp, Tag, MapPin, Code2, Info, GraduationCap,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/layout/logo'

/**
 * Footer — mirrors the header information architecture so users keep a
 * single, consistent mental model: Regarder · Participer · Communauté · Studio.
 */
export function Footer() {
  const t = useTranslations('footer')
  const n = useTranslations('nav')

  const columns: {
    title: string
    links: { href: string; label: string; icon: React.ElementType }[]
  }[] = [
    {
      title: n('watch'),
      links: [
        { href: '/films', label: n('films'), icon: Film },
        { href: '/watch', label: n('streaming'), icon: Play },
        { href: '/tv', label: n('tv'), icon: Tv },
        { href: '/tv/live', label: n('live_tv'), icon: Radio },
        { href: '/tv/replay', label: n('replay'), icon: Play },
      ],
    },
    {
      title: n('participate'),
      links: [
        { href: '/create', label: n('start_film'), icon: Clapperboard },
        { href: '/act', label: n('act_in_film'), icon: Star },
        { href: '/work', label: n('missions'), icon: Briefcase },
        { href: '/produce', label: n('produce'), icon: Film },
        { href: '/trailer-studio', label: n('trailer_studio'), icon: Sparkles },
        { href: '/academy', label: n('academy'), icon: GraduationCap },
        { href: '/community/scenarios/new', label: n('submit_scenario'), icon: FileText },
      ],
    },
    {
      title: n('community'),
      links: [
        { href: '/community', label: n('community'), icon: MessageSquare },
        { href: '/leaderboard', label: n('leaderboard'), icon: Trophy },
        { href: '/actors', label: n('actors'), icon: Users },
        { href: '/invest', label: n('coproduce'), icon: DollarSign },
        { href: '/investors', label: n('investor_space'), icon: TrendingUp },
      ],
    },
    {
      title: 'CINEGENY',
      links: [
        { href: '/about', label: n('about'), icon: Info },
        { href: '/pricing', label: n('pricing'), icon: Tag },
        { href: '/roadmap', label: n('roadmap'), icon: MapPin },
        { href: '/developers', label: n('developers'), icon: Code2 },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-white/[0.04] bg-[#060606] pt-20 md:pt-24 pb-12 md:pb-16 mt-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-8 md:px-16 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-12 lg:gap-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4 space-y-5">
            <Logo height={52} />
            <p className="text-[13px] text-white/30 leading-[1.8] max-w-sm">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Paris</span>
              <div className="h-1 w-1 rounded-full bg-[#C9A227]/30" />
              <span className="text-[10px] text-white/15 uppercase tracking-[0.2em] font-medium">Jerusalem</span>
            </div>
          </div>

          {/* Link columns — one per universe */}
          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-2 space-y-5">
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{col.title}</h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-[13px] text-white/25 transition-colors hover:text-[#C9A227]"
                    >
                      <link.icon className="h-3.5 w-3.5 opacity-40 transition-opacity group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-10 border-t border-white/[0.04] flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] text-white/15">
            &copy; {new Date().getFullYear()} {t('copyright')}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/legal/terms" className="text-[11px] text-white/20 transition-colors hover:text-white/50">{t('link_terms')}</Link>
            <span className="text-[10px] text-white/10">&middot;</span>
            <Link href="/legal/privacy" className="text-[11px] text-white/20 transition-colors hover:text-white/50">{t('link_privacy')}</Link>
            <span className="text-[10px] text-white/10">&middot;</span>
            <Link href="/legal/cookies" className="text-[11px] text-white/20 transition-colors hover:text-white/50">{t('link_cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
