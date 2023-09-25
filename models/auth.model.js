import bcrypt from 'bcrypt'
import { connection } from '../db/config.js'

export class Auth {
  static async verifyPassword ({ id, password }) {
    const [result] = await connection.query('SELECT password FROM users WHERE id = UUID_TO_BIN(?)', [id])
    const hashPassword = result[0].password
    const match = await bcrypt.compare(password, hashPassword)
    if (!match) {
      return { message: 'La contraseña no es correcta' }
    }
    return { match }
  }
}
