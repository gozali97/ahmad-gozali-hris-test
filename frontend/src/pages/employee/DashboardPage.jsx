import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  ClipboardCheck, CalendarDays, Clock,
  CheckCircle2, Loader2, LogIn, LogOut, User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, StatCard } from '@/components/base'
import { dashboardService } from '@/services/dashboardService'
import { attendanceService } from '@/services/attendanceService'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export function EmployeeDashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkInLoading, setCheckInLoading] = useState(false)
  const navigate = useNavigate()

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getEmployeeDashboard()
      setData(res.data)
    } catch {
      toast.error('Gagal memuat data dashboard.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])

  const handleAction = async (action) => {
    setCheckInLoading(true)
    try {
      await attendanceService[action]()
      toast.success(action === 'checkIn' ? 'Check-in berhasil!' : 'Check-out berhasil!')
      fetchDashboard()
    } catch (err) {
      toast.error(err.response?.data?.message || `${action === 'checkIn' ? 'Check-in' : 'Check-out'} gagal.`)
    } finally {
      setCheckInLoading(false)
    }
  }

  const attendance = data?.today_attendance
  const hasCheckedIn = !!attendance?.check_in
  const hasCheckedOut = !!attendance?.check_out

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-primary rounded-xl p-5 text-white flex items-center gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs opacity-70">
            {format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
          </p>
          <h2 className="text-lg font-bold mt-0.5 truncate">Selamat datang, {user?.name?.split(' ')[0]}</h2>
          <p className="text-xs opacity-70 mt-0.5">{user?.position?.name} · {user?.department?.name}</p>
        </div>
      </div>

      {/* Check-in / Check-out */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Absensi Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Check In</p>
                  <p className="text-lg font-bold text-foreground">{attendance?.check_in ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check Out</p>
                  <p className="text-lg font-bold text-foreground">{attendance?.check_out ?? '—'}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {!hasCheckedIn
                  ? 'Anda belum melakukan absensi hari ini'
                  : hasCheckedOut
                  ? <span className="flex items-center gap-1 text-primary"><CheckCircle2 className="w-3.5 h-3.5" />Absensi selesai</span>
                  : 'Sedang bekerja — jangan lupa check out'}
              </p>
            </div>
            <div className="flex gap-2">
              {!hasCheckedIn && (
                <Button onClick={() => handleAction('checkIn')} disabled={checkInLoading} className="bg-primary hover:bg-primary/90">
                  {checkInLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 mr-1.5" />}
                  Check In
                </Button>
              )}
              {hasCheckedIn && !hasCheckedOut && (
                <Button onClick={() => handleAction('checkOut')} disabled={checkInLoading} variant="outline" className="border-destructive text-destructive hover:bg-red-50">
                  {checkInLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 mr-1.5" />}
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Hadir bulan ini"
          value={data?.monthly_attendance_count ?? 0}
          icon={ClipboardCheck}
          iconBg="bg-green-50 text-primary"
        />
        <StatCard
          title="Sisa jatah cuti"
          value={data?.leave_quota_remaining ?? 0}
          icon={CalendarDays}
          iconBg="bg-blue-50 text-blue-600"
        />
        <div className="rounded-lg border border-border bg-card shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              data?.latest_leave?.status === 'approved' ? 'bg-green-50' :
              data?.latest_leave?.status === 'rejected' ? 'bg-red-50' : 'bg-yellow-50'
            }`}>
              <Clock className={`w-5 h-5 ${
                data?.latest_leave?.status === 'approved' ? 'text-primary' :
                data?.latest_leave?.status === 'rejected' ? 'text-destructive' : 'text-yellow-600'
              }`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {data?.latest_leave?.status_label ?? 'Belum ada'}
              </p>
              <p className="text-xs text-muted-foreground">Status cuti terakhir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12 border-border" onClick={() => navigate('/employee/attendance')}>
          <ClipboardCheck className="w-4 h-4 mr-2" />
          Riwayat Absensi
        </Button>
        <Button variant="outline" className="h-12 border-border" onClick={() => navigate('/employee/leave')}>
          <CalendarDays className="w-4 h-4 mr-2" />
          Ajukan Cuti
        </Button>
      </div>
    </div>
  )
}
