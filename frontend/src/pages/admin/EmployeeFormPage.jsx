import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ChevronLeft, Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, FormCard, FormField } from '@/components/base'
import { employeeService } from '@/services/employeeService'
import { positionService } from '@/services/positionService'
import { departmentService } from '@/services/departmentService'
import { toast } from 'sonner'

const INITIAL_FORM = {
  nip: '', name: '', email: '', password: '', password_confirmation: '',
  phone: '', address: '', birth_date: '', gender: '',
  position_id: '', department_id: '', join_date: '', status: 'active',
  leave_quota: '12',
}

export function EmployeeFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [existingPhoto, setExistingPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(isEdit)
  const [positions, setPositions] = useState([])
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    positionService.getAllActive().then(r => setPositions(r.data)).catch(() => {})
    departmentService.getAllActive().then(r => setDepartments(r.data)).catch(() => {})

    if (isEdit) {
      employeeService.getById(id).then(res => {
        const emp = res.data
        setForm({
          nip: emp.nip ?? '',
          name: emp.name ?? '',
          email: emp.email ?? '',
          password: '', password_confirmation: '',
          phone: emp.phone ?? '',
          address: emp.address ?? '',
          birth_date: emp.birth_date ?? '',
          gender: emp.gender ?? '',
          position_id: String(emp.position_id ?? ''),
          department_id: String(emp.department_id ?? ''),
          join_date: emp.join_date ?? '',
          status: emp.status ?? 'active',
          leave_quota: String(emp.leave_quota ?? 12),
        })
        setExistingPhoto(emp.photo_url)
      }).catch(() => {
        toast.error('Gagal memuat data karyawan.')
        navigate('/admin/employees')
      }).finally(() => setIsFetching(false))
    }
  }, [id, isEdit, navigate])

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSelectChange = (field) => (value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const validate = () => {
    const e = {}
    if (!form.nip) e.nip = 'NIP wajib diisi'
    if (!form.name) e.name = 'Nama wajib diisi'
    if (!form.email) e.email = 'Email wajib diisi'
    if (!isEdit && !form.password) e.password = 'Password wajib diisi'
    if (form.password && form.password !== form.password_confirmation) e.password_confirmation = 'Konfirmasi password tidak cocok'
    if (!form.phone) e.phone = 'Telepon wajib diisi'
    if (!form.address) e.address = 'Alamat wajib diisi'
    if (!form.birth_date) e.birth_date = 'Tanggal lahir wajib diisi'
    if (!form.gender) e.gender = 'Jenis kelamin wajib dipilih'
    if (!form.position_id) e.position_id = 'Jabatan wajib dipilih'
    if (!form.department_id) e.department_id = 'Departemen wajib dipilih'
    if (!form.join_date) e.join_date = 'Tanggal bergabung wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsLoading(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (val !== '') formData.append(key, val)
      })
      if (photo) formData.append('photo', photo)

      if (isEdit) {
        await employeeService.update(id, formData)
        toast.success('Data karyawan berhasil diperbarui.')
      } else {
        await employeeService.create(formData)
        toast.success('Karyawan berhasil ditambahkan.')
      }
      navigate('/admin/employees')
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      if (serverErrors) setErrors(serverErrors)
      else toast.error(err.response?.data?.message || 'Terjadi kesalahan.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <PageHeader
        title={isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
        subtitle={isEdit ? 'Perbarui data karyawan' : 'Isi data karyawan baru'}
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Karyawan', href: '/admin/employees' },
          { label: isEdit ? 'Edit' : 'Tambah' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/admin/employees')}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Kembali
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Photo */}
        <FormCard title="Foto Profil">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted shrink-0">
              {(photoPreview || existingPhoto) ? (
                <img src={photoPreview || existingPhoto} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <label htmlFor="photo" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                  <Upload className="w-4 h-4" />
                  Pilih Foto
                </div>
              </label>
              <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG, max 2MB</p>
            </div>
          </div>
        </FormCard>

        {/* Personal Info */}
        <FormCard title="Informasi Pribadi" cols={2}>
          <FormField
            label="NIP" required
            placeholder="EMP0001"
            value={form.nip}
            onChange={handleChange('nip')}
            error={errors.nip}
          />
          <FormField
            label="Nama Lengkap" required
            placeholder="Nama lengkap"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
          />
          <FormField
            label="Email" required
            type="email"
            placeholder="email@domain.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
          />
          <FormField
            label="No. Telepon" required
            placeholder="08xxxxxxxx"
            value={form.phone}
            onChange={handleChange('phone')}
            error={errors.phone}
          />
          <FormField
            label="Tanggal Lahir" required
            type="date"
            value={form.birth_date}
            onChange={handleChange('birth_date')}
            error={errors.birth_date}
          />
          <FormField
            label="Jenis Kelamin" required
            type="select"
            placeholder="Pilih jenis kelamin"
            value={form.gender}
            onValueChange={handleSelectChange('gender')}
            options={[
              { value: 'male', label: 'Laki-laki' },
              { value: 'female', label: 'Perempuan' },
            ]}
            error={errors.gender}
          />
          <FormField
            label="Alamat" required
            type="textarea"
            placeholder="Alamat lengkap"
            value={form.address}
            onChange={handleChange('address')}
            rows={2}
            error={errors.address}
            className="sm:col-span-2"
          />
        </FormCard>

        {/* Work Info */}
        <FormCard title="Informasi Pekerjaan" cols={2}>
          <FormField
            label="Jabatan" required
            type="select"
            placeholder="Pilih jabatan"
            value={form.position_id}
            onValueChange={handleSelectChange('position_id')}
            options={positions.map(p => ({ value: p.id, label: p.name }))}
            error={errors.position_id}
          />
          <FormField
            label="Departemen" required
            type="select"
            placeholder="Pilih departemen"
            value={form.department_id}
            onValueChange={handleSelectChange('department_id')}
            options={departments.map(d => ({ value: d.id, label: d.name }))}
            error={errors.department_id}
          />
          <FormField
            label="Tanggal Bergabung" required
            type="date"
            value={form.join_date}
            onChange={handleChange('join_date')}
            error={errors.join_date}
          />
          <FormField
            label="Jatah Cuti (hari)"
            type="number"
            min="0"
            value={form.leave_quota}
            onChange={handleChange('leave_quota')}
          />
          <FormField
            label="Status"
            type="select"
            value={form.status}
            onValueChange={handleSelectChange('status')}
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'inactive', label: 'Non-Aktif' },
            ]}
          />
        </FormCard>

        {/* Password */}
        <FormCard
          title={isEdit ? 'Ubah Password (opsional)' : 'Password'}
          cols={2}
        >
          <FormField
            label="Password"
            required={!isEdit}
            type="password"
            placeholder={isEdit ? 'Kosongkan jika tidak diubah' : '••••••••'}
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
          />
          <FormField
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            value={form.password_confirmation}
            onChange={handleChange('password_confirmation')}
            error={errors.password_confirmation}
          />
        </FormCard>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/employees')}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isEdit ? 'Simpan Perubahan' : 'Tambah Karyawan'}
          </Button>
        </div>
      </form>
    </div>
  )
}
