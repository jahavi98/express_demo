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
      //  models.Products.belongsTo(models.Category);
    }
  };
  Products.init({
    name: DataTypes.STRING,
    pnumber: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING,
    image:DataTypes.STRING,
    category:DataTypes.STRING,
    status:DataTypes.STRING,
    start_date:DataTypes.DATE,
    end_date:DataTypes.DATE,
    imgconvert:DataTypes.STRING,
    is_deleted:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};