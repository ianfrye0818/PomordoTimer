export type Mode = 'work' | 'shortBreak' | 'longBreak'

export type Task = {
  id: string
  text: string
  isCompleted: boolean
}

export type Settings = {
  workTime: number
  shortBreakTime: number
  longBreakTime: number
  sessionBeforeLongBreak: number
  isAudioEnabled: boolean
}

export type PomodoroTimerError = {
  message: string
  type: 'error' | 'warning' | 'info'
  timestamp: number
  source?: string
  error?: Error
}

export const TIME_PRESETS = [
  { label: '30 seconds', value: 0.5 },
  { label: '1 minute', value: 1 },
  { label: '15 minutes', value: 15 },
  { label: '20 minutes', value: 20 },
  { label: '25 minutes', value: 25 },
  { label: '30 minutes', value: 30 },
] as const
