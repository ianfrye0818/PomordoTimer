import { useEffect } from 'react'
import { Button } from './ui/button'
import { X, Pause, Play, RotateCcw } from 'lucide-react'
import { useTimer, type Mode } from './timer-provider'
import { cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export function FullscreenTimer() {
  const timer = useTimer()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
      </div>
    </div>
  )
}
