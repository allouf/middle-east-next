"use client";

import React, { useState, useEffect } from "react";
import { X, ArrowRight, Radio, Globe, Lock, MessageSquarePlus } from "lucide-react";
import { motion } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { channelApi } from "../api/channelApi";

const CreateChannelModal: React.FC = () => {
  const { isCreateChannelModalOpen, setCreateChannelModalOpen, setChannels } = useChatStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    privacy: "PUBLIC" as "PUBLIC" | "PRIVATE",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isCreateChannelModalOpen) {
      setFormData({ name: "", description: "", image: null, privacy: "PUBLIC" });
    }
  }, [isCreateChannelModalOpen]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        privacy: formData.privacy,
      };

      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }

      await channelApi.createChannel(payload);
      
      // Refetch channels
      const channelsRes = await channelApi.getMyChannels();
      if (channelsRes?.data?.data?.data && Array.isArray(channelsRes.data.data.data)) {
        setChannels(channelsRes.data.data.data);
      } else if (channelsRes?.data?.data && Array.isArray(channelsRes.data.data)) {
        setChannels(channelsRes.data.data);
      } else if (channelsRes?.data && Array.isArray(channelsRes.data)) {
        setChannels(channelsRes.data);
      }
      
      setCreateChannelModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create channel", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isCreateChannelModalOpen}
      onClose={() => setCreateChannelModalOpen(false)}
      showLine={false}
      showCloseButton={false}
      className="max-w-md"
      padding="p-0"
    >
      <div className="flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-[#e8f5f1] p-1.5 rounded-lg text-[#0d5e3d]">
              <MessageSquarePlus size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create New Channel</h3>
          </div>
          <button onClick={() => setCreateChannelModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center justify-center py-4">
             <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#0d5e3d] transition">
                  {formData.image ? (
                    <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="Channel" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                       <img src="/ReferralImage.png" className="w-full h-full object-cover opacity-50" />
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => e.target.files?.[0] && setFormData({...formData, image: e.target.files[0]})}
                />
             </div>
             <p className="mt-2 text-sm font-medium text-[#0d5e3d] cursor-pointer">Upload Photo</p>
             <p className="text-[10px] text-gray-400">JPG, PNG or GIF. Max 5MB.</p>
          </div>

          <div className="space-y-4">
            <InputField
              id="channel-name"
              label="Channel Name"
              placeholder="e.g. Design Team 2024"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <InputField
              id="channel-description"
              label="Description (Optional)"
              placeholder="What is this channel about?"
              type="textarea"
              rows={3}
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-700">PRIVACY SETTINGS</label>
             
             <div className="space-y-2">
                <div 
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border transition ${formData.privacy === "PUBLIC" ? "bg-[#e8f5f1]/50 border-[#0d5e3d]/30" : "bg-white border-gray-100 hover:bg-gray-50"}`}
                  onClick={() => setFormData({...formData, privacy: "PUBLIC"})}
                >
                   <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition ${formData.privacy === "PUBLIC" ? "bg-[#0d5e3d] border-[#0d5e3d]" : "border-gray-300"}`}>
                      {formData.privacy === "PUBLIC" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                         <Globe size={16} className="text-[#0d5e3d]" />
                         <span className="text-sm font-semibold text-gray-900">Public</span>
                      </div>
                      <p className="text-xs text-gray-500">Anyone in your workspace can view and join this channel.</p>
                   </div>
                </div>

                <div 
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border transition ${formData.privacy === "PRIVATE" ? "bg-[#e8f5f1]/50 border-[#0d5e3d]/30" : "bg-white border-gray-100 hover:bg-gray-50"}`}
                  onClick={() => setFormData({...formData, privacy: "PRIVATE"})}
                >
                   <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition ${formData.privacy === "PRIVATE" ? "bg-[#0d5e3d] border-[#0d5e3d]" : "border-gray-300"}`}>
                      {formData.privacy === "PRIVATE" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                         <Lock size={16} className="text-[#0d5e3d]" />
                         <span className="text-sm font-semibold text-gray-900">Private</span>
                      </div>
                      <p className="text-xs text-gray-500">Only invited members can view or join this channel.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button 
            unstyled 
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-white transition"
            onClick={() => setCreateChannelModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 py-3 bg-[#0d5e3d] text-white rounded-xl hover:bg-opacity-90 transition flex items-center justify-center gap-2"
            onClick={handleCreate}
            disabled={loading || !formData.name}
          >
            {loading ? "Creating..." : "Create Channel"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChannelModal;
