import { TUserRole } from "./../../../interface/auth.interface";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../../errors/AppError";
import ChatRoom from "../chatRoom/chatRoom.model";

import mongoose from "mongoose";
import { TicketStatus } from "../../ticket/ticket.interface";
import Chat from "./chat.model";
import Notification from "../../notifictaion/notification.model";
import { TDescription } from "../../notifictaion/notification.interface";
import logger from "../../../utils/serverTool/logger";

const sendMessageByTicketId = async (
  ticketId: string,
  chatData: { messages: string },
  userId: string,
  userRole: TUserRole
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const findChatRoom = (await ChatRoom.findOne({ ticketId }).session(
      session
    )) as any;
    if (!findChatRoom) {
      throw new AppError(status.NOT_FOUND, "Chat room not found");
    }

    await findChatRoom.populate("ticketId");

    if (findChatRoom.ticketId.isDeleted) {
      throw new AppError(status.NOT_FOUND, "This ticket has been deleted");
    }

    if (findChatRoom.ticketId.status === TicketStatus.Pending) {
      throw new AppError(status.BAD_REQUEST, "This ticket status in pending.");
    }

    if (findChatRoom.ticketId.status === TicketStatus.Rejected) {
      throw new AppError(status.BAD_REQUEST, "This ticket is rejected.");
    }

    if (findChatRoom.ticketId.status === TicketStatus.Solved) {
      throw new AppError(
        status.NOT_FOUND,
        "You can't send any message as ticket is closed."
      );
    }

    if (
      !findChatRoom.members.some((m: mongoose.Types.ObjectId) =>
        m.equals(userId)
      )
    ) {
      throw new AppError(status.NOT_FOUND, "User not found in chat room.");
    }

    // Create Notification based on userRole inside transaction
    if (userRole === "ADMIN") {
      await Notification.create(
        [
          {
            sender: "ADMIN",
            user: findChatRoom.ticketId.user,
            description: TDescription.message,
            ticketId: findChatRoom.ticketId._id,
            title: "Ticket Update: Message",
          },
        ],
        { session }
      );
    }
    if (userRole === "USER") {
      await Notification.create(
        [
          {
            sender: "USER",
            description: TDescription.message,
            user: findChatRoom.ticketId.user,
            ticketId: findChatRoom.ticketId._id,
            title: "Waiting for reply.",
          },
        ],
        { session }
      );
    }

    // Create chat message in the same transaction
    const createChat = await Chat.create(
      [
        {
          messages: chatData.messages,
          sender: userId,
          roomId: findChatRoom._id,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return createChat[0];
  } catch (error: any) {
    logger.error(error);

    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getMessageByTicketId = async (
  ticketId: string,
  page: number = 1,
  limit: number = 20
) => {
  const findChatRoom = (await ChatRoom.findOne({ ticketId }).populate(
    "ticketId"
  )) as any;

  if (!findChatRoom.ticketId) {
    throw new AppError(status.NOT_FOUND, "Chat room not found");
  }

  if (findChatRoom.ticketId.isDeleted) {
    throw new AppError(status.NOT_FOUND, "This ticket has been deleted");
  }

  // Calculate how many documents to skip
  const skip = (page - 1) * limit;

  // Fetch paginated chat messages sorted by createdAt (ascending or descending)
  const chatMessages = await Chat.find({ roomId: findChatRoom._id })
    .sort({ createdAt: 1 }) // 1 for oldest first, -1 for latest first
    .skip(skip)
    .limit(limit);

  return chatMessages;
};

export const ChatService = {
  sendMessageByTicketId,
  getMessageByTicketId,
};
