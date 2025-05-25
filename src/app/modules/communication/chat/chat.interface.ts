export interface IChat {
  participants: string[]; // user IDs
  messages: string[]; // message IDs
  isDeleted: boolean;
}
