import { Router } from "express";
import groupController from "../controllers/Group.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { createGroupSchema, addMemberSchema, groupParamsSchema, memberParamsSchema, createWorkerSchema } from "../schemas/Group.schema.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/",
    isAdmin,
    validateSchema(createGroupSchema),
    groupController.create
);

router.get("/",
    groupController.getMyGroups
);

router.get("/:id/members",
    isAdmin,
    validateSchema(groupParamsSchema, "params"),
    groupController.getMembers
);

router.post("/:id/members",
    isAdmin,
    validateSchema(groupParamsSchema, "params"),
    validateSchema(addMemberSchema),
    groupController.addMember
);

router.delete("/:id/members/:user_id",
    isAdmin,
    validateSchema(memberParamsSchema, "params"),
    groupController.removeMember
);

router.put("/:id",
    isAdmin,
    validateSchema(groupParamsSchema, "params"),
    validateSchema(createGroupSchema),
    groupController.update
);

router.delete("/:id",
    isAdmin,
    validateSchema(groupParamsSchema, "params"),
    groupController.deleteGroup
);

router.post("/:id/workers",
    isAdmin,
    validateSchema(groupParamsSchema, "params"),
    validateSchema(createWorkerSchema),
    groupController.createWorker
);

export default router;
