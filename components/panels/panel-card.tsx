'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

interface PanelCardProps extends React.ComponentProps<'div'> {
  icon?: React.ReactNode
  title: string
  description?: string
  variant?: 'elevated' | 'gradient' | 'glass' | 'default'
  iconBg?: 'primary' | 'accent' | 'success' | 'muted'
  action?: React.ReactNode
  children?: React.ReactNode
}

export function PanelCard({
  icon,
  title,
  description,
  variant = 'elevated',
  iconBg = 'primary',
  action,
  children,
  className,
  ...props
}: PanelCardProps) {
  return (
    <Card 
      variant={variant} 
      className={cn('animate-slide-in-up transition-premium', className)} 
      {...props}
    >
      <CardHeader icon={icon} iconBg={iconBg} gradient={true}>
        <div className="flex items-start justify-between w-full gap-4">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
