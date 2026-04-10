import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Simple prev/next pagination.
 *
 * Props:
 *  meta          — { current_page, last_page, total, per_page }
 *  page          — current page number (controlled)
 *  onPageChange  — (newPage) => void
 */
export function Pagination({ meta = {}, page, onPageChange }) {
  if (!meta.last_page || meta.last_page <= 1) return null

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
      <p>
        Halaman {meta.current_page} dari {meta.last_page}
        {meta.total !== undefined && (
          <span className="ml-1 text-xs">({meta.total} data)</span>
        )}
      </p>
      <div className="flex gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 px-3"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= meta.last_page}
          onClick={() => onPageChange(page + 1)}
          className="h-8 px-3"
        >
          Selanjutnya
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
