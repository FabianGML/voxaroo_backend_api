import { Router } from 'express'

import { ProductController } from '../controllers/ProductController.js'

export const createProductRouter = ({ productModel }) => {
  const productController = new ProductController({ productModel })
  const productRouter = Router()

  productRouter.get('/',
    productController.getAllProductsByCategory
  )

  return productRouter
}
