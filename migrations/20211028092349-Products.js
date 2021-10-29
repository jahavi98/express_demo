'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [ queryInterface.addColumn(
      'Products',
      'description',
       Sequelize.STRING
     ),
    queryInterface.addColumn(
     'Products',
     'image',
     Sequelize.STRING
     ),
     queryInterface.addColumn(
      'Products',
      'category',
      Sequelize.STRING
      ),
     queryInterface.addColumn(
     'Products',
     'status',
      Sequelize.STRING
     )];
},


  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
