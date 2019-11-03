module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("caronas", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: { model: "usuarios", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: false
      },
      id_instituicao: {
        type: Sequelize.INTEGER,
        references: { model: "instituicoes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: false
      },
      desc_carro: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      hora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dias: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      disponivel: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    return queryInterface.dropTable("caronas");
  }
};
