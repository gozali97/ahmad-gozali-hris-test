import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

/**
 * Confirm dialog wrapping AlertDialog.
 *
 * Props:
 *  trigger       — ReactNode (e.g. a Button)
 *  title         — dialog title
 *  description   — descriptive text (can be ReactNode)
 *  onConfirm     — callback on confirm click
 *  confirmLabel  — (default "Hapus")
 *  cancelLabel   — (default "Batal")
 *  variant       — "destructive" | "default"
 */
export function ConfirmDialog({
  trigger,
  title = 'Konfirmasi',
  description,
  onConfirm,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  variant = 'destructive',
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === 'destructive'
                ? 'bg-destructive hover:bg-destructive/90'
                : ''
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
