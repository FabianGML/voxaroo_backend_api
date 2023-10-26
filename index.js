import express, { json } from 'express'
import { config } from './config/config.js'

import { createUserRouter } from './routes/userRouter.js'
import { createAuthRouter } from './routes/authRouter.js'
import { createCategoryRouter } from './routes/categoryRouter.js'
import { createProductRouter } from './routes/productRouter.js'
import { User } from './models/user.model.js'
import { Auth } from './models/auth.model.js'
import { Category } from './models/category.model.js'
import { Product } from './models/product.model.js'
import { cors } from './middleware/cors.js'

export const createApp = ({ userModel, authModel, categoryModel, productModel }) => {
  const app = express()
  app.use(json())
  app.disable('x-powered-by')
  app.use(cors([
    'http://localhost:5173'
  ]))
  app.use('/images', express.static('public/images'))

  app.use('/users', createUserRouter({ userModel }))
  app.use('/auth', createAuthRouter({ authModel }))
  app.use('/categories', createCategoryRouter({ categoryModel }))
  app.use('/products', createProductRouter({ productModel }))

  app.listen(config.port, () => {
    console.log(`Escuchando en el puerto ${config.port} http://localhost:${config.port}`)
  })
}

createApp({ userModel: User, authModel: Auth, categoryModel: Category, productModel: Product })
