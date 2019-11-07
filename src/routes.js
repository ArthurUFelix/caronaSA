import { Router } from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import SessaoController from "./app/controllers/SessaoController";
import InstituicaoController from "./app/controllers/InstituicaoController";
import CaronaController from "./app/controllers/CaronaController";
import BuscaController from "./app/controllers/BuscaController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/usuarios", UsuarioController.store);
routes.post("/sessoes", SessaoController.store);

routes.use(authMiddleware);

routes.get("/usuarios/:id", UsuarioController.show);
routes.put("/usuarios", UsuarioController.update);

routes.post("/instituicoes", InstituicaoController.store);
routes.put("/instituicoes/:id", InstituicaoController.update);
routes.delete("/instituicoes/:id", InstituicaoController.delete);

routes.post("/caronas", CaronaController.store);
routes.put("/caronas/:id", CaronaController.update);
routes.delete("/caronas/:id", CaronaController.delete);

routes.get("/buscar", BuscaController.index);

// routes.post("/files", upload.single("file"), FileController.store);

export default routes;
