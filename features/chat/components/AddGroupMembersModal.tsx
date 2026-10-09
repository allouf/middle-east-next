"use client";

import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { groupApi } from "../api/groupApi";
import { contactApi } from "../api/contactApi";
import { ContactEntity } from "../types";
import Modal from "@/components/ui/Modal";

const AddGroupMembersModal: React.FC = () => {
  const {
    isAddGroupMembersModalOpen,
    setAddGroupMembersModalOpen,
    selectedGroup,
  } = useChatStore();
  const [contacts, setContacts] = useState<ContactEntity[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<ContactEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingMemberIds, setExistingMemberIds] = useState<number[]>([]);

  useEffect(() => {
    if (isAddGroupMembersModalOpen && selectedGroup) {
      fetchContacts();
      fetchExistingMembers();
    } else {
      setSelectedMembers([]);
      setSearchQuery("");
    }
  }, [isAddGroupMembersModalOpen, selectedGroup]);

  const fetchContacts = async () => {
    try {
      const res = await contactApi.getContacts();
      let data: ContactEntity[] = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        data = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (Array.isArray(res.data)) {
        data = res.data;
      }
      setContacts(data);
    } catch (error) {
      console.error("Failed to fetch contacts", error);
      setContacts([]);
    }
  };

  const fetchExistingMembers = async () => {
    if (!selectedGroup) return;
    try {
      const res = await groupApi.getGroupMembers(selectedGroup.id);
      const members = res.data?.data || res.data;
      if (Array.isArray(members)) {
        setExistingMemberIds(
          members.map((m: any) => m.userId || m.user?.id).filter(Boolean)
        );
      }
    } catch {
      setExistingMemberIds([]);
    }
  };

  const handleAdd = async () => {
    if (!selectedGroup || selectedMembers.length === 0) return;
    setLoading(true);
    try {
      await Promise.all(
        selectedMembers.map((contact) =>
          groupApi.addMember(selectedGroup.id, contact.contact_id, "MEMBER")
        )
      );
      setAddGroupMembersModalOpen(false);
    } catch (error) {
      console.error("Failed to add members", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (contact: ContactEntity) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.contact_id === contact.contact_id)
        ? prev.filter((m) => m.contact_id !== contact.contact_id)
        : [...prev, contact]
    );
  };

  const removeMember = (contactId: number) => {
    setSelectedMembers((prev) =>
      prev.filter((m) => m.contact_id !== contactId)
    );
  };

  // Filter out existing members and apply search
  const filteredContacts = contacts.filter((c) => {
    if (existingMemberIds.includes(c.contact_id)) return false;
    if (
      searchQuery &&
      !(c.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  if (!selectedGroup) return null;

  return (
    <Modal
      isOpen={isAddGroupMembersModalOpen}
      onClose={() => setAddGroupMembersModalOpen(false)}
      showLine={false}
      showCloseButton={false}
      className="max-w-md"
      padding="p-0"
    >
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-start px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Add Members to Group
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {selectedGroup.name}
            </p>
          </div>
          <button
            onClick={() => setAddGroupMembersModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition mt-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Selected Members Chips */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMembers.map((member) => (
                <div
                  key={member.contact_id}
                  className="flex items-center gap-1.5 bg-[#e8f5e9] text-[#0d5e3d] px-3 py-1.5 rounded-full text-xs font-medium"
                >
                  {member.name}
                  <button
                    onClick={() => removeMember(member.contact_id)}
                    className="hover:text-red-600 transition"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0d5e3d] focus:outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Contacts List */}
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Suggested Contacts
          </p>
          <div className="space-y-1">
            {filteredContacts.map((contact) => {
              const isSelected = selectedMembers.some(
                (m) => m.contact_id === contact.contact_id
              );
              return (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition"
                  onClick={() => toggleMember(contact)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={contact.photo || "/ReferralImage.png"}
                      className="w-9 h-9 rounded-full object-cover"
                      alt={contact.name || ""}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {contact.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {contact.phone || "Online"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                      isSelected
                        ? "bg-[#0d5e3d] border-[#0d5e3d]"
                        : "border-gray-200"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-400">
                No contacts found
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-white transition font-medium text-sm"
            onClick={() => setAddGroupMembersModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="flex-1 py-3 bg-[#0d5e3d] text-white rounded-xl hover:bg-opacity-90 transition font-medium text-sm disabled:opacity-50"
            onClick={handleAdd}
            disabled={loading || selectedMembers.length === 0}
          >
            {loading
              ? "Adding..."
              : `Add Members (${selectedMembers.length})`}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddGroupMembersModal;
