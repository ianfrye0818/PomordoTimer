import { cn } from '@/lib/utils'
import { CheckCircle2, Target, X } from 'lucide-react'
import { useMemo } from 'react'
import { useTimer } from './timer-provider'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'

export function FocusSessionCard() {
  const {
    focusSessionTasks,
    tasks,
    removeTaskFromFocus,
    toggleTaskCompletion,
    clearFocusSession,
  } = useTimer()

  // Get the actual task objects from the IDs
  const focusTasks = useMemo(() => {
    return focusSessionTasks
      .map((id) => tasks.find((task) => task.id === id))
      .filter(Boolean)
  }, [focusSessionTasks, tasks])

  const completedCount = focusTasks.filter((task) => task?.isCompleted).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Focus Session
          </CardTitle>
          {focusTasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFocusSession}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {focusTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No tasks selected for this session</p>
            <p className="text-sm mt-1">
              Go to the To-Dos tab to add tasks to your focus session
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground mb-4">
              {completedCount} of {focusTasks.length} completed
            </div>
            {focusTasks.map((task) => {
              if (!task) return null
              return (
                <div
                  key={task.id}
                  className={cn(
                    'flex items-center justify-between p-3 border rounded-lg transition-colors',
                    task.isCompleted
                      ? 'bg-muted/50 border-green-500/30'
                      : 'bg-card hover:bg-accent/50',
                  )}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Checkbox
                      checked={task.isCompleted}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                    />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        task.isCompleted &&
                          'line-through text-muted-foreground',
                      )}
                    >
                      {task.text}
                    </span>
                    {task.isCompleted && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => removeTaskFromFocus(task.id)}
                    title="Remove from focus session"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
