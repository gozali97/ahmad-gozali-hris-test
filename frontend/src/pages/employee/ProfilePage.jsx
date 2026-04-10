import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { PageHeader, FormCard, FormField, StatusBadge } from '@/components/base'
import { Loader2, Mail, Phone, MapPin, Calendar, Briefcase, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

function getInitials(name = '') {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function ProfilePage() {
  const { user } = useAuth()
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwLoading, setPwLoading] = useState(false)

  const handlePwChange = (field) => (e) => {
    setPwForm(p => ({ ...p, [field]: e.target.value }))
    if (pwErrors[field]) setPwErrors(p => ({ ...p, [field]: null }))
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!pwForm.current_password) errs.current_password = 'Wajib diisi'
    if (!pwForm.password) errs.password = 'Wajib diisi'
    else if (pwForm.password.length < 8) errs.password = 'Minimal 8 karakter'
    if (pwForm.password !== pwForm.password_confirmation) errs.password_confirmation = 'Password tidak cocok'
    if (Object.keys(errs).length) { setPwErrors(errs); return }

    setPwLoading(true)
    try {
      await authService.changePassword(pwForm)
      toast.success('Password berhasil diubah.')
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengubah password.'
      toast.error(msg)
    } finally {
      setPwLoading(false)
    }
  }

  const isAdmin = user?.role === 'admin'

  const infoItems = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Telepon', value: user?.phone },
    { icon: MapPin, label: 'Alamat', value: user?.address },
    { icon: Calendar, label: 'Tanggal Lahir', value: user?.birth_date ? format(new Date(user.birth_date), 'dd MMMM yyyy', { locale: id }) : '—' },
    { icon: Briefcase, label: 'Jabatan', value: user?.position?.name ?? '—' },
    { icon: Building2, label: 'Departemen', value: user?.department?.name ?? '—' },
    { icon: Calendar, label: 'Tanggal Bergabung', value: user?.join_date ? format(new Date(user.join_date), 'dd MMMM yyyy', { locale: id }) : '—' },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <PageHeader
        title="Profil"
        breadcrumbs={[
          { label: 'Dashboard', href: isAdmin ? '/admin/dashboard' : '/employee/dashboard' },
          { label: 'Profil' },
        ]}
      />

      {/* Profile Card */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-5">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user?.photo_url} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.nip}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="border-border text-xs">{isAdmin ? 'Admin HR' : 'Karyawan'}</Badge>
                <StatusBadge status={user?.status} />
              </div>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {infoItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground break-words">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Change Password */}
      <FormCard title="Ubah Password">
        <form onSubmit={handlePwSubmit} className="space-y-4 col-span-full">
          <FormField
            label="Password Saat Ini"
            type="password" placeholder="••••••••"
            value={pwForm.current_password}
            onChange={handlePwChange('current_password')}
            error={pwErrors.current_password}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              label="Password Baru"
              type="password" placeholder="••••••••"
              value={pwForm.password}
              onChange={handlePwChange('password')}
              error={pwErrors.password}
            />
            <FormField
              label="Konfirmasi Password"
              type="password" placeholder="••••••••"
              value={pwForm.password_confirmation}
              onChange={handlePwChange('password_confirmation')}
              error={pwErrors.password_confirmation}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={pwLoading}>
              {pwLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Password
            </Button>
          </div>
        </form>
      </FormCard>
    </div>
  )
}
