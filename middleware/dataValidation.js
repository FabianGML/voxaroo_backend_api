export function validateData (schema, property) {
  return (req, res, next) => {
    const data = req[property]
    const { error } = schema.validate(data, { abortEarly: false })
    if (error) {
      const errorMessage = error.details.map(arr => arr.message)
      res.json({ errorMessage })
    }
    next()
  }
}
