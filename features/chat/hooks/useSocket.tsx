'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { io, type Socket } from 'socket.io-client';
import { getCookie, STORAGE_KEYS } from '@/lib/utils/auth-storage';
import { ChatEvent } from '../types/chat-events';
import type {
  IClientToServerEvents,
  IServerToClientEvents,
  // Client → Server payloads
  CreateChatPayload,
  JoinChatPayload,
  LeaveChatPayload,
  SendMessagePayload,
  TypingPayload,
  ReadMessagePayload,
  JoinChannelPayload,
  LeaveChannelPayload,
  SendChannelMessagePayload,
  JoinGroupPayload,
  LeaveGroupPayload,
  SendGroupMessagePayload,
  CallUserPayload,
  EndCallClientPayload,
  // Server → Client payloads
  ConnectionSuccessPayload,
  ConnectionErrorPayload,
  ChatCreatedPayload,
  UserJoinedPayload,
  NewMessagePayload,
  UserTypingPayload,
  MessageReadPayload,
  UserDisconnectedPayload,
  PresenceUpdatePayload,
  IncomingCallPayload,
  EndCallPayload,
  UserJoinedChannelPayload,
  NewChannelMessagePayload,
  UserJoinedGroupPayload,
  NewGroupMessagePayload,
} from '../types/socket-events';

// ============================================================
// Typed Socket alias
// ============================================================
type ChatSocket = Socket<IServerToClientEvents, IClientToServerEvents>;

// ============================================================
// Context shape
// ============================================================
interface SocketContextValue {
  /** The raw socket instance — null until connected */
  socket: ChatSocket | null;
  /** Whether the socket is connected */
  isConnected: boolean;

  // ---- Client → Server emitters (convenience wrappers) ----
  createChat: (data: CreateChatPayload) => void;
  joinChat: (data: JoinChatPayload) => void;
  leaveChat: (data: LeaveChatPayload) => void;
  sendMessage: (data: SendMessagePayload) => void;
  emitTyping: (data: TypingPayload) => void;
  readMessage: (data: ReadMessagePayload) => void;

  joinChannel: (data: JoinChannelPayload) => void;
  leaveChannel: (data: LeaveChannelPayload) => void;
  sendChannelMessage: (data: SendChannelMessagePayload) => void;

  joinGroup: (data: JoinGroupPayload) => void;
  leaveGroup: (data: LeaveGroupPayload) => void;
  sendGroupMessage: (data: SendGroupMessagePayload) => void;

