import chatClient from "./chatClient";
import {
  GroupEntity,
  GroupMessagesResponse,
  CreateGroupDto,
  UpdateGroupDto,
  GroupMembersEntity,
} from "../types";

export const groupApi = {
  createGroup: (data: CreateGroupDto) =>
    chatClient.post<GroupEntity>("/group/create-group", data),

  updateGroup: (groupId: number, data: UpdateGroupDto) =>
    chatClient.patch(`/group/update-group/${groupId}`, data),

  deleteGroup: (groupId: number) =>
    chatClient.delete(`/group/delete-group/${groupId}`),

  joinGroup: (groupId: number) =>
    chatClient.post(`/group/join-group/${groupId}`),

  leaveGroup: (groupId: number) =>
    chatClient.post(`/group/leave-group/${groupId}`),

  addMember: (groupId: number, userId: number, role: string) =>
    chatClient.post(`/group/add-member/${groupId}`, { user_id: userId, role }),

  removeMember: (groupId: number, userId: number) =>
    chatClient.post(`/group/remove-member/${groupId}`, { user_id: userId }),

  getGroupMessages: (groupId: number, page = 1, perPage = 100, query?: string) =>
    chatClient.get<GroupMessagesResponse>("/group/get-group-messages", {
      params: { group_id: groupId, page, perPage, query },
    }),

  getMyGroups: () => chatClient.get<GroupEntity[]>("/group/get-my-groups"),

  getPublicGroups: () => chatClient.get<GroupEntity[]>("/group/get-public-groups"),

  getGroupById: (groupId: number) =>
    chatClient.get<GroupEntity>(`/group/get-group-by-id/${groupId}`),

  getGroupMembers: (groupId: number) =>
    chatClient.get<GroupMembersEntity>(`/group/get-group-members/${groupId}`),
};
