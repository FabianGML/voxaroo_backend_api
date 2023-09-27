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
      const { id } = req.params
      const username = req.username
      // calling the user model to get the profile
      const result = await this.userModel.getUser({ id, username })
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
      const { email, username, name, lastname, password, roles, city, state, isSeller } = req.body
      const result = await this.userModel.createUser({ email, username, name, lastname, password, roles, city, state, isSeller })
      if (result.error) return res.status(400).json(result)
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
    }
  }

  // Create seller only if the user already exist (token must be provided)
  createSeller = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.userModel.createSellerProfile({ id })
      res.status(201).json(result)
    } catch (error) {
      console.log(error)
    }
  }

  updateUser = async (req, res) => {
    try {
      const { id } = req.params
      const { email, username, name, lastname, password, roles, city, state } = req.body
      const result = await this.userModel.updateUser({ id, email, username, name, lastname, password, roles, city, state })
      if (result.error) return res.status(400).json(result)
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.userModel.deleteUser({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  deleteSeller = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.userModel.deleteSeller({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
