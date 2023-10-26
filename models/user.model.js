import bcrypt from 'bcrypt'
import { signToken } from '../utils/signToken.js'
import { connection } from '../db/config.js'
import { handleSqlError } from '../utils/handleSqlError.js'
import { generate } from 'generate-password'

export class User {
  constructor () {
    this.location = 'durango'
  }

  /* ---------------------------------------------------
          Get the user based on the token recived
     ---------------------------------------------------
  */
  static async getUser ({ id }) {
    let isAdmin = false
    let isSeller = false
    const [result] = await connection.query('SELECT username, image FROM users WHERE id = UUID_TO_BIN(?);', [id])
    const [admin] = await connection.query('SELECT * FROM admins WHERE user_id = UUID_TO_BIN(?);', [id])
    const [seller] = await connection.query('SELECT * FROM sellers WHERE user_id = UUID_TO_BIN(?);', [id])
    if (admin.length > 0) isAdmin = true
    if (seller.length > 0) isSeller = true
    return { ...result[0], isAdmin, isSeller }
  }

  static async getProfile ({ id }) {
    // const [result] = await connection.query('SELECT BIN_TO_UUID(id) as id, username, image')
  }

  /* ---------------------------------------------------
                        Create new user
     ---------------------------------------------------
  */
  static async createUser ({ email, username, name, lastname, password, isAdmin }) {
    // Recovery the UUID to sign the jwt Token
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult
    const city = this.location
    const state = this.location
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
      await this.createCustomerProfile({ uuid })
    } catch (error) {
      return handleSqlError(error)
    }
    if (isAdmin) await this.createSellerProfile({ id: uuid })

    return { id: uuid, token }
  }

  /* ---------------------------------------------------
        Create profile wether is customer or admin
     ---------------------------------------------------
  */
  static async createSellerProfile ({ id }) {
    // Create the admin with the user_id reference
    try {
      const [result] = await connection.query('INSERT INTO sellers (user_id) VALUE (UUID_TO_BIN(?));', [id])
      if (result) return { message: 'Tu perfil se añadio a los vendedores correctamente' }
    } catch (error) {
      return handleSqlError(error)
    }
  }

  static async createCustomerProfile ({ uuid }) {
    // Create the admin with the user_id reference
    await connection.query('INSERT INTO customers (user_id) VALUE (UUID_TO_BIN(?));', [uuid])
  }

  /* ---------------------------------------------------
                      Update user
     ---------------------------------------------------
  */
  static async updateUser ({ id, email, username, name, lastname }) {
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
      let token
      if (username !== dbUsername) token = signToken(id, username).token
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

  static async deleteProfiles ({ id }) {
    await connection.query('DELETE FROM sellers WHERE user_id = UUID_TO_BIN(?);', [id])
    await connection.query('DELETE FROM customers WHERE user_id = UUID_TO_BIN(?);', [id])
  }

  static async deleteSeller ({ id }) {
    const result = await connection.query('DELETE FROM sellers WHERE user_id = UUID_TO_BIN(?);', [id])
    return result
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
