import mongoose, { Schema } from "mongoose";
import { IChat } from "./chat.interface";

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: String, required: true }],
    messages: [{ type: String, required: true }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
