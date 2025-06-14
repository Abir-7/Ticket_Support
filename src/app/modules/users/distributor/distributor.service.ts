/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import mongoose, { PipelineStage } from "mongoose";
import { AuthService } from "../../auth/auth.service";
import Distributor from "./distributor.model";
import AppError from "../../../errors/AppError";
import status from "http-status";
import { UserService } from "../user/user.service";

const addDistributor = async (data: {
  email: string;
  fullName: string;
  password: string;
  shopName: string;
  shopAddress: string;
}) => {
  const isDistributor = true;
  return await AuthService.createUser(
    { email: data.email, fullName: data.fullName, password: data.password },
    { isDistributor, shopName: data.shopName, shopAddress: data.shopAddress }
  );
};

const getAllDistributor = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const aggregateArray: PipelineStage[] = [
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $lookup: {
              from: "userprofiles",
              localField: "_id",
              foreignField: "user",
              as: "userProfile",
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    { $match: { "user.isDeleted": false } },
  ];

  const [allDistributor, countArr] = await Promise.all([
    await Distributor.aggregate([
      ...aggregateArray,
      { $skip: skip },
      { $limit: limit },
    ]),

    await Distributor.aggregate([...aggregateArray, { $count: "total" }]),
  ]);

  const totalItem = countArr[0]?.total || 0;
  const totalPage = Math.ceil(totalItem / limit);

  const meta = {
    totalItem,
    totalPage,
    limit,
    page,
  };

  return { allDistributor, meta };
};

const getDistributorDetails = async (id: string) => {
  const aggregateArray: PipelineStage[] = [
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $lookup: {
              from: "userprofiles",
              localField: "_id",
              foreignField: "user",
              as: "userProfile",
            },
          },
        ],
      },
    },
    { $unwind: "$user" },
    { $match: { "user.isDeleted": false } },
  ];

  const allDistributor = await Distributor.aggregate([...aggregateArray]);

  if (!allDistributor[0]) {
    throw new AppError(status.NOT_FOUND, "Data not found.");
  }

  return allDistributor[0];
};

const removeDistributor = async (dId: string) => {
  const dData = await Distributor.findById(dId);
  if (!dData) {
    throw new AppError(status.NOT_FOUND, "Distributor data not found.");
  }
  return await UserService.deleteUser(dData._id.toString());
};

export const DistributorService = {
  addDistributor,
  getAllDistributor,
  getDistributorDetails,
  removeDistributor,
};
