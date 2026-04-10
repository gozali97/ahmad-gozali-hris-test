import { useNavigate } from 'react-router'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function ForbiddenPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Akses Ditolak</h1>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Anda tidak memiliki izin untuk mengakses halaman ini.
          {user?.role === 'employee' && (
            <> Halaman ini hanya dapat diakses oleh <strong>Admin HR</strong>.</>
          )}
        </p>

        <div className="mt-6 p-4 bg-card border border-border rounded-xl text-left text-sm space-y-2">
          <p className="font-medium text-foreground">Hak akses Anda ({user?.role === 'admin' ? 'Admin HR' : 'Karyawan'}):</p>
          {user?.role === 'admin' ? (
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Kelola data karyawan (tambah, edit, hapus)</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Kelola jabatan & departemen</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Lihat & input absensi seluruh karyawan</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Setujui / tolak pengajuan cuti</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Export data ke CSV</li>
            </ul>
          ) : (
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Check-in & check-out absensi harian</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Lihat riwayat absensi pribadi</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Ajukan cuti & lihat statusnya</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-primary rounded-full" />Lihat & update profil sendiri</li>
            </ul>
          )}
        </div>

        <Button className="mt-6" onClick={() => navigate(dashboardPath)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  )
}
