import { Router } from "express";
import { ChatController } from "./chat.controller";
import { auth } from "../../../middleware/auth/auth";

const router = Router();

router.post(
  "/:id",
  auth("ADMIN", "USER"),
  ChatController.sendMessageByTicketId
);
router.get("/:id", auth("ADMIN", "USER"), ChatController.getMessageByTicketId);

export const ChatRoute = router;
