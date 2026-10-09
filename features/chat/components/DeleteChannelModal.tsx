"use client";

import React, { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { channelApi } from "../api/channelApi";
import Modal from "@/components/ui/Modal";

const DeleteChannelModal: React.FC = () => {
  const {
    isDeleteChannelModalOpen,
    setDeleteChannelModalOpen,
    selectedChannel,
    channels,
    setChannels,
    setSelectedChannel,
  } = useChatStore();
  const [loading, setLoading] = useState(false);

  if (!selectedChannel) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await channelApi.deleteChannel(selectedChannel.id);
      
      // Remove from local state
      setChannels(channels.filter((c) => c.id !== selectedChannel.id));
      setSelectedChannel(null);
      setDeleteChannelModalOpen(false);
    } catch (error) {
      console.error("Failed to delete channel", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isDeleteChannelModalOpen}
      onClose={() => setDeleteChannelModalOpen(false)}
      showLine={false}
      showCloseButton={false}
      className="max-w-[440px]"
      padding="p-0"
    >
      <div className="flex flex-col items-center px-8 py-8">
        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
          {/* Using a trash icon similar to the screenshot */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Channel</h3>

        {/* Channel Info */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 w-full mb-5">
          {selectedChannel.avatar ? (
            <img
              src={selectedChannel.avatar}
              alt={selectedChannel.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#0d5e3d] font-bold text-sm">
              {selectedChannel.name
                ?.split(" ")
                .map((w: string) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {selectedChannel.name}
            </p>
            <p className="text-[11px] text-gray-400">
              {/* @ts-ignore */}
              {selectedChannel.members?.length || 0} members
            </p>
          </div>
        </div>

        {/* Warning Text */}
        <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
          Are you sure you want to delete this channel? This action will permanently remove the channel and all its messages for all members. This cannot be undone.
        </p>

        {/* Archive Suggestion */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-6 cursor-pointer hover:text-gray-600 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Learn more about archiving channels instead
        </div>

        {/* Buttons */}
        <div className="flex gap-3 w-full">
          <button
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition font-medium text-sm"
            onClick={() => setDeleteChannelModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium text-sm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Channel"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteChannelModal;
