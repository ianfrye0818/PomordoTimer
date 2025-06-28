import { Button } from './ui/button'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { TIME_PRESETS, useTimer } from './timer-provider'
import { useForm } from 'react-hook-form'
import { FormInputItem } from './ui/FormInputItem'
import { z } from 'zod'
import { Form } from './ui/form'

const schema = z.object({
  workTime: z.coerce.number().min(0.5).max(60).step(0.5).default(25),
  shortBreakTime: z.coerce.number().min(0.5).max(60).step(0.5).default(5),
  longBreakTime: z.coerce.number().min(0.5).max(60).step(0.5).default(15),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(10).default(4),
  isAudioEnabled: z.boolean().default(true),
})

type SettingsFormValues = z.infer<typeof schema>

export function SettingsForm({ setOpen }: { setOpen: () => void }) {
  const {
    workTime,
    shortBreakTime,
    longBreakTime,
    sessionsBeforeLongBreak,
    isAudioEnabled,
  } = useTimer()
  const { saveSettings } = useTimer()
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      workTime,
      longBreakTime,
      sessionsBeforeLongBreak,
      shortBreakTime,
      isAudioEnabled,
    },
  })

  const onSubmit = (data: SettingsFormValues) => {
    const { isAudioEnabled, ...settings } = data
    saveSettings({ settings, isAudioEnabled })
    setOpen()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="workTime">Work Time</Label>
          <div className="flex gap-2">
            <Select
              value={form.watch('workTime').toString()}
              onValueChange={(value) =>
                form.setValue('workTime', Number(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PRESETS.map((preset) => (
                  <SelectItem
                    key={preset.value}
                    value={preset.value.toString()}
                  >
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Select how long you would like to work
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="shortBreakTime">Short Break Time</Label>
          <div className="flex gap-2">
            <Select
              value={form.watch('shortBreakTime').toString()}
              onValueChange={(value) =>
                form.setValue('shortBreakTime', Number(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PRESETS.map((preset) => (
                  <SelectItem
                    key={preset.value}
                    value={preset.value.toString()}
                  >
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Select how long you would like to take a short break
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="longBreakTime">Long Break Time</Label>
          <div className="flex gap-2">
            <Select
              value={form.watch('longBreakTime').toString()}
              onValueChange={(value) =>
                form.setValue('longBreakTime', Number(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {TIME_PRESETS.map((preset) => (
                  <SelectItem
                    key={preset.value}
                    value={preset.value.toString()}
                  >
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Select how long you would like to take a long break
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="sessionsBeforeLongBreak">
            How many sessions before a long break?
          </Label>
          <FormInputItem<typeof schema>
            control={form.control}
            name="sessionsBeforeLongBreak"
            type="number"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="isAudioEnabled">Enable Alarm</Label>
          <Switch
            id="isAudioEnabled"
            name="isAudioEnabled"
            checked={form.watch('isAudioEnabled')}
            onCheckedChange={(checked) =>
              form.setValue('isAudioEnabled', checked)
            }
          />
        </div>

        <Button type="submit" className="w-full">
          Save Settings
        </Button>
      </form>
    </Form>
  )
}
