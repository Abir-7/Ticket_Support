import { Router } from "express";
import { auth } from "../../../middleware/auth/auth";
import { distributorController } from "./distributor.controller";

const router = Router();

router.post(
  "/add-distributor",
  auth("ADMIN"),
  distributorController.addDistributor
);
router.get("/", auth("ADMIN", "USER"), distributorController.getAllDistributor);
router.get("/:id", auth("ADMIN"), distributorController.getDistributorDetails);
router.delete("/:id", auth("ADMIN"), distributorController.deleteDistributor);

export const DistributorRoute = router;
