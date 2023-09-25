import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { validateData } from '../middleware/dataValidation.js'
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get('/', userController.getUser)

  userRouter.post('/',
    validateData(createUserSchema, 'body'),
    userController.createUser)

  userRouter.patch('/',
    validateData(updateUserSchema, 'body'),
    userController.updateUser)

  return userRouter
}
