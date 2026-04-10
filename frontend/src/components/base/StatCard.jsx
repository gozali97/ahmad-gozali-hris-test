import { cn } from '@/lib/utils'

/**
 * Velzon-style stat card for dashboard metrics.
 *
 * Props:
 *  title    — metric label
 *  value    — metric value
 *  icon     — lucide-react icon component
 *  iconBg   — tailwind classes for icon bubble (e.g. "bg-blue-50 text-blue-600")
 *  subtitle — small secondary text
 *  className
 */
export function StatCard({ title, value, icon: Icon, iconBg, subtitle, className }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card shadow-sm p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value ?? '—'}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0',
              iconBg,
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}
