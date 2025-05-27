import { Types } from "mongoose";

export interface ITicket {
  user: Types.ObjectId;
  mobile: string;
  issue: IssueType;
  userType: UserType;
  images: string[];
}
export enum IssueType {
  Hardware = "Hardware",
  Software = "Software",
  Battery = "Battery",
  Others = "Others",
}
export enum UserType {
  Customer = "Customer",
  Distributor = "Distributor",
}
