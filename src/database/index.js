import Sequelize from "sequelize";

import Usuario from "../app/models/Usuario";
import Instituicao from "../app/models/Instituicao";
import Carona from "../app/models/Carona";

import databaseConfig from "../config/database";

const models = [Usuario, Instituicao, Carona];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
