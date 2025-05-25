export interface IChatRoom {
  name: string;
  members: string[]; // user IDs
  isDeleted: boolean;
}
