import bcrypt from 'bcrypt'
import { signToken } from '../utils/signToken.js'
import { connection } from '../db/config.js'
import { handleSqlError } from '../utils/handleSqlError.js'
import { generate } from 'generate-password'

export class User {
  static location = 'durango'

  /* ---------------------------------------------------
          Get the user based on the token recived
     ---------------------------------------------------
  */
  static async getUser ({ id }) {
    let isAdmin = false
    let isSuperAdmin = false
    const [result] = await connection.query('SELECT username, image FROM users WHERE id = UUID_TO_BIN(?);', [id])
    const [admin] = await connection.query('SELECT * FROM admins WHERE user_id = UUID_TO_BIN(?);', [id])
    if (admin.length > 0) {
      isSuperAdmin = admin[0].role === 'superadmin'
      isAdmin = admin[0].role === 'admin'
    }
    return { ...result[0], isAdmin, isSuperAdmin }
  }

  static async getProfile ({ id }) {
    const [result] = await connection.query('SELECT *, BIN_TO_UUID(id) AS id  FROM users WHERE id = UUID_TO_BIN(?)', [id])
    delete result[0].password
    delete result[0].recovery_token
    return { ...result[0] }
  }

  /* ---------------------------------------------------
          Validate the password recived in the request
     ---------------------------------------------------
  */
  static async checkPassword ({ id, password }) {
    // Retrieving the user hashed password and making sure the user actualy exist
    console.log(id)
    const [user] = await connection.query('SELECT password as hashPassword FROM users WHERE id = UUID_TO_BIN(?);', [id])
    if (user.length === 0) {
      return { error: 'No se encontro el usuario' }
    }
    // verifying if the password match with the hashed password from db
    const hashPassword = user[0].hashPassword
    const match = await bcrypt.compare(password, hashPassword)
    if (!match) return { error: 'Contraseña incorrecta' }
    return { message: 'Contraseña correcta' }
  }

  /* ---------------------------------------------------
                        Create new user
     ---------------------------------------------------
  */
  static async createUser ({ email, username, name, lastname, password }) {
    // Recovery the UUID to sign the jwt Token
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult
    const city = User.location
    const state = User.location
    // hashing the password
    password = await bcrypt.hash(password, 12)

    // signing the token and return it to the controller
    const { token } = signToken({ uuid, username })

    // Create the user in the database
    try {
      await connection.query(
        `INSERT INTO users (id, email, username, name, lastname, password, city, state)
          VALUES
              (UUID_TO_BIN(?),?,?,?,?,?,?,? );
        `,
        [uuid, email, username, name, lastname, password, city, state]
      )
    } catch (error) {
      return handleSqlError(error)
    }

    return { id: uuid, token }
  }

  /* ---------------------------------------------------
                      Update user
     ---------------------------------------------------
  */
  static async updateUser ({ id, email, username, name, lastname, token }) {
    // Search the user, if the user doesn't exist,
    try {
      const [user] = await connection.query('SELECT username FROM users WHERE id = UUID_TO_BIN(?);', [id])
      const dbUsername = user[0].username

      const city = this.location
      const state = this.location

      // updating the user entry
      await connection.query(
        'UPDATE users SET email = ?, username = ?, name = ?, lastname = ?, city = ?, state = ? WHERE id = UUID_TO_BIN(?);'
        , [email, username, name, lastname, city, state, id])
      // If the username changed, we sign the token again
      if (username !== dbUsername) token = signToken({ uuid: id, username }).token
      console.log('token user', token)
      return { message: 'Informacion actualizada correctamente', token }
    } catch (error) {
      return handleSqlError(error)
    }
  }

  static async deleteUser ({ id }) {
    // If the role isn't passed in the request, it means that we need to delete the entire user
    await this.deleteProfiles({ id })
    await connection.query('DELETE FROM users WHERE id = UUID_TO_BIN(?);', [id])
    return { message: 'Usuario eliminado' }
  }

  /* ---------------------------------------------------
                        Admins
     ---------------------------------------------------
  */

  static async getAdmins ({ id }) {
    const [result] = await connection.query('SELECT BIN_TO_UUID(users.id) AS id, users.name, users.lastname, users.username, users.email, users.city, users.state, role FROM admins JOIN users ON id= user_id WHERE id != UUID_TO_BIN(?);', [id])
    return result[0]
  }

  static async createAdmin ({ email, username, name, lastname }) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult
    const password = generate({ length: 12, numbers: true })
    const hashedPassword = await bcrypt.hash(password, 12)
    const location = 'durango'
    const city = location
    const state = location
    try {
      await connection.query(
        `INSERT INTO users (id, email, username, name, lastname, password, city, state)
          VALUES
              (UUID_TO_BIN(?),?,?,?,?,?,?,? );
        `,
        [uuid, email, username, name, lastname, hashedPassword, city, state]
      )
    } catch (error) {
      console.log(error)
    }
    await connection.query('INSERT INTO admins (user_id, role) VALUES (UUID_TO_BIN(?),?);', [uuid, 'admin'])
    return { email, username, password }
  }

  static async deleteAdmin ({ id }) {
    await connection.query('DELETE FROM admins WHERE user_id = UUID_TO_BIN(?);', [id])
    await connection.query('DELETE FROM users WHERE id = UUID_TO_BIN(?);', [id])
    return { message: 'Administrador eliminado correctamente' }
  }
}
