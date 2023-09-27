import express, { json } from 'express'
import { config } from './config/config.js'

import { createUserRouter } from './routes/userRouter.js'
import { User } from './models/user.model.js'
import { Auth } from './models/auth.model.js'
// import { createAuthRouter } from './routes/authRouter.js'

export const createApp = ({ userModel, authModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by')

  app.use('/users', createUserRouter({ userModel }))
  // app.use('/auth', createAuthRouter({ authModel }))

  app.listen(config.port, () => {
    console.log(`Escuchando en el puerto ${config.port} http://localhost:${config.port}`)
  })
}

createApp({ userModel: User, authModel: Auth })
