/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import status from "http-status";
import AppError from "../../../errors/AppError";
import { removeFalsyFields } from "../../../utils/helper/removeFalsyField";
import { IBrand } from "./brand.interface";
import Brand from "./brand.model";
import unlinkFile from "../../../middleware/fileUpload/unlinkFiles";

const createBrand = async (
  brandData: IBrand,
  image: string
): Promise<IBrand> => {
  const data = { ...brandData, image };
  const addBrand = await Brand.create(data);

  if (!addBrand) {
    if (image) unlinkFile(image);

    throw new AppError(status.BAD_REQUEST, "Can't create brand. Try again.");
  }

  return addBrand;
};

const getAllBrands = async (
  page: number,
  limit: number,
  searchTerm: string
) => {
  const skip = (page - 1) * limit;

  const searchFilter = searchTerm
    ? {
        name: {
          $regex: searchTerm,
          $options: "i",
        },
      }
    : {};

  const queryFilter = {
    isDeleted: false,
    ...searchFilter,
  };

  const [data, totalItem] = await Promise.all([
    Brand.find(queryFilter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Brand.countDocuments(queryFilter),
  ]);

  const totalPage = Math.ceil(totalItem / limit);

  const meta = {
    totalItem,
    totalPage,
    limit,
    page,
  };

  return { data, meta };
};

const getBrandById = async (brandId: string) => {
  const brandDetails = await Brand.findOne({ _id: brandId, isDeleted: false });
  return brandDetails;
};

const updateBrand = async (
  brandId: string,
  brandData: Partial<IBrand>,
  newImage: string
) => {
  const existingBrand = await Brand.findById(brandId);
  if (!existingBrand || existingBrand.isDeleted) {
    if (newImage) {
      unlinkFile(newImage);
    }
    throw new AppError(
      status.NOT_FOUND,
      !existingBrand ? "Brand data not found." : "Brand data is deleted."
    );
  }

  const filteredData = removeFalsyFields(brandData);

  if (newImage) {
    filteredData.image = newImage;
  }

  const updatedBrand = await Brand.findByIdAndUpdate(brandId, filteredData, {
    new: true,
  });

  if (!updatedBrand) {
    if (newImage) unlinkFile(newImage);
    throw new AppError(status.BAD_REQUEST, "Brand data not updated.");
  }

  if (newImage && existingBrand.image) {
    unlinkFile(existingBrand.image);
  }

  return updatedBrand;
};

const deleteBrand = async (brandId: string) => {
  const brandInfo = await Brand.findById(brandId);
  if (!brandInfo) {
    throw new AppError(status.NOT_FOUND, "Brand data not found.");
  }

  if (brandInfo?.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "Brand data already deleted.");
  }

  brandInfo.isDeleted = true;
  return await brandInfo.save();
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
