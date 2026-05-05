import { Response } from 'express'
import { TaskStatus } from '../generated/prisma/client.js'
import { AuthRequest } from '../middlewares/auth.middleware.js'
import { TaskService } from '../services/task.service.js'
import {
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
} from '../validators/task.validator.js'
import { asyncHandler } from '../utils/async-handler.js'

const taskService = new TaskService()

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const task = await taskService.create(req.userId!, parsed.data)
  res.status(201).json(task)
})

export const findAll = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = taskQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const { page, limit, status } = parsed.data
  const result = await taskService.findAll(req.userId!, page, limit, status as TaskStatus)
  res.json(result)
})

export const findById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const task = await taskService.findById(req.userId!, req.params.id)
  res.json(task)
})

export const update = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = updateTaskSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const task = await taskService.update(req.userId!, req.params.id, parsed.data)
  res.json(task)
})

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await taskService.delete(req.userId!, req.params.id)
  res.status(204).send()
})
