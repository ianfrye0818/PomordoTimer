import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTimer, type Task } from './timer-provider'
import { FormInputItem } from './ui/FormInputItem'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Form } from './ui/form'
import { ReorderableList } from './ui/reorderable'

export function TasksCard() {
  const {
    addTask,
    removeTask,
    toggleTaskCompletion,
    updateTaskOrder,
    tasks,
    errors,
  } = useTimer()

  const form = useForm<Task>({
    defaultValues: {
      text: '',
      isCompleted: false,
    },
  })

  // Separate active and completed tasks - memoized to prevent infinite loops
  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.isCompleted),
    [tasks],
  )
  const completedTasks = useMemo(
    () => tasks.filter((t) => t.isCompleted),
    [tasks],
  )

  // Track tasks for animation purposes
  const [displayedActiveTasks, setDisplayedActiveTasks] =
    useState<Task[]>(activeTasks)
  const [displayedCompletedTasks, setDisplayedCompletedTasks] =
    useState<Task[]>(completedTasks)
  const [exitingTaskIds, setExitingTaskIds] = useState<Set<string>>(new Set())
  const [enteringTaskIds, setEnteringTaskIds] = useState<Set<string>>(new Set())
  const previousTaskIdsRef = useRef<Set<string>>(
    new Set(tasks.map((t) => t.id)),
  )

  // Handle task animations
  useEffect(() => {
    const currentTaskIds = new Set(tasks.map((t) => t.id))
    const previousTaskIds = previousTaskIdsRef.current

    // Compute active and completed tasks from current tasks
    const currentActiveTasks = tasks.filter((t) => !t.isCompleted)
    const currentCompletedTasks = tasks.filter((t) => t.isCompleted)

    // Find tasks that are exiting (were in previous but not in current)
    const exitingIds = Array.from(previousTaskIds).filter(
      (id) => !currentTaskIds.has(id),
    )
    // Find tasks that are entering (are in current but not in previous)
    const enteringIds = Array.from(currentTaskIds).filter(
      (id) => !previousTaskIds.has(id),
    )

    if (exitingIds.length > 0) {
      // Mark tasks as exiting
      setExitingTaskIds(new Set(exitingIds))

      // After exit animation, update displayed tasks and trigger enter animations
      setTimeout(() => {
        setExitingTaskIds(new Set())
        setDisplayedActiveTasks(currentActiveTasks)
        setDisplayedCompletedTasks(currentCompletedTasks)

        if (enteringIds.length > 0) {
          // Use requestAnimationFrame to ensure DOM is updated before triggering animation
          requestAnimationFrame(() => {
            setEnteringTaskIds(new Set(enteringIds))
            // Clear entering state after animation
            setTimeout(() => {
              setEnteringTaskIds(new Set())
            }, 300)
          })
        }

        previousTaskIdsRef.current = currentTaskIds
      }, 300) // Match animation duration
    } else if (enteringIds.length > 0) {
      // New tasks added without removals
      setDisplayedActiveTasks(currentActiveTasks)
      setDisplayedCompletedTasks(currentCompletedTasks)
      // Use requestAnimationFrame to ensure DOM is updated before triggering animation
      requestAnimationFrame(() => {
        setEnteringTaskIds(new Set(enteringIds))
        setTimeout(() => {
          setEnteringTaskIds(new Set())
        }, 300)
      })
      previousTaskIdsRef.current = currentTaskIds
    } else {
      // Just reordering or completion status change - update without special animation
      setDisplayedActiveTasks(currentActiveTasks)
      setDisplayedCompletedTasks(currentCompletedTasks)
      previousTaskIdsRef.current = currentTaskIds
    }
  }, [tasks])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add Task Form */}
        <Form {...form}>
          <form
            className="flex w-full items-center gap-1 mb-4"
            onSubmit={form.handleSubmit((data) => {
              addTask(data)
              form.reset()
            })}
          >
            <div className="flex-1">
              <FormInputItem
                control={form.control}
                name="text"
                placeholder="Add a new task..."
              />
            </div>
            <Button type="submit" size={'icon'}>
              <Plus className="size-2" />
            </Button>
          </form>
        </Form>

        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet. Add some tasks to work on during your Pomodoro
              sessions.
            </div>
          ) : (
            <>
              {/* Active Tasks - Reorderable */}
              {displayedActiveTasks.length > 0 && (
                <div className="space-y-2">
                  <ReorderableList
                    items={displayedActiveTasks.filter(
                      (task) => !exitingTaskIds.has(task.id),
                    )}
                    keyExtractor={(task) => task.id}
                    renderItem={(task) => {
                      const isExiting = exitingTaskIds.has(task.id)
                      const isEntering = enteringTaskIds.has(task.id)
                      const isInCurrentList = activeTasks.some(
                        (t) => t.id === task.id,
                      )

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'flex items-center justify-between transition-all duration-300 ease-in-out',
                            isExiting
                              ? 'task-exit pointer-events-none'
                              : isEntering
                                ? 'task-enter opacity-0'
                                : 'opacity-100',
                            !isInCurrentList && !isExiting && 'opacity-0',
                          )}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Checkbox
                              onCheckedChange={() =>
                                toggleTaskCompletion(task.id)
                              }
                              checked={task.isCompleted}
                            />
                            <span className="text-sm font-medium">
                              {task.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeTask(task.id)}
                            >
                              <X className="h-3 w-3 text-primary-foreground" />
                            </Button>
                          </div>
                        </div>
                      )
                    }}
                    onReorder={updateTaskOrder}
                  />
                </div>
              )}

              {/* Completed Tasks - Non-reorderable */}
              {displayedCompletedTasks.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Completed
                  </h3>
                  {displayedCompletedTasks
                    .filter((task) => !exitingTaskIds.has(task.id))
                    .map((task) => {
                      const isExiting = exitingTaskIds.has(task.id)
                      const isEntering = enteringTaskIds.has(task.id)
                      const isInCurrentList = completedTasks.some(
                        (t) => t.id === task.id,
                      )

                      return (
                        <div
                          key={task.id}
                          className={cn(
                            'flex items-center justify-between p-3 border rounded-md transition-all duration-300 ease-in-out',
                            isExiting
                              ? 'task-exit pointer-events-none'
                              : isEntering
                                ? 'task-enter opacity-0'
                                : 'opacity-100',
                            !isInCurrentList && !isExiting && 'opacity-0',
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              onCheckedChange={() =>
                                toggleTaskCompletion(task.id)
                              }
                              checked={task.isCompleted}
                            />
                            <span className="line-through text-muted-foreground text-sm">
                              {task.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => removeTask(task.id)}
                            >
                              <X className="h-3 w-3 text-primary-foreground" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </>
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
