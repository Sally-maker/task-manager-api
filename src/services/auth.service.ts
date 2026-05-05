import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { AppError } from '../utils/errors.js'

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY_DAYS = 30

function generateTokenPair(userId: string) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
  const refreshToken = crypto.randomBytes(64).toString('hex')
  return { accessToken, refreshToken }
}

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      throw new AppError(409, 'Email already in use')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return user
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new AppError(401, 'Invalid credentials')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new AppError(401, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = generateTokenPair(user.id)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    })

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email },
    }
  }

  async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({ where: { token } })

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await prisma.refreshToken.delete({ where: { token } })
      throw new AppError(401, 'Invalid or expired refresh token')
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(stored.userId)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token } }),
      prisma.refreshToken.create({
        data: { token: newRefreshToken, userId: stored.userId, expiresAt },
      }),
    ])

    return { accessToken, refreshToken: newRefreshToken }
  }

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } })
  }
}
