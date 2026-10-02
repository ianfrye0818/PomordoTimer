import { z } from 'zod'

export const taskSchema = z
  .object({
    text: z.string().min(1, 'Please enter a task before submitting'),
    isCompleted: z.boolean().default(false),
    id: z.string().uuid(),
    order: z.number().int().min(0),
  })
  .strict()
export type Task = z.infer<typeof taskSchema>
