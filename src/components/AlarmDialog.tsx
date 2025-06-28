// import { useTimer } from './timer-provider'
// import { Button } from './ui/button'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'

// export function AlarmDialog({ isBellActive, stopSound }: AlarmDialogProps) {
//   const { audioRef } = useTimer()

//   return (
//     <Dialog
//       open={}
//       onOpenChange={(open) => {
//         if (!open) stopSound()
//       }}
//     >
//       <DialogContent className="text-center">
//         <DialogHeader>
//           <DialogTitle>Session Complete!</DialogTitle>
//         </DialogHeader>
//         <p>Your timer has ended. time for a break or your next session!</p>

//         <Button onClick={stopSound} className="mt-4">
//           Stop Bell
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }
