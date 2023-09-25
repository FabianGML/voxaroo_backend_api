import { getBearer, verifyToken } from '../utils/jwtToken.js'

export class UserController {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  /* ---------------------------------------------------
                        Get The user
     ---------------------------------------------------
  */
  getUser = async (req, res) => {
    try {
      const token = getBearer(req, res)
      // Verify if the token is valid
      const payload = verifyToken({ token })
      if (payload.message) {
        return res.json({ message: payload.message })
      }
      // calling the user model to get the profile
      const result = await this.userModel.getUser({ id: payload.sub, username: payload.username })
      delete result.id
      delete result.password
      delete result.recovery_token
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  createUser = async (req, res) => {
    try {
      const { email, username, name, lastname, password, roles, city, state, role } = req.body
      const isCustomer = role === 'customer' || false
      const result = await this.userModel.createUser({ email, username, name, lastname, password, roles, city, state, isCustomer })
      if (result.error) return res.status(400).json(result)
      res.json(result)
    } catch (error) {
      console.error(error)
    }
  }

  updateUser = async (req, res) => {
    try {
      const { email, username, name, lastname, password, roles, city, state } = req.body
      const token = getBearer(req, res)
      const payload = verifyToken({ token })
      const result = await this.userModel.updateUser({ id: payload.sub, email, username, name, lastname, password, roles, city, state })
      if (result.error) return res.status(400).json(result)
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
