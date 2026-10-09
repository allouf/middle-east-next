export interface UserEntity {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  countryCode: string | null;
  region: string | null;
  provider: string | null;
  provider_id: string | null;
  provider_token: string | null;
  provider_refresh_token: string | null;
  verified_at: string | null;
  ref_code: string | null;
  referred_by_user_id: number | null;
  is_active: boolean;
  is_profile_complete: boolean;
  is_beta_user: boolean;
  deletion_reason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MessageEntity {
  id: number;
  senderUser: UserEntity;
  content: string;
  read: boolean;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  createdAt: string;
}

export interface ChatEntity {
  id: number;
  initiatorUser: UserEntity;
  receiverUser: UserEntity;
  lastMessage: MessageEntity | null;
  createdAt: string;
  updatedAt: string;
  isInitiatorOnline: boolean;
  isReceiverOnline: boolean;
}

export interface ChannelMessageEntity {
  id: number;
  message: string;
  messageType: string;
  isPinned: boolean;
  createdAt: string;
  sender: UserEntity;
}

export interface ChannelEntity {
  id: number;
  name: string;
  description: string | null;
  avatar: string | null;
  privacy: "PUBLIC" | "PRIVATE";
  isActive: boolean;
  maxMembers: number;
  readOnly: boolean;
  owner: UserEntity;
  lastMessage: ChannelMessageEntity | null;
  createdAt: string;
  updatedAt: string;
}

export interface MetaDataEntity {
  current_page: number;
  last_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;
}

export interface ChatsResponse {
  data: ChatEntity[];
  meta: MetaDataEntity;
}

export interface MessagesResponse {
  data: MessageEntity[];
  meta: MetaDataEntity;
}

export interface ChannelMessagesResponse {
  data: ChannelMessageEntity[];
  meta: MetaDataEntity;
}

export interface CreateChannelDto {
  name: string;
  description?: string;
  privacy: "PUBLIC" | "PRIVATE";
  allow_member_messages?: boolean;
  allow_member_media?: boolean;
  allow_member_calls?: boolean;
  allow_member_invites?: boolean;
  require_approval?: boolean;
  max_members?: number;
}

export interface SendChannelMessageDto {
  channel_id: number;
  message: string;
  message_type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";
  reply_to?: number;
}

export interface DeleteChatDto {
  chatIds: number[];
}

export type CallStateStatus = 'IDLE' | 'RINGING' | 'ACTIVE' | 'ENDED';
export type CallType = 'AUDIO' | 'VIDEO';

export interface CallEntity {
  id: string;
  name: string;
  photo: string | null;
  type: CallType;
  status: CallStateStatus;
  direction: 'INCOMING' | 'OUTGOING' | 'MISSED';
  timestamp: string;
  duration?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface CallHistoryResponse {
  data: CallEntity[];
  meta: MetaDataEntity;
}

// Contacts
export interface CreateContactDto {
  contact_id: number;
  name: string;
}

export interface UpdateContactDto {
  name?: string;
  is_blocked?: boolean;
  is_muted?: boolean;
  is_deleted?: boolean;
  is_archived?: boolean;
  is_pinned?: boolean;
  is_favorite?: boolean;
}

export interface ContactEntity {
  id: number;
  contact_id: number;
  name: string | null;
  phone: string | null;
  photo: string | null;
  is_blocked: boolean;
  is_muted: boolean;
  is_deleted: boolean;
  is_archived: boolean;
  is_pinned: boolean;
  is_favorite: boolean;
  createdAt: string;
}

export interface ContactsResponse {
  data: ContactEntity[];
  meta: MetaDataEntity;
}

// Users
export interface UsersResponse {
  data: UserEntity[];
  meta: MetaDataEntity;
}

// Groups
export interface GroupMessageEntity {
  id: number;
  message: string;
  messageType: string;
  caption: any;
  duration: any;
  isPinned: boolean;
  createdAt: string;
  sender: any;
}

export interface GroupEntity {
  id: number;
  name: string;
  description: string | null;
  avatar: string | null;
  privacy: "PUBLIC" | "PRIVATE";
  isActive: boolean;
  maxMembers: number;
  readOnly: boolean;
  owner: UserEntity;
  lastMessage: GroupMessageEntity | null;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMembersEntity {
  id: number;
  groupId: number;
  userId: number | null;
  role: string | null;
  status: string;
  joinedAt: string;
  lastReadAt: any;
  isOnline: boolean;
  user: UserEntity;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMessagesResponse {
  data: GroupMessageEntity[];
  meta: MetaDataEntity;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  privacy: "PUBLIC" | "PRIVATE";
  max_members?: number;
}

export interface UpdateGroupDto extends Partial<CreateGroupDto> {}

export interface AddGroupMemberDto {
  user_id: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export interface RemoveGroupMemberDto {
  user_id: number;
}

// Channels enhancements
export interface AddMemberDto {
  user_id: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
}

export interface RemoveMemberDto {
  user_id: number;
}

export interface ChannelMembersEntity {
  id: number;
  channelId: number;
  userId: number | null;
  role: string | null;
  status: string;
  joinedAt: string;
  lastReadAt: any;
  isOnline: boolean;
  user: UserEntity;
  createdAt: string;
  updatedAt: string;
}

export type CHANNEL_MESSAGE_REACTION_TYPE = "LOVE" | "LIKE" | "FIRE" | "ROCKET" | "CLAP" | "HAHA" | "WOW" | "SAD" | "ANGRY" | "DISLIKE";

export interface AddChannelMessageReactionDto {
  channel_message_id: number;
  reaction_type: CHANNEL_MESSAGE_REACTION_TYPE;
}

export interface ChannelMessageReactionEntity {
  id: number;
  channelMessageId: number;
  reactionType: CHANNEL_MESSAGE_REACTION_TYPE;
  count: number;
}

export interface UpdateChannelDto extends Partial<CreateChannelDto> {}
