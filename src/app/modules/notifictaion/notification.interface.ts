import { Types } from "mongoose";
import { TUserRole } from "../../interface/auth.interface";

export interface INotification {
  title: string;
  description: TDescription;
  user: Types.ObjectId;
  sender: TUserRole;
  ticketId: Types.ObjectId;
  isRead: boolean;
}

export enum TDescription {
  review = "Your ticket is under review. We’ll update you as soon as there’s progress.",
  progress = "Your ticket is currently in progress. We’ll notify you with any updates.",
  close = "Your ticket has been closed. Thank you for your patience.",
  message = "You have a new message.",
  request = "has submitted a support ticket regarding a flight control issue.",
  new = "User Open a new ticket.",
}
