import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import * as taskController from '../controllers/task.controller'

const router = Router()

router.use(authenticate)

router.post('/', taskController.create)
router.get('/', taskController.findAll)
router.get('/:id', taskController.findById)
router.put('/:id', taskController.update)
router.delete('/:id', taskController.remove)

export default router
