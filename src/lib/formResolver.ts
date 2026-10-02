import type {
  FieldError,
  FieldErrors,
  FieldValues,
  ResolverResult,
} from 'react-hook-form'
import { z } from 'zod'

export const formResolver =
  <T extends FieldValues>(schema: z.ZodSchema<any>) =>
  (values: T): ResolverResult<T> => {
    const result = schema.safeParse(values)

    if (result.success) {
      return {
        values: result.data,
        errors: {},
      }
    }

    const fieldErrors: FieldErrors<T> = {}

    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')

      if (path) {
        const fieldError: FieldError = {
          type: 'validation',
          message: issue.message,
        }

        fieldErrors[path as keyof T] = fieldError as FieldErrors<T>[keyof T]
      } else {
        const rootError: FieldError = {
          type: 'validation',
          message: issue.message,
        }

        fieldErrors['root' as keyof T] = rootError as FieldErrors<T>[keyof T]
      }
    })

    return {
      values: {},
      errors: fieldErrors,
    }
  }
