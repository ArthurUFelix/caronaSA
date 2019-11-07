import { Op, Sequelize } from "sequelize";

import Usuario from "../models/Usuario";
import Carona from "../models/Carona";
import Instituicao from "../models/Instituicao";

class BuscaController {
  async index(req, res) {
    const { id_instituicao, raio } = req.query;

    const usuario = await Usuario.findByPk(req.idUsuario);

    // ST_Distance_Sphere(the_geom, ST_MakePoint(your_lon,your_lat)) <= radius_mi * 1609.34

    const i = await Instituicao.findByPk(2);
    return res.json(i);

    const caronas = await Carona.findAll({
      where: {
        id_usuario: {
          [Op.not]: 2
        },
        id_instituicao: id_instituicao
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
          attributes: []
        }
      ],
      attributes: [
        "id_usuario",
        "id_instituicao",
        [Sequelize.col("instituicao.geoloc"), "geoloc"],
        [
          Sequelize.fn(
            "ST_Distance_Sphere",
            Sequelize.col("usuario.geoloc"),
            Sequelize.col("instituicao.geoloc")
          ),
          "distancia"
        ]
      ]
    });

    return res.json(caronas);
  }
}

export default new BuscaController();
