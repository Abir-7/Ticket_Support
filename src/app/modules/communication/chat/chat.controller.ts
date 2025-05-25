import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { ChatService } from "./chat.service";

const createChat = catchAsync(async (req, res) => {
  const chatData = req.body;
  const result = await ChatService.createChat(chatData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat created successfully.",
    data: result,
  });
});

const getAllChats = catchAsync(async (req, res) => {
  const result = await ChatService.getAllChats();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chats fetched successfully.",
    data: result,
  });
});

const getChatById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChatService.getChatById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat fetched successfully.",
    data: result,
  });
});

const updateChat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const chatData = req.body;
  const result = await ChatService.updateChat(id, chatData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat updated successfully.",
    data: result,
  });
});

const deleteChat = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChatService.deleteChat(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat deleted successfully.",
    data: result,
  });
});

export const ChatController = {
  createChat,
  getAllChats,
  getChatById,
  updateChat,
  deleteChat,
};
