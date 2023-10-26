import { Router } from 'express'
import { AuthController } from '../controllers/AuthController.js'
import { validateData, validateId } from '../middleware/dataValidation.js'
import { loginUserSchema, changePasswordSchema } from '../schemas/user.schema.js'
import { verifyPassword } from '../middleware/verifyPassword.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const createAuthRouter = ({ authModel }) => {
  const authController = new AuthController({ authModel })
  const authRouter = Router()

  authRouter.post('/login',
    validateData(loginUserSchema, 'body'),
    authController.login)

  authRouter.patch('/',
    validateId,
    verifyPassword,
    validateData(changePasswordSchema, 'body'),
    verifyToken,
    authController.changePassword
  )

  // Recovery

  return authRouter
}
