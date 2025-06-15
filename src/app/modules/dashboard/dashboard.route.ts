import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { DashboardController } from "./dashbord.controller";

const router = Router();

router.get("/overview", auth("ADMIN"), DashboardController.dashboardOverview);

export const DashboardRoute = router;
