import { useEffect, useState, useCallback } from 'react'
import { Plus, CalendarDays, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  PageHeader, DataTable, Pagination, StatusBadge,
  FormDialog, FormField, StatCard,
} from '@/components/base'
import { leaveService } from '@/services/leaveService'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { format, differenceInDays, parseISO } from 'date-fns'
import { id } from 'date-fns/locale'

const EMPTY_FORM = { type: 'annual', start_date: '', end_date: '', reason: '' }

export function EmployeeLeavePage() {
  const { user } = useAuth()
  const [leaves, setLeaves] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formLoading, setFormLoading] = useState(false)
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const fetchLeaves = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await leaveService.getAll({ page, per_page: 10 })
      setLeaves(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat data cuti.')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => { fetchLeaves() }, [fetchLeaves])

  const totalDays = form.start_date && form.end_date
    ? Math.max(0, differenceInDays(parseISO(form.end_date), parseISO(form.start_date)) + 1)
    : 0

  const handleSubmit = async () => {
    if (!form.type || !form.start_date || !form.end_date || !form.reason) {
      toast.error('Semua field wajib diisi.')
      return
    }
    setFormLoading(true)
    try {
      await leaveService.create(form)
      toast.success('Pengajuan cuti berhasil dikirim!')
      setDialogOpen(false)
      setForm(EMPTY_FORM)
      fetchLeaves()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengajukan cuti.')
    } finally {
      setFormLoading(false)
    }
  }

  const columns = [
    { key: 'type_label', label: 'Jenis', className: 'text-sm font-medium' },
    {
      key: 'dates', label: 'Tanggal', className: 'text-sm text-muted-foreground',
      render: (leave) => (
        <>
          {leave.start_date ? format(new Date(leave.start_date), 'd MMM', { locale: id }) : ''} –{' '}
          {leave.end_date ? format(new Date(leave.end_date), 'd MMM yyyy', { locale: id }) : ''}
        </>
      ),
    },
    { key: 'total_days', label: 'Durasi', className: 'hidden sm:table-cell text-sm', render: (leave) => `${leave.total_days} hari` },
    { key: 'status', label: 'Status', render: (leave) => <StatusBadge status={leave.status} label={leave.status_label} /> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengajuan Cuti"
        breadcrumbs={[{ label: 'Dashboard', href: '/employee/dashboard' }, { label: 'Cuti' }]}
      />

      {/* Quota Card + Action */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Sisa Jatah Cuti"
          value={user?.leave_quota ?? 0}
          subtitle="Hari tersisa dari 12 hari/tahun"
          iconBg="bg-primary/10 text-primary"
          icon={CalendarDays}
        />
        <div className="flex items-center justify-end sm:justify-start">
          <Button onClick={() => setDialogOpen(true)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Ajukan Cuti
          </Button>
        </div>
      </div>

      {/* Leave History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Riwayat Cuti</h3>
        <DataTable
          columns={columns}
          data={leaves}
          isLoading={isLoading}
          emptyMessage="Belum ada pengajuan cuti"
          onRowClick={(leave) => { setSelectedLeave(leave); setDetailOpen(true) }}
          skeletonRows={4}
        />
        <Pagination meta={meta} page={page} onPageChange={setPage} />
      </div>

      {/* Submit Leave Dialog */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Ajukan Cuti"
        onSubmit={handleSubmit}
        isLoading={formLoading}
        submitLabel="Kirim Pengajuan"
      >
        <FormField
          label="Jenis Cuti" required type="select"
          value={form.type}
          onValueChange={(v) => setForm(p => ({ ...p, type: v }))}
          options={[
            { value: 'annual', label: 'Cuti Tahunan' },
            { value: 'sick', label: 'Cuti Sakit' },
            { value: 'maternity', label: 'Cuti Melahirkan' },
            { value: 'other', label: 'Lainnya' },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Tanggal Mulai" required type="date"
            value={form.start_date}
            onChange={(e) => setForm(p => ({ ...p, start_date: e.target.value }))}
            min={format(new Date(), 'yyyy-MM-dd')}
          />
          <FormField
            label="Tanggal Selesai" required type="date"
            value={form.end_date}
            onChange={(e) => setForm(p => ({ ...p, end_date: e.target.value }))}
            min={form.start_date || format(new Date(), 'yyyy-MM-dd')}
          />
        </div>
        {totalDays > 0 && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg text-sm">
            <CalendarDays className="w-4 h-4 text-primary shrink-0" />
            <span className="text-primary font-medium">{totalDays} hari cuti</span>
            {form.type === 'annual' && (
              <span className="text-muted-foreground">· Sisa jatah: {(user?.leave_quota ?? 0) - totalDays} hari</span>
            )}
          </div>
        )}
        <FormField
          label="Alasan" required type="textarea"
          placeholder="Ceritakan alasan pengajuan cuti Anda..." rows={3}
          value={form.reason}
          onChange={(e) => setForm(p => ({ ...p, reason: e.target.value }))}
        />
      </FormDialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Cuti</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground">Jenis</p><p className="font-medium">{selectedLeave.type_label}</p></div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selectedLeave.status} label={selectedLeave.status_label} className="mt-0.5" />
                </div>
                <div><p className="text-muted-foreground">Mulai</p><p className="font-medium">{selectedLeave.start_date ? format(new Date(selectedLeave.start_date), 'dd MMMM yyyy', { locale: id }) : ''}</p></div>
                <div><p className="text-muted-foreground">Selesai</p><p className="font-medium">{selectedLeave.end_date ? format(new Date(selectedLeave.end_date), 'dd MMMM yyyy', { locale: id }) : ''}</p></div>
                <div><p className="text-muted-foreground">Total Hari</p><p className="font-medium">{selectedLeave.total_days} hari</p></div>
              </div>
              <div><p className="text-muted-foreground">Alasan</p><p className="p-3 bg-muted rounded-lg mt-0.5">{selectedLeave.reason}</p></div>
              {selectedLeave.admin_notes && (
                <div><p className="text-muted-foreground">Catatan Admin</p><p className="p-3 bg-muted rounded-lg mt-0.5">{selectedLeave.admin_notes}</p></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
