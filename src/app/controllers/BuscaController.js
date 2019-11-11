import { Op, Sequelize } from "sequelize";

import Usuario from "../models/Usuario";
import Carona from "../models/Carona";
import Instituicao from "../models/Instituicao";

class BuscaController {
  async index(req, res) {
    const { id_instituicao, distancia } = req.query;

    const distEmGraus = distancia / 1000 / 111.12;

    const usuario = await Usuario.findByPk(req.idUsuario);

    const { coordinates: usuarioCord } = usuario.geoloc;

    const usuarioLoc = Sequelize.literal(
      `ST_GeomFromText('POINT(${usuarioCord[0]} ${usuarioCord[1]})', 4326)`
    );

    const caronas = await Carona.findAll({
      where: {
        id_usuario: {
          [Op.not]: usuario.id
        },
        id_instituicao: id_instituicao,
        [Op.and]: Sequelize.fn(
          "ST_Intersects",
          Sequelize.col("usuario.geoloc"),
          Sequelize.fn("ST_Buffer", usuarioLoc, distEmGraus)
        )
      },
      include: [
        {
          model: Instituicao,
          as: "instituicao",
          attributes: []
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["geoloc"]
        }
      ],
      attributes: ["id", "id_usuario", "id_instituicao"]
    });

    return res.json(caronas);
  }
}

export default new BuscaController();
