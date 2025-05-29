import { Router } from "express";
import { TicketController } from "./ticket.controller";
import { auth } from "../../middleware/auth/auth";
import { upload } from "../../middleware/fileUpload/fileUploadHandler";
import { parseDataField } from "../../middleware/fileUpload/parseDataField";
import zodValidator from "../../middleware/zodValidator";
import { ticketZodSchema } from "./ticket.validation";

const router = Router();

router.post(
  "/new-ticket",
  auth("USER"),
  upload.array("image"),
  parseDataField("data"),
  zodValidator(ticketZodSchema),
  TicketController.createTicket
);
router.get("/my-ticket", auth("USER"), TicketController.getMyTickets);
router.get(
  "/get-ticket-from-all-user",
  auth("ADMIN"),
  TicketController.getAllUSersTicket
);
router.get("/:id", auth("ADMIN", "USER"), TicketController.getTicketById);

router.patch("/:id", auth("ADMIN"), TicketController.updateTicketStatus);
router.delete("/:id", auth("ADMIN"), TicketController.deleteTicket);

export default router;
