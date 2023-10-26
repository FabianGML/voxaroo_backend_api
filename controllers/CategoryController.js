export class CategoryController {
  constructor ({ categoryModel }) {
    this.categoryModel = categoryModel
  }

  getCategories = async (req, res) => {
    res.json(await this.categoryModel.getCategories())
  }

  createCategories = async (req, res) => {
    const { categories } = req.body
    // Cleaning the categories to be lowecase and trimed
    const categoriesToLoweCase = categories.map(category => category.name.toLowerCase().trim())
    const result = await this.categoryModel.createCategories({ categories: categoriesToLoweCase })
    res.status(201).json(result)
  }

  updateCategory = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const result = await this.categoryModel.updateCategory({ id: Number(id), name })
    res.json(result)
  }

  deleteCategory = async (req, res) => {
    const { id } = req.params
    const result = await this.categoryModel.deleteCategory({ id })
    res.json(result)
  }
}
