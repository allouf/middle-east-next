'use client';

import ChatLayout from "@/features/chat/components/ChatLayout";
import { SocketProvider } from "@/features/chat/hooks/useSocket";
import { useChatStore } from "@/features/chat/store/useChatStore";

export default function ChatPage() {
  const { activeCallDetail, callState, setActiveCallDetail, setCallState } = useChatStore();

  const handleIncomingCall = (data: any) => {
    const state = useChatStore.getState();
    const currentCallState = state.callState;
    const currentDetail = state.activeCallDetail;
    
    console.log('[ChatPage] Incoming call event received:', data, 'Current callState:', currentCallState);

    // Check if we are already waiting for a call token (OUTGOING) for this conversation
    if (currentCallState === "OUTGOING" && currentDetail?.conversationId === data.conversationId) {
      // We are the caller! The server responded with the generated token
      setActiveCallDetail({
        ...currentDetail,
        token: data.token,
        channelName: data.channelName,
        uid: data.uid || currentDetail.uid,
        callDetailId: data.callDetailId,
      });
      // Transition to ACTIVE so the camera opens and Agora connects
      setCallState("ACTIVE");
    } else if (currentCallState === "IDLE") {
      // We are the receiver
      setActiveCallDetail({
        token: data.token,
        channelName: data.channelName,
        uid: data.uid,
        callType: data.callType,
        conversationId: data.conversationId,
        callDetailId: data.callDetailId,
        callerId: data.callerId,
        isIncoming: true,
      });
      setCallState("INCOMING");
    }
  };

  const handleCallEnded = () => {
    setCallState("ENDED");
    setTimeout(() => {
      setActiveCallDetail(null);
      setCallState("IDLE");
    }, 1000);
  };

  return (
    <SocketProvider
      onIncomingVoiceCall={handleIncomingCall}
      onIncomingVideoCall={handleIncomingCall}
      onCallEnded={handleCallEnded}
    >
      <ChatLayout />
    </SocketProvider>
  );
}
