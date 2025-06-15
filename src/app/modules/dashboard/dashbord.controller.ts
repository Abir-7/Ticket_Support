import status from "http-status";
import sendResponse from "../../utils/serverTool/sendResponse";
import { DashboardService } from "./dashboard.service";
import catchAsync from "../../utils/serverTool/catchAsync";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const dashboardOverview = catchAsync(async (req, res) => {
  const result = await DashboardService.dashboardOverview();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Overview data fetched successfully.",
    data: result,
  });
});
export const DashboardController = { dashboardOverview };
