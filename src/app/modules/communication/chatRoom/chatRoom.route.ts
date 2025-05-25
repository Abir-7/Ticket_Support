import { Router } from "express";
import { ChatRoomController } from "./chatRoom.controller";

const router = Router();

router.post("/", ChatRoomController.createChatRoom);
router.get("/", ChatRoomController.getAllChatRooms);
router.get("/:id", ChatRoomController.getChatRoomById);
router.put("/:id", ChatRoomController.updateChatRoom);
router.delete("/:id", ChatRoomController.deleteChatRoom);

export default router;
