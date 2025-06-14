/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { PipelineStage } from "mongoose";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import status from "http-status";
import AppError from "../../../errors/AppError";

import User from "./user.model";
const getAllUser = async (page: number, limit: number, searchTerm?: string) => {
  const matchConditions: any = {
    isDeleted: false,
    isBlocked: false,
  };

  if (searchTerm) {
    // You can adjust fields for search — e.g. email, fullName, nickname, etc.
    matchConditions.$or = [
      { email: { $regex: searchTerm, $options: "i" } },
      { "profileInfo.fullName": { $regex: searchTerm, $options: "i" } },
      { "profileInfo.nickname": { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Calculate how many docs to skip
  const skip = (page - 1) * limit;

  // Count total matching users (with same matchConditions)
  const totalItemArr = await User.aggregate([
    { $match: { isDeleted: false, isBlocked: false } },
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "user",
        as: "profileInfo",
      },
    },
    { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
    // Apply search term here for accurate count
    ...(searchTerm
      ? [
          {
            $match: {
              $or: [
                { email: { $regex: searchTerm, $options: "i" } },
                {
                  "profileInfo.fullName": { $regex: searchTerm, $options: "i" },
                },
                {
                  "profileInfo.nickname": { $regex: searchTerm, $options: "i" },
                },
              ],
            },
          },
        ]
      : []),
    { $count: "totalCount" },
  ]);
  const totalItem = totalItemArr[0]?.totalCount || 0;
  const totalPage = Math.ceil(totalItem / limit);

  // Now fetch paginated results
  const usersWithDetails = await User.aggregate([
    { $match: { isDeleted: false, isBlocked: false } },
    {
      $lookup: {
        from: "distributors",
        localField: "_id",
        foreignField: "user",
        as: "distributorInfo",
      },
    },
    {
      $lookup: {
        from: "userprofiles",
        localField: "_id",
        foreignField: "user",
        as: "profileInfo",
      },
    },
    { $unwind: { path: "$profileInfo", preserveNullAndEmptyArrays: true } },
    ...(searchTerm
      ? [
          {
            $match: {
              $or: [
                { email: { $regex: searchTerm, $options: "i" } },
                {
                  "profileInfo.fullName": { $regex: searchTerm, $options: "i" },
                },
                {
                  "profileInfo.nickname": { $regex: searchTerm, $options: "i" },
                },
              ],
            },
          },
        ]
      : []),
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
      $project: {
        distributorInfo: 0,
        password: 0,
        __v: 0,
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = {
    totalItem,
    totalPage,
    limit,
    page,
  };

  return { meta, data: usersWithDetails };
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
