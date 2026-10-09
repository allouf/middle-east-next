import axios from "axios";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";

export const mediaApi = {
  uploadMedia: async (file: File, type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE" | "VOICE") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const token = getCookie(STORAGE_KEYS.TOKEN);
    
    // We hit the proxy route defined in next.config.ts which maps to /api/v1/media/upload
    const response = await axios.post("/api/media-proxy/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      }
    });

    return response.data;
  }
};
