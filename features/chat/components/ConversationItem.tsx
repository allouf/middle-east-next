"use client";

import React from "react";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";

interface ConversationItemProps {
  chat: any;
  isActive: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ chat, isActive, onClick }) => {
  const { initiatorUser, receiverUser, lastMessage, unreadCount, name: entityName, avatar, owner, _type } = chat;
  const currentUserEmail = getCookie(STORAGE_KEYS.EMAIL);
  
  // Determine display name based on entity type
  let name = "Unknown";
  let photo = "/ReferralImage.png";

  if (_type === "group" || _type === "channel") {
    // Groups and channels use name/avatar directly
    name = entityName || "Unknown";
    photo = avatar || "/ReferralImage.png";
  } else {
    // 1:1 chats - show the other user
    const isInitiator = initiatorUser?.email === currentUserEmail;
    const otherUser = isInitiator ? receiverUser : initiatorUser;
    name = otherUser?.name || "Unknown";
    photo = otherUser?.photo || "/ReferralImage.png";
  }

  // Resolve last message content
  const rawContent = lastMessage?.content || lastMessage?.message || "No messages";
  let displayContent = rawContent;

  const msgType = lastMessage?.type || lastMessage?.messageType;
  const isUrl = /^https?:\/\/[^\s]+$/.test(rawContent);
  
  if (isUrl) {
    const urlLower = rawContent.toLowerCase();
    if (urlLower.match(/\.(png|jpg|jpeg|gif|webp|avif)$/) || msgType === "IMAGE") displayContent = "📷 Photo";
    else if (urlLower.match(/\.(mp4|webm|ogg|mov)$/) || msgType === "VIDEO") displayContent = "🎥 Video";
    else if (urlLower.match(/\.(mp3|wav|m4a|aac)$/) || msgType === "AUDIO" || msgType === "VOICE") displayContent = "🎵 Audio";
    else displayContent = "📄 Document";
  } else if (msgType === "IMAGE") displayContent = "📷 Photo";
  else if (msgType === "VIDEO") displayContent = "🎥 Video";
  else if (msgType === "AUDIO" || msgType === "VOICE") displayContent = "🎵 Audio";
  else if (msgType === "FILE") displayContent = "📄 Document";
  
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`conversation-item ${isActive ? "active" : ""}`} onClick={onClick}>
      <div className="relative">
        {(_type === "group" || _type === "channel") && !avatar ? (
          <div className="conversation-avatar flex items-center justify-center bg-[#e8f5e9] text-[#0d5e3d] font-bold text-sm">
            {(entityName || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        ) : (
          <img
            src={photo}
            alt={name}
            className="conversation-avatar"
          />
        )}
        {_type === "chat" && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        )}
        {_type === "group" && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
        )}
      </div>
      
      <div className="conversation-info">
        <div className="conversation-top">
          <span className="conversation-name">{name}</span>
          <span className="conversation-time">{formatTime(lastMessage?.createdAt)}</span>
        </div>
        
        <div className="conversation-bottom">
          <p className="conversation-last-msg m-0 truncate">{displayContent}</p>
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
