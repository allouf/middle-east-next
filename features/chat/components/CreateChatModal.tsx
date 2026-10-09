"use client";

import React, { useState, useEffect } from "react";
import { X, Search, MessageSquare, MessageCircle } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import Modal from "@/components/ui/Modal";
import { contactApi } from "../api/contactApi";
import { chatApi } from "../api/chatApi";
import { ContactEntity } from "../types";

const CreateChatModal: React.FC = () => {
  const { isCreateChatModalOpen, setCreateChatModalOpen, setSelectedChat, setChats, chats } = useChatStore();
  const [contacts, setContacts] = useState<ContactEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (isCreateChatModalOpen) {
      fetchContacts();
    } else {
      setSearchQuery("");
      setLoadingId(null);
    }
  }, [isCreateChatModalOpen]);

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

  const handleStartChat = async (contact: ContactEntity) => {
    // Create a temporary chat entity for the UI
    const tempChat = {
      id: -contact.contact_id, // Negative ID to indicate it's temporary/new
      initiatorUser: {
        id: contact.contact_id, 
        name: contact.name,
        photo: contact.photo,
        email: null, phone: null, countryCode: null, region: null, provider: null, provider_id: null, provider_token: null, provider_refresh_token: null, verified_at: null, ref_code: null, referred_by_user_id: null, is_active: true, is_profile_complete: true, is_beta_user: false, deletion_reason: null, createdAt: null, updatedAt: null
      },
      receiverUser: {
        id: contact.contact_id, 
        name: contact.name,
        photo: contact.photo,
        email: null, phone: null, countryCode: null, region: null, provider: null, provider_id: null, provider_token: null, provider_refresh_token: null, verified_at: null, ref_code: null, referred_by_user_id: null, is_active: true, is_profile_complete: true, is_beta_user: false, deletion_reason: null, createdAt: null, updatedAt: null
      },
      lastMessage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isInitiatorOnline: true,
      isReceiverOnline: false
    };

    setSelectedChat(tempChat as any);
    setCreateChatModalOpen(false);
  };

  const filteredContacts = Array.isArray(contacts) 
    ? contacts.filter((c) => (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <Modal
      isOpen={isCreateChatModalOpen}
      onClose={() => setCreateChatModalOpen(false)}
      showLine={false}
      showCloseButton={false}
      className="max-w-md"
      padding="p-0"
    >
      <div className="flex flex-col h-[70vh] max-h-[600px]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-[#e8f5f1] p-1.5 rounded-lg text-[#0d5e3d]">
              <MessageCircle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
          </div>
          <button onClick={() => setCreateChatModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-4">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0d5e3d] transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-1">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition border border-transparent hover:border-gray-100"
                onClick={() => handleStartChat(contact)}
              >
                <div className="flex items-center gap-3">
                  <img src={contact.photo || "/ReferralImage.png"} className="w-10 h-10 rounded-full object-cover" alt={contact.name || ""} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                <div>
                  {loadingId === contact.contact_id ? (
                    <div className="w-5 h-5 border-2 border-[#0d5e3d] border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <MessageSquare size={18} className="text-gray-400" />
                  )}
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 mt-10">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                  <Search size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">No contacts found</p>
                <p className="text-xs text-gray-500 max-w-[200px]">We couldn't find any contacts matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateChatModal;
