import { Router } from "express";

import UsuarioController from "./app/controllers/UsuarioController";
import SessaoController from "./app/controllers/SessaoController";
import InstituicaoController from "./app/controllers/InstituicaoController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();

routes.post("/usuarios", UsuarioController.store);
routes.post("/sessoes", SessaoController.store);

routes.use(authMiddleware);

routes.put("/usuarios", UsuarioController.update);

routes.post("/instituicoes", InstituicaoController.store);
routes.put("/instituicoes/:id", InstituicaoController.update);

// routes.get("/providers", ProviderController.index);
// routes.get("/providers/:providerId/available", AvailableController.index);

// routes.get("/appointments", AppointmentController.index);
// routes.post("/appointments", AppointmentController.store);
// routes.delete("/appointments/:id", AppointmentController.delete);

// routes.get("/schedule", ScheduleController.index);

// routes.get("/notifications", NotificationController.index);
// routes.put("/notifications/:id", NotificationController.update);

// routes.post("/files", upload.single("file"), FileController.store);

export default routes;
