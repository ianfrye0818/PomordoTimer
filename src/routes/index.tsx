import { createFileRoute } from '@tanstack/react-router'
import PomodoroTimer from '@/components/PomodoroTimer'
import { ThemeProvider } from '@/components/theme-provider'
import { TimerProvider } from '@/components/timer-provider'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TimerProvider>
        <>
          <main className="cotainer max-w-2xl mx-auto py-8 px-4 short:max-w-6xl short:py-4">
            <h1 className="text-3xl font-bold text-center mb-8 short:text-2xl short:mb-4">
              Pomodoro Timer
            </h1>
            <PomodoroTimer />
          </main>
        </>
      </TimerProvider>
    </ThemeProvider>
  )
}
