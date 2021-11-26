'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [queryInterface.addColumn(
      'Products',
      'start_date',
      Sequelize.DATE
    ),
      queryInterface.addColumn(
        'Products',
        'end_date',
        Sequelize.DATE
      )];
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          'Products',
          'start_date',
        ),
        queryInterface.removeColumn(
          'Products',
          'end_date',
        )
      ])
    })
  }
};
