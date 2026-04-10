import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  PageHeader, SearchInput, DataTable, Pagination,
  StatusBadge, ConfirmDialog,
} from '@/components/base'
import { employeeService } from '@/services/employeeService'
import { departmentService } from '@/services/departmentService'
import { positionService } from '@/services/positionService'
import { exportToCsv, fmtDate } from '@/lib/exportCsv'
import { toast } from 'sonner'

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [departments, setDepartments] = useState([])
  const navigate = useNavigate()

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 10 }
      if (search) params.search = search
      if (deptFilter !== 'all') params.department_id = deptFilter
      if (statusFilter !== 'all') params.status = statusFilter

      const res = await employeeService.getAll(params)
      setEmployees(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat data karyawan.')
    } finally {
      setIsLoading(false)
    }
  }, [page, search, deptFilter, statusFilter])

  useEffect(() => {
    departmentService.getAllActive().then(r => setDepartments(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(timer)
  }, [fetchEmployees])

  const handleDelete = async (id) => {
    try {
      await employeeService.delete(id)
      toast.success('Karyawan berhasil dihapus.')
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus karyawan.')
    }
  }

  const handleExport = async () => {
    setExportLoading(true)
    try {
      const params = { per_page: 1000 }
      if (search) params.search = search
      if (deptFilter !== 'all') params.department_id = deptFilter
      if (statusFilter !== 'all') params.status = statusFilter

      const res = await employeeService.getAll(params)
      const data = res.data

      const headers = ['NIP', 'Nama', 'Email', 'No. HP', 'Jabatan', 'Departemen', 'Tgl. Bergabung', 'Status', 'Sisa Cuti']
      const rows = data.map((e) => [
        e.nip, e.name, e.email, e.phone,
        e.position?.name ?? '-', e.department?.name ?? '-',
        fmtDate(e.join_date),
        e.status === 'active' ? 'Aktif' : 'Non-Aktif',
        e.leave_quota,
      ])

      const now = new Date().toISOString().slice(0, 10)
      exportToCsv(`karyawan_${now}`, headers, rows)
      toast.success(`${data.length} karyawan berhasil diekspor.`)
    } catch {
      toast.error('Gagal mengekspor data karyawan.')
    } finally {
      setExportLoading(false)
    }
  }

  const columns = [
    {
      key: 'employee',
      label: 'Karyawan',
      render: (emp) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={emp.photo_url} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(emp.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{emp.name}</p>
            <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'nip',
      label: 'NIP',
      className: 'hidden md:table-cell text-sm text-muted-foreground',
    },
    {
      key: 'position',
      label: 'Jabatan',
      className: 'hidden lg:table-cell text-sm text-muted-foreground',
      render: (emp) => emp.position?.name ?? '—',
    },
    {
      key: 'department',
      label: 'Departemen',
      className: 'hidden lg:table-cell text-sm text-muted-foreground',
      render: (emp) => emp.department?.name ?? '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (emp) => <StatusBadge status={emp.status} />,
    },
    {
      key: 'actions',
      label: 'Aksi',
      className: 'text-right',
      headerClass: 'text-right',
      render: (emp) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost" size="icon" className="w-8 h-8"
            onClick={(e) => { e.stopPropagation(); navigate(`/admin/employees/${emp.id}/edit`) }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive"
                onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            }
            title="Hapus Karyawan"
            description={<>Yakin ingin menghapus <strong>{emp.name}</strong>? Tindakan ini tidak dapat dibatalkan.</>}
            onConfirm={() => handleDelete(emp.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daftar Karyawan"
        subtitle={meta.total !== undefined ? `${meta.total} karyawan terdaftar` : undefined}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Karyawan' },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={handleExport} disabled={exportLoading}>
              <Download className="w-4 h-4 mr-2" />
              {exportLoading ? 'Mengekspor...' : 'Export CSV'}
            </Button>
            <Button onClick={() => navigate('/admin/employees/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Karyawan
            </Button>
          </>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <SearchInput
          placeholder="Cari nama, NIP, email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          onClear={() => { setSearch(''); setPage(1) }}
          className="flex-1"
        />
        <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Departemen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Dept.</SelectItem>
            {departments.map(d => (
              <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Non-Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        isLoading={isLoading}
        emptyMessage="Tidak ada data karyawan"
      />

      <Pagination meta={meta} page={page} onPageChange={setPage} />
    </div>
  )
}
