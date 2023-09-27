import bcrypt from 'bcrypt'
import { signToken } from '../utils/signToken.js'
import { connection } from '../db/config.js'
import { handleSqlError } from '../utils/handleSqlError.js'

export class User {
  /* ---------------------------------------------------
          Get the user based on the token recived
     ---------------------------------------------------
  */
  static async getUser ({ id, username }) {
    const [result] = await connection.query('SELECT * FROM users WHERE id = UUID_TO_BIN(?);', [id])
    if (username !== result[0].username) return { error: 'token' }
    return result[0]
  }

  /* ---------------------------------------------------
                        Create new user
     ---------------------------------------------------
  */
  static async createUser ({ email, username, name, lastname, password, city, state, isSeller }) {
    // Recovery the UUID to sign the jwt Token
    const [uuidResult] = await connection.query('SELECT UUID() uuid')
    const [{ uuid }] = uuidResult

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
    if (isSeller) await this.createSellerProfile({ id: uuid })

    return { id: uuid, token }
  }

  /* ---------------------------------------------------
        Create profile wether is customer or seller
     ---------------------------------------------------
  */
  static async createSellerProfile ({ id }) {
    // Create the seller with the user_id reference
    try {
      const [result] = await connection.query('INSERT INTO sellers (user_id) VALUE (UUID_TO_BIN(?));', [id])
      if (result) return { message: 'Tu perfil se añadio a los vendedores correctamente' }
    } catch (error) {
      return handleSqlError(error)
    }
  }

  static async createCustomerProfile ({ uuid }) {
    // Create the seller with the user_id reference
    await connection.query('INSERT INTO customers (user_id) VALUE (UUID_TO_BIN(?));', [uuid])
  }

  /* ---------------------------------------------------
                      Update user
     ---------------------------------------------------
  */
  static async updateUser ({ id, email, username, name, lastname, city, state }) {
    // Search the user, if the user doesn't exist,
    try {
      const [user] = await connection.query('SELECT username FROM users WHERE id = UUID_TO_BIN(?);', [id])
      const dbUsername = user[0].username

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
}
