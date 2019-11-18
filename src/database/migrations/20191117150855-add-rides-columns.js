"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn("caronas", "periodo", {
      type: Sequelize.ENUM,
      values: ["Manhã", "Tarde", "Noite"],
      defaultValue: "Manhã",
      allowNull: false,
      after: "desc_carro"
    });

    return queryInterface.addColumn("caronas", "dias", {
      type: Sequelize.ARRAY(Sequelize.TEXT),
      defaultValue: [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo"
      ],
      allowNull: false,
      after: "periodo"
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn("caronas", "periodo");

    queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_Availabilities_status CASCADE;"
    );

    return queryInterface.removeColumn("caronas", "dias");
  }
};
