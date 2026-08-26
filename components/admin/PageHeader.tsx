'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  breadcrumb: { label: string; href?: string }[]
  action?: ReactNode
}

export default function PageHeader({ title, breadcrumb, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-2" aria-label="Breadcrumb">
          <a href="/admin/dashboard" className="hover:text-primary transition-colors">
            Admin
          </a>
          {breadcrumb.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <span className="text-border">/</span>
              {item.href ? (
                <a href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      </div>

      {/* Action Button */}
      {action && <div>{action}</div>}
    </div>
  )
}
