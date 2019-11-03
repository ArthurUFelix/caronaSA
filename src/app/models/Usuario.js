import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.STRING,
        telefone: Sequelize.STRING,
        endereco: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
        geoloc: Sequelize.GEOMETRY("POINT"),
        lat: Sequelize.VIRTUAL,
        lon: Sequelize.VIRTUAL
      },
      {
        sequelize
      }
    );

    this.addHook("beforeSave", async usuario => {
      if (usuario.senha) {
        usuario.senha_hash = await bcrypt.hash(usuario.senha, 8);
      }

      if (usuario.lat && usuario.lon) {
        usuario.geoloc = {
          type: "Point",
          coordinates: [usuario.lat, usuario.lon],
          crs: { type: "name", properties: { name: "EPSG:4326" } }
        };
      }
    });

    return this;
  }

  verificarSenha(senha) {
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default Usuario;
