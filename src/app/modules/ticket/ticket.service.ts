/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRelativePath } from "../../middleware/fileUpload/getRelativeFilePath";
import ChatRoom from "../communication/chatRoom/chatRoom.model";
import { ITicket, TicketStatus } from "./ticket.interface";
import Ticket from "./ticket.model";
import mongoose from "mongoose";

const createTicket = async (
  ticketData: Partial<ITicket>,
  userId: string,
  imageArr: Express.Multer.File[]
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const images = imageArr.map((image) => getRelativePath(image.path));

    const addTicket = await Ticket.create(
      [
        {
          user: userId,
          mobile: ticketData.mobile,
          images,
          issue: ticketData.issue,
          userType: ticketData.userType,
        },
      ],
      { session }
    );

    await ChatRoom.create(
      [
        {
          ticketId: addTicket[0]._id,
          members: [userId],
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return addTicket[0];
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getMyTickets = async (userId: string) => {
  const now = new Date();
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(now.getDate() - 14);

  const [isProgress, recentlySolved] = await Promise.all([
    Ticket.find({ user: userId, status: TicketStatus.InProgress }).lean(),
    Ticket.find({
      user: userId,
      status: TicketStatus.Solved,
      updatedAt: { $gte: fourteenDaysAgo, $lte: now },
    })
      .sort({ updatedAt: -1 })
      .lean(),
  ]);

  return [...isProgress, ...recentlySolved];
};

const getAllTickets = async () => {
  // TODO: Call repository or model to get all tickets
  // return tickets;
};

const getTicketById = async (ticketId: string) => {
  // TODO: Call repository or model to get a ticket by ID
  // return ticket;
};

const updateTicket = async (ticketId: string, ticketData: Partial<ITicket>) => {
  // TODO: Call repository or model to update a ticket
  // return updatedTicket;
};

const deleteTicket = async (ticketId: string) => {
  // TODO: Call repository or model to delete a ticket
  // return deletedTicket;
};

export const TicketService = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getMyTickets,
};
