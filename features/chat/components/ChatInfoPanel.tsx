"use client";

import React, { useEffect, useState } from "react";
import {
  BsTelephone,
  BsInfoCircle,
  BsChevronRight,
  BsX,
  BsEnvelope,
  BsGeoAlt,
} from "react-icons/bs";
import { useChatStore } from "../store/useChatStore";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";
import chatClient from "../api/chatClient";
import { groupApi } from "../api/groupApi";

const ChatInfoPanel: React.FC = () => {
  const {
    selectedChat,
    selectedChannel,
    selectedGroup,
    setShowInfo,
    setAddGroupMembersModalOpen,
    setLeaveGroupModalOpen,
    groupMembers,
    setGroupMembers,
  } = useChatStore();
  const activeEntity = selectedChat || selectedChannel || selectedGroup;
  const [userInfo, setUserInfo] = useState<any>(null);
  const [commonGroups, setCommonGroups] = useState<any[]>([]);
  const [mediaTab, setMediaTab] = useState<
    "photos" | "videos" | "files" | "links"
  >("photos");
  const [loading, setLoading] = useState(false);

  const isChannel = !!selectedChannel;
  const isGroup = !!selectedGroup;
  const currentUserEmail = getCookie(STORAGE_KEYS.EMAIL);

  // Determine the other user (for 1:1 chats)
  const isInitiator =
    !isChannel &&
    !isGroup &&
    (activeEntity as any)?.initiatorUser?.email === currentUserEmail;
  const otherUser = isInitiator
    ? (activeEntity as any)?.receiverUser
    : (activeEntity as any)?.initiatorUser;

  // Fetch user profile and groups when panel opens
  useEffect(() => {
    if (!activeEntity) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isGroup) {
          // Fetch group members
          try {
            const membersRes = await groupApi.getGroupMembers(activeEntity.id);
            const members = membersRes.data?.data || membersRes.data;
            if (Array.isArray(members)) {
              setGroupMembers(members);
            } else {
              setGroupMembers([]);
            }
          } catch (err) {
            console.error("Failed to fetch group members:", err);
            setGroupMembers([]);
          }
        } else if (!isChannel && otherUser?.id) {
          // 1:1 chat — fetch user profile
          try {
            const res = await chatClient.get(`/profile/${otherUser.id}`);
            const data = res.data?.data || res.data;
            setUserInfo(data);
          } catch (err) {
            console.error("Failed to fetch user info:", err);
            setUserInfo(null);
          }

          // Fetch groups to find common ones
          try {
            const groupsRes = await groupApi.getMyGroups();
            let myGroups: any[] = [];
            if (
              groupsRes.data?.data?.data &&
              Array.isArray(groupsRes.data.data.data)
            ) {
              myGroups = groupsRes.data.data.data;
            } else if (
              groupsRes.data?.data &&
              Array.isArray(groupsRes.data.data)
            ) {
              myGroups = groupsRes.data.data;
            } else if (Array.isArray(groupsRes.data)) {
              myGroups = groupsRes.data;
            }

            if (otherUser?.id && myGroups.length > 0) {
              const groupsInCommon: any[] = [];
              for (const group of myGroups.slice(0, 10)) {
                try {
                  const mRes = await groupApi.getGroupMembers(group.id);
                  const mData = mRes.data?.data || mRes.data;
                  if (Array.isArray(mData)) {
                    const found = mData.some(
                      (m: any) =>
                        m.userId === otherUser.id ||
                        m.user?.id === otherUser.id
                    );
                    if (found) {
                      groupsInCommon.push({
                        ...group,
                        memberCount: mData.length,
                      });
                    }
                  }
                } catch {
                  // skip
                }
              }
              setCommonGroups(groupsInCommon);
            } else {
              setCommonGroups([]);
            }
          } catch (err) {
            console.error("Failed to fetch groups:", err);
            setCommonGroups([]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeEntity?.id, isChannel, isGroup, otherUser?.id]);

  if (!activeEntity) return null;

  // ──── GROUP INFO PANEL ────
  if (isGroup) {
    const group = selectedGroup!;
    const onlineCount = groupMembers.filter((m: any) => m.isOnline).length;

    return (
      <div className="w-[320px] bg-white border-l border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
        {/* Close button */}
        <div className="flex justify-end p-3">
          <button
            onClick={() => setShowInfo(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400"
          >
            <BsX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Group Header */}
          <div className="px-6 pb-6 flex flex-col items-center">
            <div className="relative mb-3">
              {group.avatar ? (
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0d5e3d] font-bold text-2xl border-2 border-gray-100">
                  {group.name
                    ?.split(" ")
                    .map((w: string) => w[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{group.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {groupMembers.length} members • {onlineCount} online
            </p>
          </div>

          {/* About */}
          {group.description && (
            <div className="px-6 py-4 border-t border-gray-50">
              <h4 className="text-[11px] font-semibold text-gray-400 mb-2 tracking-wider uppercase">
                About
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {group.description}
              </p>
            </div>
          )}

          {/* Members */}
          <div className="px-6 py-4 border-t border-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                Members
              </h4>
              <span
                className="text-[#0d5e3d] text-xs font-medium cursor-pointer hover:underline"
                onClick={() => setAddGroupMembersModalOpen(true)}
              >
                View All
              </span>
            </div>

            {loading && (
              <p className="text-gray-400 text-xs">Loading members...</p>
            )}

            {!loading &&
              groupMembers.slice(0, 5).map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 mb-3 last:mb-0"
                >
                  <div className="relative">
                    <img
                      src={member.user?.photo || "/ReferralImage.png"}
                      alt={member.user?.name || ""}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    {member.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {member.user?.name || "Unknown"}
                    </p>
                  </div>
                  {(member.role === "OWNER" || member.role === "ADMIN") && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#e8f5e9] text-[#0d5e3d] px-2 py-0.5 rounded-full">
                      {member.role === "OWNER" ? "Admin" : member.role}
                    </span>
                  )}
                </div>
              ))}
          </div>

          {/* Shared Media */}
          <div className="px-6 py-4 border-t border-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
                Shared Media
              </h4>
              <span className="text-[#0d5e3d] text-xs font-medium cursor-pointer hover:underline">
                248 items
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 aspect-square rounded-lg overflow-hidden"
                >
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                    {i === 6 ? (
                      <span className="text-[11px] font-medium">+243</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Group Button */}
          <div className="px-6 py-4 border-t border-gray-50">
            <button
              className="w-full py-2.5 text-red-500 text-sm font-medium hover:bg-red-50 rounded-xl transition"
              onClick={() => setLeaveGroupModalOpen(true)}
            >
              Leave Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ──── 1:1 / CHANNEL INFO PANEL (original) ────
  const name = isChannel
    ? (activeEntity as any).name
    : userInfo?.name || otherUser?.name || "Unknown";
  const photo = isChannel
    ? (activeEntity as any).avatar
    : userInfo?.photo || otherUser?.photo || "/ReferralImage.png";
  const phone = userInfo?.phone || otherUser?.phone || null;
  const email = userInfo?.email || otherUser?.email || null;
  const bio = userInfo?.bio || null;
  const region = userInfo?.region || otherUser?.region || null;
  const countryCode = userInfo?.countryCode || otherUser?.countryCode || null;

  const mediaTabs = [
    { id: "photos", label: "Photos" },
    { id: "videos", label: "Videos" },
    { id: "files", label: "Files" },
    { id: "links", label: "Links" },
  ] as const;

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const groupColors = [
    { bg: "#e8f5e9", text: "#0d5e3d" },
    { bg: "#fff3e0", text: "#e65100" },
    { bg: "#e3f2fd", text: "#1565c0" },
    { bg: "#fce4ec", text: "#c62828" },
    { bg: "#f3e5f5", text: "#6a1b9a" },
  ];

  return (
    <div className="w-[320px] bg-white border-l border-gray-100 flex flex-col overflow-hidden flex-shrink-0">
      {/* Close button */}
      <div className="flex justify-end p-3">
        <button
          onClick={() => setShowInfo(false)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400"
        >
          <BsX className="text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile header */}
        <div className="px-6 pb-6 flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src={photo}
              alt={name}
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-[#0d5e3d] text-xs font-medium mt-0.5">Online</p>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Last seen 5 minutes ago
          </p>
        </div>

        {/* Contact Information */}
        <div className="px-6 py-4 border-t border-gray-50">
          <h4 className="text-[11px] font-semibold text-gray-400 mb-4 tracking-wider uppercase">
            Contact Information
          </h4>

          {phone && (
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                <BsTelephone className="text-[#0d5e3d] text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{phone}</p>
                <p className="text-[11px] text-gray-400">Mobile</p>
              </div>
            </div>
          )}

          {email && (
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <BsEnvelope className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{email}</p>
                <p className="text-[11px] text-gray-400">Email</p>
              </div>
            </div>
          )}

          {region && (
            <div className="flex gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                <BsGeoAlt className="text-orange-600 text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {region}
                  {countryCode ? `, ${countryCode}` : ""}
                </p>
                <p className="text-[11px] text-gray-400">Location</p>
              </div>
            </div>
          )}

          {bio && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                <BsInfoCircle className="text-gray-500 text-sm" />
              </div>
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">{bio}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Bio</p>
              </div>
            </div>
          )}

          {!phone && !email && !bio && !region && (
            <p className="text-gray-400 text-sm">
              No contact information available.
            </p>
          )}
        </div>

        {/* Shared Media */}
        <div className="px-6 py-4 border-t border-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase">
              Shared Media
            </h4>
            <span className="text-[#0d5e3d] text-xs font-medium cursor-pointer hover:underline">
              View all
            </span>
          </div>

          <div className="flex gap-4 mb-4 text-sm">
            {mediaTabs.map((tab) => (
              <span
                key={tab.id}
                className={`cursor-pointer pb-1 transition ${
                  mediaTab === tab.id
                    ? "text-[#0d5e3d] font-medium border-b-2 border-[#0d5e3d]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={() => setMediaTab(tab.id)}
              >
                {tab.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-100 aspect-square rounded-lg overflow-hidden"
              >
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                  {i === 4 ? (
                    <span className="text-[11px] font-medium">+12</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groups in Common */}
        <div className="px-6 py-4 border-t border-gray-50">
          <h4 className="text-[11px] font-semibold text-gray-400 mb-3 tracking-wider uppercase">
            Groups in Common
          </h4>

          {loading && <p className="text-gray-400 text-xs">Loading...</p>}

          {!loading && commonGroups.length === 0 && (
            <p className="text-gray-400 text-xs">No groups in common</p>
          )}

          {commonGroups.map((group, idx) => {
            const colors = groupColors[idx % groupColors.length];
            return (
              <div
                key={group.id}
                className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2 transition"
              >
                {group.avatar ? (
                  <img
                    src={group.avatar}
                    alt={group.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                    }}
                  >
                    {getInitials(group.name)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {group.name}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {group.memberCount || group.maxMembers || 0} members
                  </p>
                </div>
                <BsChevronRight className="text-gray-300 text-xs flex-shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatInfoPanel;
