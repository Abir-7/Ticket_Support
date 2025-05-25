import mongoose, { Schema } from "mongoose";
import { ITicket } from "./ticket.interface";

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    priority: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.model<ITicket>("Ticket", ticketSchema);

export default Ticket;
