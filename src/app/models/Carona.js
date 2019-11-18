import Sequelize, { Model } from "sequelize";

class Carona extends Model {
  static init(sequelize) {
    super.init(
      {
        desc_carro: Sequelize.STRING,
        hora: Sequelize.DATE,
        dias: Sequelize.ARRAY(Sequelize.TEXT),
        disponivel: Sequelize.BOOLEAN
      },
      {
        sequelize
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: "id_usuario", as: "usuario" });
    this.belongsTo(models.Instituicao, {
      foreignKey: "id_instituicao",
      as: "instituicao"
    });
  }
}

export default Carona;
