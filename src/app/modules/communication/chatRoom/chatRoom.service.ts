/* eslint-disable @typescript-eslint/no-unused-vars */
import { IChatRoom } from "./chatRoom.interface";

const createChatRoom = async (chatRoomData: IChatRoom) => {
  // TODO: Implement chat room creation logic
};

const getAllChatRooms = async () => {
  // TODO: Implement logic to get all chat rooms
};

const getChatRoomById = async (chatRoomId: string) => {
  // TODO: Implement logic to get a chat room by ID
};

const updateChatRoom = async (
  chatRoomId: string,
  chatRoomData: Partial<IChatRoom>
) => {
  // TODO: Implement logic to update a chat room
};

const deleteChatRoom = async (chatRoomId: string) => {
  // TODO: Implement logic to delete a chat room
};

export const ChatRoomService = {
  createChatRoom,
  getAllChatRooms,
  getChatRoomById,
  updateChatRoom,
  deleteChatRoom,
};
