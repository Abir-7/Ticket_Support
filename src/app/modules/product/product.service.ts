/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../errors/AppError";
import unlinkFile from "../../middleware/fileUpload/unlinkFiles";
import { removeFalsyFields } from "../../utils/helper/removeFalsyField";
import { IProduct } from "./product.interface";
import Product from "./product.model";
import mongoose, { PipelineStage } from "mongoose";

const createProduct = async (productData: IProduct, image: string) => {
  const newFilteredData = removeFalsyFields(productData as any);

  if (image) {
    newFilteredData.image = image;
  }

  const savedProduct = await Product.create(newFilteredData);
  if (!savedProduct) {
    if (image) unlinkFile(image);
    throw new AppError(status.BAD_REQUEST, "Can not add prodruct. Try again.");
  }

  return savedProduct;
};

const getAllProducts = async (
  page: number,
  limit: number,
  searchTerm: string
) => {
  const matchStage: any = {
    isDeleted: false,
  };

  const aggregatePipeline: PipelineStage[] = [{ $match: matchStage }];

  // If searchTerm exists, add a $match stage for brand name or model:
  if (searchTerm) {
    aggregatePipeline.push({
      $match: {
        $or: [{ model: { $regex: searchTerm, $options: "i" } }],
      },
    });
  }

  // Count total items without pagination
  const countPipeline = [...aggregatePipeline, { $count: "total" }];

  const countResult = await Product.aggregate(countPipeline);
  const totalItem = countResult[0]?.total || 0;
  const totalPage = Math.ceil(totalItem / limit);

  // Add project and pagination stages for actual data fetch
  aggregatePipeline.push(
    {
      $project: {
        model: 1,
        image: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const products = await Product.aggregate(aggregatePipeline);

  return {
    products,
    meta: {
      totalItem,
      totalPage,
      limit,
      page,
    },
  };
};

const getProductById = async (productId: string) => {
  const aggrigate: PipelineStage[] = [
    {
      $match: { _id: new mongoose.Types.ObjectId(productId), isDeleted: false },
    },
  ];

  const data = await Product.aggregate(aggrigate);
  return data;
};

const updateProduct = async (
  productId: string,
  productData: Partial<IProduct>,
  image: string
) => {
  const productInfo = await Product.findById(productId);

  if (!productInfo) {
    if (image) unlinkFile(image);
    throw new AppError(status.NOT_FOUND, "Product not found to update.");
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { ...removeFalsyFields(productData), ...(image ? { image } : {}) },
    { new: true }
  );

  if (!updatedProduct) {
    if (image) unlinkFile(image);
    throw new AppError(status.BAD_REQUEST, "Product failed to update.");
  } else {
    if (image && productInfo.image) {
      unlinkFile(productInfo.image);
    }
  }

  return updatedProduct;
};

const deleteProduct = async (productId: string) => {
  const deletedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      isDeleted: true,
    },
    { new: true }
  );

  if (!deletedProduct) {
    throw new AppError(status.BAD_REQUEST, "Product failed to delete.");
  }

  return deletedProduct;
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
