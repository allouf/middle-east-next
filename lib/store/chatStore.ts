import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSelecttionSideBarChat = create(persist());

export default useSelecttionSideBarChat;
