import { Router } from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import RecuperacaoController from "./app/controllers/RecuperacaoController";
import SessaoController from "./app/controllers/SessaoController";
import InstituicaoController from "./app/controllers/InstituicaoController";
import CaronaController from "./app/controllers/CaronaController";
import BuscaController from "./app/controllers/BuscaController";
import AgendaController from "./app/controllers/AgendaController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

// Rota padrão
routes.get("/", (req, res) => {
  res.redirect("/login.html");
});

routes.post("/usuarios", UsuarioController.store);
routes.post("/sessoes", SessaoController.store);
routes.post("/recuperacao", RecuperacaoController.store);

routes.use(authMiddleware);

routes.get("/usuarios/:id", UsuarioController.show);
routes.put("/usuarios", UsuarioController.update);

routes.get("/instituicoes", InstituicaoController.index);
routes.post("/instituicoes", InstituicaoController.store);
routes.put("/instituicoes/:id", InstituicaoController.update);
routes.delete("/instituicoes/:id", InstituicaoController.delete);

routes.get("/caronas/:id", CaronaController.show);
routes.post("/caronas", CaronaController.store);
routes.put("/caronas/:id", CaronaController.update);
routes.delete("/caronas/:id", CaronaController.delete);

routes.get("/buscar", BuscaController.index);

routes.get("/agenda", AgendaController.index);
routes.put("/agenda/:id", AgendaController.update);

// routes.post("/files", upload.single("file"), FileController.store);

export default routes;
