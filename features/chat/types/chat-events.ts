/**
 * Chat WebSocket event names.
 * Maps 1:1 to the backend ChatEvent enum.
 */
export enum ChatEvent {
  // Connection
  CONNECTION_SUCCESS = 'connection-success',
  CONNECTION_ERROR = 'connection-error',

  // 1:1 Chat
  CREATE_CHAT = 'create-chat',
  CHAT_CREATED = 'chat-created',

  JOIN_CHAT = 'join-chat',
  USER_JOINED = 'user-joined',

  SEND_MESSAGE = 'send-message',
  NEW_MESSAGE = 'new-message',

  TYPING = 'typing',
  USER_TYPING = 'user-typing',

  READ_MESSAGE = 'read-message',
  MESSAGE_READ = 'message-read',

  USER_DISCONNECTED = 'user-disconnected',

  LEAVE_CHAT = 'leave-chat',
  PRESENCE_UPDATE = 'presence-update',

  // Calls
  VOICE_CALL = 'voice-call',
  VIDEO_CALL = 'video-call',
  END_CALL = 'end-call',
  CALL_USER = 'call-user',

  // Channel
  JOIN_CHANNEL = 'join-channel',
  USER_JOINED_CHANNEL = 'user-joined-channel',
  LEAVE_CHANNEL = 'leave-channel',
  SEND_CHANNEL_MESSAGE = 'send-channel-message',
  NEW_CHANNEL_MESSAGE = 'new-channel-message',

  // Group
  JOIN_GROUP = 'join-group',
  USER_JOINED_GROUP = 'user-joined-group',
  LEAVE_GROUP = 'leave-group',
  SEND_GROUP_MESSAGE = 'send-group-message',
  NEW_GROUP_MESSAGE = 'new-group-message',
}
