import { create } from "zustand";
import { ChatEntity, ChannelEntity, GroupEntity, GroupMembersEntity, MessageEntity, CallEntity, CallStateStatus } from "../types";

export interface CallDetail {
  token: string | null;
  channelName: string;
  uid: number | null;
  callType: 'AUDIO' | 'VIDEO';
  conversationId: number;
  callDetailId: number | null;
  callerId: number;
  receiverId?: number;
  isIncoming: boolean;
}

interface ChatState {
  activeTab: "chats" | "calls" | "archived" | "profile";
  chatFilter: "all" | "messages" | "groups" | "channels";
  selectedChat: ChatEntity | null;
  selectedChannel: ChannelEntity | null;
  selectedGroup: GroupEntity | null;
  searchQuery: string;
  chats: ChatEntity[];
  channels: ChannelEntity[];
  groups: GroupEntity[];
  messages: any[]; // Combined message type or specific to selection
  showInfo: boolean;
  isCreateGroupModalOpen: boolean;
  isCreateChannelModalOpen: boolean;
  isCreateChatModalOpen: boolean;
  isLeaveGroupModalOpen: boolean;
  isAddGroupMembersModalOpen: boolean;
  isLeaveChannelModalOpen: boolean;
  isDeleteChannelModalOpen: boolean;
  groupMembers: GroupMembersEntity[];
  
  // Call specific states
  callFilter: "all" | "missed" | "outgoing";
  selectedCall: CallEntity | null;
  callState: CallStateStatus; // IDLE | INCOMING | OUTGOING | ACTIVE | ENDED
  activeCallDetail: CallDetail | null;

  setActiveTab: (tab: "chats" | "calls" | "archived" | "profile") => void;
  setChatFilter: (filter: "all" | "messages" | "groups" | "channels") => void;
  setSelectedChat: (chat: ChatEntity | null) => void;
  setSelectedChannel: (channel: ChannelEntity | null) => void;
  setSelectedGroup: (group: GroupEntity | null) => void;
  setSearchQuery: (query: string) => void;
  setChats: (chats: ChatEntity[]) => void;
  setChannels: (channels: ChannelEntity[]) => void;
  setGroups: (groups: GroupEntity[]) => void;
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
  setShowInfo: (show: boolean) => void;
  setCreateGroupModalOpen: (open: boolean) => void;
  setCreateChannelModalOpen: (open: boolean) => void;
  setCreateChatModalOpen: (open: boolean) => void;
  setLeaveGroupModalOpen: (open: boolean) => void;
  setAddGroupMembersModalOpen: (open: boolean) => void;
  setLeaveChannelModalOpen: (open: boolean) => void;
  setDeleteChannelModalOpen: (open: boolean) => void;
  setGroupMembers: (members: GroupMembersEntity[]) => void;

  setCallFilter: (filter: "all" | "missed" | "outgoing") => void;
  setSelectedCall: (call: CallEntity | null) => void;
  setCallState: (state: CallStateStatus) => void;
  setActiveCallDetail: (detail: CallDetail | null) => void;
  updateChatLastMessage: (id: number, isChannel: boolean, lastMessage: any) => void;
  updateGroupLastMessage: (id: number, lastMessage: any) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeTab: "chats",
  chatFilter: "messages",
  selectedChat: null,
  selectedChannel: null,
  selectedGroup: null,
  searchQuery: "",
  chats: [],
  channels: [],
  groups: [],
  messages: [],
  showInfo: false,
  isCreateGroupModalOpen: false,
  isCreateChannelModalOpen: false,
  isCreateChatModalOpen: false,
  isLeaveGroupModalOpen: false,
  isAddGroupMembersModalOpen: false,
  isLeaveChannelModalOpen: false,
  isDeleteChannelModalOpen: false,
  groupMembers: [],
  
  callFilter: "all",
  selectedCall: null,
  callState: "IDLE",
  activeCallDetail: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setChatFilter: (filter) => set({ chatFilter: filter }),
  setSelectedChat: (chat) => set({ selectedChat: chat, selectedChannel: null, selectedGroup: null, showInfo: false }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel, selectedChat: null, selectedGroup: null, showInfo: false }),
  setSelectedGroup: (group) => set({ selectedGroup: group, selectedChat: null, selectedChannel: null, showInfo: false }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setChats: (chats) => set({ chats }),
  setChannels: (channels) => set({ channels }),
  setGroups: (groups) => set({ groups }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setShowInfo: (show) => set({ showInfo: show }),
  setCreateGroupModalOpen: (open) => set({ isCreateGroupModalOpen: open }),
  setCreateChannelModalOpen: (open) => set({ isCreateChannelModalOpen: open }),
  setCreateChatModalOpen: (open) => set({ isCreateChatModalOpen: open }),
  setLeaveGroupModalOpen: (open) => set({ isLeaveGroupModalOpen: open }),
  setAddGroupMembersModalOpen: (open) => set({ isAddGroupMembersModalOpen: open }),
  setLeaveChannelModalOpen: (open) => set({ isLeaveChannelModalOpen: open }),
  setDeleteChannelModalOpen: (open) => set({ isDeleteChannelModalOpen: open }),
  setGroupMembers: (members) => set({ groupMembers: members }),

  setCallFilter: (filter) => set({ callFilter: filter }),
  setSelectedCall: (call) => set({ selectedCall: call, callState: 'IDLE' }),
  setCallState: (state) => set({ callState: state }),
  setActiveCallDetail: (detail) => set({ activeCallDetail: detail }),
  
  updateChatLastMessage: (id, isChannel, lastMessage) => set((state) => {
    if (isChannel) {
      const idx = state.channels.findIndex(c => c.id === id);
      if (idx === -1) return state;
      const newChannels = [...state.channels];
      const updatedChannel = { ...newChannels[idx], lastMessage };
      newChannels.splice(idx, 1);
      newChannels.unshift(updatedChannel);
      return { channels: newChannels };
    } else {
      const idx = state.chats.findIndex(c => c.id === id);
      if (idx === -1) return state;
      const newChats = [...state.chats];
      const updatedChat = { ...newChats[idx], lastMessage };
      newChats.splice(idx, 1);
      newChats.unshift(updatedChat);
      return { chats: newChats };
    }
  }),
  updateGroupLastMessage: (id: number, lastMessage: any) => set((state) => {
    const idx = state.groups.findIndex(g => g.id === id);
    if (idx === -1) return state;
    const newGroups = [...state.groups];
    const updatedGroup = { ...newGroups[idx], lastMessage };
    newGroups.splice(idx, 1);
    newGroups.unshift(updatedGroup);
    return { groups: newGroups };
  }),
}));
