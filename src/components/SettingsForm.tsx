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
import { useTheme } from './theme-provider'
import { Input } from './ui/input'
import ErrorMessage from './ui/ErrorMessage'
import { useState } from 'react'

const CUSTOM_VALUE = 'custom'

type TimeUnit = 'minutes' | 'seconds'

const CUSTOM_LIMITS: Record<TimeUnit, { min: number; max: number }> = {
  minutes: { min: 1, max: 180 },
  seconds: { min: 1, max: 3600 },
}

const schema = z.object({
  workTime: z.coerce
    .number()
    .positive()
    .max(CUSTOM_LIMITS.minutes.max)
    .default(25),
  shortBreakTime: z.coerce
    .number()
    .positive()
    .max(CUSTOM_LIMITS.minutes.max)
    .default(5),
  longBreakTime: z.coerce
    .number()
    .positive()
    .max(CUSTOM_LIMITS.minutes.max)
    .default(15),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(10).default(4),
  runContinuously: z.boolean().default(false),
  isAudioEnabled: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
})

type SettingsFormValues = z.infer<typeof schema>

export function SettingsForm({ setOpen }: { setOpen: () => void }) {
  const { theme, setTheme } = useTheme()
  const {
    workTime,
    shortBreakTime,
    longBreakTime,
    sessionsBeforeLongBreak,
    runContinuously,
    isAudioEnabled,
  } = useTimer()
  const { saveSettings } = useTimer()
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      workTime,
      longBreakTime,
      sessionsBeforeLongBreak,
      shortBreakTime,
      runContinuously,
      isAudioEnabled,
      theme,
    },
  })

  const [invalidFields, setInvalidFields] = useState<Array<string>>([])

  const setFieldValidity = (field: string, valid: boolean) => {
    setInvalidFields((prev) => {
      const without = prev.filter((f) => f !== field)
      return valid ? without : [...without, field]
    })
  }

  const onSubmit = (data: SettingsFormValues) => {
    const { isAudioEnabled, theme, ...settings } = data
    saveSettings({ settings, isAudioEnabled })
    setTheme(theme)
    setOpen()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DurationField
          id="workTime"
          label="Work Time"
          description="Select how long you would like to work"
          value={form.watch('workTime')}
          onChange={(value) => form.setValue('workTime', value)}
          onValidityChange={(valid) => setFieldValidity('workTime', valid)}
        />

        <DurationField
          id="shortBreakTime"
          label="Short Break Time"
          description="Select how long you would like to take a short break"
          value={form.watch('shortBreakTime')}
          onChange={(value) => form.setValue('shortBreakTime', value)}
          onValidityChange={(valid) =>
            setFieldValidity('shortBreakTime', valid)
          }
        />

        <DurationField
          id="longBreakTime"
          label="Long Break Time"
          description="Select how long you would like to take a long break"
          value={form.watch('longBreakTime')}
          onChange={(value) => form.setValue('longBreakTime', value)}
          onValidityChange={(valid) => setFieldValidity('longBreakTime', valid)}
        />

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

        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="runContinuously">Run Continuously</Label>
            <Switch
              id="runContinuously"
              name="runContinuously"
              checked={form.watch('runContinuously')}
              onCheckedChange={(checked) =>
                form.setValue('runContinuously', checked)
              }
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Automatically start each break and work session, stopping after the
            long break
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={form.watch('theme')}
            onValueChange={(value) =>
              form.setValue('theme', value as 'light' | 'dark' | 'system')
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
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

        <Button
          type="submit"
          className="w-full"
          disabled={invalidFields.length > 0}
        >
          Save Settings
        </Button>
      </form>
    </Form>
  )
}

function isValidCustomTime(input: string, unit: TimeUnit) {
  const amount = Number(input)
  const { min, max } = CUSTOM_LIMITS[unit]
  return (
    input.trim() !== '' &&
    Number.isInteger(amount) &&
    amount >= min &&
    amount <= max
  )
}

// Settings store durations in minutes, so seconds are stored as fractions
function toMinutes(amount: number, unit: TimeUnit) {
  return unit === 'seconds' ? amount / 60 : amount
}

function DurationField({
  id,
  label,
  description,
  value,
  onChange,
  onValidityChange,
}: {
  id: string
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  onValidityChange: (valid: boolean) => void
}) {
  const [isCustom, setIsCustom] = useState(
    () => !TIME_PRESETS.some((preset) => preset.value === value),
  )
  const [unit, setUnit] = useState<TimeUnit>(() =>
    Number.isInteger(value) ? 'minutes' : 'seconds',
  )
  const [customInput, setCustomInput] = useState(() =>
    (Number.isInteger(value) ? value : Math.round(value * 60)).toString(),
  )

  const { min, max } = CUSTOM_LIMITS[unit]
  const customError = !isValidCustomTime(customInput, unit)
    ? `Enter a whole number of ${unit} between ${min} and ${max}`
    : undefined

  const applyCustom = (input: string, nextUnit: TimeUnit) => {
    const valid = isValidCustomTime(input, nextUnit)
    if (valid) onChange(toMinutes(Number(input), nextUnit))
    onValidityChange(valid)
  }

  const handleSelect = (selected: string) => {
    if (selected === CUSTOM_VALUE) {
      // Start from the current duration in whichever unit represents it exactly
      const nextUnit: TimeUnit = Number.isInteger(value) ? 'minutes' : 'seconds'
      const input = (
        nextUnit === 'minutes' ? value : Math.round(value * 60)
      ).toString()
      setIsCustom(true)
      setUnit(nextUnit)
      setCustomInput(input)
      applyCustom(input, nextUnit)
      return
    }
    setIsCustom(false)
    onChange(Number(selected))
    onValidityChange(true)
  }

  const handleCustomInput = (input: string) => {
    setCustomInput(input)
    applyCustom(input, unit)
  }

  const handleUnitChange = (nextUnit: TimeUnit) => {
    setUnit(nextUnit)
    applyCustom(customInput, nextUnit)
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={isCustom ? CUSTOM_VALUE : value.toString()}
        onValueChange={handleSelect}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Select preset" />
        </SelectTrigger>
        <SelectContent>
          {TIME_PRESETS.map((preset) => (
            <SelectItem key={preset.value} value={preset.value.toString()}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_VALUE}>Custom...</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              step={1}
              value={customInput}
              onChange={(e) => handleCustomInput(e.target.value)}
              aria-label={`${label} in ${unit}`}
              aria-invalid={!!customError}
              className={customError ? 'border-red-500' : undefined}
            />
            <Select
              value={unit}
              onValueChange={(next) => handleUnitChange(next as TimeUnit)}
            >
              <SelectTrigger className="w-32" aria-label={`${label} unit`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="seconds">Seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ErrorMessage message={customError} className="text-left text-sm" />
        </>
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
