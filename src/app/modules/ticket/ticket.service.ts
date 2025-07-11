/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../errors/AppError";
import { IAuthData, userRoles } from "../../interface/auth.interface";
import { getRelativePath } from "../../middleware/fileUpload/getRelativeFilePath";
import unlinkFile from "../../middleware/fileUpload/unlinkFiles";
import ChatRoom from "../communication/chatRoom/chatRoom.model";
import { ITicket, TicketStatus } from "./ticket.interface";
import Ticket from "./ticket.model";
import mongoose, { PipelineStage } from "mongoose";
import Notification from "../notifictaion/notification.model";
import { TDescription } from "../notifictaion/notification.interface";

import { appConfig } from "../../config";
import { publishJob } from "../../rabitMQ/publisher";

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

          images,

          ...ticketData,
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

    await Notification.create(
      [
        {
          user: userId,
          description: TDescription.new,
          sender: userRoles.USER,
          ticketId: addTicket[0]._id,
          title: "Waiting for review.",
        },
      ],
      { session }
    );

    await publishJob("emailQueue", {
      email: appConfig.admin.email,
      subject: "Ticket",
      text: `A User open new ticket`, //!  page url will add here
    });

    await session.commitTransaction();
    session.endSession();

    return addTicket[0];
  } catch (error: any) {
    if (imageArr && imageArr.length > 0) {
      for (const image of imageArr) {
        unlinkFile(getRelativePath(image.path));
      }
    }
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

const getMyTickets = async (
  userId: string,
  isRecent: "true" | "false",
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  if (isRecent === "false") {
    const data = await Ticket.find({ user: userId, isDeleted: false })
      .populate("productId")
      .sort({ updatedAt: -1 }) // Optional: newest first
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(data);

    return data;
  } else if (isRecent === "true") {
    const now = new Date();
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(now.getDate() - 5);

    // Prepare conditions for each ticket status
    const conditions = [
      { status: TicketStatus.Pending },
      { status: TicketStatus.InProgress },
      {
        status: TicketStatus.Solved,
        updatedAt: { $gte: fiveDaysAgo, $lte: now },
      },
      {
        status: TicketStatus.Rejected,
        updatedAt: { $gte: fiveDaysAgo, $lte: now },
      },
    ];

    // Maintain order: Pending → InProgress → Solved → Rejected
    const statusPriority: Record<string, number> = {
      [TicketStatus.Pending]: 1,
      [TicketStatus.InProgress]: 2,
      [TicketStatus.Solved]: 3,
      [TicketStatus.Rejected]: 4,
    };

    const tickets = await Ticket.find({
      user: userId,
      isDeleted: false,
      $or: conditions,
    })
      .populate("productId")
      .skip(skip)
      .limit(limit)
      .sort({
        // Custom priority sort
        updatedAt: -1,
      })
      .lean();

    // Sort by our custom status priority
    tickets.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

    return tickets;
  } else {
    throw new AppError(
      status.BAD_REQUEST,
      "Failed to get data. query isRecent:true or false"
    );
  }
};

const getAllUSersTicket = async (
  page: number,
  limit: number,
  tStatus: string,
  searchTerm: string
) => {
  console.log(page, limit, searchTerm, tStatus, "gg");

  const query: Record<string, unknown> = { isDeleted: false };

  if (tStatus && tStatus.length > 2) {
    query.status = tStatus;
  }

  const aggrigateArray: PipelineStage[] = [
    { $match: query },
    {
      $lookup: {
        from: "userprofiles",
        foreignField: "user",
        localField: "user",
        as: "userProfile",
      },
    },
    { $unwind: "$userProfile" },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "userProfile.user",
        as: "userProfile.user",
      },
    },
    { $unwind: "$userProfile.user" },
    {
      $lookup: {
        from: "products",
        foreignField: "_id",
        localField: "productId",
        as: "productId",
      },
    },
    { $unwind: "$productId" },
    ...(searchTerm && searchTerm.trim() !== ""
      ? [
          {
            $match: {
              $or: [
                {
                  "userProfile.fullName": {
                    $regex: searchTerm,
                    $options: "i",
                  },
                },
                {
                  "userProfile.phone": {
                    $regex: searchTerm,
                    $options: "i",
                  },
                },
                {
                  "userProfile.nickname": { $regex: searchTerm, $options: "i" },
                },
                {
                  "userProfile.user.email": {
                    $regex: searchTerm,
                    $options: "i",
                  },
                },
                {
                  phone: {
                    $regex: searchTerm,
                    $options: "i",
                  },
                },
                // add other fields to search as needed
              ],
            },
          },
        ]
      : []),
  ];

  const dataAggregate = [
    ...aggrigateArray,
    {
      $project: {
        user: 0,
        "userProfile.user.authentication": 0,
        "userProfile.user.password": 0,
        "userProfile.user.role": 0,
        "userProfile.user.isVerified": 0,
        "userProfile.user.needToResetPass": 0,
        "userProfile.user.__v": 0,
        "userProfile._id": 0,
        "userProfile.__v": 0,
        __v: 0,
      },
    },
  ];

  const countAggregate = [...aggrigateArray, { $count: "total" }];
  const countResult = await Ticket.aggregate(countAggregate);
  const totalItem = countResult[0]?.total || 0;
  const totalPage = Math.ceil(totalItem / limit);

  const data = await Ticket.aggregate(dataAggregate);
  const meta = {
    totalItem,
    totalPage,
    limit,
    page,
  };

  return { data, meta };
};

