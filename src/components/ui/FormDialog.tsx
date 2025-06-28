'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface FormDialogProps {
  title: string
  description?: string
  children?: React.ReactNode
  setOpen: (open: boolean) => void
  open?: boolean
}

export default function FormDialog({
  title,
  description,
  children,
  setOpen,
  open,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
