import { getBearer, verifyToken } from '../utils/jwtToken.js'

export class AuthController {
  constructor ({ authModel }) {
    this.authModel = authModel
  }

  verifyPassword = async (req, res) => {
    try {
      const { password } = req.body
      const { redirect } = req.params
      const token = getBearer(req, res)
      const { sub } = verifyToken({ token })
      const { message, match } = await this.authModel.verifyPassword({ id: sub, password, redirect })
      if (message) {
        res.json({ message })
      }
      if (match) {
        res.redirect(`http://localhost:3000/${redirect}`)
      }
    } catch (error) {
      console.log(error)
    }
  }
}
