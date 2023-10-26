export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel
  }

  login = async (req, res) => {
    const { email, password } = req.body
    const result = await this.authModel.login({ email, password })
    if (result.error) return res.status(400).json(result)
    res.json(result)
  }

  changePassword = async (req, res) => {
    try {
      const id = req.id
      const { newPassword } = req.body
      const result = await this.authModel.changePassword({ id, newPassword })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
