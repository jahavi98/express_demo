'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Products', // table name
        'is_deleted', // new field name
        {
          allowNull: false,
          type: Sequelize.INTEGER(1),
          defaultValue: true,
          defaultValue: 0
        },
      ),


    ]);
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
