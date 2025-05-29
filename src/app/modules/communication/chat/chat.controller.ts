import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { ChatService } from "./chat.service";

const sendMessageByTicketId = catchAsync(async (req, res) => {
  const chatData = req.body;
  const result = await ChatService.sendMessageByTicketId(
    req.params.id,
    chatData,
    req.user.userId
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chat created successfully.",
    data: result,
  });
});

const getMessageByTicketId = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const result = await ChatService.getMessageByTicketId(
    req.params.id,
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Chats fetched successfully.",
    data: result,
  });
});

export const ChatController = {
  sendMessageByTicketId,
  getMessageByTicketId,
};
