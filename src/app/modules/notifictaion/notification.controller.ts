import status from "http-status";
import catchAsync from "../../utils/serverTool/catchAsync";
import sendResponse from "../../utils/serverTool/sendResponse";
import { NotificationService } from "./notification.service";

const getFromUser = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await NotificationService.getFromUser(
    Number(page),
    Number(limit)
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket notification fetched successfully.",
    data: result.getNotification,
    meta: result.meta,
  });
});

const getFromAdmin = catchAsync(async (req, res) => {
  const result = await NotificationService.getFromAdmin(req.user.userId);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket  notification fetched successfully.",
    data: result,
  });
});
const markAsRead = catchAsync(async (req, res) => {
  const result = await NotificationService.markAsRead(
    req.params.id,
    req.user.userRole
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Ticket  notification fetched successfully.",
    data: result,
  });
});

export const NotificationController = { getFromUser, getFromAdmin, markAsRead };
