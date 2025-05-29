import mongoose, { PipelineStage } from "mongoose";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import status from "http-status";
import AppError from "../../../errors/AppError";

import User from "./user.model";

const getAllUser = async () => {
  const aggrigateArray: PipelineStage[] = [
    { $match: { isDeleted: false, role: "USER" } },
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
      },
    },
  ];

  const user = await User.aggregate(aggrigateArray);
  return user;
};
const getMyData = async (userId: string) => {
  const aggrigateArray: PipelineStage[] = [
    {
      $match: {
        isDeleted: false,
        role: "USER",
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
      },
    },
  ];

  const user = await User.aggregate(aggrigateArray);
  return user[0] || {};
};
const deleteUser = async (userId: string) => {
  const user = await User.findOneAndUpdate(
    { user: userId },
    { isDeleted: true },
    { new: true }
  );

  if (!user) {
    throw new AppError(status.BAD_REQUEST, "Failed to delete user");
  }

  return user;
};

export const UserService = {
  getMyData,
  deleteUser,
  getAllUser,
};
