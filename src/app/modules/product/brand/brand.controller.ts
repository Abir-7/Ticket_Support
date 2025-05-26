import status from "http-status";
import catchAsync from "../../../utils/serverTool/catchAsync";
import sendResponse from "../../../utils/serverTool/sendResponse";
import { BrandService } from "./brand.service";
import { getRelativePath } from "../../../middleware/fileUpload/getRelativeFilePath";

const createBrand = catchAsync(async (req, res) => {
  const brandData = req.body;
  const result = await BrandService.createBrand(
    brandData,
    req.file?.path ? getRelativePath(req.file?.path) : ""
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Brand created successfully.",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req, res) => {
  const { page, limit = 10, searchTerm } = req.query;

  const result = await BrandService.getAllBrands(
    Number(page),
    Number(limit),
    searchTerm as string
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Brands fetched successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const getBrandById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BrandService.getBrandById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Brand fetched successfully.",
    data: result,
  });
});

const updateBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const brandData = req.body;

  const result = await BrandService.updateBrand(
    id,
    brandData,
    req.file?.path ? getRelativePath(req.file?.path) : ""
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Brand updated successfully.",
    data: result,
  });
});

const deleteBrand = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BrandService.deleteBrand(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Brand deleted successfully.",
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
