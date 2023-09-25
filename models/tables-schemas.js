import { DataTypes, Sequelize } from 'sequelize'

export const USER_TABLE = 'users'
export const CATEGORY_TABLE = 'categories'
export const PRODUCT_TABLE = 'products'
export const COMMENT_TABLE = 'comments'
export const SALE_TABLE = 'sales'
export const SALE_PRODUCT_TABLE = 'sales_products'
export const SALE_POINT_TABLE = 'sales_points'
export const IMAGE_TABLE = 'images'

export const UserSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  roles: {
    allowNull: false,
    type: DataTypes.STRING(10)
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  },
  city: {
    allowNull: false,
    type: DataTypes.STRING(20)
  },
  state: {
    allowNull: false,
    type: DataTypes.STRING(20)
  }
}

export const CategorySchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}

export const ProductsSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  score: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0
  },
  sellerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'seller_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'category_id',
    references: {
      model: CATEGORY_TABLE,
      key: 'id'
    }
  }
}

export const CommentSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  body: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    }
  }
}

export const SaleSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  key: {
    type: DataTypes.STRING(5),
    allowNull: false
  },
  sellerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'seller_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    }
  },
  customerId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'customer_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}

export const SaleProductSchema = {
  productId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    primaryKey: true
  },
  saleId: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'sale_id',
    references: {
      model: SALE_TABLE,
      key: 'id'
    },
    primaryKey: true
  },
  amount: {
    type: DataTypes.SMALLINT,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'unit_price'
  },
  subTotal: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    field: 'sub_total'
  }
}

export const SalePointSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  openingTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'opening_time'
  },
  closeTime: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'close_time'
  }
}

export const ImageSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  productId: {
    type: DataTypes.STRING,
    field: 'product_id',
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    }
  },
  salePointId: {
    type: DataTypes.STRING,
    field: 'sale_point_id',
    references: {
      model: SALE_POINT_TABLE,
      key: 'id'
    }
  }
}
