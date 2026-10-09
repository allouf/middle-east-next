"use client";

import React, { useState, useEffect } from "react";
import { X, Search, ArrowRight, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatStore } from "../store/useChatStore";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import ImageField from "@/components/ui/ImageField";
import { contactApi } from "../api/contactApi";
import { groupApi } from "../api/groupApi";
import { ContactEntity } from "../types";

const CreateGroupModal: React.FC = () => {
  const { isCreateGroupModalOpen, setCreateGroupModalOpen, setGroups, groups } = useChatStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null as File | null,
    privacy: "PRIVATE" as "PUBLIC" | "PRIVATE",
  });
  const [contacts, setContacts] = useState<ContactEntity[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCreateGroupModalOpen) {
      fetchContacts();
    } else {
      // Reset on close
      setStep(1);
      setFormData({ name: "", description: "", image: null, privacy: "PRIVATE" });
      setSelectedMembers([]);
      setSearchQuery("");
    }
  }, [isCreateGroupModalOpen]);

  const fetchContacts = async () => {
    try {
      const res = await contactApi.getContacts();
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        setContacts(res.data.data.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        setContacts(res.data.data);
      } else if (Array.isArray(res.data)) {
        setContacts(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      setContacts([]);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      // 1. Create group
      const payload: any = {
        name: formData.name,
        privacy: formData.privacy,
      };
      
      if (formData.description.trim()) {
        payload.description = formData.description.trim();
      }

      const res = await groupApi.createGroup(payload);

      const newGroup = (res.data as any).data || res.data;
      const groupId = newGroup.id;

      // 2. Add members if any
      if (selectedMembers.length > 0 && groupId) {
        await Promise.all(
          selectedMembers.map((userId) =>
            groupApi.addMember(groupId, userId, "MEMBER")
          )
        );
      }

      // Update local state — add the new group to the list
      if (newGroup) {
        setGroups([newGroup, ...groups]);
      }
      
      setCreateGroupModalOpen(false);
    } catch (error: any) {
      console.error("Failed to create group", error);
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = Array.isArray(contacts) 
    ? contacts.filter((c) => (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      isOpen={isCreateGroupModalOpen}
      onClose={() => setCreateGroupModalOpen(false)}
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
              <UserPlus size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Create New Group</h3>
          </div>
          <button onClick={() => setCreateGroupModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
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
                    <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" alt="Group" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                       <img src="/ReferralImage.png" className="w-full h-full object-cover opacity-50" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-full transition pointer-events-none">
                   <div className="bg-white/80 p-2 rounded-full">
                      <ArrowRight className="rotate-[-90deg] w-4 h-4 text-gray-700" />
                   </div>
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
              id="group-name"
              label="Group Name"
              placeholder="e.g. Design Team 2024"
              value={formData.name}
              onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <InputField
              id="group-description"
              label="Description (Optional)"
              placeholder="What is this group about?"
              type="textarea"
              rows={3}
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Add Members Section */}
          <div className="space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Add Members</label>
                <span className="text-xs text-gray-400">{selectedMembers.length} members selected</span>
             </div>
             
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0d5e3d] transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                    onClick={() => toggleMember(contact.contact_id)}
                  >
                    <div className="flex items-center gap-3">
                      <img src={contact.photo || "/ReferralImage.png"} className="w-9 h-9 rounded-full object-cover" alt={contact.name || ""} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-[10px] text-gray-400">{contact.phone}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${selectedMembers.includes(contact.contact_id) ? "bg-[#0d5e3d] border-[#0d5e3d]" : "border-gray-200"}`}>
                       {selectedMembers.includes(contact.contact_id) && (
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                       )}
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <p className="text-center py-4 text-sm text-gray-400">No contacts found</p>
                )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <Button 
            unstyled 
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-white transition"
            onClick={() => setCreateGroupModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 py-3 bg-[#0d5e3d] text-white rounded-xl hover:bg-opacity-90 transition flex items-center justify-center gap-2"
            onClick={handleCreate}
            disabled={loading || !formData.name}
          >
            {loading ? "Creating..." : "Create Group"}
            {!loading && <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;
