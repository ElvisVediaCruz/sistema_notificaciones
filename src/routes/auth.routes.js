import { Router } from "express";
import authController from "../controllers/Auth.controller.js";
import { validateSchema } from "../middlewares/dataValidations.middleware.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../schemas/Auth.schema.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register",
    validateSchema(registerSchema),
    authController.register
);

router.post("/login",
    validateSchema(loginSchema),
    authController.login
);

router.put("/fcm-token",
    authenticate,
    authController.updateFcmToken
);

router.put("/password",
    authenticate,
    validateSchema(changePasswordSchema),
    authController.updatePassword
);

router.delete("/users/:id_user",
    authenticate,
    isAdmin,
    authController.deleteUser
);

export default router;
