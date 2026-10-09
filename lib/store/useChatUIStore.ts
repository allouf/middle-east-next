import { create } from "zustand";

export const useChatUIStore = create((set) => ({
  activeTab: "chats", // chats | messages | channel
  activeUI: "",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setActiveUI: (ui) => set({ activeUI: ui }),
}));
