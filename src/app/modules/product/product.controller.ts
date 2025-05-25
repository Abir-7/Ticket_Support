import status from "http-status";
import catchAsync from "../../utils/serverTool/catchAsync";
import sendResponse from "../../utils/serverTool/sendResponse";
import { ProductService } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
  const productData = req.body;
  const result = await ProductService.createProduct(productData);
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Product created successfully.",
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductService.getAllProducts();
  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Products fetched successfully.",
    data: result,
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
  const { id } = req.params;
  const productData = req.body;
  const result = await ProductService.updateProduct(id, productData);
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
