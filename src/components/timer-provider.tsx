import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
export type Mode = 'work' | 'shortBreak' | 'longBreak'

export class TimerError extends Error {
  constructor(
    message: string,
    public type: 'error' | 'warning' | 'info',
    public timestamp: number,
    public source?: string,
    public error?: Error,
  ) {
    super(message)
    this.name = 'TimerError'
  }
}

export type Task = {
  id: string
  text: string
  isCompleted: boolean
}

export type Settings = {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionsBeforeLongBreak: number
}

type TimerContextType = {
  time: number
  mode: 'work' | 'shortBreak' | 'longBreak'
  isRunning: boolean
  setMode: (mode: Mode) => void
  playSound: () => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  addTask: (task: Task) => void
  removeTask: (id: string) => void
  toggleTaskCompletion: (id: string) => void
  saveSettings: (props: {
    settings?: Settings
    isAudioEnabled?: boolean
  }) => void
  sessionCount: number
  tasks: Task[]
  errors: TimerError[]
  workTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionsBeforeLongBreak: number
  isAudioEnabled: boolean
  timerRef: React.RefObject<NodeJS.Timeout | null>
  audioRef: React.RefObject<HTMLAudioElement | null>
}

export const TIME_PRESETS = [
  { label: '10 seconds', value: 0.16666666666666666 },
  { label: '30 seconds', value: 0.5 },
  { label: '1 minute', value: 1 },
  { label: '5 minutes', value: 5 },
  { label: '10 minutes', value: 10 },
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '25 minutes', value: 25 },
  { label: '30 minutes', value: 30 },
] as const

const TimerContext = createContext<TimerContextType>({
  time: 0,
  mode: 'work',
  isRunning: false,
  setMode: () => {},
  playSound: () => {},
  startTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
  addTask: () => {},
  removeTask: () => {},
  saveSettings: () => {},
  toggleTaskCompletion: () => {},
  tasks: [],
  workTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  sessionsBeforeLongBreak: 4,
  isAudioEnabled: true,
  timerRef: { current: null },
  audioRef: { current: null },
  errors: [],
  sessionCount: 0,
})

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [sessionCount, setSessionCount] = useState(0)
  const [errors, setErrors] = useState<TimerError[]>([])
  const [time, setTime] = useState(0)
  const [mode, setMode] = useState<Mode>('work')
  const [isRunning, setIsRunning] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [workTime, setWorkTime] = useState(25)
  const [shortBreakTime, setShortBreakTime] = useState(5)
  const [longBreakTime, setLongBreakTime] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)

  const audioRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const playSound = () => {
    if (audioRef.current) {
      if (isAudioEnabled) {
        audioRef.current.play()
      } else {
        toast.error('Audio is disabled')
      }
    }
  }

  const startTimer = () => {
    if (isRunning) {
      return
    }
    setIsRunning(true)
  }

  const pauseTimer = () => {
    if (!isRunning) {
      return
    }
    setIsRunning(false)
  }

  const resetTimer = () => {
    if (isRunning) {
      setIsRunning(false)
    }
    setMode('work')
    setTime(workTime * 60)
  }

  const addTask = (task: Task) => {
    const newTasks = [...tasks, task]
    setTasks(newTasks)
    saveTasks(newTasks)
  }

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleModeChange = (newMode: Mode) => {
    if (isRunning) {
      setIsRunning(false)
    }
    setMode(newMode)
    setTime(
      newMode === 'work'
        ? workTime * 60
        : newMode === 'shortBreak'
          ? shortBreakTime * 60
          : longBreakTime * 60,
    )
  }

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks))
  }

  const loadTasks = () => {
    const storedTasks = localStorage.getItem('pomodoro-tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }

  const saveSettings = (props: {
    settings?: Settings
    isAudioEnabled?: boolean
  }) => {
    if (props.settings) {
      setWorkTime(props.settings.workTime)
      setShortBreakTime(props.settings.shortBreakTime)
      setLongBreakTime(props.settings.longBreakTime)
      setSessionsBeforeLongBreak(props.settings.sessionsBeforeLongBreak)
      localStorage.setItem('pomodoro-settings', JSON.stringify(props.settings))
    }

    if (props.isAudioEnabled !== undefined) {
      setIsAudioEnabled(props.isAudioEnabled)
      localStorage.setItem(
        'pomodoro-isAudioEnabled',
        props.isAudioEnabled.toString(),
      )
    }
  }

  const toggleTaskCompletion = (id: string) => {
    console.log(tasks)
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
    )
    debugger
    console.log(updatedTasks)

    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const loadSettings = (type: 'settings' | 'isAudioEnabled' | 'all') => {
    const loadSettings = () => {
      const storedSettings = localStorage.getItem('pomodoro-settings')
      if (storedSettings) {
        const settings = JSON.parse(storedSettings) as Settings
        setWorkTime(settings.workTime)
        setShortBreakTime(settings.shortBreakTime)
        setLongBreakTime(settings.longBreakTime)
        setSessionsBeforeLongBreak(settings.sessionsBeforeLongBreak)
      }
    }
    const loadIsAudioEnabled = () => {
      const storedIsAudioEnabled = localStorage.getItem(
        'pomodoro-isAudioEnabled',
      )
      if (storedIsAudioEnabled) {
        setIsAudioEnabled(storedIsAudioEnabled === 'true')
      }
    }
    if (type === 'all') {
      loadSettings()
      loadIsAudioEnabled()
      return
    }

    if (type === 'settings') {
      loadSettings()
      return
    }

    if (type === 'isAudioEnabled') {
      loadIsAudioEnabled()
      return
    }
  }

  // Load settings and tasks on app mount
  useEffect(() => {
    loadSettings('all')
    loadTasks()
  }, [])

  // Update time ever second if timer is running
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Only decrement time if it's greater than 0
        if (time > 0) {
          setTime((prev) => prev - 1)
        } else {
          playSound()
          setIsRunning(false)
          setTime(
            mode === 'work'
              ? workTime * 60
              : mode === 'shortBreak'
                ? shortBreakTime * 60
                : longBreakTime * 60,
          )
          handleModeChange(mode === 'work' ? 'shortBreak' : 'longBreak')
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isRunning, time, mode, workTime, shortBreakTime, longBreakTime])

  return (
    <TimerContext.Provider
      value={{
        time,
        mode,
        isRunning,
        setMode,
        playSound,
        startTimer,
        addTask,
        removeTask,
        saveSettings,
        toggleTaskCompletion,
        tasks,
        workTime,
        shortBreakTime,
        longBreakTime,
        sessionsBeforeLongBreak,
        isAudioEnabled,
        pauseTimer,
        resetTimer,
        audioRef,
        timerRef,
        errors,
        sessionCount,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
