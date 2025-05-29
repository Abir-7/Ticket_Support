import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { UserService } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUser();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "All User data is fetched successfully",
    data: result,
  });
});
const getMyData = catchAsync(async (req, res) => {
  const result = await UserService.getMyData(req.user.userId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User data is fetched successfully",
    data: result,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const result = await UserService.deleteUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "User deleted successfully.",
    data: result,
  });
});

export const UserController = {
  getMyData,
  deleteUser,
  getAllUser,
};
