import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { ChatRoomService } from "./chatRoom.service";

const createChatRoom = catchAsync(async (req, res) => {
  const chatRoomData = req.body;
  const result = await ChatRoomService.createChatRoom(chatRoomData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat room created successfully.",
    data: result,
  });
});

const getAllChatRooms = catchAsync(async (req, res) => {
  const result = await ChatRoomService.getAllChatRooms();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat rooms fetched successfully.",
    data: result,
  });
});

const getChatRoomById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChatRoomService.getChatRoomById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat room fetched successfully.",
    data: result,
  });
});

const updateChatRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const chatRoomData = req.body;
  const result = await ChatRoomService.updateChatRoom(id, chatRoomData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat room updated successfully.",
    data: result,
  });
});

const deleteChatRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ChatRoomService.deleteChatRoom(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat room deleted successfully.",
    data: result,
  });
});

export const ChatRoomController = {
  createChatRoom,
  getAllChatRooms,
  getChatRoomById,
  updateChatRoom,
  deleteChatRoom,
};
