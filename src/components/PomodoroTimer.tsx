import { FullscreenTimer } from './FullscreenTimer'
import { TasksCard } from './TasksCard'
import { useTimer } from './timer-provider'
import { TimerCard } from './TimerCard'

export default function PomodoroTimer() {
  const timer = useTimer()

  if (timer.isFullscreen) {
    return <FullscreenTimer />
  }

  return (
    <>
      <div className="grid gap-6">
        <TimerCard />

        <TasksCard />
      </div>
    </>
  )
}
