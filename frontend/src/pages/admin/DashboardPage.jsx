import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Users, UserCheck, UserX, Clock, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader, StatCard } from '@/components/base'
import { dashboardService } from '@/services/dashboardService'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const statusBadge = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

const statusLabel = {
  pending: 'Menunggu',
  approved: 'Disetujui',
  rejected: 'Ditolak',
}

export function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardService.getAdminDashboard()
        setData(res.data)
      } catch {
        toast.error('Gagal memuat data dashboard.')
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={format(new Date(), "EEEE, d MMMM yyyy", { locale: id })}
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Karyawan" value={data?.total_employees} icon={Users} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Karyawan Aktif" value={data?.active_employees} icon={UserCheck} iconBg="bg-green-50 text-primary" />
        <StatCard title="Non-Aktif" value={data?.inactive_employees} icon={UserX} iconBg="bg-red-50 text-destructive" />
        <StatCard title="Cuti Pending" value={data?.monthly_leave?.pending} icon={Clock} iconBg="bg-yellow-50 text-yellow-600" subtitle="Butuh persetujuan" />
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Attendance */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Absensi Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Hadir', key: 'present', color: 'bg-primary' },
              { label: 'Sakit', key: 'sick', color: 'bg-yellow-400' },
              { label: 'Izin', key: 'permit', color: 'bg-blue-400' },
              { label: 'Alpha', key: 'absent', color: 'bg-red-400' },
            ].map(({ label, key, color }) => {
              const count = data?.today_attendance?.[key] ?? 0
              const total = Object.values(data?.today_attendance ?? {}).reduce((a, b) => a + b, 0) || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Monthly Leave */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Cuti Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <p className="text-2xl font-bold text-yellow-600">{data?.monthly_leave?.pending ?? 0}</p>
                <p className="text-xs text-yellow-600 mt-0.5">Pending</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{data?.monthly_leave?.approved ?? 0}</p>
                <p className="text-xs text-primary mt-0.5">Disetujui</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-xl">
                <p className="text-2xl font-bold text-destructive">{data?.monthly_leave?.rejected ?? 0}</p>
                <p className="text-xs text-destructive mt-0.5">Ditolak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Employees */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Karyawan Terbaru</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs h-7" onClick={() => navigate('/admin/employees')}>
              Lihat semua
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.recent_employees?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada karyawan</p>
            )}
            {data?.recent_employees?.map((emp) => (
              <div key={emp.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-primary">
                    {emp.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.position?.name} · {emp.department?.name}</p>
                </div>
                <Badge variant="outline" className="text-xs border-border shrink-0">
                  {emp.nip}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Leaves */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold">Cuti Menunggu Persetujuan</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary text-xs h-7" onClick={() => navigate('/admin/leaves')}>
              Lihat semua
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.pending_leaves?.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Tidak ada cuti pending</p>
            )}
            {data?.pending_leaves?.map((leave) => (
              <div key={leave.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{leave.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{leave.type_label} · {leave.total_days} hari</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[leave.status]}`}>
                  {statusLabel[leave.status]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
