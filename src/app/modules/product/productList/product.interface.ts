import { Types } from "mongoose";

export interface IProduct {
  brand: Types.ObjectId;
  model: string;
  image: string;
  description: string;
  isDeleted: boolean;
}
