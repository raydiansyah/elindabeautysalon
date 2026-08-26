'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; label: string }
  color?: string
}

export default function StatCard({ icon, label, value, trend, color = 'from-primary to-primary-light' }: StatCardProps) {
  return (
    <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-text-muted text-sm">{label}</div>
    </div>
  )
}
