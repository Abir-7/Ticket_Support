import status from "http-status";
import catchAsync from "../../utils/serverTool/catchAsync";
import sendResponse from "../../utils/serverTool/sendResponse";
import { ProductService } from "./product.service";
import { getRelativePath } from "../../middleware/fileUpload/getRelativeFilePath";

const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;

  const result = await ProductService.createProduct(
    productData,
    req.file?.path ? getRelativePath(req.file?.path as string) : ""
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product created successfully.",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const { page = "1", limit = "10", searchTerm = "" } = req.query;

  const result = await ProductService.getAllProducts(
    Number(page),
    Number(limit),
    searchTerm as string
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Products fetched successfully.",
    data: result.products,
    meta: result.meta,
  });
});

const getProductById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.getProductById(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product fetched successfully.",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  console.log(req.file?.path);
  const { id } = req.params;
  const productData = req.body;
  const result = await ProductService.updateProduct(
    id,
    productData,
    req.file?.path ? getRelativePath(req.file.path) : ""
  );
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product updated successfully.",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProductService.deleteProduct(id);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product deleted successfully.",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getProductById,

  updateProduct,
  deleteProduct,
};
