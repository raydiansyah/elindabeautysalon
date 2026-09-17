'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: number; label: string }
  color?: string
}

export default function StatCard({ icon, label, value, trend, color = 'from-accent-gold/30 to-accent-gold/10' }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent-gold/50 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} border border-white/10 rounded-xl flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.value >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold font-display tracking-tight text-white mb-1">{value}</div>
      <div className="text-text-muted text-xs font-medium uppercase tracking-wider">{label}</div>
    </div>
  )
}
