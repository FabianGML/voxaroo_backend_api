import bcrypt from 'bcrypt'
import { signToken } from '../utils/jwtToken.js'
import { connection } from '../db/config.js'
import { verifyPassword } from '../utils/verifyPassword.js'
import { handleSqlError } from '../utils/handleSqlError.js'

export class User {
  /* ---------------------------------------------------
          Get the user based on the token recived
     ---------------------------------------------------
  */
  static async getUser ({ id, username }) {
    const [result] = await connection.query('SELECT * FROM users WHERE id = UUID_TO_BIN(?);', [id])
    if (username !== result[0].username) return { message: 'token invalido' }
    return result[0]
  }

  /* ---------------------------------------------------
                        Create new user
     ---------------------------------------------------
  */
  static async createUser ({ email, username, name, lastname, password, city, state, isCustomer }) {
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
              (UUID_TO_BIN(?),?,?,?,?,?,?,? )
        `,
        [uuid, email, username, name, lastname, password, city, state]
      )
    } catch (error) {
      return handleSqlError(error)
    }

    const table = isCustomer ? 'customers' : 'sellers'
    this.createProfile({ uuid, table })
    return { token }
  }

  /* ---------------------------------------------------
        Create profile wether is customer or seller
     ---------------------------------------------------
  */
  static async createProfile ({ uuid, table }) {
    // Create the seller with the user_id reference
    await connection.query(`INSERT INTO ${table} (user_id) VALUE (UUID_TO_BIN(?));`, [uuid])
  }

  /* ---------------------------------------------------
                      Update user
     ---------------------------------------------------
  */
  static async updateUser ({ id, email, username, name, lastname, password, city, state }) {
    // Search the user, if the user doesn't exist,
    try {
      // Retrieving the user hashed password and making sure the user actualy exist
      const [user] = await connection.query('SELECT username, password as hashPassword FROM users WHERE id = UUID_TO_BIN(?);', [id])
      if (user.length === 0) {
        return { error: 'No se encontro el usuario' }
      }
      // verifying if the password match with the hashed password from db
      const hashPassword = user[0].hashPassword
      const dbUsername = user[0].username
      const match = await verifyPassword({ password, hashPassword })

      if (!match) return { error: 'La contraseña no es correcta' }
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
}
