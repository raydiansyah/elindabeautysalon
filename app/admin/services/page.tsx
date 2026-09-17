'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react'

interface Service {
  id: number
  name: string
  description: string
  icon: string
  startingPrice: number
  order: number
  isActive: boolean
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({})

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      setServices(data)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (id?: number) => {
    try {
      const method = id ? 'PUT' : 'POST'
      const url = id ? `/api/services/${id}` : '/api/services'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      setEditingId(null)
      setFormData({})
      fetchServices()
    } catch (error) {
      console.error('Failed to save service:', error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus layanan ini?')) return
    
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      fetchServices()
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Kelola Layanan"
          breadcrumb={[]}
          action={
            <button
              onClick={() => {
                setEditingId(0)
                setFormData({ name: '', description: '', icon: 'scissors', startingPrice: 0, order: services.length + 1, isActive: true })
              }}
              className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent-gold px-4 py-2 text-xs sm:text-sm font-semibold text-elin-ink shadow-md shadow-accent-gold/20 hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Layanan</span>
            </button>
          }
        />

        {loading ? (
          <div className="text-center py-12 text-text-muted">Memuat layanan...</div>
        ) : (
          <div className="bg-surface/60 backdrop-blur-sm rounded-2xl border border-border overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/80 border-b border-border">
                  <tr>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-light">Nama Layanan</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-light">Harga Awal</th>
                    <th className="text-left p-4 font-semibold text-xs uppercase tracking-wider text-text-light">Status</th>
                    <th className="text-right p-4 font-semibold text-xs uppercase tracking-wider text-text-light">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-border hover:bg-surface-light/40 transition-colors">
                      <td className="p-4">
                        {editingId === service.id ? (
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-gold"
                            placeholder="Nama Layanan"
                          />
                        ) : (
                          <div>
                            <div className="font-semibold text-white">{service.name}</div>
                            <div className="text-sm text-text-muted mt-1">{service.description}</div>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === service.id ? (
                          <input
                            type="number"
                            value={formData.startingPrice || 0}
                            onChange={(e) => setFormData({ ...formData, startingPrice: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 bg-background border border-border rounded-xl text-white focus:outline-none focus:border-accent-gold"
                            placeholder="Harga Awal"
                          />
                        ) : (
                          <span className="text-accent-gold font-bold text-base tracking-tight">{formatRupiah(service.startingPrice)}</span>
                        )}
                      </td>
                      <td className="p-4">
                        {editingId === service.id ? (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              formData.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {formData.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{formData.isActive ? 'Aktif' : 'Nonaktif'}</span>
                          </button>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            service.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-text-muted border border-white/10'
                          }`}>
                            {service.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{service.isActive ? 'Aktif' : 'Nonaktif'}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {editingId === service.id ? (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleSave(service.id)} className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" aria-label="Save">
                              <Save className="w-5 h-5" />
                            </button>
                            <button onClick={() => { setEditingId(null); setFormData({}) }} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" aria-label="Cancel">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => { setEditingId(service.id); setFormData(service) }} className="p-2 text-accent-gold hover:bg-accent-gold/15 rounded-lg transition-colors" aria-label="Edit">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(service.id)} className="p-2 text-red-400 hover:bg-red-500/15 rounded-lg transition-colors" aria-label="Delete">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
