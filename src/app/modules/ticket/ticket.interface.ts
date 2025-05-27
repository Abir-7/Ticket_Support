import { Types } from "mongoose";

export interface ITicket {
  user: Types.ObjectId;
  mobile: string;
  issue: IssueType;
  userType: UserType;
  images: string[];
  status: TicketStatus;
}
export enum TicketStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Solved = "Solved",
  Rejected = "Rejected",
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
