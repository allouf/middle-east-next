"use client";

import React from "react";
import { BsSearch, BsThreeDotsVertical, BsArrowLeft } from "react-icons/bs";
import { useChatStore } from "../../store/useChatStore";
import ConversationList from "../ConversationList";

const ArchivedSidebar: React.FC = () => {
  const { searchQuery, setSearchQuery, setActiveTab } = useChatStore();

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <BsArrowLeft 
              className="cursor-pointer text-xl text-[#0d5e3d]" 
              onClick={() => setActiveTab("chats")} 
            />
            <h2 className="chat-sidebar-title m-0 text-[#0d5e3d]">Archived Chats</h2>
          </div>
          <BsThreeDotsVertical className="cursor-pointer text-xl text-gray-500 hover:text-black" />
        </div>
        
        <div className="chat-search-container">
          <BsSearch className="chat-search-icon" />
          <input
            type="text"
            className="chat-search-input"
            placeholder="Search archived messages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ConversationList />
    </div>
  );
};

export default ArchivedSidebar;
