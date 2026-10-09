"use client";

import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { groupApi } from "../api/groupApi";
import { useSocket } from "../hooks/useSocket";
import Modal from "@/components/ui/Modal";

const LeaveGroupModal: React.FC = () => {
  const {
    isLeaveGroupModalOpen,
    setLeaveGroupModalOpen,
    selectedGroup,
    groups,
    setGroups,
    setSelectedGroup,
  } = useChatStore();
  const { leaveGroup: socketLeaveGroup, isConnected } = useSocket();
  const [loading, setLoading] = useState(false);

  if (!selectedGroup) return null;

  const handleLeave = async () => {
    setLoading(true);
    try {
      // REST call to leave group
      await groupApi.leaveGroup(selectedGroup.id);

      // Socket event to leave room
      if (isConnected) {
        socketLeaveGroup({ group_id: selectedGroup.id });
      }

      // Remove from local state
      setGroups(groups.filter((g) => g.id !== selectedGroup.id));
      setSelectedGroup(null);
      setLeaveGroupModalOpen(false);
    } catch (error) {
      console.error("Failed to leave group", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isLeaveGroupModalOpen}
      onClose={() => setLeaveGroupModalOpen(false)}
      showLine={false}
      showCloseButton={false}
      className="max-w-[440px]"
      padding="p-0"
    >
      <div className="flex flex-col items-center px-8 py-8">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Leave Group</h3>

        {/* Group Info */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 w-full mb-5">
          {selectedGroup.avatar ? (
            <img
              src={selectedGroup.avatar}
              alt={selectedGroup.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0d5e3d] font-bold text-sm">
              {selectedGroup.name
                ?.split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {selectedGroup.name}
            </p>
            <p className="text-[11px] text-gray-400">
              {selectedGroup.maxMembers || 0} members
            </p>
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-6">
          Are you sure you want to leave this group? You will no longer receive
          messages from this group unless someone adds you again.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
            onClick={() => setLeaveGroupModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm"
            onClick={handleLeave}
            disabled={loading}
          >
            {loading ? "Leaving..." : "Leave Group"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveGroupModal;
