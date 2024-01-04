import { connection } from '../db/config.js'

export class Product {
  static async getHomeInfo () {
    const [products] = await connection.query('SELECT * FROM products ORDER BY RAND() LIMIT 6;')
    const [categories] = await connection.query('SELECT * FROM categories ORDER BY RAND() LIMIT 3')
    return { products, categories }
  }

  static async addFavorite ({ userId, productId, isAdding }) {
    if (!isAdding) {
      await connection.query('DELETE FROM favorites_products WHERE user_id = UUID_TO_BIN(?) AND product_id = UUID_TO_BIN(?);', [userId, productId])
    } else {
      await connection.query('INSERT INTO favorites_products (user_id, product_id) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?));', [userId, productId])
    }
  }
}
