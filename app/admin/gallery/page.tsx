import AdminLayout from '@/components/admin/AdminLayout'
import PageHeader from '@/components/admin/PageHeader'
import { Image } from 'lucide-react'

export default function AdminGallery() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Kelola Galeri"
          breadcrumb={[]}
        />

        <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-border p-12 text-center">
          <Image className="w-16 h-16 text-accent-rose mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Halaman Kelola Galeri</h3>
          <p className="text-text-muted">Fitur ini akan segera tersedia</p>
        </div>
      </div>
    </AdminLayout>
  )
}
