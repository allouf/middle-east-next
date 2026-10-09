import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { pusherClient } from "@/lib/utils/pusher";
import api from "@/lib/api";
import { CHANNEL_ENDPOINTS } from "@/shared/constants/urls";

interface Message {
  id: string | number;
  message: string;
  message_type: string;
  [key: string]: unknown;
}

interface Channel {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

interface Member {
  id: string | number;
  [key: string]: unknown;
}

interface ChannelDetails {
  id: string | number;
  name: string;
  [key: string]: unknown;
}

interface UseChannelsProps {
  channelId?: string | number | null;
}

interface UseChannelsReturn {
  activeChannelId: string | number | null;
  setActiveChannelId: Dispatch<SetStateAction<string | number | null>>;
  messages: Message[];
  newMessage: string;
  members: Member[];
  memberRequest: Member[];
  setNewMessage: Dispatch<SetStateAction<string>>;
  handleSend: () => Promise<void>;
  handleFileSend: (file: File) => Promise<void>;
  handleAudioSend: (audioBlob: Blob) => Promise<void>;
  fetchMessagesAndSubscribe: (chId: string | number) => Promise<void>;
  createChannel: (payload: Record<string, unknown>) => Promise<unknown>;
  updateChannel: (id: string | number, payload: Record<string, unknown>) => Promise<unknown>;
  joinChannel: (id: string | number) => Promise<unknown>;
  leaveChannel: (id: string | number) => Promise<unknown>;
  deleteChannel: (id: string | number) => Promise<unknown>;
  addMember: (id: string | number, payload: Record<string, unknown>) => Promise<unknown>;
  removeMember: (id: string | number, payload: Record<string, unknown>) => Promise<unknown>;
  myChannels: Channel[];
  publicChannels: Channel[];
  channelDetails: ChannelDetails | null;
  fetchMyChannels: () => Promise<void>;
  fetchPublicChannels: () => Promise<void>;
  fetchChannelDetails: (id: string | number) => Promise<void>;
  fetchChannelMember: (id: string | number) => Promise<void>;
  fetchChannelMemberRequest: (id: string | number) => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let channel: any;

const useChannels = ({ channelId }: UseChannelsProps = {}): UseChannelsReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChannelId, setActiveChannelId] = useState<string | number | null>(channelId || null);
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [publicChannels, setPublicChannels] = useState<Channel[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberRequest, setMemberRequest] = useState<Member[]>([]);
  const [channelDetails, setChannelDetails] = useState<ChannelDetails | null>(null);

  // Auto subscribe when channelId changes
  useEffect(() => {
    if (channelId) {
      setActiveChannelId(channelId);
      fetchMessagesAndSubscribe(channelId);
      fetchChannelDetails(channelId);
    }
  }, [channelId]);

  const fetchMessagesAndSubscribe = async (chId: string | number) => {
    try {
      const { data } = await api.get(CHANNEL_ENDPOINTS.getMessages(chId));
      setMessages((data as Message[]) || []);

      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }

      channel = pusherClient.subscribe(`private-channel.${chId}`);
      channel.bind("new-message", () => {
        fetchMessagesAndSubscribe(chId);
      });
    } catch (error) {
      console.error("Failed to fetch channel messages:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, []);

  // CRUD + Members
  const createChannel = async (payload: Record<string, unknown>) => {
    const { data } = await api.post(CHANNEL_ENDPOINTS.create, payload);
    return data;
  };

  const updateChannel = async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.post(CHANNEL_ENDPOINTS.update(id), payload);
    return data;
  };

  const joinChannelApi = async (id: string | number) => {
    const { data } = await api.post(CHANNEL_ENDPOINTS.join(id));
    return data;
  };

  const leaveChannelApi = async (id: string | number) => {
    const { data } = await api.post(CHANNEL_ENDPOINTS.leave(id));
    return data;
  };

  const deleteChannel = async (id: string | number) => {
    const { data } = await api.delete(CHANNEL_ENDPOINTS.delete(id));
    return data;
  };

  const addMember = async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.post(CHANNEL_ENDPOINTS.addMember(id), payload);
    return data;
  };

  const removeMember = async (id: string | number, payload: Record<string, unknown>) => {
    const { data } = await api.post(
      CHANNEL_ENDPOINTS.removeMember(id),
      payload
    );
    return data;
  };

  // Messages
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChannelId) return;
    try {
      await api.post(CHANNEL_ENDPOINTS.sendMessage, {
        channel_id: activeChannelId,
        message: newMessage,
        message_type: "text",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileSend = async (file: File) => {
    if (!activeChannelId || !file) return;

    const formData = new FormData();
    formData.append("channel_id", String(activeChannelId));
    formData.append(
      "message_type",
      file.type.startsWith("image/") ? "photo" : "file"
    );
    formData.append("file", file);

    try {
      await api.post(CHANNEL_ENDPOINTS.sendMessage, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Failed to send file:", error);
    }
  };

  const handleAudioSend = async (audioBlob: Blob) => {
    if (!activeChannelId || !audioBlob) return;

    const formData = new FormData();
    formData.append("channel_id", String(activeChannelId));
    formData.append("message_type", "audio");
    formData.append("file", audioBlob, "voice-message.webm");

    try {
      await api.post(CHANNEL_ENDPOINTS.sendMessage, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Failed to send audio:", error);
    }
  };

  // Fetch helpers
  const fetchMyChannels = async () => {
    const { data } = await api.get(CHANNEL_ENDPOINTS.myChannels);
    setMyChannels((data as Channel[]) || []);
  };

  const fetchPublicChannels = async () => {
    const { data } = await api.get(CHANNEL_ENDPOINTS.publicChannels);
    setPublicChannels((data as Channel[]) || []);
  };

  const fetchChannelDetails = async (id: string | number) => {
    const { data } = await api.get(CHANNEL_ENDPOINTS.details(id));
    setChannelDetails((data as ChannelDetails) || null);
  };

  const fetchChannelMember = async (id: string | number) => {
    const { data } = await api.get(CHANNEL_ENDPOINTS.member(id));
    setMembers((data as Member[]) || []);
  };

  const fetchChannelMemberRequest = async (id: string | number) => {
    const { data } = await api.get(CHANNEL_ENDPOINTS.memberRequest(id));
    setMemberRequest((data as Member[]) || []);
  };

  return {
    activeChannelId,
    setActiveChannelId,
    messages,
    newMessage,
    members,
    memberRequest,
    setNewMessage,
    handleSend,
    handleFileSend,
    handleAudioSend,
    fetchMessagesAndSubscribe,
    createChannel,
    updateChannel,
    joinChannel: joinChannelApi,
    leaveChannel: leaveChannelApi,
    deleteChannel,
    addMember,
    removeMember,
    myChannels,
    publicChannels,
    channelDetails,
    fetchMyChannels,
    fetchPublicChannels,
    fetchChannelDetails,
    fetchChannelMember,
    fetchChannelMemberRequest,
  };
};

export default useChannels;



