import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

/**
 * Search input with an icon and optional clear button.
 *
 * Props:
 *  value      — controlled value
 *  onChange   — (e) => ...
 *  onClear    — callback when clear button is clicked
 *  placeholder
 *  className
 */
export function SearchInput({
  value = '',
  onChange,
  onClear,
  placeholder = 'Cari...',
  className,
  ...props
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 pr-8"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
