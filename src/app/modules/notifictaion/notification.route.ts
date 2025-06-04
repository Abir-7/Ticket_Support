import { Router } from "express";
import { auth } from "../../middleware/auth/auth";
import { NotificationController } from "./notification.controller";

const router = Router();

router.get(
  "/get-notification-from-user",
  auth("ADMIN"),
  NotificationController.getFromUser
);

router.get(
  "/get-notification-from-admin",
  auth("USER"),
  NotificationController.getFromAdmin
);

router.patch(
  "/mark-as-read/:id",
  auth("USER", "ADMIN"),
  NotificationController.markAsRead
);

export const NotificationRouter = router;
