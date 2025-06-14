import { model, Schema } from "mongoose";
import { IDistributor } from "./distributor.interface";

const distributorSchema = new Schema<IDistributor>(
  {
    shopAddress: {
      type: String,
      required: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // assuming one distributor per user
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const Distributor = model<IDistributor>("Distributor", distributorSchema);

export default Distributor;
