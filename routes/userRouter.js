import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { validateData, validateId } from '../middleware/dataValidation.js'
import { verifyPassword } from '../middleware/verifyPassword.js'
import { createUserSchema, updateUserSchema, sellerSchema } from '../schemas/user.schema.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get('/:id',
    validateId,
    verifyToken,
    userController.getUser)

  userRouter.post('/',
    validateData(createUserSchema, 'body'),
    userController.createUser
  )

  userRouter.patch('/:id',
    validateId,
    validateData(updateUserSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.updateUser
  )

  userRouter.delete('/:id',
    validateId,
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.deleteUser
  )

  userRouter.post('/sellers/:id',
    validateId,
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.createSeller
  )

  userRouter.delete('/sellers/:id',
    validateId,
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.deleteSeller
  )

  return userRouter
}
