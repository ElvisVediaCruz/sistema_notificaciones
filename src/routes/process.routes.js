import { Router } from "express";
import processController from "../controllers/Process.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { createProcessSchema, updateProcessSchema, processParamsSchema, processClientParamsSchema, updateProcessParamsSchema, activeProcessSchema } from "../schemas/Process.schema.js";
import { authenticate, resolveAdminId } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, resolveAdminId);

router.post("/:id_client",
    validateSchema(processClientParamsSchema, "params"),
    validateSchema(createProcessSchema),
    processController.create
);

router.get("/clients/:id_client",
    processController.getAllClients
);

router.get("/client/:id_client/:id_process",
    validateSchema(updateProcessParamsSchema, "params"),
    processController.getAllByClient
);

router.get("/:id_process",
    validateSchema(processParamsSchema, "params"),
    processController.getById
);

router.put("/:id_process/active",
    validateSchema(processParamsSchema, "params"),
    validateSchema(activeProcessSchema),
    processController.updateActive
);

router.put("/:id_process/:id_client",
    validateSchema(updateProcessParamsSchema, "params"),
    validateSchema(updateProcessSchema),
    processController.update
);

export default router;
