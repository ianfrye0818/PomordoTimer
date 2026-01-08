import { cn } from '@/lib/utils'
import { Plus, Target, X } from 'lucide-react'
import { useMemo } from 'react'
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
    focusSessionTasks,
    addTaskToFocus,
    removeTaskFromFocus,
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
              {activeTasks.length > 0 && (
                <div className="space-y-2">
                  <ReorderableList
                    items={activeTasks}
                    keyExtractor={(task) => task.id}
                    renderItem={(task) => {
                      const isInFocus = focusSessionTasks.includes(task.id)
                      return (
                        <div className="flex items-center justify-between">
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
                          <div className="flex items-center space-x-1">
                            <Button
                              variant={isInFocus ? 'default' : 'outline'}
                              size="sm"
                              className={cn(
                                'h-7 text-xs',
                                isInFocus &&
                                  'bg-blue-600 hover:bg-blue-700 text-white',
                              )}
                              onClick={() =>
                                isInFocus
                                  ? removeTaskFromFocus(task.id)
                                  : addTaskToFocus(task.id)
                              }
                            >
                              <Target className="h-3 w-3 mr-1" />
                              {isInFocus ? 'In Focus' : 'Add to Focus'}
                            </Button>
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
              {completedTasks.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Completed
                  </h3>
                  {completedTasks.map((task) => {
                    return (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 border rounded-md"
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
