"use client";

import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { MessageSquarePlus, Users, MessageSquare } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import ConversationList from "./ConversationList";

const ChatSidebar: React.FC = () => {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const { 
    chatFilter, 
    setChatFilter, 
    searchQuery, 
    setSearchQuery, 
    setCreateGroupModalOpen, 
    setCreateChannelModalOpen,
    setCreateChatModalOpen
  } = useChatStore();

  const filters = [
    { id: "messages", label: "Messages" },
    { id: "groups", label: "Groups" },
    { id: "channels", label: "Channels" },
  ];

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <div className="flex justify-between items-center mb-4 relative">
          <h2 className="chat-sidebar-title m-0">Messages</h2>
          <div className="relative">
            <MessageSquarePlus 
              className="cursor-pointer text-[#0d5e3d] w-6 h-6 hover:opacity-80 transition" 
              onClick={() => setShowCreateMenu(!showCreateMenu)}
            />
            
            {showCreateMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCreateMenu(false)}></div>
                <div className="absolute right-0 top-8 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 overflow-hidden">
                  <div 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition"
                    onClick={() => {
                      setCreateChatModalOpen(true);
                      setShowCreateMenu(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <MessageSquarePlus size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Start New Chat</p>
                      <p className="text-[10px] text-gray-400">Message a contact</p>
                    </div>
                  </div>
                  <div 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition border-t border-gray-50"
                    onClick={() => {
                      setCreateGroupModalOpen(true);
                      setShowCreateMenu(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Create New Group</p>
                      <p className="text-[10px] text-gray-400">Chat with multiple people</p>
                    </div>
                  </div>
                  <div 
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition border-t border-gray-50"
                    onClick={() => {
                      setCreateChannelModalOpen(true);
                      setShowCreateMenu(false);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Create New Channel</p>
                      <p className="text-[10px] text-gray-400">Broadcast to many people</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="chat-search-container">
          <BsSearch className="chat-search-icon" />
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="chat-filter-tabs" style={{ gap: '8px' }}>
          {filters.map((filter) => (
            <div
              key={filter.id}
              className={`chat-filter-tab ${chatFilter === filter.id ? "active" : ""}`}
              onClick={() => setChatFilter(chatFilter === filter.id ? "all" : filter.id as any)}
            >
              {filter.label}
            </div>
          ))}
        </div>
      </div>

      <ConversationList />
    </div>
  );
};

export default ChatSidebar;
