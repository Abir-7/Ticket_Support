import { Types } from "mongoose";

export interface IChat {
  roomId: Types.ObjectId;
  sender: Types.ObjectId;
  messages: string;
  isDeleted: boolean;
}
