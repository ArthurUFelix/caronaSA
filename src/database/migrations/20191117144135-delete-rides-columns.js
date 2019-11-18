"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.removeColumn("caronas", "hora");

    return queryInterface.removeColumn("caronas", "dias");
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.addColumn("caronas", "hora", {
      type: Sequelize.DATE,
      allowNull: false
    });

    return queryInterface.addColumn("caronas", "dias", {
      type: Sequelize.STRING(100),
      allowNull: false
    });
  }
};
