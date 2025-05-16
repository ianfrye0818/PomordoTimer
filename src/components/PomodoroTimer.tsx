import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from './ui/button'
import {
  Check,
  Loader2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings,
  X,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { Label } from './ui/label'

type Mode = 'work' | 'shortBreak' | 'longBreak'

type Task = {
  id: string
  text: string
  isCompleted: boolean
}

type Settings = {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionBeforeLongBreak: number
}

export default function PomodoroTimer() {
  // Settings State
  const [settings, setSettings] = useState<Settings>({
    longBreakTime: 15,
    shortBreakTime: 5,
    sessionBeforeLongBreak: 4,
    workTime: 25,
  })

  // Timer State
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<Mode>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Task State
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  console.log({ loading })
  useEffect(() => {
    audioRef.current = new Audio('/bell.wav')
    loadTasks()
    loadSettings()

    setLoading(false)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    let time = 0

    switch (mode) {
      case 'work':
        time = settings.workTime * 60
        break
      case 'shortBreak':
        time = settings.shortBreakTime * 60
        break
      case 'longBreak':
        time = settings.longBreakTime * 60
    }

    setTimeLeft(time)
    if (isRunning) {
      stopTimer()
      startTimer()
    }
  }, [settings, mode])

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playSound()
          clearInterval(timerRef.current as NodeJS.Timeout)
          moveToTextMode()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
  }

  const resetTimer = () => {
    stopTimer()
    let time = 0

    switch (mode) {
      case 'work':
        time = settings.workTime * 60
        break
      case 'shortBreak':
        time = settings.shortBreakTime * 60
        break
      case 'longBreak':
        time = settings.longBreakTime * 60
    }

    setTimeLeft(time)
  }

  const moveToTextMode = () => {
    if (mode === 'work') {
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)

      if (newSessionCount % settings.sessionBeforeLongBreak === 0) {
        setMode('longBreak')
      } else {
        setMode('shortBreak')
      }
    } else {
      setMode('work')
    }
    setIsRunning(false)
  }

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current
        .play()
        .catch((e) => console.error('Error playing sound: ', e))
    }
  }

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const loadTasks = () => {
    const tasks = localStorage.getItem('tasks')
    if (tasks) {
      const parsedTasks = JSON.parse(tasks) as Task[]
      setTasks(parsedTasks)
    }
  }

  const loadSettings = () => {
    const storedSettings = localStorage.getItem('settings')
    console.log({ storedSettings })
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings) as Settings
      console.log({ parsedSettings })
      setSettings(parsedSettings)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleModeChange = (newMode: Mode) => {
    stopTimer()
    setMode(newMode)
  }

  const saveSettings = (newSettings: Settings) => {
    localStorage.setItem('settings', JSON.stringify(settings))
    setSettings(newSettings)
    setSettingsOpen(false)
  }

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now().toString(),
        text: newTask,
        isCompleted: false,
      }
      const updatedTasks = [...tasks, newTaskItem]
      setTasks(updatedTasks)
      setNewTask('')
      saveTasks(updatedTasks)
    }
  }

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
    )
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  return (
    <div className="grid gap-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timer</CardTitle>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant={'outline'} size={'icon'}>
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                </DialogHeader>
                <SettingsForm settings={settings} onSave={saveSettings} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="work"
            value={mode}
            onValueChange={(value) => handleModeChange(value as Mode)}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger
                value="work"
                className={
                  mode === 'work'
                    ? 'bg-green-100 data-[state=active]:bg-green-200'
                    : ''
                }
              >
                Work
              </TabsTrigger>
              <TabsTrigger
                value="shortBreak"
                className={
                  mode === 'shortBreak'
                    ? 'bg-red-100 data-[state=active]:bg-red-200'
                    : ''
                }
              >
                Short Break
              </TabsTrigger>
              <TabsTrigger
                value="longBreak"
                className={
                  mode === 'longBreak'
                    ? 'bg-red-100 data-[state=active]:bg-red-200'
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
                'bg-slate-50 border',
              )}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 text-black" />
              ) : (
                formatTime(timeLeft)
              )}
            </div>

            <div className="flex space-x-4">
              <Button onClick={isRunning ? stopTimer : startTimer} size="lg">
                {isRunning ? (
                  <Pause className="mr-2 h-4 w-4" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              <Button variant="outline" onClick={resetTimer} size="lg">
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addTask()
              }}
            />
            <Button onClick={addTask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks yet. Add some tasks to work on during your Pomodoro
                sessions.
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <div
                        className={cn(
                          'h-4 w-4 border rounded-sm flex items-center justify-center',
                          task.isCompleted
                            ? 'bg-primary border-primary'
                            : 'border-input',
                        )}
                      >
                        {task.isCompleted && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </Button>
                    <span
                      className={cn(
                        task.isCompleted &&
                          'line-through text-muted-foreground',
                      )}
                    >
                      {task.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTask(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SettingsForm({
  onSave,
  settings,
}: {
  settings: Settings
  onSave: (newSettings: Settings) => void
}) {
  const [formValues, setFormValues] = useState(settings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setFormValues({ ...formValues, [name]: numValue })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formValues)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="workTime">Work Time (minutes)</Label>
        <Input
          id="workTime"
          name="workTime"
          type="number"
          min="1"
          value={formValues.workTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="shortBreakTime">Short Break Time (minutes)</Label>
        <Input
          id="shortBreakTime"
          name="shortBreakTime"
          type="number"
          min="1"
          value={formValues.shortBreakTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="longBreakTime">Long Break Time (minutes)</Label>
        <Input
          id="longBreakTime"
          name="longBreakTime"
          type="number"
          min="1"
          value={formValues.longBreakTime}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sessionsBeforeLongBreak">
          Sessions Before Long Break
        </Label>
        <Input
          id="sessionsBeforeLongBreak"
          name="sessionBeforeLongBreak"
          type="number"
          min="1"
          value={formValues.sessionBeforeLongBreak}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full">
        Save Settings
      </Button>
    </form>
  )
}
