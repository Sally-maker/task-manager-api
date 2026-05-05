import { TaskStatus } from '../generated/prisma/client.js'
import prisma from '../config/prisma.js'

interface CreateTaskData {
  title: string
  description?: string
  status?: TaskStatus
}

interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
}

export class TaskService {
  async create(userId: string, data: CreateTaskData) {
    return prisma.task.create({ data: { ...data, userId } })
  }

  async findAll(userId: string, page: number, limit: number, status?: TaskStatus) {
    const where = { userId, ...(status && { status }) }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.task.count({ where }),
    ])

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(userId: string, id: string) {
    const task = await prisma.task.findFirst({ where: { id, userId } })
    if (!task) {
      throw { status: 404, message: 'Task not found' }
    }
    return task
  }

  async update(userId: string, id: string, data: UpdateTaskData) {
    await this.findById(userId, id)
    return prisma.task.update({ where: { id }, data })
  }

  async delete(userId: string, id: string) {
    await this.findById(userId, id)
    await prisma.task.delete({ where: { id } })
  }
}
