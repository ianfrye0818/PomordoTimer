import { TimerCard } from './TimerCard'
import { TasksCard } from './TasksCard'

export default function PomodoroTimer() {
  return (
    <>
      <div className="grid gap-6">
        <TimerCard />

        <TasksCard />
      </div>
    </>
  )
}
