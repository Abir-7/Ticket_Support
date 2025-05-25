import { Router } from "express";
import { ChatController } from "./chat.controller";

const router = Router();

router.post("/", ChatController.createChat);
router.get("/", ChatController.getAllChats);
router.get("/:id", ChatController.getChatById);
router.put("/:id", ChatController.updateChat);
router.delete("/:id", ChatController.deleteChat);

export default router;
