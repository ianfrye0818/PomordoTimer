import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import {
  Pause,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Volume2Icon,
  VolumeOffIcon,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { cn } from '@/lib/utils'
import type { Mode } from '@/types/pomodoro'
import { SettingsForm } from './SettingsForm'
import { useTimer } from './timer-provider'
import FormDialog from './ui/FormDialog'

export function TimerCard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const timer = useTimer()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timer</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={'outline'}
                size={'icon'}
                onClick={() => setIsSettingsOpen(true)}
              >
                <SettingsIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant={'outline'}
                size={'icon'}
                onClick={() =>
                  timer.saveSettings({ isAudioEnabled: !timer.isAudioEnabled })
                }
              >
                {timer.isAudioEnabled ? (
                  <Volume2Icon className="h-4 w-4" />
                ) : (
                  <VolumeOffIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="work"
            value={timer.mode}
            onValueChange={(value) => timer.setMode(value as Mode)}
            className="w-full"
          >
            <TabsList>
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
                    ? 'bg-rose-600  data-[state=active]:bg-rose-500'
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

          <div className="mt-8 flex flex-col items-center">
            <div
              className={cn(
                'text-6xl font-bold tabular-nums mb-8 p-8 rounded-xl shadow-md',
                timer.mode === 'work' ? 'text-green-600' : 'text-red-600',
                'bg-background',
              )}
            >
              {formatTime(timer.time)}
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={timer.isRunning ? timer.pauseTimer : timer.startTimer}
                size="lg"
              >
                {timer.isRunning ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {timer.isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" onClick={timer.resetTimer} size="lg">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Session{' '}
            {Math.floor(timer.sessionCount / timer.sessionsBeforeLongBreak) + 1}
            , Pomodoro{' '}
            {(timer.sessionCount % timer.sessionsBeforeLongBreak) + 1} of{' '}
            {timer.sessionsBeforeLongBreak}
          </div>
        </CardFooter>
      </Card>
      <FormDialog
        title="Timer Settings"
        setOpen={setIsSettingsOpen}
        open={isSettingsOpen}
      >
        <SettingsForm setOpen={() => setIsSettingsOpen(false)} />
      </FormDialog>
    </>
  )
}
