import { Router } from 'express'
import { CategoryController } from '../controllers/CategoryController.js'
import { validateData } from '../middleware/dataValidation.js'
import { verifyToken } from '../middleware/verifyToken.js'
import { checkRoles } from '../middleware/checkRoles.js'
import { verifyPassword } from '../middleware/verifyPassword.js'
import { createCategoriesSchema, validateUrlId, updateCategorySchema, deleteCategorySchema } from '../schemas/category.schema.js'

export const createCategoryRouter = ({ categoryModel }) => {
  const categoryRouter = Router()
  const categoryController = new CategoryController({ categoryModel })

  categoryRouter.get('/',
    categoryController.getCategories
  )

  categoryRouter.post('/',
    validateData(createCategoriesSchema, 'body'),
    verifyToken,
    checkRoles('superadmin', 'admin'),
    categoryController.createCategories
  )

  categoryRouter.patch('/:id',
    validateData(validateUrlId, 'params'),
    validateData(updateCategorySchema, 'body'),
    verifyToken,
    checkRoles('superadmin', 'admin'),
    categoryController.updateCategory
  )

  categoryRouter.delete('/:id',
    validateData(validateUrlId, 'params'),
    validateData(deleteCategorySchema, 'body'),
    verifyToken,
    verifyPassword,
    checkRoles('superadmin', 'admin'),
    categoryController.deleteCategory
  )

  return categoryRouter
}
