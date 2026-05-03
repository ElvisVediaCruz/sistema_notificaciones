import { Router } from "express";
import stateController from "../controllers/State.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { createStateSchema, updateStateSchema, getStateByIdSchema } from "../schemas/State.schema.js";
import { authenticate, isAdmin, resolveAdminId } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, resolveAdminId);

router.get("/",    stateController.getAll);
router.get("/:id", validateSchema(getStateByIdSchema, "params"), stateController.getById);

// Only admins can manage the shared state catalog
router.post("/",
    isAdmin,
    validateSchema(createStateSchema),
    stateController.create
);

router.put("/:id",
    isAdmin,
    validateSchema(getStateByIdSchema, "params"),
    validateSchema(updateStateSchema),
    stateController.update
);

router.delete("/:id",
    isAdmin,
    validateSchema(getStateByIdSchema, "params"),
    stateController.deleteState
);

export default router;
