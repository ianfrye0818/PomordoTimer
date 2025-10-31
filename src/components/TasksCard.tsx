import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
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
            <Button type="submit">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </Form>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No tasks yet. Add some tasks to work on during your Pomodoro
              sessions.
            </div>
          ) : (
            <ReorderableList
              items={tasks}
              renderItem={(task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      checked={task.isCompleted}
                    />
                    <span
                      className={cn(
                        task.isCompleted &&
                          'line-through text-muted-foreground',
                      )}
                    >
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
              )}
              onReorder={updateTaskOrder}
            />
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

// tasks.map((task) => (
//               <div
//                 key={task.id}
//                 className="flex items-center justify-between p-3 border rounded-md"
//               >
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-6 w-6"
//                     onClick={() => toggleTaskCompletion(task.id)}
//                   >
//                     <div
//                       className={cn(
//                         'h-4 w-4 border rounded-sm flex items-center justify-center',
//                         task.isCompleted
//                           ? 'bg-primary border-primary'
//                           : 'border-input',
//                       )}
//                     >
//                       {task.isCompleted && (
//                         <Check className="h-3 w-3 text-primary-foreground" />
//                       )}
//                     </div>
//                   </Button>
//                   <span
//                     className={cn(
//                       task.isCompleted && 'line-through text-muted-foreground',
//                     )}
//                   >
//                     {task.text}
//                   </span>
//                 </div>
//                 <X
//                   className="size-5 cursor-pointer hover:text-red-500"
//                   onClick={() => removeTask(task.id)}
//                 />
//               </div>
//             ))
//           )
