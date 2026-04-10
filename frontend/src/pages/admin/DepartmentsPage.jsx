import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  PageHeader, SearchInput, DataTable, Pagination,
  StatusBadge, ConfirmDialog, FormDialog, FormField,
} from '@/components/base'
import { departmentService } from '@/services/departmentService'
import { toast } from 'sonner'

const EMPTY_FORM = { name: '', code: '', description: '', status: 'active' }

export function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [formLoading, setFormLoading] = useState(false)

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 10 }
      if (search) params.search = search
      const res = await departmentService.getAll(params)
      setDepartments(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat data departemen.')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(fetchDepartments, 300)
    return () => clearTimeout(t)
  }, [fetchDepartments])

  const openCreate = () => { setForm(EMPTY_FORM); setFormErrors({}); setEditItem(null); setDialogOpen(true) }
  const openEdit = (item) => {
    setForm({ name: item.name, code: item.code, description: item.description ?? '', status: item.status })
    setFormErrors({})
    setEditItem(item)
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Nama departemen wajib diisi'
    if (!form.code.trim()) errs.code = 'Kode departemen wajib diisi'
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setFormLoading(true)
    try {
      if (editItem) {
        await departmentService.update(editItem.id, form)
        toast.success('Departemen berhasil diperbarui.')
      } else {
        await departmentService.create(form)
        toast.success('Departemen berhasil ditambahkan.')
      }
      setDialogOpen(false)
      fetchDepartments()
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      if (serverErrors) setFormErrors(serverErrors)
      else toast.error(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (item) => {
    try {
      await departmentService.delete(item.id)
      toast.success('Departemen berhasil dihapus.')
      fetchDepartments()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus departemen.')
    }
  }

  const columns = [
    { key: 'name', label: 'Nama Departemen', render: (item) => <span className="font-medium">{item.name}</span> },
    {
      key: 'code', label: 'Kode',
      render: (item) => <Badge variant="outline" className="text-xs font-mono border-border">{item.code}</Badge>,
    },
    { key: 'description', label: 'Deskripsi', className: 'hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate', render: (item) => item.description || '—' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'employee_count', label: 'Karyawan', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (item) => item.employee_count ?? 0 },
    {
      key: 'actions', label: 'Aksi', className: 'text-right', headerClass: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={(e) => { e.stopPropagation(); openEdit(item) }}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="icon" className="w-8 h-8 text-destructive hover:text-destructive" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            }
            title="Hapus Departemen"
            description={<>Yakin ingin menghapus departemen <strong>{item.name}</strong>?</>}
            onConfirm={() => handleDelete(item)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Departemen"
        subtitle={meta.total !== undefined ? `${meta.total} departemen terdaftar` : undefined}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Departemen' }]}
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Departemen
          </Button>
        }
      />

      <SearchInput
        placeholder="Cari departemen..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        onClear={() => { setSearch(''); setPage(1) }}
        className="max-w-sm"
      />

      <DataTable columns={columns} data={departments} isLoading={isLoading} emptyMessage="Tidak ada data departemen" skeletonRows={4} />
      <Pagination meta={meta} page={page} onPageChange={setPage} />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editItem ? 'Edit Departemen' : 'Tambah Departemen'}
        onSubmit={handleSubmit}
        isLoading={formLoading}
        submitLabel={editItem ? 'Simpan' : 'Tambah'}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Nama Departemen" required
            placeholder="Contoh: Information Technology"
            value={form.name}
            onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
            error={formErrors.name}
            className="col-span-2"
          />
          <FormField
            label="Kode" required
            placeholder="IT"
            value={form.code}
            onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
            maxLength={10}
            error={formErrors.code}
          />
          <FormField
            label="Status"
            type="select"
            value={form.status}
            onValueChange={(v) => setForm(p => ({ ...p, status: v }))}
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Non-Aktif' },
            ]}
          />
          <FormField
            label="Deskripsi"
            type="textarea"
            placeholder="Deskripsi departemen..."
            rows={2}
            value={form.description}
            onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
            className="col-span-2"
          />
        </div>
      </FormDialog>
    </div>
  )
}
