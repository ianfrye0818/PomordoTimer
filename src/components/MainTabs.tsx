import { Coffee, ListTodo } from 'lucide-react'
import { FocusSessionCard } from './FocusSessionCard'
import { TasksCard } from './TasksCard'
import { TimerCard } from './TimerCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

export function MainTabs() {
  return (
    <Tabs defaultValue="focus" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="focus" className="flex items-center gap-2">
          <Coffee className="h-4 w-4" />
          Focus
        </TabsTrigger>
        <TabsTrigger value="todos" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          To-Dos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="focus" className="space-y-6">
        <FocusSessionCard />
        <TimerCard />
      </TabsContent>

      <TabsContent value="todos">
        <TasksCard />
      </TabsContent>
    </Tabs>
  )
}
