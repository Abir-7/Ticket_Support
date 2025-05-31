import mongoose, { Schema } from "mongoose";
import { INotification, TDescription } from "./notification.interface";
import { userRoles } from "../../interface/auth.interface";

const TDescriptionValues = Object.values(TDescription);

// Mongoose schema definition
const NotificationSchema: Schema<INotification> = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, enum: TDescriptionValues, required: true },
    user: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    sender: {
      type: String,
      enum: Object.values(userRoles),
      required: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Ticket", // replace 'Ticket' with your ticket model name if any
    },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true, // optional, adds createdAt and updatedAt fields
  }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

export default Notification;
