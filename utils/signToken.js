import jwt from 'jsonwebtoken'
import { config } from '../config/config.js'

export const signToken = ({ uuid, username, role }) => {
  const currentDate = new Date()
  const token = jwt.sign({ sub: uuid, username, timestamp: currentDate, role }, config.jwtKey)
  return { token }
}
