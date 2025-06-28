import { TimerCard } from './TimerCard'
import { TasksCard } from './TasksCard'
import { FullscreenTimer } from './FullscreenTimer'
import { useTimer } from './timer-provider'

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
