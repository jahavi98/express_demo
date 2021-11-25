'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      product_category.belongsTo(models.Products, {foreignKey: 'products_id'})
      product_category.belongsTo(models.Category, {foreignKey: 'category_id'})
    }
  };
  product_category.init({
    products_id: DataTypes.INTEGER,
    category_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'product_category',
  });
  return product_category;
};