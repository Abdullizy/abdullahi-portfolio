import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_var(--glow)] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        outline: 'border-2 border-primary bg-transparent text-foreground',
        secondary: 'border border-border bg-card text-foreground',
        onAccent: 'bg-primary-foreground text-primary',
        outlineOnAccent: 'border-2 border-primary-foreground bg-transparent text-primary-foreground',
        ghost: 'bg-transparent text-foreground hover:shadow-none',
      },
      size: {
        default: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-base sm:px-9 sm:text-lg',
        icon: 'size-11',
      },
      shape: {
        square: 'rounded-sm',
        pill: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'square',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, shape, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, shape, className }))} {...props} />
}

export { Button, buttonVariants }
