import chatClient from "./chatClient";
import {
  UserEntity,
  UsersResponse,
} from "../types";

export const userApi = {
  getUsers: (page = 1, perPage = 10, id?: number, name?: string) =>
    chatClient.get<UsersResponse>("/user/get-users", {
      params: { page, perPage, id, name },
    }),

  getUserById: (id: string) =>
    chatClient.get<UserEntity>(`/user/get-user-by-id/${id}`),
};
