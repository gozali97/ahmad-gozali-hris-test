import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/**
 * Velzon-style data table wrapper with loading skeleton & empty state.
 *
 * Props:
 *  columns     — [{ key, label, className, hidden, render }]
 *  data        — array of row objects
 *  isLoading   — show skeleton rows
 *  emptyMessage
 *  onRowClick  — (row) => void
 *  skeletonRows — number of rows to show while loading (default 5)
 *  className
 */
export function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'Tidak ada data',
  onRowClick,
  skeletonRows = 5,
  className,
}) {
  const visibleCols = columns.filter((c) => !c.hidden)

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden bg-card shadow-sm',
        className,
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {visibleCols.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  'text-xs font-semibold text-muted-foreground uppercase tracking-wider',
                  col.headerClass || col.className,
                )}
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(skeletonRows)].map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {visibleCols.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={visibleCols.length}
                className="text-center py-12 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow
                key={row.id ?? idx}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  onRowClick && 'cursor-pointer',
                )}
                onClick={() => onRowClick?.(row)}
              >
                {visibleCols.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
