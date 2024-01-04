import Joi from 'joi'

const stringsValidations = Joi
  .string()
  .max(20)
  .pattern(/^[^0-9]+$/)
  .messages({
    'any.required': 'El nombre y el apellido son obligatorios',
    'string.empty': 'El nombre y apellido no pueden estar vacío',
    'string.pattern.base': 'El nombre y el apellido no pueden contener números'
  })
const username = Joi.string().min(4).max(20).messages({
  'string.empty': 'El nombre de usuario no puede estar vacío',
  'string.min': 'El nombre de usuario debe contener al menos 4 caracteres',
  'string.max': 'El nombre de usuario debe contener menos de 20 caracteres'
})
const name = stringsValidations
const lastname = stringsValidations
const email = Joi.string().email().messages({
  'string.empty': 'El email no puede estar vacío',
  'string.email': 'El email debe ser un email valido'
})
const password = Joi.string()
  .messages({
    'string.pattern.base': 'La contraseña debe contener al menos una letra mayúscula, de minimo 7 caracteres y maximo 20 y no contener caracteres especiales.',
    'string.empty': 'La contraseña no puede estar vacia'
  })
const repeatPassword = Joi.string()
  .valid(Joi.ref('password'))
  .messages({
    'any.only': 'Las contraseñas deben coincidir',
    'string.empty': 'Por favor, repita la contraseñas'
  }).required()
// const city = Joi.string().valid('durango').messages({ 'any.only': 'La ciudad unicamente puede ser Durango' })
// const state = Joi.string().valid('durango').messages({ 'any.only': 'El estado unicamente puede ser Durango' })

export const createUserSchema = Joi.object({
  username: username.required().messages({
    'string.empty': 'El Nombre de Usuario no puede estar vacío'
  }),
  name: name.required(),
  lastname: lastname.required(),
  email: email.required().messages({
    'string.empty': 'El campo de email no puede estar vacío'
  }),
  password: password.pattern(/^(?=.*[A-Z])(?!.*[\W_])(.{5,20})$/).required(),
  repeatPassword
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
  email
})

export const changePasswordSchema = Joi.object({
  password,
  newPassword: password.pattern(/^(?=.*[A-Z])(?!.*[\W_])(.{7,20})$/).required(),
  repeatPassword: Joi.string().valid(Joi.ref('newPassword')).messages({ 'any.only': 'Las contraseñas deben coincidir' })
})

export const validatePassword = Joi.object({
  password: password.required()
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
