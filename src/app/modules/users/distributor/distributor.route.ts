import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { distributorController } from "./distributor.controller";

const router = Router();
router.post(
  "/add-distributor",
  auth("ADMIN"),
  distributorController.addDistributor
);
export const DistributorRoute = router;
