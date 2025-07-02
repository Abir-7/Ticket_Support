import { Router } from "express";
import { UserController } from "./user.controller";

import { auth } from "../../../middleware/auth/auth";

const router = Router();
router.get("/", auth("ADMIN"), UserController.getAllUser);
router.get("/me", auth("USER", "ADMIN"), UserController.getMyData);

router.delete("/me", auth("USER"), UserController.deleteUser);
router.delete("/:id", auth("ADMIN"), UserController.deleteUser);

export const UserRoute = router;
