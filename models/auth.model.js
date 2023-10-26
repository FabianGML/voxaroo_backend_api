import bcrypt from 'bcrypt'
import { connection } from '../db/config.js'
import { signToken } from '../utils/signToken.js'

export class Auth {
  static async login ({ email, password }) {
    // Making sure the user exist
    const [user] = await connection.query('SELECT password, username, BIN_TO_UUID(id) AS id FROM users WHERE email = ?;', [email])
    if (user.length === 0) return { error: 'El correo no esta asociado a ninguna cuenta' }
    const { id, username } = user[0]
    // Comparing the password with the encrypted db password
    const dbPassword = user[0].password
    const match = await bcrypt.compare(password, dbPassword)
    if (!match) return { error: 'La contraseña es incorrecta' }
    const [admin] = await connection.query('SELECT * FROM admins WHERE user_id = UUID_TO_BIN(?);', [id])
    // If the user is an admin we sign the token with its role
    const { token } = admin.length > 0 ? signToken({ uuid: id, username, role: admin[0].role }) : signToken({ uuid: id, username })
    return { id, token }
  }

  static async changePassword ({ id, newPassword }) {
    const hashPassword = await bcrypt.hash(newPassword, 12)
    await connection.query('UPDATE users SET password = ? WHERE id = UUID_TO_BIN(?);', [hashPassword, id])
    return { message: 'Contraseña actualizada correctamente' }
  }
}
