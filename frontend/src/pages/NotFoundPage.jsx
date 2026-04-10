import { useNavigate } from 'react-router'
import { FileSearch, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border">
          <FileSearch className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-1">404</p>
        <h1 className="text-2xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <div className="flex gap-2 justify-center mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          {isAuthenticated && (
            <Button onClick={() => navigate(dashboardPath)}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
