import { NextFunction, Request, Response } from 'express'
import { AppError } from '../utils/errors.js'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message })
  }

  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
}