  callUser: (data: CallUserPayload) => void;
  endCall: (data: EndCallClientPayload) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

const CHAT_WS_URL =
  process.env.NEXT_PUBLIC_CHAT_WS_URL ||
  'https://apiuat-nest.middleeastcommerce.net';

interface SocketProviderProps {
  children: ReactNode;
  /** Optional — called on any server→client event for global handling */
  onNewMessage?: (data: NewMessagePayload) => void;
  onNewChannelMessage?: (data: NewChannelMessagePayload) => void;
  onNewGroupMessage?: (data: NewGroupMessagePayload) => void;
  onIncomingVoiceCall?: (data: IncomingCallPayload) => void;
  onIncomingVideoCall?: (data: IncomingCallPayload) => void;
  onCallEnded?: (data: EndCallPayload) => void;
  onPresenceUpdate?: (data: PresenceUpdatePayload) => void;
  onUserTyping?: (data: UserTypingPayload) => void;
  onMessageRead?: (data: MessageReadPayload) => void;
  onChatCreated?: (data: ChatCreatedPayload) => void;
  onUserJoined?: (data: UserJoinedPayload) => void;
  onUserJoinedChannel?: (data: UserJoinedChannelPayload) => void;
  onUserJoinedGroup?: (data: UserJoinedGroupPayload) => void;
  onUserDisconnected?: (data: UserDisconnectedPayload) => void;
  onConnectionSuccess?: (data: ConnectionSuccessPayload) => void;
  onConnectionError?: (data: ConnectionErrorPayload) => void;
}

export function SocketProvider({
  children,
  onNewMessage,
  onNewChannelMessage,
  onNewGroupMessage,
  onIncomingVoiceCall,
  onIncomingVideoCall,
  onCallEnded,
  onPresenceUpdate,
  onUserTyping,
  onMessageRead,
  onChatCreated,
  onUserJoined,
  onUserJoinedChannel,
  onUserJoinedGroup,
  onUserDisconnected,
  onConnectionSuccess,
  onConnectionError,
}: SocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<ChatSocket | null>(null);

  // Keep callback refs fresh without re-creating the socket
  const callbackRefs = useRef({
    onNewMessage,
    onNewChannelMessage,
    onNewGroupMessage,
    onIncomingVoiceCall,
    onIncomingVideoCall,
    onCallEnded,
    onPresenceUpdate,
    onUserTyping,
    onMessageRead,
    onChatCreated,
    onUserJoined,
    onUserJoinedChannel,
    onUserJoinedGroup,
    onUserDisconnected,
    onConnectionSuccess,
    onConnectionError,
  });
  useEffect(() => {
    callbackRefs.current = {
      onNewMessage,
      onNewChannelMessage,
      onNewGroupMessage,
      onIncomingVoiceCall,
      onIncomingVideoCall,
      onCallEnded,
      onPresenceUpdate,
      onUserTyping,
      onMessageRead,
      onChatCreated,
      onUserJoined,
      onUserJoinedChannel,
      onUserJoinedGroup,
      onUserDisconnected,
      onConnectionSuccess,
      onConnectionError,
    };
  });

  // ----------------------------------------------------------
  // Connect / disconnect
  // ----------------------------------------------------------
  useEffect(() => {
    const token = getCookie(STORAGE_KEYS.TOKEN);
    if (!token) {
      console.warn('[SocketProvider] No auth token — skipping socket connect');
      return;
    }

    const socket: ChatSocket = io(CHAT_WS_URL, {
      auth: { 
        token // Just the raw token, NestJS typically expects this
      },
      extraHeaders: {
        Authorization: `Bearer ${token}` // Provide Bearer here for polling
      },
      transports: ['polling', 'websocket'], // MUST be polling first so extraHeaders are sent!
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socketRef.current = socket;

    // --- native socket.io events ---
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
      setIsConnected(false);
    });

    // --- Server → Client listeners ---
    
    // Log all incoming events for debugging
    socket.onAny((eventName, ...args) => {
      console.log(`[Socket.onAny] Received event: ${eventName}`, args);
    });

    // Connection
    socket.on(ChatEvent.CONNECTION_SUCCESS, (data) => {
      console.log('[Socket] Connection success:', data.message);
      callbackRefs.current.onConnectionSuccess?.(data);
    });

    socket.on(ChatEvent.CONNECTION_ERROR, (data) => {
      console.error('[Socket] Connection error event:', data);
      callbackRefs.current.onConnectionError?.(data);
    });

    // 1:1 Chat
    socket.on(ChatEvent.CHAT_CREATED, (data) => {
      callbackRefs.current.onChatCreated?.(data);
    });

    socket.on(ChatEvent.USER_JOINED, (data) => {
      callbackRefs.current.onUserJoined?.(data);
    });

    socket.on(ChatEvent.NEW_MESSAGE, (data) => {
      callbackRefs.current.onNewMessage?.(data);
    });

    socket.on(ChatEvent.USER_TYPING, (data) => {
      callbackRefs.current.onUserTyping?.(data);
    });

    socket.on(ChatEvent.MESSAGE_READ, (data) => {
      callbackRefs.current.onMessageRead?.(data);
    });

    // Presence
    socket.on(ChatEvent.USER_DISCONNECTED, (data) => {
      callbackRefs.current.onUserDisconnected?.(data);
    });

    socket.on(ChatEvent.PRESENCE_UPDATE, (data) => {
      callbackRefs.current.onPresenceUpdate?.(data);
    });

    // Calls
    socket.on(ChatEvent.VOICE_CALL, (data) => {
      console.log('[Socket] Incoming VOICE_CALL', data);
      callbackRefs.current.onIncomingVoiceCall?.(data);
    });

    socket.on(ChatEvent.VIDEO_CALL, (data) => {
      console.log('[Socket] Incoming VIDEO_CALL', data);
      callbackRefs.current.onIncomingVideoCall?.(data);
    });

    // Fallback/Generic call event catchers in case backend uses a different name
    socket.on(ChatEvent.CALL_USER as any, (data: any) => {
      console.log('[Socket] Incoming CALL_USER', data);
      if (data?.callType === 'VIDEO' || data?.call_type === 'VIDEO') {
        callbackRefs.current.onIncomingVideoCall?.(data);
      } else {
        callbackRefs.current.onIncomingVoiceCall?.(data);
      }
    });

    socket.on('incoming-call' as any, (data: any) => {
      console.log('[Socket] Incoming incoming-call', data);
      if (data?.callType === 'VIDEO' || data?.call_type === 'VIDEO') {
        callbackRefs.current.onIncomingVideoCall?.(data);
      } else {
        callbackRefs.current.onIncomingVoiceCall?.(data);
      }
    });

    socket.on(ChatEvent.END_CALL, (data) => {
      callbackRefs.current.onCallEnded?.(data);
    });

    // Channel
    socket.on(ChatEvent.USER_JOINED_CHANNEL, (data) => {
      callbackRefs.current.onUserJoinedChannel?.(data);
    });

    socket.on(ChatEvent.NEW_CHANNEL_MESSAGE, (data) => {
      callbackRefs.current.onNewChannelMessage?.(data);
    });

    // Group
    socket.on(ChatEvent.USER_JOINED_GROUP, (data) => {
      callbackRefs.current.onUserJoinedGroup?.(data);
    });

    socket.on(ChatEvent.NEW_GROUP_MESSAGE, (data) => {
      callbackRefs.current.onNewGroupMessage?.(data);
    });

    // --- Cleanup ---
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, []); // connect once on mount

  // ----------------------------------------------------------
  // Client → Server emitters
  // ----------------------------------------------------------
  const emit = useCallback(
    <E extends keyof IClientToServerEvents>(
      event: E,
      data: Parameters<IClientToServerEvents[E]>[0]
    ) => {
      if (!socketRef.current?.connected) {
        console.warn(`[Socket] Cannot emit "${event}" — not connected`);
        return;
      }
      socketRef.current.emit(event, data as any);
    },
    []
  );

  const createChat = useCallback(
    (data: CreateChatPayload) => emit(ChatEvent.CREATE_CHAT, data),
    [emit]
  );
  const joinChat = useCallback(
    (data: JoinChatPayload) => emit(ChatEvent.JOIN_CHAT, data),
    [emit]
  );
  const leaveChat = useCallback(
    (data: LeaveChatPayload) => emit(ChatEvent.LEAVE_CHAT, data),
    [emit]
  );
  const sendMessage = useCallback(
    (data: SendMessagePayload) => emit(ChatEvent.SEND_MESSAGE, data),
    [emit]
  );
  const emitTyping = useCallback(
    (data: TypingPayload) => emit(ChatEvent.TYPING, data),
    [emit]
  );
  const readMessage = useCallback(
    (data: ReadMessagePayload) => emit(ChatEvent.READ_MESSAGE, data),
    [emit]
  );

  const joinChannel = useCallback(
    (data: JoinChannelPayload) => emit(ChatEvent.JOIN_CHANNEL, data),
    [emit]
  );
  const leaveChannel = useCallback(
    (data: LeaveChannelPayload) => emit(ChatEvent.LEAVE_CHANNEL, data),
    [emit]
  );
  const sendChannelMessage = useCallback(
    (data: SendChannelMessagePayload) =>
      emit(ChatEvent.SEND_CHANNEL_MESSAGE, data),
    [emit]
  );

  const joinGroup = useCallback(
    (data: JoinGroupPayload) => emit(ChatEvent.JOIN_GROUP, data),
    [emit]
  );
  const leaveGroup = useCallback(
    (data: LeaveGroupPayload) => emit(ChatEvent.LEAVE_GROUP, data),
    [emit]
  );
  const sendGroupMessage = useCallback(
    (data: SendGroupMessagePayload) =>
      emit(ChatEvent.SEND_GROUP_MESSAGE, data),
    [emit]
  );

  const callUser = useCallback(
    (data: CallUserPayload) => emit(ChatEvent.CALL_USER, data),
    [emit]
  );
  const endCall = useCallback(
    (data: EndCallClientPayload) => emit(ChatEvent.END_CALL, data),
    [emit]
  );

  // ----------------------------------------------------------
  // Context value
  // ----------------------------------------------------------
  const value: SocketContextValue = {
    socket: socketRef.current,
    isConnected,
    createChat,
    joinChat,
    leaveChat,
    sendMessage,
    emitTyping,
    readMessage,
    joinChannel,
    leaveChannel,
    sendChannelMessage,
    joinGroup,
    leaveGroup,
    sendGroupMessage,
    callUser,
    endCall,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

/**
 * Access the chat socket context.
 * Must be used within a `<SocketProvider>`.
 *
 * @example
 * ```tsx
 * const { sendMessage, isConnected } = useSocket();
 *
 * sendMessage({
 *   chat_id: 1,
 *   content: 'Hello!',
 *   type: 'TEXT',
 * });
 * ```
 */
export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a <SocketProvider>');
  }
  return ctx;
}
