"use client";

import React from "react";
import ChatIconSidebar from "./ChatIconSidebar";
import ChatSidebar from "./ChatSidebar";
import ChatArea from "./ChatArea";
import ChatInfoPanel from "./ChatInfoPanel";
import CallSidebar from "./calls/CallSidebar";
import CallArea from "./calls/CallArea";
import ArchivedSidebar from "./archived/ArchivedSidebar";
import ArchivedArea from "./archived/ArchivedArea";
import ProfileArea from "./profile/ProfileArea";
import CreateGroupModal from "./CreateGroupModal";
import CreateChannelModal from "./CreateChannelModal";
import CreateChatModal from "./CreateChatModal";
import LeaveGroupModal from "./LeaveGroupModal";
import AddGroupMembersModal from "./AddGroupMembersModal";
import LeaveChannelModal from "./LeaveChannelModal";
import DeleteChannelModal from "./DeleteChannelModal";
import { useChatStore } from "../store/useChatStore";
import "../styles/chat.css";
import dynamic from "next/dynamic";

const CallHandler = dynamic(() => import("./CallHandler"), { ssr: false });

const ChatLayout: React.FC = () => {
  const { showInfo, activeTab } = useChatStore();
  
  return (
    <div className="chat-container flex w-full overflow-hidden bg-white" style={{ height: 'calc(100vh - 140px)' }}>
      <ChatIconSidebar />
      {activeTab === "calls" ? (
        <>
          <CallSidebar />
          <CallArea />
        </>
      ) : activeTab === "archived" ? (
        <>
          <ArchivedSidebar />
          <ArchivedArea />
          {showInfo && <ChatInfoPanel />}
        </>
      ) : activeTab === "profile" ? (
        <ProfileArea />
      ) : (
        <>
          <ChatSidebar />
          <ChatArea />
          {showInfo && <ChatInfoPanel />}
        </>
      )}

      <CreateGroupModal />
      <CreateChannelModal />
      <CreateChatModal />
      <LeaveGroupModal />
      <AddGroupMembersModal />
      <LeaveChannelModal />
      <DeleteChannelModal />

      {/* Global Call Handler */}
      <CallHandler />
    </div>
  );
};

export default ChatLayout;
