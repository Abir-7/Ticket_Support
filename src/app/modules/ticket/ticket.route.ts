import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { auth } from "../../middleware/auth/auth";
import { upload } from "../../middleware/fileUpload/fileUploadHandler";
import { parseDataField } from "../../middleware/fileUpload/parseDataField";

const router = Router();

router.post(
  "/new-ticket",
  auth("USER"),
  upload.array("image"),
  parseDataField("data"),
  TicketController.createTicket
);
router.get("/my-ticket", auth("USER"), TicketController.getMyTickets);
router.get("/", TicketController.getAllTickets);
router.get("/:id", TicketController.getTicketById);
router.put("/:id", TicketController.updateTicket);
router.delete("/:id", TicketController.deleteTicket);

export default router;
