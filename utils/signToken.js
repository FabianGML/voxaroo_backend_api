import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const signToken = ({ uuid, username }) => {
  const currentDate = new Date()
  const token = jwt.sign({ sub: uuid, username, timestamp: currentDate }, config.jwtKey)
  return { token }
}
