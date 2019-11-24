import * as Yup from "yup";

import Instituicao from "../models/Instituicao";
import Usuario from "../models/Usuario";

class InstituicaoController {
  async index(req, res) {
    const instituicoes = await Instituicao.findAll({
      attributes: ["id", "nome"]
    });

    return res.json(instituicoes);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      endereco: Yup.string().required(),
      lat: Yup.string().required(),
      lon: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validação Falhou" });
    }

    /**
     * Verifica se o usuário logado é admin
     */
    const usuario = await Usuario.findByPk(req.idUsuario);

    if (!usuario.admin) {
      return res.status(401).json({ erro: "Acesso negado" });
    }

    const instituicaoExiste = await Instituicao.findOne({
      where: { nome: req.body.nome }
    });

    if (instituicaoExiste) {
      return res.status(400).json({ erro: "Instituição já existe" });
    }

    const { id, nome } = await Instituicao.create(req.body);

    return res.json({
      id,
      nome
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      endereco: Yup.string().required(),
      lat: Yup.string().required(),
      lon: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validação falhou" });
    }

    /**
     * Verifica se o usuário logado é admin
     */
    const usuario = await Usuario.findByPk(req.idUsuario);

    if (!usuario.admin) {
      return res.status(401).json({ erro: "Acesso negado" });
    }

    const instituicao = await Instituicao.findByPk(req.params.id);

    if (!instituicao) {
      return res.status(400).json({ erro: "Instituição não encontrada" });
    }

    const { nome } = req.body;

    if (nome !== instituicao.nome) {
      const instituicaoExiste = await Instituicao.findOne({ where: { nome } });

      if (instituicaoExiste) {
        return res.status(400).json({ erro: "Instituicao já existe" });
      }
    }

    const { id } = await instituicao.update(req.body);

    return res.json({
      id,
      nome
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    /**
     * Verifica se o usuário logado é admin
     */
    const usuario = await Usuario.findByPk(req.idUsuario);

    if (!usuario.admin) {
      return res.status(401).json({ erro: "Acesso negado" });
    }

    const instituicao = await Instituicao.findByPk(id);

    if (!instituicao) {
      return res.status(400).json({ erro: "Instituição não encontrada" });
    }

    await instituicao.destroy();

    return res.json({ mensagem: "Instituição excluida" });
  }
}

export default new InstituicaoController();
