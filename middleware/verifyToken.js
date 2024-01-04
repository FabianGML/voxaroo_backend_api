import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'
import { connection } from '../db/config.js'

export const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = req.headers.authorization.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  jwt.verify(token, config.jwtKey, async (err, decoded) => {
    let daysPassed
    let dbUsername
    let username
    if (decoded) {
      const id = decoded.sub
      // Making sure the token is valid by comparing the token's id and username with the id param and db username
      console.log('decoded', decoded)
      const [user] = await connection.query('SELECT username FROM users WHERE id = UUID_TO_BIN(?);', [id])
      console.log(user)
      if (user.length === 0) return res.status(400).json({ error: 'El usuario no existe' })
      if (id !== decoded.sub) return res.status(401).json({ error: 'Unauthorized' })
      dbUsername = user[0].username
      username = decoded.username
      // Comparing the current time with the token timestamp
      const currentTimestamp = new Date()
      const tokenTimestamp = new Date(decoded.timestamp)
      daysPassed = (currentTimestamp - tokenTimestamp) / (1000 * 60 * 60 * 24)
      req.id = decoded.sub
      req.username = decoded.username
      req.role = decoded.role
    }
    if (err || daysPassed > 21 || username !== dbUsername) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    next()
  })
}
