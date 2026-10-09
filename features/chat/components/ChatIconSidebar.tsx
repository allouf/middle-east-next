"use client";

import React from "react";
import { 
  BsChatFill, 
  BsJournalText, 
  BsTelephone, 
  BsFolderPlus,
  BsPerson
} from "react-icons/bs";
import { useChatStore } from "../store/useChatStore";

const ChatIconSidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useChatStore();

  const menuItems = [
    { id: "chats", icon: <BsChatFill />, label: "Chats" },
    { id: "contacts", icon: <BsJournalText />, label: "Contacts" },
    { id: "calls", icon: <BsTelephone />, label: "Calls" },
    { id: "archived", icon: <BsFolderPlus />, label: "Archived" },
    { id: "profile", icon: <BsPerson />, label: "Profile" },
  ];

  return (
    <div className="chat-icon-sidebar">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`chat-icon-item ${activeTab === item.id ? "active" : ""}`}
          onClick={() => setActiveTab(item.id as any)}
          title={item.label}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatIconSidebar;
