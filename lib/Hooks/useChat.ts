import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { pusherClient } from "./../utils/pusher";
import api from "./../api/index";
import {
  getMessagesUrl,
  sendMessagesUrl,
  startConversationUrl,
  getConversationsUrl,
} from "@/shared/constants/urls";

interface Message {
  id: string | number;
  message: string;
  message_type: string;
  [key: string]: unknown;
}

interface Conversation {
  id: string | number;
  initiator_id?: string | number;
  [key: string]: unknown;
}

interface UseChatProps {
  receiverId?: string | number | null;
}

interface UseChatReturn {
  initiatorId: string | number | null;
  messages: Message[];
  newMessage: string;
  setNewMessage: Dispatch<SetStateAction<string>>;
  conversationId: string | number | null;
  setConversationId: Dispatch<SetStateAction<string | number | null>>;
  fetchMessagesAndSubscribe: (convId: string | number) => Promise<void>;
  handleSend: () => Promise<void>;
  handleFileSend: (file: File) => Promise<void>;
  handleAudioSend: (audioBlob: Blob) => Promise<void>;
  conversations: Conversation[];
  getConversations: () => Promise<void>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let channel: any;

const useChat = ({ receiverId }: UseChatProps = {}): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversationId, setConversationId] = useState<string | number | null>(null);
  const [initiatorId, setInitiatorId] = useState<string | number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const startConversation = async () => {
      try {
        const resData = await api.post(startConversationUrl, {
          receiver_id: receiverId,
        });

        const conversation = resData?.data?.data as Conversation | undefined;
        setConversationId(conversation?.id ?? null);
        setInitiatorId(conversation?.initiator_id ?? null);

        if (conversation?.id) {
          fetchMessagesAndSubscribe(conversation.id);
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
      }
    };

    if (receiverId) {
      startConversation();
    }
  }, [receiverId]);

  const fetchMessagesAndSubscribe = async (convId: string | number) => {
    try {
      const { data: fetchedMessages } = await api.get(
        `${getMessagesUrl}/${convId}`
      );
      setMessages((fetchedMessages as Message[]) || []);

      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
      channel = pusherClient.subscribe(`private-conversation.${convId}`);

      channel.bind("new-message", () => {
        fetchMessagesAndSubscribe(convId);
      });
    } catch (error) {
      console.error("Failed to fetch messages or subscribe:", error);
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

  const handleSend = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      await api.post(sendMessagesUrl, {
        conversation_id: conversationId,
        message: newMessage,
        message_type: "text",
      });
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileSend = async (file: File) => {
    if (!conversationId || !file) return;

    const formData = new FormData();
    formData.append("conversation_id", String(conversationId));
    formData.append(
      "message_type",
      file.type.startsWith("image/") ? "photo" : "file"
    );
    formData.append("file", file);

    try {
      await api.post(sendMessagesUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Failed to send file:", error);
    }
  };

  const handleAudioSend = async (audioBlob: Blob) => {
    if (!conversationId || !audioBlob) return;

    const formData = new FormData();
    formData.append("conversation_id", String(conversationId));
    formData.append("message_type", "audio");
    formData.append("file", audioBlob, "voice-message.webm");

    try {
      await api.post(sendMessagesUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Failed to send audio:", error);
    }
  };

  const getConversations = async () => {
    const { data } = await api.get(getConversationsUrl);
    setConversations((data as Conversation[]) || []);
  };

  return {
    initiatorId,
    messages,
    newMessage,
    setNewMessage,
    conversationId,
    setConversationId,
    fetchMessagesAndSubscribe,
    handleSend,
    handleFileSend,
    handleAudioSend,
    conversations,
    getConversations,
  };
};

export default useChat;



