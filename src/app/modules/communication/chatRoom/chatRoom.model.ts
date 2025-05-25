import mongoose, { Schema } from "mongoose";
import { IChatRoom } from "./chatRoom.interface";

const chatRoomSchema = new Schema<IChatRoom>(
  {
    name: { type: String, required: true },
    members: [{ type: String, required: true }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", chatRoomSchema);

export default ChatRoom;
