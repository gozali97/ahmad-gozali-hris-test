import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

/**
 * Dialog wrapper tailored for forms with built-in cancel/submit footer.
 *
 * Props:
 *  open           — controlled open state
 *  onOpenChange   — (bool) => void
 *  title          — dialog heading
 *  onSubmit       — form submit handler
 *  isLoading      — disables submit + shows spinner
 *  submitLabel    — submit button text (default "Simpan")
 *  cancelLabel    — cancel button text (default "Batal")
 *  children       — form content
 *  footer         — custom footer override (ReactNode)
 *  maxWidth       — dialog max width class (default "max-w-md")
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  onSubmit,
  isLoading = false,
  submitLabel = 'Simpan',
  cancelLabel = 'Batal',
  children,
  footer,
  maxWidth = 'max-w-md',
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.(e)
          }}
          className="space-y-4"
        >
          {children}

          {footer !== undefined ? (
            footer
          ) : (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                {cancelLabel}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {submitLabel}
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
