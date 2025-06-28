import { type Control, type FieldPath } from 'react-hook-form'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import type { HTMLInputTypeAttribute } from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from './form'
import ErrorMessage from './ErrorMessage'
import { Input } from './input'

export interface FormInputItemProps<T extends z.ZodTypeAny>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<z.infer<T>, any>
  name: FieldPath<z.infer<T>>
  label?: string
  borderLabel?: string
  labelClassName?: string
  type?: HTMLInputTypeAttribute
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  iconClassName?: string
  buttonClassName?: string
  showPassword?: boolean
  setShowPassword?: (showPassword: boolean) => void
  formDescription?: string
}

export function FormInputItem<T extends z.ZodTypeAny>({
  control,
  name,
  label,
  placeholder,
  formDescription,
  className,
  labelClassName,
  type,
  iconClassName,
  buttonClassName,
  showPassword,
  setShowPassword,
  ...props
}: FormInputItemProps<T>) {
  const shouldShowPassword = () => {
    if (type === 'password' && showPassword) {
      return 'text'
    }
    return type
  }
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isError = !!fieldState.error
        return (
          <FormItem className="flex flex-col gap-2">
            {label && (
              <FormLabel className={cn(labelClassName)}>
                {label}{' '}
                {props.required && <span className="text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Input
                  placeholder={placeholder}
                  className={cn(
                    'w-full',
                    isError && 'border-red-500',
                    className,
                  )}
                  type={shouldShowPassword()}
                  {...field}
                  {...props}
                />
              </div>
            </FormControl>
            {formDescription && (
              <FormDescription className="text-sm text-gray-500">
                {formDescription}
              </FormDescription>
            )}
            <ErrorMessage
              message={fieldState.error?.message}
              className="text-left"
            />
          </FormItem>
        )
      }}
    />
  )
}
