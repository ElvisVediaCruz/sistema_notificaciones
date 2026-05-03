import { Router } from "express";
import procesStateController from "../controllers/ProcesState.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { procesStateParamsSchema, processStateSchema } from "../schemas/ProcesState.schema.js";
import { authenticate, resolveAdminId } from "../middlewares/auth.middleware.js";

const route = Router();

route.use(authenticate, resolveAdminId);

route.put(
    "/:id_process",
    validateSchema(procesStateParamsSchema, "params"),
    validateSchema(processStateSchema),
    procesStateController.update
);

export default route;
