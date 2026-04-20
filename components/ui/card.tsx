import * as React from 'react'

import { cn } from '@/lib/utils'

interface CardProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'elevated' | 'gradient' | 'glass' | 'stat' | 'panel'
  hover?: boolean
}

function Card({ className, variant = 'default', hover = true, ...props }: CardProps) {
  const variants = {
    default: 'bg-card/95 backdrop-blur-sm border border-border/40 shadow-elevation-sm transition-premium',
    elevated: 'bg-card/98 backdrop-blur-md border border-border/30 shadow-elevation-md transition-premium hover:shadow-elevation-lg hover:border-primary/20',
    gradient: 'bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-md border border-border/30 shadow-elevation-md transition-premium hover:shadow-elevation-lg',
    glass: 'bg-background/40 backdrop-blur-xl border border-border/20 shadow-elevation-sm transition-premium hover:shadow-elevation-md',
    stat: 'bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border border-primary/10 shadow-elevation-sm hover:shadow-elevation-md hover:border-primary/20 transition-premium',
    panel: 'bg-card/95 backdrop-blur-sm border border-border/30 shadow-elevation-md transition-premium hover:shadow-elevation-lg',
  }

  return (
    <div
      data-slot="card"
      className={cn(
        'text-card-foreground flex flex-col gap-6 rounded-2xl py-7 px-6 transition-all duration-300',
        variants[variant],
        hover && 'hover:scale-[1.01]',
        className,
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode
  gradient?: boolean
  iconBg?: 'primary' | 'accent' | 'success' | 'muted'
}

function CardHeader({ className, icon, gradient = false, iconBg = 'primary', ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header -mx-6 -mt-7 px-6 pt-6 pb-4 rounded-t-2xl transition-premium',
        gradient && 'bg-gradient-to-r from-primary/8 via-transparent to-accent/5 border-b border-border/20',
        !gradient && 'border-b border-border/10',
        'grid auto-rows-min grid-rows-[auto_auto] items-start gap-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        className,
      )}
      {...props}
    >
      {icon && (
        <div className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-premium',
          iconBg === 'primary' && 'bg-primary/15 border-primary/20 text-primary',
          iconBg === 'accent' && 'bg-accent/15 border-accent/20 text-accent',
          iconBg === 'success' && 'bg-green-500/15 border-green-500/20 text-green-600 dark:text-green-400',
          iconBg === 'muted' && 'bg-muted/40 border-border/20 text-muted-foreground',
        )}>
          {icon}
        </div>
      )}
      {props.children}
    </div>
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('heading-md text-foreground', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('body-sm text-muted-foreground mt-1', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
