import jwt from "jsonwebtoken";
import * as Yup from "yup";

import authConfig from "../../config/auth";

import Usuario from "../models/Usuario";

class SessaoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: "Validação Falhou" });
    }

    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      res.status(401).json({ erro: "Usuário não encontrado" });
    }

    if (!(await usuario.verificarSenha(senha))) {
      res.status(401).json({ erro: "Senha inválida" });
    }

    const { id, nome } = usuario;

    return res.json({
      usuario: {
        id,
        nome,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessaoController();
