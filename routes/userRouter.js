import { Router } from 'express'
import { UserController } from '../controllers/userController.js'
import { validateData, validateId } from '../middleware/dataValidation.js'
import { verifyPassword } from '../middleware/verifyPassword.js'
import { createUserSchema, updateUserSchema, sellerSchema, createAdminSchema } from '../schemas/user.schema.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkRoles } from '../middleware/checkRoles.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  // Get your own user
  userRouter.get('/',
    verifyToken,
    userController.getUser)

  userRouter.get('/profile',
    verifyToken,
    userController.getProfile
  )

  // Create a new user and adding it to the customers table
  userRouter.post('/',
    validateData(createUserSchema, 'body'),
    userController.createUser
  )

  // Update the user info
  userRouter.patch('/',
    validateData(updateUserSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.updateUser
  )

  // Delete the entire user
  userRouter.delete('/',
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.deleteUser
  )

  // ---------------------------- Sellers endpoints ----------------------------
  // Insert an existing user into the sellers table
  userRouter.post('/sellers',
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.createSeller
  )

  // delete a user only from the sellers table
  userRouter.delete('/sellers',
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    userController.deleteSeller
  )
  // ---------------------------- Admin endpoints ----------------------------
  // Get all existing admins (only for super admin role)
  userRouter.get('/admin',
    verifyToken,
    checkRoles('superadmin'),
    userController.getAdmins
  )
  // Create admin (only for super admin role)
  userRouter.post('/admin',
    validateData(createAdminSchema, 'body'),
    verifyToken,
    verifyPassword,
    checkRoles('superadmin'),
    userController.createAdmin
  )

  // Delete an admin (only for super admin role)
  userRouter.delete('/admin/:id',
    validateId,
    validateData(sellerSchema, 'body'),
    verifyToken,
    verifyPassword,
    checkRoles('superadmin'),
    userController.deleteAdmin
  )

  return userRouter
}
