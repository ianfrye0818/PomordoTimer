import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import {
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Settings as SettingsIcon,
  Volume2Icon,
  VolumeOffIcon,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { cn } from '@/lib/utils'
import type { Mode, Settings } from '@/types/pomodoro'
import { SettingsForm } from './SettingsForm'

interface TimerCardProps {
  mode: Mode
  timeLeft: number
  isRunning: boolean
  sessionCount: number
  settings: Settings
  loading: boolean
  onModeChange: (mode: Mode) => void
  onStart: () => void
  onStop: () => void
  onReset: () => void
  onSettingsChange: (settings: Settings) => void
}

export function TimerCard({
  mode,
  timeLeft,
  isRunning,
  sessionCount,
  settings,
  loading,
  onModeChange,
  onStart,
  onStop,
  onReset,
  onSettingsChange,
}: TimerCardProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Timer</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                  <SettingsIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <SettingsForm
                  settings={settings}
                  onSave={(newSettings) => {
                    onSettingsChange(newSettings)
                    setSettingsOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>
            <Button
              variant={'outline'}
              size={'icon'}
              onClick={() =>
                onSettingsChange({
                  ...settings,
                  isAudioEnabled: !settings.isAudioEnabled,
                })
              }
            >
              {settings.isAudioEnabled ? (
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
          value={mode}
          onValueChange={(value) => onModeChange(value as Mode)}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger
              value="work"
              className={
                mode === 'work'
                  ? 'bg-green-600 data-[state=active]:bg-green-500'
                  : ''
              }
            >
              Work
            </TabsTrigger>
            <TabsTrigger
              value="shortBreak"
              className={
                mode === 'shortBreak'
                  ? 'bg-rose-600  data-[state=active]:bg-rose-500'
                  : ''
              }
            >
              Short Break
            </TabsTrigger>
            <TabsTrigger
              value="longBreak"
              className={
                mode === 'longBreak'
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
              mode === 'work' ? 'text-green-600' : 'text-red-600',
              'bg-background',
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 text-black" />
            ) : (
              formatTime(timeLeft)
            )}
          </div>

          <div className="flex space-x-4">
            <Button onClick={isRunning ? onStop : onStart} size="lg">
              {isRunning ? (
                <Pause className="mr-2 h-4 w-4" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button variant="outline" onClick={onReset} size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          Session{' '}
          {Math.floor(sessionCount / settings.sessionBeforeLongBreak) + 1},
          Pomodoro {(sessionCount % settings.sessionBeforeLongBreak) + 1} of{' '}
          {settings.sessionBeforeLongBreak}
        </div>
      </CardFooter>
    </Card>
  )
}
