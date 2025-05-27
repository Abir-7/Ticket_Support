import { model, Schema } from "mongoose";
import { IssueType, ITicket, TicketStatus, UserType } from "./ticket.interface";

const TicketSchema = new Schema<ITicket>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mobile: { type: String, required: true },
    issue: {
      type: String,
      enum: Object.values(IssueType),
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    images: [{ type: String, required: true }],
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.Pending,
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = model<ITicket>("Ticket", TicketSchema);
export default Ticket;
