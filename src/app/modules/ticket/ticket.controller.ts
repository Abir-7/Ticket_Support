/* eslint-disable @typescript-eslint/no-explicit-any */

import status from "http-status";
import catchAsync from "../../utils/serverTool/catchAsync";
import sendResponse from "../../utils/serverTool/sendResponse";
import { TicketService } from "./ticket.service";

const createTicket = catchAsync(async (req, res) => {
  const ticketData = req.body;
  const result = await TicketService.createTicket(
    ticketData,
    req.user.userId,
    req.files as Express.Multer.File[]
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket created successfully.",
    data: result,
  });
});

const getMyTickets = catchAsync(async (req, res) => {
  const { isRecent, page = 1, limit = 10 } = req.query;

  const result = await TicketService.getMyTickets(
    req.user.userId,
    isRecent as "true" | "false",
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My Tickets fetched successfully.",
    data: result,
  });
});

const getAllUSersTicket = catchAsync(async (req, res) => {
  const {
    status: ticketStatus,
    page = 1,
    limit = 10,
    searchTerm = "",
  } = req.query;
  const result = await TicketService.getAllUSersTicket(
    Number(page),
    Number(limit),
    ticketStatus as string,
    searchTerm as string
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Tickets fetched successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const getTicketById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TicketService.getTicketById(id, req.user);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket data fetched successfully.",
    data: result,
  });
});

const updateTicketStatus = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TicketService.updateTicketStatus(
    id,
    req.body.status,
    req.body.rejectedReason,
    req.user.userId
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket updated successfully.",
    data: result,
  });
});
const deleteTicket = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await TicketService.deleteTicket(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket deleted successfully.",
    data: result,
  });
});

export const TicketController = {
  createTicket,
  getAllUSersTicket,
  getTicketById,
  updateTicketStatus,
  getMyTickets,
  deleteTicket,
};
