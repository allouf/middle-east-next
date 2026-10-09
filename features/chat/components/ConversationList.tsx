"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ConversationItem from "./ConversationItem";
import { chatApi } from "../api/chatApi";
import { channelApi } from "../api/channelApi";
import { groupApi } from "../api/groupApi";

const ConversationList: React.FC = () => {
  const { chats, channels, groups, setChats, setChannels, setGroups, selectedChat, setSelectedChat, selectedChannel, setSelectedChannel, selectedGroup, setSelectedGroup, chatFilter, searchQuery, activeTab } = useChatStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const isArchived = activeTab === "archived";
        
        const [chatsRes, channelsRes, groupsRes] = await Promise.all([
          chatApi.getMyChats(1, 100, isArchived).catch((e) => {
            console.error("Failed to fetch chats", e);
            return { data: [] };
          }),
          channelApi.getMyChannels().catch((e) => {
            console.error("Failed to fetch channels", e);
            return { data: [] };
          }),
          groupApi.getMyGroups().catch((e) => {
            console.error("Failed to fetch groups", e);
            return { data: [] };
          }),
        ]);
        
        // Handle nested data structures commonly returned by paginated endpoints
        if (chatsRes?.data?.data?.data && Array.isArray(chatsRes.data.data.data)) {
          setChats(chatsRes.data.data.data);
        } else if (chatsRes?.data?.data && Array.isArray(chatsRes.data.data)) {
          setChats(chatsRes.data.data);
        } else if (chatsRes?.data && Array.isArray(chatsRes.data)) {
          setChats(chatsRes.data);
        }

        if (channelsRes?.data?.data?.data && Array.isArray(channelsRes.data.data.data)) {
          setChannels(channelsRes.data.data.data);
        } else if (channelsRes?.data?.data && Array.isArray(channelsRes.data.data)) {
          setChannels(channelsRes.data.data);
        } else if (channelsRes?.data && Array.isArray(channelsRes.data)) {
          setChannels(channelsRes.data);
        }

        if (groupsRes?.data?.data?.data && Array.isArray(groupsRes.data.data.data)) {
          setGroups(groupsRes.data.data.data);
        } else if (groupsRes?.data?.data && Array.isArray(groupsRes.data.data)) {
          setGroups(groupsRes.data.data);
        } else if (groupsRes?.data && Array.isArray(groupsRes.data)) {
          setGroups(groupsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setChats, setChannels, setGroups, activeTab]);

  const allItems = [
    ...(Array.isArray(chats) ? chats : []).map((c: any) => ({ ...c, _type: "chat" })),
    ...(Array.isArray(channels) ? channels : []).map((c: any) => ({ ...c, _type: "channel" })),
    ...(Array.isArray(groups) ? groups : []).map((c: any) => ({ ...c, _type: "group" })),
  ];
  
  const filteredItems = allItems.filter(item => {
    // Search query filter
    const name = item.name || item.initiatorUser?.name || "";
    if (searchQuery && !name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Tab filter
    if (chatFilter === "messages") return item._type === "chat";
    if (chatFilter === "groups") return item._type === "group";
    if (chatFilter === "channels") return item._type === "channel";
    return true; // "all"
  }).sort((a, b) => {
    // Sort unread messages first, then by lastMessage.createdAt
    const aUnread = (a.unreadCount || 0) > 0 ? 1 : 0;
    const bUnread = (b.unreadCount || 0) > 0 ? 1 : 0;
    if (aUnread !== bUnread) return bUnread - aUnread;
    
    const timeA = new Date(a.lastMessage?.createdAt || a.createdAt || 0).getTime();
    const timeB = new Date(b.lastMessage?.createdAt || b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading conversations...</div>;
  }

  if (filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 10L12 14L16 10" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">No active threads</p>
        <p className="text-xs text-gray-400">Search to find a friend</p>
      </div>
    );
  }

  return (
    <div className="conversation-list">
      {filteredItems.map((item: any) => {
        const isActive = (item._type === "chat" && selectedChat?.id === item.id) || 
                         (item._type === "channel" && selectedChannel?.id === item.id) ||
                         (item._type === "group" && selectedGroup?.id === item.id);
                         
        return (
          <ConversationItem
            key={`${item._type}-${item.id}`}
            chat={item}
            isActive={isActive}
            onClick={() => {
              if (item._type === "chat") {
                setSelectedChat(item);
              } else if (item._type === "group") {
                setSelectedGroup(item);
              } else {
                setSelectedChannel(item);
              }
            }}
          />
        );
      })}
    </div>
  );
};

export default ConversationList;
