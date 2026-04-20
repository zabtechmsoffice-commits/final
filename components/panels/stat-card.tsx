'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode
  label: string
  value: string | number
  change?: {
    value: number
    type: 'positive' | 'negative'
    label: string
  }
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive'
  sublabel?: string
}

const colorMap = {
  primary: 'bg-primary/15 border-primary/20 text-primary',
  accent: 'bg-accent/15 border-accent/20 text-accent',
  success: 'bg-green-500/15 border-green-500/20 text-green-600 dark:text-green-400',
  warning: 'bg-yellow-500/15 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  destructive: 'bg-destructive/15 border-destructive/20 text-destructive',
}

const colorMapBg = {
  primary: 'from-primary/8 via-card to-transparent',
  accent: 'from-accent/8 via-card to-transparent',
  success: 'from-green-500/8 via-card to-transparent',
  warning: 'from-yellow-500/8 via-card to-transparent',
  destructive: 'from-destructive/8 via-card to-transparent',
}

const colorMapBorder = {
  primary: 'border-primary/15',
  accent: 'border-accent/15',
  success: 'border-green-500/15',
  warning: 'border-yellow-500/15',
  destructive: 'border-destructive/15',
}

export function StatCard({
  icon,
  label,
  value,
  change,
  color = 'primary',
  sublabel,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        'group rounded-2xl border shadow-elevation-sm transition-premium',
        `${colorMapBorder[color]} bg-gradient-to-br ${colorMapBg[color]}`,
        'hover:shadow-elevation-md hover:border-current/30',
        className
      )}
      {...props}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
              {change && (
                <span className={cn('text-xs font-semibold flex items-center gap-1', change.type === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-destructive')}>
                  {change.type === 'positive' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {change.value}% {change.label}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className={cn('rounded-xl border p-3 transition-premium group-hover:shadow-md group-hover:scale-105', colorMap[color])}>
              {icon}
            </div>
          )}
        </div>
        {sublabel && (
          <div className={cn('pt-2 border-t', `border-current/10`)}>
            <p className="text-xs text-muted-foreground font-medium">{sublabel}</p>
          </div>
        )}
      </div>
    </div>
  )
}
