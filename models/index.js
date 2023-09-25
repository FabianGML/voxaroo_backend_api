import { User } from './user.model.js'
import { Category } from './category.model.js'
import { Product } from './product.model.js'
import { Comment } from './comment.model.js'
import { Sale } from './sale.model.js'
import { SaleProduct } from './sale-product.model.js'
import { SalePoint } from './sale-point.model.js'
import { Image } from './image.model.js'

import {
  UserSchema,
  CategorySchema,
  ProductSchema,
  CommentSchema,
  SaleSchema,
  SaleProductSchema,
  SalePointSchema,
  ImageSchema
} from './tables-schemas.js'

/* ----------------------------------------------------------------------------
      This function receives all models to initialize and associates each one
   ---------------------------------------------------------------------------- */
export function setupModels (sequelize) {
  User.init(UserSchema, User.config(sequelize))
  Category.init(CategorySchema, Category.config(sequelize))
  Product.init(ProductSchema, Product.config(sequelize))
  Comment.init(CommentSchema, Comment.config(sequelize))
  Sale.init(SaleSchema, Sale.config(sequelize))
  SaleProduct.init(SaleProductSchema, SaleProduct.config(sequelize))
  SalePoint.init(SalePointSchema, SalePoint.config(sequelize))
  Image.init(ImageSchema, Image.config(sequelize))

  User.associate(sequelize.models)
  Category.associate(sequelize.models)
  Product.associate(sequelize.models)
  Sale.associate(sequelize.models)
}
