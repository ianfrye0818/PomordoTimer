import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Check, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Task, PomodoroTimerError } from '@/types/pomodoro'

interface TasksCardProps {
  tasks: Task[]
  errors: PomodoroTimerError[]
  onTasksChange: (tasks: Task[]) => void
}

export function TasksCard({ tasks, errors, onTasksChange }: TasksCardProps) {
  const [newTask, setNewTask] = useState('')

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskItem = {
        id: Date.now().toString(),
        text: newTask,
        isCompleted: false,
      }
      const updatedTasks = [...tasks, newTaskItem]
      onTasksChange(updatedTasks)
      setNewTask('')
    }
  }

  const toggleTaskCompletion = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task,
    )
    onTasksChange(updatedTasks)
  }

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id)
    onTasksChange(updatedTasks)
  }

  return (
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
                      task.isCompleted && 'line-through text-muted-foreground',
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
        {errors.length > 0 && (
          <div className="mt-4">
            {errors.map((error) => (
              <div key={error.timestamp} className="text-sm text-red-500">
                {error.message}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
