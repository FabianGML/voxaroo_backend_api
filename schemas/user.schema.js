import Joi from 'joi'

const username = Joi.string().min(4).max(20)
const name = Joi.string().max(20)
const lastname = Joi.string().max(20)
const email = Joi.string().email()
const password = Joi.string()
  .pattern(/^(?=.*[A-Z])(?!.*[\W_])(.{5,20})$/)
  .messages({
    'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula y no contener caracteres especiales.',
    'string.empty': 'La contraseña no puede estar vacía.'
  })
const role = Joi.string().valid('customer', 'seller')
const city = Joi.string().valid('durango').messages({ 'any.only': 'La ciudad unicamente puede ser Durango' })
const state = Joi.string().valid('durango').messages({ 'any.only': 'El estado unicamente puede ser Durango' })

export const createUserSchema = Joi.object({
  username: username.required(),
  name: name.required(),
  lastname: lastname.required(),
  email: email.required(),
  password: password.required(),
  role: role.required(),
  city: city.required(),
  state: state.required()
})

export const updateUserSchema = Joi.object({
  username,
  name,
  lastname,
  email,
  password: password.required(),
  city,
  state
})
