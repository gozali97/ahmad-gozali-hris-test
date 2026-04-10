import { useEffect, useState, useCallback } from 'react'
import { Plus, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  PageHeader, DataTable, Pagination, StatusBadge,
  FormDialog, FormField,
} from '@/components/base'
import { attendanceService } from '@/services/attendanceService'
import { employeeService } from '@/services/employeeService'
import { exportToCsv, fmtDate } from '@/lib/exportCsv'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const STATUS_LABELS = { present: 'Hadir', sick: 'Sakit', permit: 'Izin', absent: 'Alpha' }

const EMPTY_FORM = {
  user_id: '', date: format(new Date(), 'yyyy-MM-dd'),
  check_in: '08:00', check_out: '', status: 'present', notes: '',
}

export function AttendancesPage() {
  const [attendances, setAttendances] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [recap, setRecap] = useState([])
  const [employees, setEmployees] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  const fetchAttendances = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (dateFrom) params.date_from = dateFrom
      if (dateTo) params.date_to = dateTo
      const res = await attendanceService.getAll(params)
      setAttendances(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat absensi.')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, dateFrom, dateTo])

  const fetchRecap = async () => {
    try { const res = await attendanceService.getRecap(); setRecap(res.data) }
    catch { toast.error('Gagal memuat rekap.') }
  }

  useEffect(() => {
    fetchAttendances()
    employeeService.getAll({ per_page: 100 }).then(r => setEmployees(r.data)).catch(() => {})
  }, [fetchAttendances])

  const handleSubmit = async () => {
    if (!form.user_id || !form.date) { toast.error('Karyawan dan tanggal wajib diisi.'); return }
    setFormLoading(true)
    try {
      await attendanceService.create(form)
      toast.success('Absensi berhasil disimpan.')
      setDialogOpen(false)
      fetchAttendances()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleExportList = async () => {
    setExportLoading(true)
    try {
      const params = { per_page: 1000 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (dateFrom) params.date_from = dateFrom
      if (dateTo) params.date_to = dateTo
      const res = await attendanceService.getAll(params)
      const data = res.data
      const headers = ['Karyawan', 'NIP', 'Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status', 'Keterangan']
      const rows = data.map((a) => [
        a.user?.name ?? '-', a.user?.nip ?? '-', fmtDate(a.date),
        a.check_in ?? '-', a.check_out ?? '-', STATUS_LABELS[a.status] ?? a.status, a.notes ?? '-',
      ])
      exportToCsv(`absensi_${new Date().toISOString().slice(0, 10)}`, headers, rows)
      toast.success(`${data.length} record absensi berhasil diekspor.`)
    } catch {
      toast.error('Gagal mengekspor data absensi.')
    } finally {
      setExportLoading(false)
    }
  }

  const handleExportRecap = () => {
    if (recap.length === 0) { toast.error('Tidak ada data rekap untuk diekspor.'); return }
    const headers = ['NIP', 'Nama Karyawan', 'Hadir', 'Sakit', 'Izin', 'Alpha', 'Total']
    const rows = recap.map((r) => [r.employee.nip, r.employee.name, r.present, r.sick, r.permit, r.absent, r.total])
    exportToCsv(`rekap_absensi_${new Date().toISOString().slice(0, 7)}`, headers, rows)
    toast.success('Rekap absensi berhasil diekspor.')
  }

  const listColumns = [
    {
      key: 'user', label: 'Karyawan',
      render: (att) => (
        <div>
          <p className="text-sm font-medium">{att.user?.name}</p>
          <p className="text-xs text-muted-foreground">{att.user?.nip}</p>
        </div>
      ),
    },
    {
      key: 'date', label: 'Tanggal', className: 'text-sm',
      render: (att) => att.date ? format(new Date(att.date), 'dd MMM yyyy', { locale: id }) : '—',
    },
    { key: 'check_in', label: 'Check In', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (att) => att.check_in || '—' },
    { key: 'check_out', label: 'Check Out', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (att) => att.check_out || '—' },
    { key: 'status', label: 'Status', render: (att) => <StatusBadge status={att.status} label={STATUS_LABELS[att.status]} /> },
  ]

  const recapColumns = [
    {
      key: 'employee', label: 'Karyawan',
      render: (r) => (
        <div>
          <p className="text-sm font-medium">{r.employee.name}</p>
          <p className="text-xs text-muted-foreground">{r.employee.nip}</p>
        </div>
      ),
    },
    { key: 'present', label: 'Hadir', className: 'text-center text-sm font-medium text-primary' },
    { key: 'sick', label: 'Sakit', className: 'text-center text-sm text-yellow-600' },
    { key: 'permit', label: 'Izin', className: 'text-center text-sm text-blue-600' },
    { key: 'absent', label: 'Alpha', className: 'text-center text-sm text-destructive' },
    { key: 'total', label: 'Total', className: 'text-center text-sm font-medium' },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Absensi"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Absensi' }]}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Input Absensi Manual
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === 'recap') fetchRecap() }}>
        <TabsList className="border border-border bg-muted/50">
          <TabsTrigger value="list">Daftar Absensi</TabsTrigger>
          <TabsTrigger value="recap">Rekap Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-3 mt-4">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="present">Hadir</SelectItem>
                  <SelectItem value="sick">Sakit</SelectItem>
                  <SelectItem value="permit">Izin</SelectItem>
                  <SelectItem value="absent">Alpha</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="w-40" placeholder="Dari" />
              <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="w-40" placeholder="Sampai" />
            </div>
            <Button variant="outline" size="sm" onClick={handleExportList} disabled={exportLoading}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              {exportLoading ? 'Mengekspor...' : 'Export CSV'}
            </Button>
          </div>

          <DataTable columns={listColumns} data={attendances} isLoading={isLoading} emptyMessage="Belum ada data absensi" />
          <Pagination meta={meta} page={page} onPageChange={setPage} />
        </TabsContent>

        <TabsContent value="recap" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Rekap bulan berjalan</p>
            <Button variant="outline" size="sm" onClick={handleExportRecap}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
          </div>
          <DataTable columns={recapColumns} data={recap} emptyMessage="Tidak ada data rekap" />
        </TabsContent>
      </Tabs>

      {/* Manual Input Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Input Absensi Manual"
        onSubmit={handleSubmit}
        isLoading={formLoading}
      >
        <FormField
          label="Karyawan" required
          type="select"
          placeholder="Pilih karyawan"
          value={form.user_id}
          onValueChange={(v) => setForm(p => ({ ...p, user_id: v }))}
          options={employees.map(e => ({ value: e.id, label: `${e.name} — ${e.nip}` }))}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Tanggal" required type="date"
            value={form.date}
            onChange={(e) => setForm(p => ({ ...p, date: e.target.value }))}
          />
          <FormField
            label="Status" required type="select"
            value={form.status}
            onValueChange={(v) => setForm(p => ({ ...p, status: v }))}
            options={[
              { value: 'present', label: 'Hadir' },
              { value: 'sick', label: 'Sakit' },
              { value: 'permit', label: 'Izin' },
              { value: 'absent', label: 'Alpha' },
            ]}
          />
          <FormField
            label="Jam Masuk" type="time"
            value={form.check_in}
            onChange={(e) => setForm(p => ({ ...p, check_in: e.target.value }))}
          />
          <FormField
            label="Jam Keluar" type="time"
            value={form.check_out}
            onChange={(e) => setForm(p => ({ ...p, check_out: e.target.value }))}
          />
        </div>
        <FormField
          label="Keterangan" type="textarea"
          placeholder="Keterangan tambahan..." rows={2}
          value={form.notes}
          onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
        />
      </FormDialog>
    </div>
  )
}
