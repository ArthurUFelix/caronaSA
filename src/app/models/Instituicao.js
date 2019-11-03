import Sequelize, { Model } from "sequelize";

class Instituicao extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        endereco: Sequelize.STRING,
        geoloc: Sequelize.GEOMETRY("POINT", 4326),
        lat: Sequelize.VIRTUAL,
        lon: Sequelize.VIRTUAL
      },
      {
        tableName: "instituicoes",
        sequelize
      }
    );

    this.addHook("beforeSave", async instituicao => {
      if (instituicao.lat && instituicao.lon) {
        instituicao.geoloc = {
          type: "Point",
          coordinates: [instituicao.lat, instituicao.lon],
          crs: { type: "name", properties: { name: "EPSG:4326" } }
        };
      }
    });

    return this;
  }
}

export default Instituicao;
