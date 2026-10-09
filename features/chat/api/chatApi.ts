import chatClient from "./chatClient";
import { ChatsResponse, MessagesResponse, DeleteChatDto, ChatEntity, CallHistoryResponse } from "../types";

export const chatApi = {
  getMyChats: (page = 1, perPage = 10, isArchived?: boolean) =>
    chatClient.get<ChatsResponse>("/chat/get-my-chats", { params: { page, perPage, is_archived: isArchived } }),

  getChatMessages: (chatId: number, page = 1, perPage = 10) =>
    chatClient.get<MessagesResponse>("/chat/get-chat-messages", {
      params: { chat_id: chatId, page, perPage },
    }),

  deleteChats: (data: DeleteChatDto) =>
    chatClient.delete("/chat/delete-chats", { data }),

  archiveChat: (chatId: number) =>
    chatClient.patch<ChatEntity>(`/chat/archive-chat/${chatId}`),

  unarchiveChat: (chatId: number) =>
    chatClient.patch<ChatEntity>(`/chat/unarchive-chat/${chatId}`),

  // Legacy/Additional endpoints if needed
  startConversation: (receiverId: number) =>
    chatClient.post("/chat/start-conversation", { receiver_id: receiverId }),

  sendMessage: (chatId: number, content: string, type: string = "TEXT") =>
    chatClient.post("/chat/send-message", { chat_id: chatId, content, type }),

  getCallHistory: (page = 1, perPage = 10, conversationId?: number, callType?: 'VOICE' | 'VIDEO') => {
    return chatClient.get<CallHistoryResponse>("/chat/get-call-history", {
      params: {
        page,
        perPage,
        ...(conversationId ? { conversation_id: conversationId } : {}),
        ...(callType ? { call_type: callType } : {})
      }
    });
  },
};
