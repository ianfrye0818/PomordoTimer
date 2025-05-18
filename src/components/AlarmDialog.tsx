import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

interface AlarmDialogProps {
  isBellActive: boolean
  stopSound: () => void
}

export function AlarmDialog({ isBellActive, stopSound }: AlarmDialogProps) {
  return (
    <Dialog
      open={isBellActive}
      onOpenChange={(open) => {
        if (!open) stopSound()
      }}
    >
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle>Session Complete!</DialogTitle>
        </DialogHeader>
        <p>Your timer has ended. time for a break or your next session!</p>

        <Button onClick={stopSound} className="mt-4">
          Stop Bell
        </Button>
      </DialogContent>
    </Dialog>
  )
}
