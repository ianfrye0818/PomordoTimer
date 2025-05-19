import { useEffect, useRef, useState } from 'react'
import type { Mode, Settings, Task, PomodoroTimerError } from '@/types/pomodoro'
import { TimerCard } from './TimerCard'
import { TasksCard } from './TasksCard'
import { AlarmDialog } from './AlarmDialog'

export default function PomodoroTimer() {
  const [errors, setErrors] = useState<PomodoroTimerError[]>([])

  // Settings State
  const [settings, setSettings] = useState<Settings>({
    longBreakTime: 15,
    shortBreakTime: 5,
    sessionBeforeLongBreak: 4,
    workTime: 25,
    isAudioEnabled: true,
  })

  // Timer State
  const [timeLeft, setTimeLeft] = useState(settings.workTime * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<Mode>('work')
  const [sessionCount, setSessionCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Task State
  const [tasks, setTasks] = useState<Task[]>([])

  // Alarm State
  const [bellActive, setBellActive] = useState(false)

  const [audioLoaded, setAudioLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Load bell sound into cache
    const audio = new Audio('/bell.mp3')
    audio.preload = 'auto'
    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true)
      setErrors((prev) => {
        return prev.filter((e) => e.source !== 'audio')
      })
    })

    audio.addEventListener('error', (e) => {
      setErrors((prev) => {
        return [
          ...prev,
          {
            message: 'Failed to load audio file',
            timestamp: Date.now(),
            type: 'error',
            source: 'audio',
            error: e.error,
          },
        ]
      })
    })

    audioRef.current = audio

    // Load tasks from local storage
    loadTasks()
    // Load user settings from local storage
    loadSettings()

    setLoading(false)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
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

  const playSound = async () => {
    if (!settings.isAudioEnabled) return

    if (!audioRef.current || !audioLoaded) {
      setErrors((prev) => [
        ...prev,
        {
          message: 'Failed to load audio file',
          type: 'warning',
          timestamp: Date.now(),
          source: 'audio',
        },
      ])
      return
    }
    try {
      audioRef.current.loop = true
      audioRef.current.currentTime = 0

      try {
        await audioRef.current.play()
      } catch (playError) {
        setErrors((prev) => {
          return [
            ...prev,
            {
              message: 'Failed to play audio file',
              type: 'error',
              error: (playError as Error) || new Error('Unknown error'),
              timestamp: Date.now(),
              source: 'audio',
            },
          ]
        })

        return
      }
      setBellActive(true)
      setErrors((prev) => {
        return prev.filter((e) => e.source !== 'audio')
      })

      // Auto stop the bell after 10 seconds
      setTimeout(() => {
        stopSound()
      }, 10000)
    } catch (error) {
      setErrors((prev) => {
        return [
          ...prev,
          {
            message: 'Failed to play audio file',
            type: 'error',
            error: (error as Error) || new Error('Unknown error'),
            timestamp: Date.now(),
            source: 'audio',
          },
        ]
      })
    }
  }

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current.loop = false
    }

    setBellActive(false)
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
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings) as Settings
      setSettings(parsedSettings)
    }
  }

  const handleModeChange = (newMode: Mode) => {
    stopTimer()
    setMode(newMode)
  }

  const saveSettings = (newSettings: Settings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings))
    setSettings(newSettings)
  }

  return (
    <>
      <div className="grid gap-6">
        <TimerCard
          mode={mode}
          timeLeft={timeLeft}
          isRunning={isRunning}
          sessionCount={sessionCount}
          settings={settings}
          loading={loading}
          onModeChange={handleModeChange}
          onStart={startTimer}
          onStop={stopTimer}
          onReset={resetTimer}
          onSettingsChange={saveSettings}
        />

        <TasksCard
          tasks={tasks}
          errors={errors}
          onTasksChange={(updatedTasks) => {
            setTasks(updatedTasks)
            saveTasks(updatedTasks)
          }}
        />
      </div>
      <AlarmDialog isBellActive={bellActive} stopSound={stopSound} />
    </>
  )
}
