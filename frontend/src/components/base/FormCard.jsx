import { cn } from '@/lib/utils'

/**
 * Velzon-style card for grouping form sections.
 * Features a primary-colored left-border accent and a clean header.
 *
 * Props:
 *  title     — section heading
 *  subtitle  — optional description
 *  children  — form fields inside
 *  className — extra wrapper classes
 *  cols      — grid column count (1 | 2 | 3), defaults to 1
 */
export function FormCard({ title, subtitle, children, className, cols = 1 }) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }[cols] || 'grid-cols-1'

  return (
    <div
      className={cn(
        'rounded-lg bg-card border border-border shadow-sm overflow-hidden',
        className,
      )}
    >
      {/* Header with left accent */}
      {title && (
        <div className="px-5 py-3.5 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full inline-block" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 ml-3">{subtitle}</p>
          )}
        </div>
      )}

      {/* Body */}
      <div className={cn('p-5 grid gap-4', gridClass)}>
        {children}
      </div>
    </div>
  )
}
