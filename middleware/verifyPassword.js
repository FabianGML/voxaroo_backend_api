import bcrypt from 'bcrypt'
import { connection } from '../db/config.js'

/**
 * Verify if the password match with the hashed password from db
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifyPassword = async (req, res, next) => {
  const id = req.id
  const { password } = req.body
  // Retrieving the user hashed password and making sure the user actualy exist
  const [user] = await connection.query('SELECT username, password as hashPassword FROM users WHERE id = UUID_TO_BIN(?);', [id])
  if (user.length === 0) {
    return res.json({ error: 'No se encontro el usuario' })
  }
  // verifying if the password match with the hashed password from db
  const hashPassword = user[0].hashPassword
  const match = await bcrypt.compare(password, hashPassword)
  if (!match) return res.json({ error: 'Contraseña incorrecta' })
  next()
}
