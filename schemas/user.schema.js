import Joi from 'joi'

const username = Joi.string().min(4).max(20)
const name = Joi.string().max(20)
const lastname = Joi.string().max(20)
const email = Joi.string().email()
const password = Joi.string()
  .messages({
    'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, de minimo 7 caracteres y maximo 20 y no contener caracteres especiales.'
  })
const isSeller = Joi.boolean()
// const city = Joi.string().valid('durango').messages({ 'any.only': 'La ciudad unicamente puede ser Durango' })
// const state = Joi.string().valid('durango').messages({ 'any.only': 'El estado unicamente puede ser Durango' })

export const createUserSchema = Joi.object({
  username: username.required(),
  name: name.required(),
  lastname: lastname.required(),
  email: email.required(),
  password: password.pattern(/^(?=.*[A-Z])(?!.*[\W_])(.{5,20})$/).required(),
  isSeller
  // city: city.required(),
  // state: state.required()
})

export const sellerSchema = Joi.object({
  password: password.required()
})

export const updateUserSchema = Joi.object({
  username,
  name,
  lastname,
  email,
  password: password.required()
  // city,
  // state
})

export const changePasswordSchema = Joi.object({
  password,
  newPassword: password.pattern(/^(?=.*[A-Z])(?!.*[\W_])(.{7,20})$/).required(),
  repeatPassword: Joi.string().valid(Joi.ref('newPassword')).messages({ 'any.only': 'Las contraseñas deben coincidir' })
})

export const loginUserSchema = Joi.object({
  email: email.allow(''),
  password: password.allow('')
})

export const createAdminSchema = Joi.object({
  username: username.required(),
  name: name.required(),
  lastname: lastname.required(),
  email: email.required(),
  password
  // city: city.required(),
  // state: state.required()
})
