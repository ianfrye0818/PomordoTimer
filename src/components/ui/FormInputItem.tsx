import ErrorMessage from '@/components/ui/ErrorMessage'
import { cn } from 'cn'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { type InputHTMLAttributes, useState } from 'react'
import { type FieldPath, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { FormField } from '../ui/form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface Props<T extends z.ZodType<any>>
  extends InputHTMLAttributes<HTMLInputElement> {
  name: FieldPath<z.infer<T>>
  label?: string
  errorProps?: React.HTMLAttributes<HTMLDivElement>
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

export function FormInputItem<T extends z.ZodType<any>>({
  label,
  errorProps,
  containerProps,
  name,
  ...props
}: Props<T>) {
  const [showPassword, setShowPassword] = useState(false)
  const form = useFormContext()
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className={cn('flex flex-col gap-2', containerProps?.className)}>
          {label && (
            <Label>
              {label}{' '}
              {props.required && <span className="text-red-500">*</span>}
            </Label>
          )}
          <div className="relative">
            <Input
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              {...props}
              type={
                props.type === 'password'
                  ? showPassword
                    ? 'text'
                    : 'password'
                  : props.type
              }
              className={`${props.className || ''} ${props.type === 'password' ? 'pr-12' : ''}`}
            />
            {props.type === 'password' && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <ShowPasswordButton
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>
            )}
          </div>
          <ErrorMessage
            message={form.formState.errors[name]?.message as string | undefined}
            {...errorProps}
          />
        </div>
      )}
    />
  )
}

function ShowPasswordButton({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean
  setShowPassword: (showPassword: boolean) => void
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      type="button"
      className="h-8 w-8 p-0"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? (
        <EyeOffIcon className="icon" />
      ) : (
        <EyeIcon className="icon" />
      )}
    </Button>
  )
}
