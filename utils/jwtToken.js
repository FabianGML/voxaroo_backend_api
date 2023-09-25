import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const signToken = ({ uuid, username }) => {
  const currentDate = new Date()
  const token = jwt.sign({ sub: uuid, username, timestamp: currentDate }, config.jwtKey)
  return { token }
}

export const verifyToken = ({ token }) => {
  const result = jwt.verify(token, config.jwtKey, (err, decoded) => {
    let daysPassed
    if (decoded) {
      const currentTimestamp = new Date()
      const tokenTimestamp = new Date(decoded.timestamp)
      daysPassed = (currentTimestamp - tokenTimestamp) / (1000 * 60 * 60 * 24)
    }
    if (err || daysPassed > 21) {
      return { message: 'token invalido' }
    }
    return decoded
  })
  return result
}

// Get the token from the header but making sure is passed
export const getBearer = (req, res) => {
  if (!req.headers.authorization) {
    return res.json({ message: 'token invalido' })
  }
  const token = req.headers.authorization.split(' ')
  return token[1]
}
