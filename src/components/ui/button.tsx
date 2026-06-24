'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0908] disabled:pointer-events-none disabled:opacity-50 active:translate-y-0 active:scale-[0.97] cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'btn-sheen bg-[linear-gradient(135deg,#8A6A12_0%,#C9A227_32%,#F5D77A_52%,#E8C766_60%,#C9A227_80%)] text-[#1A1206] font-semibold ring-1 ring-inset ring-[#F5D77A]/50 shadow-[0_2px_20px_rgba(201,162,39,0.28)] hover:-translate-y-px hover:brightness-[1.07] hover:shadow-[0_10px_36px_-6px_rgba(201,162,39,0.55)]',
        destructive:
          'btn-sheen bg-[linear-gradient(135deg,#B20710_0%,#E11D2A_55%,#F0414E_100%)] text-white shadow-[0_2px_18px_rgba(225,29,42,0.3)] hover:-translate-y-px hover:shadow-[0_10px_30px_-6px_rgba(225,29,42,0.5)]',
        outline:
          'border border-[#C9A227]/40 text-[#E8C766] hover:-translate-y-px hover:border-[#C9A227]/80 hover:bg-[#C9A227]/10 hover:shadow-[0_8px_24px_-8px_rgba(201,162,39,0.35)]',
        secondary:
          'border border-white/10 bg-white/[0.06] text-white backdrop-blur-sm hover:-translate-y-px hover:border-white/20 hover:bg-white/[0.12]',
        ghost:
          'text-white/70 hover:text-white hover:bg-white/[0.08]',
        link:
          'h-auto p-0 text-[#C9A227] underline-offset-4 hover:text-[#E8C766] hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3.5 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
