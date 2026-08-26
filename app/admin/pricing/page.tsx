import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import { DollarSign } from 'lucide-react'

export default function AdminPricing() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Kelola Harga"
          breadcrumb={[]}
        />

        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-border p-12 text-center">
          <DollarSign className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Halaman Kelola Harga</h3>
          <p className="text-text-muted">Fitur ini akan segera tersedia</p>
        </div>
      </div>
    </AdminLayout>
  )
}
