import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

/**
 * Velzon-style page header with title, breadcrumb, and action slot.
 *
 * Props:
 *  title       — page title
 *  subtitle    — optional subtitle below title
 *  breadcrumbs — array of { label, href? } for breadcrumb trail
 *  actions     — ReactNode rendered on the right side
 *  className
 */
export function PageHeader({ title, subtitle, breadcrumbs, actions, className }) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5',
        className,
      )}
    >
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="w-3 h-3" />}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={idx === breadcrumbs.length - 1 ? 'text-foreground font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      {actions && (
        <div className="flex gap-2 self-start sm:self-auto shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
