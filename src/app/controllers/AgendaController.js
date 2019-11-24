import Carona from "../models/Carona";
import Instituicao from "../models/Instituicao";

class AgendaController {
  async index(req, res) {
    const caronas = await Carona.findAll({
      where: {
        id_usuario: req.idUsuario
      },
      include: [
        {
          model: Instituicao,
          as: "instituicao",
          attributes: ["id", "nome"]
        }
      ],
      attributes: ["id", "periodo", "dias", "disponivel"]
    });

    return res.json(caronas);
  }
}

export default new AgendaController();
