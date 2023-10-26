export const validateData = (schema, property) => {
  return (req, res, next) => {
    const data = req[property]
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      const errorMessage = error.details.map(arr => arr.message)
      console.log(errorMessage)
      return res.status(400).json({ error: errorMessage })
    }
    next()
  }
}

export const validateId = (req, res, next) => {
  const { id } = req.params
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  if (!uuidRegex.test(id)) return res.status(404).json({ error: 'No existe el usuario' })
  next()
}
