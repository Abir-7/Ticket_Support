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
  const result = await TicketService.getMyTickets(req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "My Tickets fetched successfully.",
    data: result,
  });
});

const getAllTickets = catchAsync(async (req, res) => {
  const result = await TicketService.getAllTickets();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Tickets fetched successfully.",
    data: result,
  });
});

const getTicketById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TicketService.getTicketById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket fetched successfully.",
    data: result,
  });
});

const updateTicket = catchAsync(async (req, res) => {
  const { id } = req.params;
  const ticketData = req.body;
  const result = await TicketService.updateTicket(id, ticketData);
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
  getAllTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getMyTickets,
};
