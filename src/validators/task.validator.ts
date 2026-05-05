import { z } from 'zod'

const statusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(1000).optional(),
  status: statusEnum.optional().default('PENDING'),
})

export const updateTaskSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional(),
    status: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  })

export const taskQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .regex(/^\d+$/)
    .optional()
    .transform((v) => (v ? Math.min(parseInt(v, 10), 100) : 10)),
  status: statusEnum.optional(),
})
