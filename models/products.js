'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Products.init({
    name: DataTypes.STRING,
    pnumber: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    image:DataTypes.STRING,
    category:DataTypes.STRING,
    status:DataTypes.STRING,
    start_date:DataTypes.DATE,
    end_date:DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};