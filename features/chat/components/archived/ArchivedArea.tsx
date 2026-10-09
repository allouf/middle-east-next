"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BsTelephone, BsCameraVideo, BsInfoCircle, BsThreeDotsVertical, 
  BsArchive, BsEmojiSmile, BsPlusCircle, BsImage, BsSendFill, 
  BsVolumeMute, BsPinAngle, BsEnvelopeOpen, BsSlashCircle, BsTrash,
  BsChatDots
} from "react-icons/bs";
import { useChatStore } from "../../store/useChatStore";
import MessageBubble from "../MessageBubble";
import { chatApi } from "../../api/chatApi";
import { channelApi } from "../../api/channelApi";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";

const ArchivedArea: React.FC = () => {
  const { selectedChat, selectedChannel, messages, setMessages, addMessage, setActiveTab, showInfo, setShowInfo } = useChatStore();
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeEntity = selectedChat || selectedChannel;
  const isChannel = !!selectedChannel;
  const currentUserEmail = getCookie(STORAGE_KEYS.EMAIL);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeEntity) return;
      setLoading(true);
      try {
        if (isChannel) {
          const res = await channelApi.getChannelMessages(activeEntity.id);
          if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
            setMessages(res.data.data.data.reverse());
          } else if (res.data?.data && Array.isArray(res.data.data)) {
            setMessages(res.data.data.reverse());
          } else if (res.data && Array.isArray(res.data)) {
            setMessages(res.data.reverse());
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
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeEntity, isChannel, setMessages]);
  
  if (!activeEntity) {
    return (
      <div className="chat-main flex flex-col justify-center items-center bg-white h-full relative">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8 relative inline-block">
            <div className="w-28 h-28 bg-[#e6f0eb] rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <BsArchive className="text-5xl text-[#0d5e3d]" />
            </div>
            <div className="absolute -top-2 -right-4 w-10 h-10 bg-white shadow-md border border-gray-100 rounded-xl flex items-center justify-center">
              <BsChatDots className="text-gray-400 text-lg" />
            </div>
            <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-white shadow-md border border-gray-100 rounded-xl flex items-center justify-center">
              <BsImage className="text-gray-400 text-lg" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No archived conversations</h3>
          <p className="text-gray-500 mb-8 text-sm">Archived chats will appear here to keep your<br/>main chat list organized.</p>
          <button 
            className="bg-[#0d5e3d] text-white px-8 py-3 rounded-xl font-medium hover:bg-opacity-90 transition shadow-sm"
            onClick={() => setActiveTab("chats")}
          >
            Go to Chats
          </button>
        </div>
      </div>
    );
  }

  const isInitiator = !isChannel && (activeEntity as any).initiatorUser?.email === currentUserEmail;
  const otherUser = isInitiator ? (activeEntity as any).receiverUser : (activeEntity as any).initiatorUser;
  
  const name = isChannel ? (activeEntity as any).name : (otherUser?.name || "Unknown");
  const photo = isChannel ? (activeEntity as any).avatar : (otherUser?.photo || "/ReferralImage.png");
  const subtitle = isChannel ? 'Channel' : '';

  const headerMenuItems = [
    { 
      icon: <BsArchive className="w-[16px] h-[16px]" />, 
      label: "Unarchive Chat", 
      color: "text-[#475569]" 
    },
    { iconSrc: "/icons/chats/mute.svg", label: "Mute Notifications", color: "text-[#475569]" },
    { iconSrc: "/icons/chats/search.svg", label: "Search", color: "text-[#475569]" },
    { iconSrc: "/icons/chats/clear.svg", label: "Clear Chat", color: "text-[#475569]" },
    { iconSrc: "/icons/chats/delete.svg", label: "Delete Chat", color: "text-[#dc2626]" },
  ];

  const handleMenuClick = async (label: string) => {
    setShowMenu(false);
    if (!activeEntity) return;

    if (label === "Unarchive Chat") {
      try {
        await chatApi.unarchiveChat(activeEntity.id);
        setChats(chats.filter((c: any) => c.id !== activeEntity.id));
        setActiveTab("chats");
      } catch (error) {
        console.error("Failed to unarchive chat", error);
      }
    }
  };

  const handleStartCall = () => {
    alert("Calls from archived chats are not supported in this demo yet.");
  };

  return (
    <div className="chat-main relative">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          {isChannel && !photo ? (
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0d5e3d] font-bold text-sm flex-shrink-0">
              {(name || "?").split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
          ) : (
            <img src={photo || "/ReferralImage.png"} alt={name} className="w-10 h-10 rounded-full object-cover" />
          )}
          <div>
            <div className="chat-header-name">{name}</div>
            <div className="chat-header-status">
              {isChannel ? (
                <span className="text-xs text-gray-400">{subtitle}</span>
              ) : (
                'Offline'
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <img 
            src="/icons/chats/audioCall.svg" 
            alt="Phone" 
            className="w-[18px] h-[18px] cursor-pointer hover:opacity-80 transition object-contain" 
            onClick={handleStartCall} 
          />
          <img 
            src="/icons/chats/videoCall.svg" 
            alt="Video" 
            className="w-[20px] h-[15px] cursor-pointer hover:opacity-80 transition object-contain" 
            onClick={handleStartCall} 
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

      <div className="message-list relative flex-1">
        <div className="message-date-divider">
          <span className="message-date-text">Today</span>
        </div>

        {(!Array.isArray(messages) || messages.length === 0) && (
          <div className="flex flex-col items-center justify-center flex-1 py-10 opacity-60">
            <div className="w-14 h-14 bg-green-50 text-[#0d5e3d] rounded-full flex items-center justify-center mb-3">
              <BsChatDots className="text-2xl" />
            </div>
            <p className="text-gray-500 font-medium text-sm">No messages</p>
            <p className="text-gray-400 text-xs mt-1">This archived conversation is empty.</p>
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

      {/* Banner positioned fixed at the bottom above the input area */}
      <div className="absolute bottom-[90px] left-1/2 -translate-x-1/2 z-10 w-max pointer-events-auto">
        <div className="bg-[#e6f0eb] text-gray-600 text-sm py-2 px-4 rounded-xl flex items-center gap-3 shadow-sm border border-[#d1e3da]">
          <BsArchive className="text-gray-500" />
          <span className="font-medium">This conversation is archived. New messages will move it to Inbox.</span>
          <button 
            className="bg-white text-[#0d5e3d] px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm ml-2 hover:bg-gray-50 transition"
            onClick={() => handleMenuClick("Unarchive Chat")}
          >
            Unarchive
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="message-input-area opacity-60">
        <img src="/icons/chats/sendMedia.svg" alt="Add" className="w-[20px] h-[20px] flex-shrink-0 cursor-not-allowed" />
        <img src="/icons/chats/sendImage.svg" alt="Image" className="w-[18px] h-[18px] flex-shrink-0 cursor-not-allowed" />
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full bg-[#f5f7f9] text-sm text-gray-700 rounded-full py-3 px-5 pr-12 focus:outline-none border-none cursor-not-allowed"
            placeholder="Type a message..."
            value={inputValue}
            disabled
          />
          <img src="/icons/chats/iconsIcon.svg" alt="Emoji" className="absolute right-4 top-1/2 -translate-y-1/2 w-[20px] h-[20px] cursor-not-allowed" />
        </div>
        <button 
          className="w-10 h-10 bg-[#0d5e3d] rounded-full flex items-center justify-center text-white flex-shrink-0 cursor-not-allowed"
          disabled
        >
          <img src="/icons/chats/sendMessage.svg" alt="Send" className="w-[16px] h-[14px]" />
        </button>
      </div>
    </div>
  );
};

export default ArchivedArea;
