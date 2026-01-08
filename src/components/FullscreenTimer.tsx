import { cn } from '@/lib/utils'
import { Pause, Play, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTimer, type Mode, type Task } from './timer-provider'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export function FullscreenTimer() {
  const timer = useTimer()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get focused tasks: only tasks in focus session, non-completed, limited to 5
  const { simplifiedTasks, totalIncompleteCount } = useMemo(() => {
    const focusedIncompleteTasks = timer.tasks
      .filter((task) => timer.focusSessionTasks.includes(task.id) && !task.isCompleted)
      .sort((a, b) => a.order - b.order)
    return {
      simplifiedTasks: focusedIncompleteTasks.slice(0, 5),
      totalIncompleteCount: focusedIncompleteTasks.length,
    }
  }, [timer.tasks, timer.focusSessionTasks])

  // Track tasks for animation purposes
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>(simplifiedTasks)
  const [exitingTaskIds, setExitingTaskIds] = useState<Set<string>>(new Set())
  const [enteringTaskIds, setEnteringTaskIds] = useState<Set<string>>(new Set())
  const previousTaskIdsRef = useRef<Set<string>>(
    new Set(simplifiedTasks.map((t) => t.id)),
  )

  // Handle task animations
  useEffect(() => {
    const currentTaskIds = new Set(simplifiedTasks.map((t) => t.id))
    const previousTaskIds = previousTaskIdsRef.current

    // Find tasks that are exiting (were in previous but not in current)
    const exitingIds = Array.from(previousTaskIds).filter(
      (id) => !currentTaskIds.has(id),
    )
    // Find tasks that are entering (are in current but not in previous)
    const enteringIds = Array.from(currentTaskIds).filter(
      (id) => !previousTaskIds.has(id),
    )

    if (exitingIds.length > 0) {
      // Mark tasks as exiting
      setExitingTaskIds(new Set(exitingIds))

      // After exit animation, update displayed tasks and trigger enter animations
      setTimeout(() => {
        setExitingTaskIds(new Set())
        setDisplayedTasks(simplifiedTasks)

        if (enteringIds.length > 0) {
          // Use requestAnimationFrame to ensure DOM is updated before triggering animation
          requestAnimationFrame(() => {
            setEnteringTaskIds(new Set(enteringIds))
            // Clear entering state after animation
            setTimeout(() => {
              setEnteringTaskIds(new Set())
            }, 300)
          })
        }

        previousTaskIdsRef.current = currentTaskIds
      }, 300) // Match animation duration
    } else if (enteringIds.length > 0) {
      // New tasks added without removals
      setDisplayedTasks(simplifiedTasks)
      // Use requestAnimationFrame to ensure DOM is updated before triggering animation
      requestAnimationFrame(() => {
        setEnteringTaskIds(new Set(enteringIds))
        setTimeout(() => {
          setEnteringTaskIds(new Set())
        }, 300)
      })
      previousTaskIdsRef.current = currentTaskIds
    } else {
      // Just reordering - update without special animation
      setDisplayedTasks(simplifiedTasks)
      previousTaskIdsRef.current = currentTaskIds
    }
  }, [simplifiedTasks])

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        timer.exitFullscreen()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [timer])

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header with close button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={timer.exitFullscreen}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main timer content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {/* Mode tabs */}
        <Tabs
          defaultValue="work"
          value={timer.mode}
          onValueChange={(value) => timer.setMode(value as Mode)}
          className="w-full max-w-md mb-8"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="work"
              className={
                timer.mode === 'work'
                  ? 'bg-green-600 data-[state=active]:bg-green-500'
                  : ''
              }
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="shortBreak"
              className={
                timer.mode === 'shortBreak'
                  ? 'bg-rose-600 data-[state=active]:bg-rose-500'
                  : ''
              }
            >
              Short Break
            </TabsTrigger>
            <TabsTrigger
              value="longBreak"
              className={
                timer.mode === 'longBreak'
                  ? 'bg-pink-600 data-[state=active]:bg-pink-500'
                  : ''
              }
            >
              Long Break
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Timer display */}
        <div
          className={cn(
            'text-8xl font-bold tabular-nums mb-12 p-12 rounded-2xl shadow-lg',
            timer.mode === 'work' ? 'text-green-600' : 'text-red-600',
            'bg-card border',
          )}
        >
          {formatTime(timer.time)}
        </div>

        {/* Controls */}
        <div className="flex space-x-6">
          <Button
            onClick={timer.isRunning ? timer.pauseTimer : timer.startTimer}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            {timer.isRunning ? (
              <Pause className="mr-3 h-6 w-6" />
            ) : (
              <Play className="mr-3 h-6 w-6" />
            )}
            {timer.isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="outline"
            onClick={timer.resetTimer}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            <RotateCcw className="mr-3 h-6 w-6" />
            Reset
          </Button>
        </div>

        {/* Session info */}
        <div className="mt-8 text-lg text-muted-foreground">
          Session{' '}
          {Math.floor(timer.sessionCount / timer.sessionsBeforeLongBreak) + 1},
          Pomodoro {(timer.sessionCount % timer.sessionsBeforeLongBreak) + 1} of{' '}
          {timer.sessionsBeforeLongBreak}
        </div>

        {/* Focused Tasks List */}
        {(displayedTasks.length > 0 || simplifiedTasks.length > 0) && (
          <div className="mt-12 w-full max-w-md">
            <div className="text-sm text-muted-foreground mb-3 text-center">
              Focus Tasks ({simplifiedTasks.length}
              {totalIncompleteCount > 5 && ` of ${totalIncompleteCount}`})
            </div>
            <div className="space-y-2">
              {displayedTasks.map((task) => {
                const isExiting = exitingTaskIds.has(task.id)
                const isEntering = enteringTaskIds.has(task.id)
                const isInCurrentList = simplifiedTasks.some(
                  (t) => t.id === task.id,
                )

                return (
                  <div
                    key={task.id}
                    className={cn(
                      'flex items-center space-x-3 p-3 border rounded-md bg-card hover:bg-accent/50',
                      isExiting
                        ? 'task-exit pointer-events-none'
                        : isEntering
                          ? 'task-enter opacity-0'
                          : 'opacity-100',
                      !isInCurrentList && !isExiting && 'opacity-0',
                    )}
                  >
                    <Checkbox
                      onCheckedChange={() =>
                        timer.toggleTaskCompletion(task.id)
                      }
                      checked={false}
                      className="flex-shrink-0"
                    />
                    <span className="flex-1 text-sm">{task.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
