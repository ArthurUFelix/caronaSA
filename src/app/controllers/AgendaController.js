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
      attributes: ["id", "periodo", "dias", "disponivel"],
      order: ["id"]
    });

    return res.json(caronas);
  }

  async update(req, res) {
    const id = req.params.id;

    const carona = await Carona.findByPk(id);

    if (carona.disponivel) {
      carona.disponivel = false;
    } else {
      carona.disponivel = true;
    }

    await carona.save();

    return res.json(carona);
  }
}

export default new AgendaController();
