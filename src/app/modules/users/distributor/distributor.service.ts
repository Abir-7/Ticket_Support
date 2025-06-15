/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import mongoose, { PipelineStage } from "mongoose";
import { AuthService } from "../../auth/auth.service";
import Distributor from "./distributor.model";
import AppError from "../../../errors/AppError";
import status from "http-status";
import { UserService } from "../user/user.service";
import { TUserRole } from "../../../interface/auth.interface";

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

const getAllDistributor = async (
  page: number,
  limit: number,
  userRole: TUserRole
) => {
  const isAdmin = userRole === "ADMIN";
  const skip = (page - 1) * limit;

  const basePipeline: PipelineStage[] = [
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
          { $unwind: "$userProfile" },
        ],
      },
    },
    { $unwind: "$user" },
    { $match: { "user.isDeleted": false } },

    {
      $project: {
        shopName: 1,
        shopAddress: 1,
        user: {
          _id: "$user._id",
          email: "$user.email",
          userProfile: {
            fullName: "$user.userProfile.fullName",
            phone: "$user.userProfile.phone",
            address: "$user.userProfile.address",
            image: "$user.userProfile.image",
          },
        },
        _id: 1,
      },
    },
  ];

  const paginatedPipeline = isAdmin
    ? [...basePipeline, { $skip: skip }, { $limit: limit }]
    : [...basePipeline];

  const countPromise = isAdmin
    ? Distributor.aggregate([...basePipeline, { $count: "total" }])
    : Promise.resolve([{ total: 0 }]);

  const [allDistributor, countArr] = await Promise.all([
    Distributor.aggregate(paginatedPipeline),
    countPromise,
  ]);

  const totalItem = isAdmin ? countArr[0]?.total || 0 : allDistributor.length;
  const totalPage = isAdmin ? Math.ceil(totalItem / limit) : 1;

  const meta = {
    totalItem,
    totalPage,
    limit: isAdmin ? limit : totalItem,
    page: isAdmin ? page : 1,
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
  return await UserService.deleteUser(dData.user.toString());
};

export const DistributorService = {
  addDistributor,
  getAllDistributor,
  getDistributorDetails,
  removeDistributor,
};
