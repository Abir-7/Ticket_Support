import { Types } from "mongoose";

export interface ITicket {
  user: Types.ObjectId;
  phone: string;
  issue: IssueType[];
  userType: UserType;
  distributor?: Types.ObjectId;
  images: string[];
  description: string;
  status: TicketStatus;
  rejectedReason?: string;
  isDeleted: boolean;
  note: string;
  productId: Types.ObjectId;
  productSerialNumber: string;
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
  Connectivity = "Connectivity",
  PhysicalDamage = "Physical Damage",
}
export enum UserType {
  Applicator = "Applicator",
  Distributor = "Distributor",
}
