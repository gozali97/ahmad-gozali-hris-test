import { useEffect, useState, useCallback } from 'react'
import { LogIn, LogOut, Clock, Loader2, AlarmClock, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  PageHeader, DataTable, Pagination, StatusBadge,
} from '@/components/base'
import { attendanceService } from '@/services/attendanceService'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const STATUS_LABELS = { present: 'Hadir', sick: 'Sakit', permit: 'Izin', absent: 'Alpha' }

function LiveClock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-foreground tabular-nums">{format(time, 'HH:mm:ss')}</p>
      <p className="text-sm text-muted-foreground mt-1">{format(time, 'EEEE, d MMMM yyyy', { locale: id })}</p>
    </div>
  )
}

export function EmployeeAttendancePage() {
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [attendances, setAttendances] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'))
  const [year] = useState(String(new Date().getFullYear()))
  const [page, setPage] = useState(1)

  const fetchToday = async () => {
    try { const res = await attendanceService.getTodayStatus(); setTodayAttendance(res.data) }
    catch {}
  }

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await attendanceService.getAll({ month, year, page, per_page: 20 })
      setAttendances(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat riwayat absensi.')
    } finally {
      setIsLoading(false)
    }
  }, [month, year, page])

  useEffect(() => { fetchToday() }, [])
  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleAction = async (action) => {
    setActionLoading(true)
    try {
      await attendanceService[action]()
      toast.success(action === 'checkIn' ? 'Check-in berhasil. Semangat bekerja!' : 'Check-out berhasil. Sampai besok!')
      fetchToday()
      fetchHistory()
    } catch (err) {
      toast.error(err.response?.data?.message || `${action === 'checkIn' ? 'Check-in' : 'Check-out'} gagal.`)
    } finally {
      setActionLoading(false)
    }
  }

  const hasCheckedIn = !!todayAttendance?.check_in
  const hasCheckedOut = !!todayAttendance?.check_out

  const columns = [
    {
      key: 'date', label: 'Tanggal', className: 'text-sm font-medium',
      render: (att) => att.date ? format(new Date(att.date), 'EEEE, d MMM yyyy', { locale: id }) : '—',
    },
    { key: 'status', label: 'Status', render: (att) => <StatusBadge status={att.status} label={STATUS_LABELS[att.status]} /> },
    { key: 'check_in', label: 'Jam Masuk', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (att) => att.check_in || '—' },
    { key: 'check_out', label: 'Jam Keluar', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (att) => att.check_out || '—' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Absensi"
        breadcrumbs={[{ label: 'Dashboard', href: '/employee/dashboard' }, { label: 'Absensi' }]}
      />

      {/* Check-in Card */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <LiveClock />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <div className="flex gap-3">
              {!hasCheckedIn && (
                <Button onClick={() => handleAction('checkIn')} disabled={actionLoading} size="lg" className="min-w-32">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
                  Check In
                </Button>
              )}
              {hasCheckedIn && !hasCheckedOut && (
                <Button onClick={() => handleAction('checkOut')} disabled={actionLoading} size="lg" variant="outline" className="min-w-32 border-destructive text-destructive hover:bg-red-50">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogOut className="w-5 h-5 mr-2" />}
                  Check Out
                </Button>
              )}
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Masuk</p>
                <p className="text-xl font-bold text-foreground">{todayAttendance?.check_in || '—'}</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Keluar</p>
                <p className="text-xl font-bold text-foreground">{todayAttendance?.check_out || '—'}</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
              {!hasCheckedIn
                ? <><AlarmClock className="w-4 h-4" />Anda belum absen hari ini</>
                : !hasCheckedOut
                ? <><Clock className="w-4 h-4 text-primary" />Sedang bekerja &mdash; jangan lupa check out</>
                : <><CheckCircle2 className="w-4 h-4 text-primary" />Absensi hari ini selesai</>}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Riwayat Absensi</h3>
          <Select value={month} onValueChange={(v) => { setMonth(v); setPage(1) }}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0')
                const label = format(new Date(2024, i, 1), 'MMMM', { locale: id })
                return <SelectItem key={m} value={m}>{label}</SelectItem>
              })}
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={attendances}
          isLoading={isLoading}
          emptyMessage="Tidak ada data absensi bulan ini"
        />
        <Pagination meta={meta} page={page} onPageChange={setPage} />
      </div>
    </div>
  )
}
