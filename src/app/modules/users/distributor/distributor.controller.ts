import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { DistributorService } from "./distributor.service";

const addDistributor = catchAsync(async (req, res) => {
  const result = await DistributorService.addDistributor(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Distributor added successfully",
    data: result,
  });
});

const getAllDistributor = catchAsync(async (req, res) => {
  const { page = 1, limit = 15 } = req.query;
  const result = await DistributorService.getAllDistributor(
    Number(page),
    Number(limit),
    req.user.userRole
  );

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Distributor list fetched successfully",
    data: result.allDistributor,
    meta: result.meta,
  });
});

const getDistributorDetails = catchAsync(async (req, res) => {
  const result = await DistributorService.getDistributorDetails(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Distributor details fetched successfully.",
    data: result,
  });
});

const deleteDistributor = catchAsync(async (req, res) => {
  const result = await DistributorService.removeDistributor(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Distributor deleted successfully.",
    data: result,
  });
});

export const distributorController = {
  addDistributor,
  getAllDistributor,
  getDistributorDetails,
  deleteDistributor,
};
