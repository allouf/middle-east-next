import { ChatEvent } from './chat-events';

// ============================================================
// Shared Enums (mirrors backend Prisma enums for frontend use)
// ============================================================

export type MessageType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE';
export type CallType = 'AUDIO' | 'VIDEO';

// ============================================================
// Client → Server Event Payloads (what the frontend SENDS)
// ============================================================

/** CREATE_CHAT — start a new 1:1 conversation */
export interface CreateChatPayload {
  receiver_user_id: number;
}

/** JOIN_CHAT — join a chat room */
export interface JoinChatPayload {
  chat_id: number;
}

/** LEAVE_CHAT — leave a chat room */
export interface LeaveChatPayload {
  chat_id: number;
}

/** SEND_MESSAGE — send a message in a 1:1 chat */
export interface SendMessagePayload {
  chat_id: number;
  content: string;
  type: MessageType;
  caption?: string;
  duration?: number;
}

/** TYPING — notify that the user is typing */
export interface TypingPayload {
  chat_id: number;
}

/** READ_MESSAGE — mark a message as read */
export interface ReadMessagePayload {
  chat_id: number;
  message_id: number;
}

/** JOIN_CHANNEL — join a channel room */
export interface JoinChannelPayload {
  channel_id: number;
}

/** LEAVE_CHANNEL — leave a channel room */
export interface LeaveChannelPayload {
  channel_id: number;
}

/** SEND_CHANNEL_MESSAGE — send a message in a channel */
export interface SendChannelMessagePayload {
  channel_id: number;
  content: string;
  type: MessageType;
  caption?: string;
  duration?: number;
}

/** JOIN_GROUP — join a group room */
export interface JoinGroupPayload {
  group_id: number;
}

/** LEAVE_GROUP — leave a group room */
export interface LeaveGroupPayload {
  group_id: number;
}

/** SEND_GROUP_MESSAGE — send a message in a group */
export interface SendGroupMessagePayload {
  group_id: number;
  content: string;
  type: MessageType;
  caption?: string;
  duration?: number;
}

/** CALL_USER — initiate a voice/video call */
export interface CallUserPayload {
  conversation_id: number;
  chat_id?: number;
  channel_name: string;
  channelName?: string;
  call_type: CallType;
  callType?: CallType;
  receiver_id: number;
  receiverId?: number;
}

/** END_CALL — end an active call (client-side) */
export interface EndCallClientPayload {
  conversation_id: number;
  channel_name: string;
}

// ============================================================
// Server → Client Event Payloads (what the frontend RECEIVES)
// ============================================================

/** CONNECTION_SUCCESS — socket connected successfully */
export interface ConnectionSuccessPayload {
  message: string;
}

/** CONNECTION_ERROR — socket connection failed */
export interface ConnectionErrorPayload {
  status: number;
  message: string;
}

/** CHAT_CREATED — a new chat was created */
export interface ChatCreatedPayload {
  chatId: number;
  initiatorUserId: number;
  receiverUserId: number;
}

/** USER_JOINED — a user joined a chat room */
export interface UserJoinedPayload {
  chatId: number;
  userId: number;
}

/** NEW_MESSAGE — new message received in 1:1 chat */
export interface NewMessagePayload {
  chatId: number;
  userSenderId?: number;
  messageId: number;
  content: string;
  caption: string | null;
  duration: number | null;
  createdAt: string;
}

/** USER_TYPING — another user is typing */
export interface UserTypingPayload {
  chatId: number;
}

/** MESSAGE_READ — a message was read */
export interface MessageReadPayload {
  messageId: number;
  chatId: number;
}

/** USER_DISCONNECTED — a user went offline */
export interface UserDisconnectedPayload {
  userId?: number;
}

/** PRESENCE_UPDATE — online/offline status change */
export interface PresenceUpdatePayload {
  status: 'online' | 'offline';
}

/** VOICE_CALL / VIDEO_CALL — incoming call notification */
export interface IncomingCallPayload {
  channelName: string;
  token: string;
  uid: number;
  callType: CallType;
  conversationId: number;
  callDetailId: number;
  callerId: number;
}

/** END_CALL — call ended (server broadcast) */
export interface EndCallPayload {
  channelName: string;
  conversationId: number;
  callerId: number;
}

