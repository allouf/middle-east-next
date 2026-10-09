"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BsTelephone, BsCameraVideo, BsInfoCircle, BsThreeDotsVertical, BsClockHistory, BsSearch, BsPencil, BsPersonPlus, BsShare, BsExclamationCircle, BsSlashCircle, BsTrash, BsPlusCircle, BsImage, BsEmojiSmile, BsChatDots, BsFileEarmarkText, BsMic, BsPaperclip } from "react-icons/bs";
import { MessageSquarePlus, Users, MessageSquare, Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import MessageBubble from "./MessageBubble";
import { chatApi } from "../api/chatApi";
import { channelApi } from "../api/channelApi";
import { groupApi } from "../api/groupApi";
import { mediaApi } from "../api/mediaApi";
import chatClient from "../api/chatClient";
import { useSocket } from "../hooks/useSocket";
import { ChatEvent } from "../types/chat-events";
import type { NewMessagePayload, NewChannelMessagePayload, NewGroupMessagePayload, UserTypingPayload } from "../types/socket-events";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";

const ChatArea: React.FC = () => {
  const { 
    selectedChat, 
    selectedChannel,
    selectedGroup,
    chats, 
    channels,
    groups,
    messages, 
    setMessages, 
    addMessage, 
    showInfo, 
    setShowInfo,
    setCreateGroupModalOpen,
    setCreateChatModalOpen,
    setLeaveGroupModalOpen,
    setAddGroupMembersModalOpen,
    updateChatLastMessage,
    updateGroupLastMessage,
    activeTab,
    setChats,
    setGroups,
    setSelectedChat,
    setSelectedGroup
  } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Socket integration
  const {
    socket,
    isConnected,
    sendMessage: socketSendMessage,
    sendChannelMessage: socketSendChannelMessage,
    sendGroupMessage: socketSendGroupMessage,
    emitTyping,
    joinChat,
    joinChannel: socketJoinChannel,
    joinGroup: socketJoinGroup,
    readMessage,
    createChat,
    callUser,
  } = useSocket();

  const { setActiveCallDetail, setCallState, groupMembers } = useChatStore();

  const currentUserEmail = getCookie(STORAGE_KEYS.EMAIL);
  const isGroup = !!selectedGroup;
  const isChannel = !!selectedChannel && !isGroup;
  const activeEntity = selectedChat || selectedChannel || selectedGroup;
  const hasChats = (Array.isArray(chats) ? chats.length : 0) > 0 || (Array.isArray(channels) ? channels.length : 0) > 0 || (Array.isArray(groups) ? groups.length : 0) > 0;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch messages via REST and join socket room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeEntity) return;
      if (activeEntity.id < 0) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        if (isGroup) {
          // Fetch group messages
          const res = await groupApi.getGroupMessages(activeEntity.id);
          if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
            setMessages(res.data.data.data.reverse());
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            setMessages(res.data.data.reverse());
          } else if (res.data && Array.isArray(res.data)) {
            setMessages(res.data.reverse());
          }
          // Fetch group members for header subtitle
          try {
            const membersRes = await groupApi.getGroupMembers(activeEntity.id);
            const members = membersRes.data?.data || membersRes.data;
            if (Array.isArray(members)) {
              useChatStore.getState().setGroupMembers(members);
            }
          } catch { /* silent */ }
          if (isConnected) {
            socketJoinGroup({ group_id: activeEntity.id });
          }
        } else if (isChannel) {
          const res = await channelApi.getChannelMessages(activeEntity.id);
          if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
            setMessages(res.data.data.data.reverse());
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            setMessages(res.data.data.reverse());
          } else if (res.data && Array.isArray(res.data)) {
            setMessages(res.data.reverse());
          }
          if (isConnected && !isGroup) {
            socketJoinChannel({ channel_id: activeEntity.id });
          }
        } else {
          const res = await chatApi.getChatMessages(activeEntity.id);
          if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
            setMessages(res.data.data.data.reverse());
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            setMessages(res.data.data.reverse());
          } else if (res.data && Array.isArray(res.data)) {
            setMessages(res.data.reverse());
          }
          if (isConnected) {
            joinChat({ chat_id: activeEntity.id });
          }
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeEntity, isGroup, isChannel, setMessages, isConnected, joinChat, socketJoinChannel, socketJoinGroup]);

  // Listen for real-time incoming messages
  useEffect(() => {
    if (!socket || !activeEntity) return;

    const handleNewMessage = (data: NewMessagePayload) => {
      if (data.chatId === activeEntity.id && !isChannel) {
        addMessage({
          id: data.messageId,
          content: data.content,
          caption: data.caption,
          duration: data.duration,
          createdAt: data.createdAt,
          senderUser: { id: data.userSenderId },
          type: 'TEXT',
          isSent: false,
        });
      }
    };

    const handleNewChannelMessage = (data: NewChannelMessagePayload) => {
      if (data.channelId === activeEntity.id && isChannel) {
        addMessage({
          id: data.messageId,
          message: data.content,
          content: data.content,
          caption: data.caption,
          duration: data.duration,
          createdAt: data.createdAt,
          sender: { id: data.userSenderId },
          messageType: 'TEXT',
          isSent: false,
        });
      }
    };

    const handleNewGroupMessage = (data: NewGroupMessagePayload) => {
      if (data.groupId === activeEntity.id && isGroup) {
        addMessage({
          id: data.messageId,
          message: data.content,
          content: data.content,
          caption: data.caption,
          duration: data.duration,
          createdAt: data.createdAt,
          sender: { id: data.userSenderId },
          messageType: 'TEXT',
          isSent: false,
        });
      }
    };

    const handleUserTyping = (data: UserTypingPayload) => {
      if (data.chatId === activeEntity.id && !isChannel) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
      }
    };

    socket.on(ChatEvent.NEW_MESSAGE, handleNewMessage);
    socket.on(ChatEvent.NEW_CHANNEL_MESSAGE, handleNewChannelMessage);
    socket.on(ChatEvent.NEW_GROUP_MESSAGE, handleNewGroupMessage);
    socket.on(ChatEvent.USER_TYPING, handleUserTyping);

    return () => {
      socket.off(ChatEvent.NEW_MESSAGE, handleNewMessage);
      socket.off(ChatEvent.NEW_CHANNEL_MESSAGE, handleNewChannelMessage);
      socket.off(ChatEvent.NEW_GROUP_MESSAGE, handleNewGroupMessage);
      socket.off(ChatEvent.USER_TYPING, handleUserTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket, activeEntity, isChannel, addMessage]);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (activeEntity && !isChannel && isConnected) {
      emitTyping({ chat_id: activeEntity.id });
    }
  }, [activeEntity, isChannel, isConnected, emitTyping]);

  // Close menu on outside click
  useEffect(() => {
    if (!showMenu) return;
    const handleClick = () => setShowMenu(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showMenu]);
  
  // ============================
  // EMPTY STATES
  // ============================
  if (!activeEntity) {
    if (!hasChats) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white h-full relative">
          <div className="relative mb-6">
            <div className="w-64 h-64 bg-gray-50 rounded-full flex items-center justify-center">
              <div className="relative w-32 h-32">
                <div className="absolute top-0 right-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-24">
                   <div className="w-12 h-2 bg-gray-200 rounded mb-2"></div>
                   <div className="w-16 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="absolute bottom-0 left-0 bg-[#0d5e3d] p-3 rounded-xl shadow-md w-12 h-12 flex items-center justify-center">
                   <MessageSquare className="text-white w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No conversations yet</h2>
          <p className="text-gray-500 text-center max-w-sm mb-8">
            You don't have any chats yet. Start a new conversation or add a contact to begin messaging.
          </p>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 bg-[#0d5e3d] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition text-sm"
              onClick={() => setCreateChatModalOpen(true)}
            >
              <MessageSquarePlus className="w-4 h-4" /> Start New Chat
            </button>
            <button 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              onClick={() => setCreateGroupModalOpen(true)}
            >
              <Users className="w-4 h-4" /> Create Group
            </button>
          </div>
          <div className="absolute bottom-8 text-xs text-gray-400 flex items-center gap-1">
             <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M10.5 5.25V4.08333C10.5 1.82817 8.48528 0 6 0C3.51472 0 1.5 1.82817 1.5 4.08333V5.25C0.671573 5.25 0 5.92157 0 6.75V12.5C0 13.3284 0.671573 14 1.5 14H10.5C11.3284 14 12 13.3284 12 12.5V6.75C12 5.92157 11.3284 5.25 10.5 5.25ZM6 10.5C5.17157 10.5 4.5 9.82843 4.5 9C4.5 8.17157 5.17157 7.5 6 7.5C6.82843 7.5 7.5 8.17157 7.5 9C7.5 9.82843 6.82843 10.5 6 10.5ZM9 5.25H3V4.08333C3 2.42648 4.34315 1.16667 6 1.16667C7.65685 1.16667 9 2.42648 9 4.08333V5.25Z" fill="#A0AEC0"/>
             </svg>
             End-to-end encrypted for your security
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white h-full p-8">
        <div className="w-full max-w-2xl bg-[#f5f7f9] rounded-[2rem] flex flex-col items-center justify-center py-16 px-12">
          <div className="w-20 h-20 bg-[#e8ecf1] rounded-full flex items-center justify-center mb-5">
            <MessageSquare className="w-9 h-9 text-[#999]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your messages</h2>
          <p className="text-gray-500 text-center max-w-xs mb-8 text-sm leading-relaxed">
            Select a conversation from the list to start messaging with your team and friends.
          </p>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 bg-[#0d5e3d] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition text-sm"
              onClick={() => setCreateChatModalOpen(true)}
            >
              <MessageSquarePlus className="w-4 h-4" /> Start New Chat
            </button>
            <button 
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
              onClick={() => setCreateGroupModalOpen(true)}
            >
              <Users className="w-4 h-4" /> Create Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  const token = getCookie(STORAGE_KEYS.TOKEN);
  let currentUserId: number | null = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      currentUserId = payload.sub || payload.id || payload.userId || payload.user_id;
    } catch (e) {
      console.warn("Failed to decode token for user ID");
    }
  }

  // Fallback to email if token decode fails
  const isInitiator = !isChannel && !isGroup && (
    ((activeEntity as any).initiatorUser?.id === currentUserId) || 
    ((activeEntity as any).initiatorUser?.email === currentUserEmail)
  );
  
  const otherUser = isInitiator ? (activeEntity as any).receiverUser : (activeEntity as any).initiatorUser;
  
  const name = (isChannel || isGroup) ? (activeEntity as any).name : (otherUser?.name || "Unknown");
  const photo = (isChannel || isGroup) ? (activeEntity as any).avatar : (otherUser?.photo || "/ReferralImage.png");
  const memberCount = isGroup ? groupMembers.length : 0;
  const subtitle = isGroup ? `${memberCount || ''} members` : isChannel ? 'Channel' : '';

  const sendMessageCore = async (contentToSend: string, messageType: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | "VOICE") => {
    if (!activeEntity) return;

    const tempMessage = {
      id: Date.now(),
      content: contentToSend,
      message: contentToSend,
      senderUser: { name: "Me", photo: null, email: currentUserEmail },
      sender: { name: "Me", photo: null, email: currentUserEmail },
      type: messageType,
      createdAt: new Date().toISOString(),
      isSent: true
    };
    
    addMessage(tempMessage);
    if (isGroup) {
      updateGroupLastMessage(activeEntity.id, {
        content: messageType === "TEXT" ? contentToSend : `[${messageType}]`,
        message: messageType === "TEXT" ? contentToSend : `[${messageType}]`,
        createdAt: tempMessage.createdAt,
      });
    } else {
      updateChatLastMessage(activeEntity.id, isChannel, {
        content: messageType === "TEXT" ? contentToSend : `[${messageType}]`,
        message: messageType === "TEXT" ? contentToSend : `[${messageType}]`,
        createdAt: tempMessage.createdAt,
      });
    }

    try {
      if (isGroup) {
        if (isConnected) {
          socketSendGroupMessage({
            group_id: activeEntity.id,
            content: contentToSend,
            type: messageType,
          });
        } else {
          console.warn("[GroupMsg] Socket not connected, cannot send group message.");
        }
      } else if (isChannel) {
        if (isConnected) {
          socketSendChannelMessage({
            channel_id: activeEntity.id,
            content: contentToSend,
            type: messageType,
          });
        } else {
          await channelApi.sendChannelMessage({
            channel_id: activeEntity.id,
            message: contentToSend,
            message_type: messageType,
          });
        }
      } else {
        if (activeEntity.id < 0) {
          const receiverId = Math.abs(activeEntity.id);
          if (isConnected && socket) {
            createChat({ receiver_user_id: receiverId });
            const onChatCreated = (data: any) => {
              if (data.receiverUserId === receiverId || data.initiatorUserId === receiverId) {
                socketSendMessage({
                  chat_id: data.chatId,
                  content: contentToSend,
                  type: messageType,
                });
                socket.off(ChatEvent.CHAT_CREATED, onChatCreated);
              }
            };
            socket.on(ChatEvent.CHAT_CREATED, onChatCreated);
            setTimeout(() => {
              if (socket) socket.off(ChatEvent.CHAT_CREATED, onChatCreated);
            }, 10000);
          } else {
            console.error("Socket not connected, cannot create chat.");
          }
        } else {
          if (isConnected) {
            socketSendMessage({
              chat_id: activeEntity.id,
              content: contentToSend,
              type: messageType,
            });
          } else {
            await chatApi.sendMessage(activeEntity.id, contentToSend, messageType);
          }
        }
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || !activeEntity) return;
    const contentToSend = inputValue;
    setInputValue("");
    await sendMessageCore(contentToSend, "TEXT");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeEntity) return;

    let mediaType: "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | "VOICE" = "FILE";
    if (file.type.startsWith("image/")) mediaType = "IMAGE";
    else if (file.type.startsWith("video/")) mediaType = "VIDEO";
    else if (file.type.startsWith("audio/")) mediaType = "AUDIO";

    try {
      setLoading(true);
      const res = await mediaApi.uploadMedia(file, mediaType);
      
      const fileUrl = res?.data?.data || res?.data?.url || res?.url || res?.data || res;
      
      if (fileUrl && typeof fileUrl === "string") {
         await sendMessageCore(fileUrl, mediaType);
      } else {
         console.error("Failed to parse media upload response", res);
      }
    } catch (error) {
      console.error("Media upload failed", error);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStartCall = (callType: 'AUDIO' | 'VIDEO') => {
    if (!activeEntity || !isConnected) return;
    
    // Only 1:1 calls for now, using conversation_id from chat
    // If it's a channel or group, we'd need channel calling logic
    if (isChannel || isGroup) {
      alert("Group/Channel calls are not supported in this demo yet.");
      return;
    }

    const channelName = `call_${activeEntity.id}_${Date.now()}`;
    const receiverId = activeEntity.id < 0 ? Math.abs(activeEntity.id) : (otherUser as any)?.id;
    
    if (!receiverId) return;

    callUser({
      conversation_id: activeEntity.id,
      chat_id: activeEntity.id,
      channel_name: channelName,
      channelName: channelName,
      call_type: callType,
      callType: callType,
      receiver_id: receiverId,
      receiverId: receiverId,
    });

    setActiveCallDetail({
      token: null, // Caller might not have token until backend responds, or uses temp token
      channelName: channelName,
      uid: null,
      callType: callType,
      conversationId: activeEntity.id,
      callDetailId: null,
      callerId: (currentUserEmail as any) || "Me",
      receiverId: receiverId,
      isIncoming: false,
    });
    setCallState("OUTGOING");
  };

  // Header menu items
  const is1to1Chat = !isChannel && !isGroup;
  
  const headerMenuItems = [
    ...(is1to1Chat ? [
      { 
        icon: <BsClockHistory className="w-[16px] h-[16px]" />, 
        label: activeTab === 'archived' ? "Unarchive Chat" : "Archive Chat", 
        color: "text-[#475569]",
      }
    ] : []),
    ...(isGroup ? [
      { iconSrc: "/icons/chats/addPerson.svg", label: "Add Members", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/leave.svg", label: "Leave Group", color: "text-[#dc2626]" },
      { iconSrc: "/icons/chats/clear.svg", label: "Clear Chat", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/search.svg", label: "Search", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/delete.svg", label: "Delete Group", color: "text-[#dc2626]" },
    ] : []),
    ...(isChannel ? [
      { iconSrc: "/icons/chats/clear.svg", label: "Clear Chat", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/mute.svg", label: "Mute Notifications", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/search.svg", label: "Search", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/leave.svg", label: "Unfollow Channel", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/share.svg", label: "Share Channel", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/report.svg", label: "Report", color: "text-[#ea580c]" },
      { iconSrc: "/icons/chats/delete.svg", label: "Delete", color: "text-[#dc2626]" },
    ] : []),
    ...(is1to1Chat ? [
      { iconSrc: "/icons/chats/clear.svg", label: "Clear Chat", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/search.svg", label: "Search", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/search.svg", label: "Edit Contact", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/addPerson.svg", label: "Add To Group", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/leave.svg", label: "Share Contact", color: "text-[#475569]" },
      { iconSrc: "/icons/chats/report.svg", label: "Report", color: "text-[#ea580c]" },
      { iconSrc: "/icons/chats/block.svg", label: "Block Username", color: "text-[#dc2626]" },
      { iconSrc: "/icons/chats/delete.svg", label: "Delete Chat", color: "text-[#dc2626]" },
    ] : []),
  ];

  const handleMenuClick = async (label: string) => {
    setShowMenu(false);
    if (!activeEntity) return;

    if (label === "Leave Group" && isGroup) {
      setLeaveGroupModalOpen(true);
    } else if (label === "Add Members" && isGroup) {
      setAddGroupMembersModalOpen(true);
    } else if (label === "Unfollow Channel" && isChannel) {
      useChatStore.getState().setLeaveChannelModalOpen(true);
    } else if (label === "Delete" && isChannel) {
      useChatStore.getState().setDeleteChannelModalOpen(true);
    } else if (label === "Delete Group" && isGroup) {
      try {
        await groupApi.deleteGroup(activeEntity.id);
        setGroups(groups.filter((g: any) => g.id !== activeEntity.id));
        setSelectedGroup(null);
      } catch (error) {
        console.error("Failed to delete group", error);
      }
    } else if (label === "Archive Chat") {
      try {
        await chatApi.archiveChat(activeEntity.id);
        setChats(chats.filter((c: any) => c.id !== activeEntity.id));
        setSelectedChat(null);
      } catch (error) {
        console.error("Failed to archive chat", error);
      }
    } else if (label === "Unarchive Chat") {
      try {
        await chatApi.unarchiveChat(activeEntity.id);
        setChats(chats.filter((c: any) => c.id !== activeEntity.id));
        setSelectedChat(null);
      } catch (error) {
        console.error("Failed to unarchive chat", error);
      }
    }
  };

  return (
    <div className="chat-main">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          {(isGroup || isChannel) && !photo ? (
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0d5e3d] font-bold text-sm flex-shrink-0">
              {(name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          ) : (
            <img src={photo || "/ReferralImage.png"} alt={name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <div className="chat-header-name">{name}</div>
            <div className="chat-header-status">
              {isTyping ? (
                <span className="text-[#0d5e3d] text-xs animate-pulse">typing...</span>
              ) : (isGroup || isChannel) ? (
                <span className="text-xs text-gray-400">{subtitle}</span>
              ) : (
                isConnected ? 'Online' : 'Offline'
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <img 
            src="/icons/chats/audioCall.svg" 
            alt="Phone" 
            className="w-[18px] h-[18px] cursor-pointer hover:opacity-80 transition object-contain" 
            onClick={() => handleStartCall('AUDIO')} 
          />
          <img 
            src="/icons/chats/videoCall.svg" 
            alt="Video" 
            className="w-[20px] h-[15px] cursor-pointer hover:opacity-80 transition object-contain" 
            onClick={() => handleStartCall('VIDEO')} 
          />
          <div className="w-[1px] h-[18px] bg-[#0d5e3d] mx-1 opacity-60"></div>
          <img 
            src="/icons/chats/info.svg" 
            alt="Info" 
            className={`w-[18px] h-[18px] cursor-pointer hover:opacity-80 transition ${showInfo ? 'opacity-100' : 'opacity-80'} object-contain`} 
            onClick={() => setShowInfo(!showInfo)} 
          />
          
          {/* Three dots menu */}
          <div className="relative">
            <BsThreeDotsVertical 
              className="text-[#0d5e3d] cursor-pointer text-[18px] ml-1 hover:opacity-80 transition" 
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }} 
            />
            
            {showMenu && (
              <div className="absolute right-0 top-10 w-[220px] bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-50 z-50 py-2.5 overflow-hidden">
                {headerMenuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3.5 px-5 py-2.5 cursor-pointer text-[14px] font-medium transition hover:bg-gray-50 ${item.color}`}
                    onClick={() => handleMenuClick(item.label)}
                  >
                    <span className="w-[18px] h-[18px] flex items-center justify-center">
                      {item.iconSrc ? (
                        <img src={item.iconSrc} alt={item.label} className="w-full h-full object-contain" />
                      ) : (
                        item.icon
                      )}
                    </span>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="message-list">
        <div className="message-date-divider">
          <span className="message-date-text">Today</span>
        </div>

        {/* Empty state */}
        {(!Array.isArray(messages) || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 opacity-60">
            <div className="w-14 h-14 bg-green-50 text-[#0d5e3d] rounded-full flex items-center justify-center mb-3">
              <BsChatDots className="text-2xl" />
            </div>
            <p className="text-gray-500 font-medium text-sm">Start conversation</p>
            <p className="text-gray-400 text-xs mt-1">Send a message to begin the chat.</p>
          </div>
        )}

        {(Array.isArray(messages) ? messages : []).map((msg: any) => {
          const isSent = msg.isSent !== undefined 
            ? msg.isSent 
            : isChannel 
              ? msg.sender?.email === currentUserEmail 
              : msg.senderUser?.email === currentUserEmail;
              
          return <MessageBubble key={msg.id} message={msg} isSent={isSent} />;
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="message-input-area">
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileUpload} 
        />
        <input 
          type="file" 
          accept="image/*"
          ref={imageInputRef} 
          style={{ display: "none" }} 
          onChange={handleFileUpload} 
        />
        <div className="relative">
          <img 
            src="/icons/chats/sendMedia.svg" 
            alt="Add" 
            className="w-[20px] h-[20px] cursor-pointer hover:opacity-70 transition flex-shrink-0" 
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          />
          {showAttachmentMenu && (
            <div className="absolute bottom-10 left-0 w-[180px] bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-50 z-50 py-2.5">
              <div 
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*,video/*";
                    fileInputRef.current.click();
                  }
                  setShowAttachmentMenu(false);
                }}
              >
                <BsImage className="text-gray-400 text-lg" />
                Photo & Video
              </div>
              <div 
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = ".pdf,.doc,.docx,.xls,.xlsx,.txt";
                    fileInputRef.current.click();
                  }
                  setShowAttachmentMenu(false);
                }}
              >
                <BsFileEarmarkText className="text-gray-400 text-lg" />
                Document
              </div>
              <div 
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "audio/*";
                    fileInputRef.current.click();
                  }
                  setShowAttachmentMenu(false);
                }}
              >
                <BsMic className="text-gray-400 text-lg" />
                Audio
              </div>
              <div 
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 transition"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "*/*";
                    fileInputRef.current.click();
                  }
                  setShowAttachmentMenu(false);
                }}
              >
                <BsPaperclip className="text-gray-400 text-lg" />
                Other File
              </div>
            </div>
          )}
        </div>
        <img 
          src="/icons/chats/sendImage.svg" 
          alt="Image" 
          className="w-[18px] h-[18px] cursor-pointer hover:opacity-70 transition flex-shrink-0" 
          onClick={() => imageInputRef.current?.click()}
        />
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-[#f5f7f9] text-sm text-gray-700 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-1 focus:ring-[#0d5e3d] border-none"
            placeholder="Type a message..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <img src="/icons/chats/iconsIcon.svg" alt="Emoji" className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] cursor-pointer hover:opacity-70 transition" />
        </div>
        <button 
          className="w-10 h-10 bg-[#0d5e3d] rounded-full flex items-center justify-center text-white hover:bg-[#0a4f32] transition flex-shrink-0"
          onClick={handleSend}
        >
          <img src="/icons/chats/sendMessage.svg" alt="Send" className="w-[16px] h-[14px]" />
        </button>
      </div>
    </div>
  );
};


export default ChatArea;
