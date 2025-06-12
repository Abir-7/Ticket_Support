import mongoose, { Schema } from "mongoose";
import { IProduct } from "./product.interface";

const productSchema = new Schema<IProduct>(
  {
    model: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
