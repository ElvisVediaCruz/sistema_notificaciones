import { Router } from "express";
import dashboardController from "../controllers/Dashboard.js";
import { authenticate, resolveAdminId } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate, resolveAdminId);

router.get("/all", dashboardController.getDashboard);

export default router;
