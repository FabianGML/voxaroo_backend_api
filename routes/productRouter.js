import { Router } from 'express'

import { ProductController } from '../controllers/ProductController.js'
import { verifyToken } from '../middleware/verifyToken.js'

export const createProductRouter = ({ productModel }) => {
  const productController = new ProductController({ productModel })
  const productRouter = Router()

  productRouter.get('/',
    productController.getAllProductsByCategory
  )

  productRouter.get('/random',
    productController.getHomeInfo
  )

  productRouter.post('/add-favorite',
    verifyToken,
    productController.handleFavorite
  )

  return productRouter
}
