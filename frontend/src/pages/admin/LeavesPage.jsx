import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  PageHeader, DataTable, Pagination, StatusBadge, FormField,
} from '@/components/base'
import { leaveService } from '@/services/leaveService'
import { exportToCsv, fmtDate } from '@/lib/exportCsv'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { CheckCircle2, XCircle, Loader2, Clock, Download } from 'lucide-react'

export function LeavesPage() {
  const [leaves, setLeaves] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [detailItem, setDetailItem] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const fetchLeaves = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 15 }
      if (activeTab === 'pending') params.status = 'pending'
      else if (statusFilter !== 'all') params.status = statusFilter
      const res = await leaveService.getAll(params)
      setLeaves(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat data cuti.')
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, activeTab])

  useEffect(() => { fetchLeaves() }, [fetchLeaves])

  const openDetail = (leave) => { setDetailItem(leave); setAdminNotes(''); setDialogOpen(true) }

  const handleAction = async (action) => {
    setActionLoading(true)
    try {
      await leaveService[action](detailItem.id, { admin_notes: adminNotes })
      toast.success(action === 'approve' ? 'Cuti berhasil disetujui.' : 'Cuti berhasil ditolak.')
      setDialogOpen(false)
      fetchLeaves()
    } catch (err) {
      toast.error(err.response?.data?.message || `Gagal ${action === 'approve' ? 'menyetujui' : 'menolak'} cuti.`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const params = { per_page: 1000 }
      if (activeTab === 'pending') params.status = 'pending'
      else if (statusFilter !== 'all') params.status = statusFilter
      const res = await leaveService.getAll(params)
      const data = res.data
      const headers = ['Karyawan', 'NIP', 'Jenis Cuti', 'Tgl. Mulai', 'Tgl. Selesai', 'Total Hari', 'Alasan', 'Status', 'Catatan Admin', 'Diajukan']
      const rows = data.map((l) => [
        l.user?.name ?? '-', l.user?.nip ?? '-', l.type_label ?? l.type,
        fmtDate(l.start_date), fmtDate(l.end_date), l.total_days,
        l.reason, l.status_label ?? l.status, l.admin_notes ?? '-', fmtDate(l.created_at),
      ])
      exportToCsv(`cuti_${new Date().toISOString().slice(0, 10)}`, headers, rows)
      toast.success(`${data.length} record cuti berhasil diekspor.`)
    } catch {
      toast.error('Gagal mengekspor data cuti.')
    } finally {
      setExportLoading(false)
    }
  }

  const columns = [
    {
      key: 'user', label: 'Karyawan',
      render: (leave) => (
        <div>
          <p className="text-sm font-medium">{leave.user?.name}</p>
          <p className="text-xs text-muted-foreground">{leave.user?.nip}</p>
        </div>
      ),
    },
    { key: 'type_label', label: 'Jenis', className: 'text-sm' },
    {
      key: 'dates', label: 'Tanggal', className: 'hidden sm:table-cell text-sm text-muted-foreground',
      render: (leave) => (
        <>
          {leave.start_date ? format(new Date(leave.start_date), 'dd MMM', { locale: id }) : ''} –{' '}
          {leave.end_date ? format(new Date(leave.end_date), 'dd MMM yyyy', { locale: id }) : ''}
        </>
      ),
    },
    { key: 'total_days', label: 'Durasi', className: 'hidden md:table-cell text-sm font-medium', render: (leave) => `${leave.total_days} hari` },
    { key: 'status', label: 'Status', render: (leave) => <StatusBadge status={leave.status} label={leave.status_label} /> },
    {
      key: 'created_at', label: 'Diajukan', className: 'text-sm text-muted-foreground hidden lg:table-cell',
      render: (leave) => leave.created_at ? format(new Date(leave.created_at), 'dd MMM yyyy', { locale: id }) : '',
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Manajemen Cuti"
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Cuti' }]}
        actions={
          <Button variant="outline" size="sm" onClick={handleExport} disabled={exportLoading}>
            <Download className="w-3.5 h-3.5 mr-1.5" />
            {exportLoading ? 'Mengekspor...' : 'Export CSV'}
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1) }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <TabsList className="border border-border bg-muted/50">
            <TabsTrigger value="all">Semua Cuti</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Menunggu
              {leaves.filter(l => l.status === 'pending').length > 0 && activeTab !== 'pending' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {leaves.filter(l => l.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {activeTab === 'all' && (
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <TabsContent value="all" className="mt-4">
          <DataTable columns={columns} data={leaves} isLoading={isLoading} onRowClick={openDetail} emptyMessage="Tidak ada data cuti" />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <DataTable columns={columns} data={leaves} isLoading={isLoading} onRowClick={openDetail} emptyMessage="Tidak ada data cuti" />
        </TabsContent>
      </Tabs>

      <Pagination meta={meta} page={page} onPageChange={setPage} />

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Cuti</DialogTitle>
          </DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Karyawan</p><p className="font-medium">{detailItem.user?.name}</p></div>
                <div><p className="text-muted-foreground">Jenis Cuti</p><p className="font-medium">{detailItem.type_label}</p></div>
                <div><p className="text-muted-foreground">Tanggal Mulai</p><p className="font-medium">{detailItem.start_date ? format(new Date(detailItem.start_date), 'dd MMMM yyyy', { locale: id }) : ''}</p></div>
                <div><p className="text-muted-foreground">Tanggal Selesai</p><p className="font-medium">{detailItem.end_date ? format(new Date(detailItem.end_date), 'dd MMMM yyyy', { locale: id }) : ''}</p></div>
                <div><p className="text-muted-foreground">Total Hari</p><p className="font-medium">{detailItem.total_days} hari kerja</p></div>
                <div><p className="text-muted-foreground">Status</p><StatusBadge status={detailItem.status} label={detailItem.status_label} /></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alasan</p>
                <p className="text-sm mt-0.5 p-3 bg-muted rounded-lg">{detailItem.reason}</p>
              </div>
              {detailItem.status === 'pending' && (
                <FormField
                  label="Catatan Admin (opsional)"
                  type="textarea"
                  placeholder="Tambahkan catatan..." rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              )}
            </div>
          )}
          <DialogFooter>
            {detailItem?.status === 'pending' ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Tutup</Button>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-red-50"
                  disabled={actionLoading}
                  onClick={() => handleAction('reject')}
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1.5" />}
                  Tolak
                </Button>
                <Button disabled={actionLoading} onClick={() => handleAction('approve')}>
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-1.5" />}
                  Setujui
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Tutup</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
