import { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  PageHeader, SearchInput, DataTable, Pagination,
  StatusBadge, ConfirmDialog, FormDialog, FormField,
} from '@/components/base'
import { positionService } from '@/services/positionService'
import { toast } from 'sonner'

const EMPTY_FORM = { name: '', description: '', status: 'active' }

export function PositionsPage() {
  const [positions, setPositions] = useState([])
  const [meta, setMeta] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [formLoading, setFormLoading] = useState(false)

  const fetchPositions = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = { page, per_page: 10 }
      if (search) params.search = search
      const res = await positionService.getAll(params)
      setPositions(res.data)
      setMeta(res.meta)
    } catch {
      toast.error('Gagal memuat data jabatan.')
    } finally {
      setIsLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const t = setTimeout(fetchPositions, 300)
    return () => clearTimeout(t)
  }, [fetchPositions])

  const openCreate = () => {
    setForm(EMPTY_FORM); setFormErrors({}); setEditItem(null); setDialogOpen(true)
  }

  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description ?? '', status: item.status })
    setFormErrors({}); setEditItem(item); setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) { setFormErrors({ name: 'Nama jabatan wajib diisi' }); return }
    setFormLoading(true)
    try {
      if (editItem) {
        await positionService.update(editItem.id, form)
        toast.success('Jabatan berhasil diperbarui.')
      } else {
        await positionService.create(form)
        toast.success('Jabatan berhasil ditambahkan.')
      }
      setDialogOpen(false)
      fetchPositions()
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
      await positionService.delete(item.id)
      toast.success('Jabatan berhasil dihapus.')
      fetchPositions()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus jabatan.')
    }
  }

  const columns = [
    { key: 'name', label: 'Nama Jabatan', render: (item) => <span className="font-medium">{item.name}</span> },
    { key: 'description', label: 'Deskripsi', className: 'hidden md:table-cell text-sm text-muted-foreground max-w-xs truncate', render: (item) => item.description || '—' },
    { key: 'status', label: 'Status', render: (item) => <StatusBadge status={item.status} /> },
    { key: 'employee_count', label: 'Jumlah Karyawan', className: 'hidden sm:table-cell text-sm text-muted-foreground', render: (item) => `${item.employee_count ?? 0} karyawan` },
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
            title="Hapus Jabatan"
            description={<>Yakin ingin menghapus jabatan <strong>{item.name}</strong>?</>}
            onConfirm={() => handleDelete(item)}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Jabatan"
        subtitle={meta.total !== undefined ? `${meta.total} jabatan terdaftar` : undefined}
        breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Jabatan' }]}
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jabatan
          </Button>
        }
      />

      <SearchInput
        placeholder="Cari jabatan..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        onClear={() => { setSearch(''); setPage(1) }}
        className="max-w-sm"
      />

      <DataTable columns={columns} data={positions} isLoading={isLoading} emptyMessage="Tidak ada data jabatan" skeletonRows={4} />
      <Pagination meta={meta} page={page} onPageChange={setPage} />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editItem ? 'Edit Jabatan' : 'Tambah Jabatan'}
        onSubmit={handleSubmit}
        isLoading={formLoading}
        submitLabel={editItem ? 'Simpan' : 'Tambah'}
      >
        <FormField
          label="Nama Jabatan" required
          placeholder="Contoh: Manager IT"
          value={form.name}
          onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
          error={formErrors.name}
        />
        <FormField
          label="Deskripsi"
          type="textarea"
          placeholder="Deskripsi jabatan..."
          rows={3}
          value={form.description}
          onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
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
      </FormDialog>
    </div>
  )
}
