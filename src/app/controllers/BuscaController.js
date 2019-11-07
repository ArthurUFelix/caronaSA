import { Op, Sequelize } from 'sequelize';

import Usuario from '../models/Usuario';
import Carona from '../models/Carona';
import Instituicao from '../models/Instituicao';

class BuscaController {
  async index(req, res) {
    const { id_instituicao, raio } = req.query;

    const usuario = await Usuario.findByPk(req.idUsuario);

    const caronas = await Carona.findAll({
      where: {
        id_usuario: {
          [Op.not]: 2
        },
        id_instituicao: id_instituicao,
        [
          Sequelize.fn('ST_Distance_Sphere',
            Sequelize.col('usuario')
            Sequelize.fn('ST_MakePoint'),
            Sequelize.col('')
          )
        ]
      },
      include: [
        {
          model: Instituicao,
          as: 'instituicao',
          attributes: []
        },
        {
          model: Usuario,
          as: 'usuario',
          attributes: []
        }
      ],
      attributes: ['id_usuario', 'id_instituicao', [Sequelize.col('instituicao.geoloc'), 'geoloc']]
    })

    return res.json(caronas);
  }
}

export default new BuscaController();

ST_Distance_Sphere(the_geom, ST_MakePoint(your_lon,your_lat)) <= radius_mi * 1609.34

Distancia()