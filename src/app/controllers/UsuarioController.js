import * as Yup from "yup";

import Usuario from "../models/Usuario";

class UsuarioController {
  async show(req, res) {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, { 
      attributes: ['id', 'nome',  'email', 'telefone', 'endereco', 'geoloc']
    });

    return res.json(usuario);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string()
        .required()
        .min(6),
      telefone: Yup.string().required(),
      endereco: Yup.string().required(),
      lat: Yup.string().required(),
      lon: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validação Falhou" });
    }

    const usuarioExiste = await Usuario.findOne({
      where: { email: req.body.email }
    });

    if (usuarioExiste) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const { id, nome, email } = await Usuario.create(req.body);

    return res.json({
      id,
      nome,
      email
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senhaAntiga: Yup.string().min(6),
      senha: Yup.string()
        .min(6)
        .when("senhaAntiga", (senhaAntiga, campo) =>
          senhaAntiga ? campo.required() : campo
        ),
      confirmarSenha: Yup.string().when("senha", (senha, campo) =>
        senha ? campo.required().oneOf([Yup.ref("senha")]) : campo
      ),
      telefone: Yup.string().required(),
      endereco: Yup.string().required(),
      lat: Yup.string().required(),
      lon: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validação falhou" });
    }

    const { email, senhaAntiga } = req.body;

    const usuario = await Usuario.findByPk(req.idUsuario);
    if (email !== usuario.email) {
      const usuarioExiste = await Usuario.findOne({ where: { email } });

      if (usuarioExiste) {
        return res.status(400).json({ erro: "Usuário já existe" });
      }
    }

    if (senhaAntiga && !(await usuario.verificarSenha(senhaAntiga))) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const { id, nome } = await usuario.update(req.body);

    return res.json({
      id,
      nome,
      email
    });
  }
}

export default new UsuarioController();
