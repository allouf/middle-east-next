import chatClient from "./chatClient";
import {
  ChannelEntity,
  ChannelMessagesResponse,
  CreateChannelDto,
  UpdateChannelDto,
  SendChannelMessageDto,
  AddChannelMessageReactionDto,
  ChannelMessageReactionEntity,
  ChannelMembersEntity,
} from "../types";

export const channelApi = {
  createChannel: (data: CreateChannelDto) =>
    chatClient.post<ChannelEntity>("/channel/create-channel", data),

  updateChannel: (channelId: number, data: UpdateChannelDto) =>
    chatClient.patch(`/channel/update-channel/${channelId}`, data),

  deleteChannel: (channelId: number) =>
    chatClient.delete(`/channel/delete-channel/${channelId}`),

  joinChannel: (channelId: number) =>
    chatClient.post(`/channel/join-channel/${channelId}`),

  leaveChannel: (channelId: number) =>
    chatClient.post(`/channel/leave-channel/${channelId}`),

  addMember: (channelId: number, userId: number, role: string) =>
    chatClient.post(`/channel/add-member/${channelId}`, { user_id: userId, role }),

  removeMember: (channelId: number, userId: number) =>
    chatClient.post(`/channel/remove-member/${channelId}`, { user_id: userId }),

  sendChannelMessage: (data: SendChannelMessageDto) =>
    chatClient.post("/channel/send-message", data),

  getChannelMessages: (channelId: number, page = 1, perPage = 100, query?: string) =>
    chatClient.get<ChannelMessagesResponse>("/channel/get-channel-messages", {
      params: { channel_id: channelId, page, perPage, query },
    }),

  addMessageReaction: (data: AddChannelMessageReactionDto) =>
    chatClient.post<ChannelMessageReactionEntity>("/channel/add-message-reaction", data),

  getMyChannels: () => chatClient.get<ChannelEntity[]>("/channel/get-my-channels"),

  getPublicChannels: () => chatClient.get<ChannelEntity[]>("/channel/get-public-channels"),

  getChannelById: (channelId: number) =>
    chatClient.get<ChannelEntity>(`/channel/get-channel-by-id/${channelId}`),

  getChannelMembers: (channelId: number) =>
    chatClient.get<ChannelMembersEntity>(`/channel/get-channel-members/${channelId}`),

  getChannelRequests: (channelId: number) =>
    chatClient.get(`/channel/get-channel-requests/${channelId}`),

  getMyMemberRequests: () => chatClient.get("/channel/get-my-member-requests"),

  updateRequestStatus: (requestId: number, status: "APPROVED" | "REJECTED") =>
    chatClient.patch(`/channel/update-request-status/${requestId}`, { status }),
};
