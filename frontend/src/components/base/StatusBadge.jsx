import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, XCircle, UserCheck, UserX } from 'lucide-react'

/**
 * Pre-configured status badge with consistent colors & icons.
 *
 * variant presets:
 *  active / approved / present  — green
 *  inactive / rejected / absent — red
 *  pending                     — yellow/amber
 *  sick                        — yellow
 *  permit                      — blue
 *  default                     — gray
 */
const PRESETS = {
  active:   { color: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: UserCheck,     label: 'Aktif' },
  inactive: { color: 'border-gray-200 bg-gray-50 text-gray-600',          icon: UserX,         label: 'Non-Aktif' },
  approved: { color: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle2,  label: 'Disetujui' },
  rejected: { color: 'border-red-200 bg-red-50 text-red-600',             icon: XCircle,       label: 'Ditolak' },
  pending:  { color: 'border-amber-200 bg-amber-50 text-amber-700',       icon: Clock,         label: 'Menunggu' },
  present:  { color: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: CheckCircle2,  label: 'Hadir' },
  sick:     { color: 'border-yellow-200 bg-yellow-50 text-yellow-700',     icon: null,          label: 'Sakit' },
  permit:   { color: 'border-blue-200 bg-blue-50 text-blue-700',          icon: null,          label: 'Izin' },
  absent:   { color: 'border-red-200 bg-red-50 text-red-600',             icon: XCircle,       label: 'Alpha' },
}

export function StatusBadge({
  status,
  label: customLabel,
  showIcon = true,
  className,
}) {
  const preset = PRESETS[status] || { color: 'border-gray-200 bg-gray-50 text-gray-600', icon: null, label: status }
  const Icon = preset.icon
  const displayLabel = customLabel || preset.label

  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium gap-1', preset.color, className)}
    >
      {showIcon && Icon && <Icon className="w-3 h-3" />}
      {displayLabel}
    </Badge>
  )
}
