import Mail from "../../libs/Mail";

import Usuario from "../models/Usuario";

class RecuperacaoController {
  async store(req, res) {
    const usuario = await Usuario.findOne({ where: { email: req.body.email } });

    if (!usuario) {
      return res
        .status(400)
        .json({ erro: "Usuário não encontrado no sistema" });
    }

    const novaSenha = Math.random()
      .toString(36)
      .substring(2, 10);

    usuario.senha = novaSenha;

    await usuario.save();

    Mail.sendMail({
      from: "Equipe CaronaPraAula <noreply@caronapraaula.com>",
      to: `${usuario.nome} <${usuario.email}>`,
      subject: "Recuperação de senha",
      text: `Você solicitou uma recuperação de cadastro para o app CaronaPraAula. Os dados cadastrados para este e-mail são:\nEmail: ${usuario.email}\nSenha: ${usuario.senha}\n\nAtenciosamente,\nEquipe CaronaPraAula`
    });

    return res.json(usuario);
  }
}

export default new RecuperacaoController();
