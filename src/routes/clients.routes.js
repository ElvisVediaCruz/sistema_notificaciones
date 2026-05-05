import { Router } from "express";
import clientController from "../controllers/Clients.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { createClientSchema, updateClientSchema, clientParamsSchema, activeClientSchema } from "../schemas/Client.schema.js";
import { authenticate, isAdmin, resolveAdminId } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, resolveAdminId);

router.post("/",
    validateSchema(createClientSchema),
    clientController.create
);

router.get("/",
    clientController.getAll
);

router.get("/status",
    clientController.getStatus
);

router.get("/:id",
    validateSchema(clientParamsSchema, "params"),
    clientController.getById
);

router.put("/:id",
    validateSchema(clientParamsSchema, "params"),
    validateSchema(updateClientSchema),
    clientController.update
);

router.put("/:id/active",
    isAdmin,
    validateSchema(clientParamsSchema, "params"),
    validateSchema(activeClientSchema),
    clientController.updateActive
);

router.delete("/:id",
    isAdmin,
    validateSchema(clientParamsSchema, "params"),
    clientController.deleteClient
);

export default router;
