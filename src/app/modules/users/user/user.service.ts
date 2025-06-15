/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { PipelineStage } from "mongoose";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import status from "http-status";
import AppError from "../../../errors/AppError";

import User from "./user.model";
const getAllUser = async (page: number, limit: number, searchTerm?: string) => {
  const skip = (page - 1) * limit;

  const matchConditions: any = {
    isDeleted: false,
    isBlocked: false,
    role: { $ne: "ADMIN" },
  };

  // Search logic (case-insensitive)
  if (searchTerm) {
    matchConditions.$or = [
      { email: { $regex: searchTerm, $options: "i" } },
      { "profileInfo.fullName": { $regex: searchTerm, $options: "i" } },
      { "profileInfo.nickname": { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Shared pipeline stages
  const basePipeline: PipelineStage[] = [
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "user",
        as: "profileInfo",
      },
    },
    { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "distributors",
        localField: "_id",
        foreignField: "user",
        as: "distributorInfo",
      },
    },
    {
      $addFields: {
        userType: {
          $cond: {
            if: { $gt: [{ $size: "$distributorInfo" }, 0] },
            then: "distributor",
            else: "applicator",
          },
        },
      },
    },
    {
      $match: matchConditions,
    },
  ];

  // Count
  const totalItemArr = await User.aggregate([
    ...basePipeline,
    { $count: "totalCount" },
  ]);
  const totalItem = totalItemArr[0]?.totalCount || 0;
  const totalPage = Math.ceil(totalItem / limit);

  // Final paginated query
  const usersWithDetails = await User.aggregate([
    ...basePipeline,
    {
      $project: {
        distributorInfo: 0,
        password: 0,
        __v: 0,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  return {
    meta: {
      totalItem,
      totalPage,
      limit,
      page,
    },
    data: usersWithDetails,
  };
};

const getMyData = async (userId: string) => {
  const aggrigateArray: PipelineStage[] = [
    {
      $match: {
        isDeleted: false,

        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "user",
        as: "userProfile",
      },
    },
    { $unwind: "$userProfile" },

    {
      $lookup: {
        from: "distributors",
        localField: "_id",
        foreignField: "user",
        as: "shopInfo",
      },
    },
    {
      $unwind: {
        path: "$shopInfo",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        password: 0,
        authentication: 0,
        __v: 0,
        needToResetPass: 0,
        "userProfile.__v": 0,
      },
    },
  ];

  const user = await User.aggregate(aggrigateArray);

  if (!user) {
    throw new AppError(status.NOT_FOUND, "Failed to get user data.");
  }

  return user[0] || {};
};

const deleteUser = async (userId: string) => {
  console.log(userId);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "Failed to delete user. User not found or already deleted."
    );
  }

  return user;
};

export const UserService = {
  getMyData,
  deleteUser,
  getAllUser,
};
