import Joi from 'joi'

const name = Joi.string().max(20).custom((value, helpers) => {
  if (/\d/.test(value)) {
    return helpers.message('No se permiten números en el campo.')
  }
  return value
})
const id = Joi.number().positive().required()

export const createCategoriesSchema = Joi.object({
  categories: Joi.array().items(Joi.object({ name }))
})

export const validateUrlId = Joi.object({
  id
})

export const updateCategorySchema = Joi.object({
  name
})

export const deleteCategorySchema = Joi.object({
  password: Joi.string().required()
})
