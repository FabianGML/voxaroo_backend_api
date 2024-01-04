export class ProductController {
  constructor ({ productModel }) {
    this.productModel = productModel
  }

  getAllProductsByCategory = async (req, res) => {
    console.log(req.query)
  }

  getHomeInfo = async (req, res) => {
    try {
      const result = await this.productModel.getHomeInfo()
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }

  handleFavorite = async (req, res) => {
    try {
      const { productId, isAdding } = req.body
      const result = await this.productModel.addFavorite({ userId: req.id, productId, isAdding })
      res.json(result)
    } catch (error) {
      console.log(error)
    }
  }
}
