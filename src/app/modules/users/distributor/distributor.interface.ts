import { Types } from "mongoose";

export interface IDistributor {
  user: Types.ObjectId;
  shopName: string;
  shopAddress: string;
}
