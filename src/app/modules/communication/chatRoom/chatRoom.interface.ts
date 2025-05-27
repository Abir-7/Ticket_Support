import { Types } from "mongoose";

export interface IChatRoom {
  ticketId: Types.ObjectId;
  members: Types.ObjectId[]; // user IDs
  isDeleted: boolean;
}
