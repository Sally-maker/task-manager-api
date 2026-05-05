import { Response } from 'express'
import { AuthService } from '../services/auth.service.js'
import { loginSchema, refreshSchema, registerSchema } from '../validators/auth.validator.js'
import { asyncHandler } from '../utils/async-handler.js'
import { AuthRequest } from '../middlewares/auth.middleware.js'

const authService = new AuthService()

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const user = await authService.register(
    parsed.data.name,
    parsed.data.email,
    parsed.data.password,
  )

  res.status(201).json(user)
})

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const result = await authService.login(parsed.data.email, parsed.data.password)
  res.json(result)
})

export const refresh = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  const tokens = await authService.refresh(parsed.data.refreshToken)
  res.json(tokens)
})

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors })
  }

  await authService.logout(parsed.data.refreshToken)
  res.status(204).send()
})
