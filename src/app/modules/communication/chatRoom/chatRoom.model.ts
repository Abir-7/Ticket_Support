import { Schema, model } from "mongoose";
import { IChatRoom } from "./chatRoom.interface";

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    members: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const ChatRoom = model<IChatRoom>("ChatRoom", ChatRoomSchema);
export default ChatRoom;
