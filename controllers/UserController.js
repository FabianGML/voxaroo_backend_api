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
      const id = req.id
      // calling the user model to get the profile
      const result = await this.userModel.getUser({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  getProfile = async (req, res) => {
    try {
      const id = req.id
      const result = await this.userModel.getProfile({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  createUser = async (req, res) => {
    try {
      const { email, username, name, lastname, password } = req.body
      const result = await this.userModel.createUser({ email, username, name, lastname, password })
      if (result && result.error) return res.status(400).json(result)
      res.status(201).json(result)
    } catch (error) {
      console.error(error)
    }
  }

  updateUser = async (req, res) => {
    try {
      const id = req.id
      const { email, username, name, lastname } = req.body
      const token = req.headers.authorization.split(' ')[1]
      const result = await this.userModel.updateUser({ id, email, username, name, lastname, token })
      if (result.error) return res.status(400).json(result)
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  deleteUser = async (req, res) => {
    try {
      const id = req.id
      const result = await this.userModel.deleteUser({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  checkPassword = async (req, res) => {
    try {
      const id = req.id
      const { password } = req.body
      const result = await this.userModel.checkPassword({ id, password })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  // ------------------- Seller Controllers ------------------------------
  // Create seller only if the user already exist (token must be provided)
  createSeller = async (req, res) => {
    try {
      const id = req.id
      const result = await this.userModel.createSellerProfile({ id })
      res.status(201).json(result)
    } catch (error) {
      console.log(error)
    }
  }

  deleteSeller = async (req, res) => {
    try {
      const id = req.id
      const result = await this.userModel.deleteSeller({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  // ------------------- Admin Controllers ------------------------------
  getAdmins = async (req, res) => {
    try {
      const id = req.id
      const result = await this.userModel.getAdmins({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  createAdmin = async (req, res) => {
    try {
      const role = req.role
      const { email, username, name, lastname } = req.body
      if (role !== 'superadmin') return res.status(401).json({ error: 'Unauthorized' })
      const result = await this.userModel.createAdmin({ email, username, name, lastname })
      res.status(201).json(result)
    } catch (error) {
      console.log(error)
    }
  }

  deleteAdmin = async (req, res) => {
    try {
      const { id } = req.params
      const result = await this.userModel.deleteAdmin({ id })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
