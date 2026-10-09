import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CompleteProfileStore {
  isCompleteProfile: boolean;
  setIsCompleteProfile: (value: boolean) => void;
}

const useCompleteProfile = create<CompleteProfileStore>()(
  persist(
    (set) => ({
      isCompleteProfile: false,
      setIsCompleteProfile: (value: boolean) =>
        set({ isCompleteProfile: value }),
    }),
    {
      name: "complete-profile-storage", 
    }
  )
);

export default useCompleteProfile;