/** USER_JOINED_CHANNEL — a user joined a channel */
export interface UserJoinedChannelPayload {
  channelId: number;
  userId: number;
}

/** NEW_CHANNEL_MESSAGE — new message in a channel */
export interface NewChannelMessagePayload {
  channelId: number;
  userSenderId?: number | null;
  messageId: number;
  content: string;
  caption: string | null;
  duration: number | null;
  createdAt: string;
}

/** USER_JOINED_GROUP — a user joined a group */
export interface UserJoinedGroupPayload {
  groupId: number;
  userId: number;
}

/** NEW_GROUP_MESSAGE — new message in a group */
export interface NewGroupMessagePayload {
  groupId: number;
  userSenderId?: number | null;
  messageId: number;
  content: string;
  caption: string | null;
  duration: number | null;
  createdAt: string;
}

// ============================================================
// Typed Socket Interfaces (for socket.io-client generic)
// ============================================================

/**
 * Events the CLIENT emits TO the server.
 * Used as the first generic arg: `Socket<IServerToClientEvents, IClientToServerEvents>`
 */
export interface IClientToServerEvents {
  [ChatEvent.CREATE_CHAT]: (data: CreateChatPayload) => void;
  [ChatEvent.JOIN_CHAT]: (data: JoinChatPayload) => void;
  [ChatEvent.LEAVE_CHAT]: (data: LeaveChatPayload) => void;
  [ChatEvent.SEND_MESSAGE]: (data: SendMessagePayload) => void;
  [ChatEvent.TYPING]: (data: TypingPayload) => void;
  [ChatEvent.READ_MESSAGE]: (data: ReadMessagePayload) => void;

  [ChatEvent.JOIN_CHANNEL]: (data: JoinChannelPayload) => void;
  [ChatEvent.LEAVE_CHANNEL]: (data: LeaveChannelPayload) => void;
  [ChatEvent.SEND_CHANNEL_MESSAGE]: (data: SendChannelMessagePayload) => void;

  [ChatEvent.JOIN_GROUP]: (data: JoinGroupPayload) => void;
  [ChatEvent.LEAVE_GROUP]: (data: LeaveGroupPayload) => void;
  [ChatEvent.SEND_GROUP_MESSAGE]: (data: SendGroupMessagePayload) => void;

  [ChatEvent.CALL_USER]: (data: CallUserPayload) => void;
  [ChatEvent.END_CALL]: (data: EndCallClientPayload) => void;
}

/**
 * Events the CLIENT listens for FROM the server.
 * Used as the second generic arg: `Socket<IServerToClientEvents, IClientToServerEvents>`
 */
export interface IServerToClientEvents {
  [ChatEvent.CONNECTION_SUCCESS]: (data: ConnectionSuccessPayload) => void;
  [ChatEvent.CONNECTION_ERROR]: (data: ConnectionErrorPayload) => void;

  [ChatEvent.CHAT_CREATED]: (data: ChatCreatedPayload) => void;
  [ChatEvent.USER_JOINED]: (data: UserJoinedPayload) => void;
  [ChatEvent.NEW_MESSAGE]: (data: NewMessagePayload) => void;
  [ChatEvent.USER_TYPING]: (data: UserTypingPayload) => void;
  [ChatEvent.MESSAGE_READ]: (data: MessageReadPayload) => void;

  [ChatEvent.USER_DISCONNECTED]: (data: UserDisconnectedPayload) => void;
  [ChatEvent.PRESENCE_UPDATE]: (data: PresenceUpdatePayload) => void;

  [ChatEvent.VOICE_CALL]: (data: IncomingCallPayload) => void;
  [ChatEvent.VIDEO_CALL]: (data: IncomingCallPayload) => void;
  [ChatEvent.END_CALL]: (data: EndCallPayload) => void;

  [ChatEvent.USER_JOINED_CHANNEL]: (data: UserJoinedChannelPayload) => void;
  [ChatEvent.NEW_CHANNEL_MESSAGE]: (data: NewChannelMessagePayload) => void;

  [ChatEvent.USER_JOINED_GROUP]: (data: UserJoinedGroupPayload) => void;
  [ChatEvent.NEW_GROUP_MESSAGE]: (data: NewGroupMessagePayload) => void;
}
