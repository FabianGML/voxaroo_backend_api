export class ProductController {
  constructor ({ productModel }) {
    this.productModel = productModel
  }

  getAllProductsByCategory = async (req, res) => {
    console.log(req.query)
  }
}
