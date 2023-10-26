export const checkRoles = (...roles) => {
  return (req, res, next) => {
    const role = req.role
    if (!role || !roles.includes(role)) return res.status(401).json({ error: 'Unauthorized' })
    next()
  }
}
