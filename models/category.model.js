import { connection } from '../db/config.js'
import { handleSqlError } from '../utils/handleSqlError.js'

export class Category {
  static async getCategories () {
    const [result] = await connection.query('SELECT * FROM categories') // Añadir la cantidad de productos de cada categoria
    return result
  }

  static async createCategories ({ categories }) {
    const [dbCategories] = await connection.query('SELECT * FROM categories')
    const dbCategoriesNames = dbCategories.map(category => category.name)
    const errors = categories.filter(category => dbCategoriesNames.includes(category))
    if (errors.length > 0) return { error: errors }
    await connection.query('INSERT INTO categories (name) VALUES ?', [categories.map(category => [category])])
    return { message: 'Categorias creadas correctamente' }
  }

  static async updateCategory ({ id, name }) {
    try {
      const [result] = await connection.query('UPDATE categories SET name = ? WHERE id = ?;', [name, id])
      if (result.affectedRows === 0) return { error: 'La categoria no existe' }
      return { message: `Categoria ${id} actualizada correctamente` }
    } catch (error) {
      return handleSqlError(error)
    }
  }

  static async deleteCategory ({ id }) {
    const [result] = await connection.query('DELETE FROM categories WHERE id = ?;', [id]) // Eliminar tambien los productos?
    if (result.affectedRows === 0) return { error: 'La categoria no existe' }
    return { message: 'Categoria eliminada exitosamente' }
  }
}