const getTicketById = async (ticketId: string, user: IAuthData) => {
  const aggrigateArray: PipelineStage[] = [
    {
      $match: { _id: new mongoose.Types.ObjectId(ticketId), isDeleted: false },
    },
    {
      $lookup: {
        from: "userprofiles",
        foreignField: "user",
        localField: "user",
        as: "userProfile",
      },
    },
    { $unwind: "$userProfile" },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "userProfile.user",
        as: "userProfile.user",
      },
    },
    { $unwind: "$userProfile.user" },
    {
      $lookup: {
        from: "products",
        foreignField: "_id",
        localField: "productId",
        as: "productId",
      },
    },
    { $unwind: "$productId" },
    {
      $project: {
        user: 0,
        "userProfile.user.authentication": 0,
        "userProfile.user.password": 0,
        "userProfile.user.role": 0,
        "userProfile.user.isVerified": 0,
        "userProfile.user.needToResetPass": 0,
        "userProfile.user.__v": 0,
        "userProfile._id": 0,
        "userProfile.__v": 0,
        __v: 0,
      },
    },
  ];
  const data = (await Ticket.aggregate(aggrigateArray)) as any;

  if (user?.userRole === "USER") {
    if (String(data[0]?.userProfile?.user?._id) !== user?.userId)
      throw new AppError(
        status.BAD_REQUEST,
        "You can't seen other user ticket"
      );
  }

  return data[0] || {};
};

const updateTicketStatus = async (
  ticketId: string,
  tStatus: TicketStatus,
  rejectedReason: string,
  userId: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(ticketId, tStatus, "------------------>");
  try {
    const ticketData = await Ticket.findById(ticketId).session(session);

    if (!ticketData) {
      throw new AppError(status.NOT_FOUND, "Ticket data not found.");
    }

    if (ticketData.isDeleted) {
      throw new AppError(status.NOT_FOUND, "Ticket data is deleted.");
    }

    if (!tStatus) {
      throw new AppError(status.BAD_REQUEST, "Status data not found.");
    }

    if (ticketData.status === tStatus) {
      throw new AppError(
        status.BAD_REQUEST,
        `Ticket status already in ${ticketData.status}`
      );
    }

    if (ticketData.status === TicketStatus.Rejected) {
      throw new AppError(
        status.BAD_REQUEST,
        `Ticket is already ${TicketStatus.Rejected}.`
      );
    }

    if (
      tStatus === TicketStatus.Pending &&
      (ticketData.status === TicketStatus.InProgress ||
        ticketData.status === TicketStatus.Solved)
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        "Cannot change ticket status to pending."
      );
    }

    if (
      tStatus === TicketStatus.InProgress &&
      ticketData.status === TicketStatus.Solved
    ) {
      throw new AppError(
        status.BAD_REQUEST,
        `Status is already ${TicketStatus.Solved}, can't change back to ${TicketStatus.InProgress}.`
      );
    }

    await ChatRoom.findOneAndUpdate(
      { ticketId },
      { $addToSet: { members: userId } },
      { session }
    );

    if (tStatus === TicketStatus.Rejected && !!rejectedReason) {
      ticketData.rejectedReason = rejectedReason;
    }

    await Notification.create(
      [
        {
          description: TDescription.progress,
          sender: "ADMIN",
          ticketId,
          title: "Ticket Update",
          user: ticketData.user,
        },
      ],
      { session }
    );

    ticketData.status = tStatus;
    await ticketData.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return ticketData;
  } catch (error: any) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new Error(error); // rethrow so caller can handle it
  }
};

const deleteTicket = async (ticketId: string) => {
  const deletedTicket = await Ticket.findOneAndUpdate(
    { _id: ticketId, isDeleted: false },
    {
      isDeleted: true,
    },
    { new: true }
  );
  if (!deletedTicket) {
    throw new Error("Delete failed. Ticket not found or already deleted"); // reth
  }
  return deletedTicket;
};

export const TicketService = {
  createTicket,
  getAllUSersTicket,
  getTicketById,
  updateTicketStatus,
  getMyTickets,
  deleteTicket,
};
