'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsToMany(models.Products, {through: 'product_category', foreignKey: 'category_id', as: 'product'})
    }
  };
  Category.init({
    parent_id: DataTypes.STRING,
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    image: DataTypes.STRING,
    isdelete: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
  });


  return Category;
};
