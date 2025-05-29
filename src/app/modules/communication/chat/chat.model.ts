import mongoose, { Schema } from "mongoose";
import { IChat } from "./chat.interface";

const ChatSchema = new Schema<IChat>(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "ChatRoom", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messages: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
