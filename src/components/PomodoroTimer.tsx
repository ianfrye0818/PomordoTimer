import { FullscreenTimer } from './FullscreenTimer'
import { useTimer } from './timer-provider'
import { MainTabs } from './MainTabs'

export default function PomodoroTimer() {
  const timer = useTimer()

  if (timer.isFullscreen) {
    return <FullscreenTimer />
  }

  return (
    <>
      <div className="grid gap-6">
        <MainTabs />
      </div>
    </>
  )
}
