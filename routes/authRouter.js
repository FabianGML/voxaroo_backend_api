import { Router } from 'express'
import { AuthController } from '../controllers/AuthController.js'

export const createAuthRouter = ({ authModel }) => {
  const authController = new AuthController({ authModel })
  const authRouter = Router()

  authRouter.post('/:redirect', authController.verifyPassword)
  return authRouter
}
