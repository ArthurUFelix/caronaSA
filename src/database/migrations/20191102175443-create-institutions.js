module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("instituicoes", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      endereco: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      geoloc: {
        type: Sequelize.GEOMETRY("Point", 4326),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable("instituicoes");
  }
};
