import { TicketStatus } from "../ticket/ticket.interface";
import Ticket from "../ticket/ticket.model";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const dashboardOverview = async () => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfToday.getDate() + 1);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

  const stats = await Ticket.aggregate([
    {
      $match: {
        isDeleted: false,
        createdAt: { $gte: startOfYear, $lt: endOfYear },
      },
    },
    {
      $facet: {
        presentYearAllTicket: [
          {
            $project: {
              _id: 1,
              createdAt: 1,
              status: 1,
            },
          },
          { $sort: { createdAt: -1 } },
        ],
        monthlyTotal: [
          { $match: { createdAt: { $gte: startOfMonth } } },
          { $count: "count" },
        ],
        monthlySolved: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: TicketStatus.Solved,
            },
          },
          { $count: "count" },
        ],
        monthlyPending: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: TicketStatus.Pending,
            },
          },
          { $count: "count" },
        ],
        todaysTotal: [
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow,
              },
            },
          },
          { $count: "count" },
        ],
        recentTicketsToday: [
          {
            $match: {
              createdAt: {
                $gte: startOfToday,
                $lt: startOfTomorrow,
              },
            },
          },
          {
            $lookup: {
              from: "userprofiles",
              foreignField: "user",
              localField: "user",
              as: "userProfile",
            },
          },
          { $unwind: "$userProfile" },
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userProfile.user",
              as: "userProfile.user",
            },
          },
          { $unwind: "$userProfile.user" },
          {
            $lookup: {
              from: "products",
              foreignField: "_id",
              localField: "productId",
              as: "productId",
            },
          },
          { $unwind: "$productId" },
          { $sort: { createdAt: -1 } },
          { $limit: 15 },
          {
            $project: {
              _id: 1,
              issue: 1,
              status: 1,
              productSerialNumber: 1,
              userEmail: "$userProfile.user.email",
              userName: "$userProfile.fullName",
              productModel: "$productId.model",
            },
          },
        ],
      },
    },
    {
      $project: {
        presentYearAllTicket: 1,
        monthlyTotal: {
          $ifNull: [{ $arrayElemAt: ["$monthlyTotal.count", 0] }, 0],
        },
        monthlySolved: {
          $ifNull: [{ $arrayElemAt: ["$monthlySolved.count", 0] }, 0],
        },
        monthlyPending: {
          $ifNull: [{ $arrayElemAt: ["$monthlyPending.count", 0] }, 0],
        },
        todaysTotal: {
          $ifNull: [{ $arrayElemAt: ["$todaysTotal.count", 0] }, 0],
        },
        recentTicketsToday: 1,
      },
    },
  ]);

  return (
    stats[0] || {
      presentYearAllTicket: [],
      monthlyTotal: 0,
      monthlySolved: 0,
      monthlyPending: 0,
      todaysTotal: 0,
      recentTicketsToday: [],
    }
  );
};

export const DashboardService = { dashboardOverview };
