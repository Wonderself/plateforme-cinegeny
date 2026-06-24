import Image from 'next/image'
import Link from 'next/link'

const RATIO = 1389 / 768 // intrinsic logo aspect ratio

interface LogoProps {
  /** Rendered height in px (width derived from intrinsic ratio) */
  height?: number
  /** Wrap in a Link. Pass null to render the image only. */
  href?: string | null
  priority?: boolean
  className?: string
}

/**
 * CINEGENY brand logo — the metallic gold infinity film-reel wordmark.
 * Uses the official artwork as-is (black background blends into dark chrome).
 */
export function Logo({ height = 40, href = '/', priority = false, className = '' }: LogoProps) {
  const width = Math.round(height * RATIO)

  const img = (
    <Image
      src="/images/cinegeny-logo.png"
      alt="CINEGENY — Cinema & Creative Studio"
      width={width}
      height={height}
      priority={priority}
      className={`w-auto object-contain select-none transition-[filter,transform] duration-500 ${className}`}
      style={{ height }}
    />
  )

  if (href === null) return img

  return (
    <Link
      href={href}
      aria-label="CINEGENY — Accueil"
      className="group inline-flex items-center shrink-0"
    >
      <span className="transition-transform duration-500 group-hover:scale-[1.03] group-hover:drop-shadow-[0_0_18px_rgba(201,162,39,0.35)]">
        {img}
      </span>
    </Link>
  )
}
