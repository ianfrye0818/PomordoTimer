import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { Settings } from '@/types/pomodoro'
import { TIME_PRESETS } from '@/types/pomodoro'

interface SettingsFormProps {
  settings: Settings
  onSave: (newSettings: Settings) => void
}

export function SettingsForm({ onSave, settings }: SettingsFormProps) {
  const [formValues, setFormValues] = useState(settings)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setFormValues({ ...formValues, [name]: numValue })
    }
  }

  const handlePresetChange = (value: string, name: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue > 0) {
      setFormValues({ ...formValues, [name]: numValue })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formValues)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="workTime">Work Time</Label>
        <div className="flex gap-2">
          <Select
            value={formValues.workTime.toString()}
            onValueChange={(value) => handlePresetChange(value, 'workTime')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value.toString()}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="workTime"
            name="workTime"
            type="number"
            step="0.5"
            min="0.5"
            value={formValues.workTime}
            onChange={handleChange}
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter time in minutes (e.g., 0.5 for 30 seconds, 1.5 for 1 minute 30
          seconds)
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="shortBreakTime">Short Break Time</Label>
        <div className="flex gap-2">
          <Select
            value={formValues.shortBreakTime.toString()}
            onValueChange={(value) =>
              handlePresetChange(value, 'shortBreakTime')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value.toString()}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="shortBreakTime"
            name="shortBreakTime"
            type="number"
            step="0.5"
            min="0.5"
            value={formValues.shortBreakTime}
            onChange={handleChange}
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter time in minutes (e.g., 0.5 for 30 seconds, 1.5 for 1 minute 30
          seconds)
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="longBreakTime">Long Break Time</Label>
        <div className="flex gap-2">
          <Select
            value={formValues.longBreakTime.toString()}
            onValueChange={(value) =>
              handlePresetChange(value, 'longBreakTime')
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              {TIME_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value.toString()}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id="longBreakTime"
            name="longBreakTime"
            type="number"
            step="0.5"
            min="0.5"
            value={formValues.longBreakTime}
            onChange={handleChange}
            className="flex-1"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter time in minutes (e.g., 0.5 for 30 seconds, 1.5 for 1 minute 30
          seconds)
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="sessionsBeforeLongBreak">
          Sessions Before Long Break
        </Label>
        <Input
          id="sessionsBeforeLongBreak"
          name="sessionBeforeLongBreak"
          type="number"
          min="1"
          value={formValues.sessionBeforeLongBreak}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="isAudioEnabled">Enable Audio</Label>
        <Switch
          id="isAudioEnabled"
          name="isAudioEnabled"
          checked={formValues.isAudioEnabled}
          onCheckedChange={(checked) =>
            setFormValues({ ...formValues, isAudioEnabled: checked })
          }
        />
      </div>

      <Button type="submit" className="w-full">
        Save Settings
      </Button>
    </form>
  )
}
