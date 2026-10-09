import { useState, useCallback, Dispatch, SetStateAction } from "react";
import useAgoraEvents from "./useAgoraEvents";
import useAgoraClient from "./useAgoraClient";
import { joinChannel, leaveChannel, publishTracks } from "../utils/callUtils";
import { endCall, getCallToken } from "./../api/callApi";
import { createMicrophoneTrack } from "../utils/rtcUtils";
import { AgoraAPP_ID } from "../../shared/constants/data";

interface LocalTrack {
  setEnabled: (enabled: boolean) => Promise<void>;
}

interface CallInfo {
  token: string;
  channel: string;
  channelName?: string;
  uid: string | number;
  conversation_id?: string | number;
}

interface JoinVoiceCallParams {
  token: string;
  channel: string;
  uid: string | number;
}

interface UseVoiceCallReturn {
  initiateCall: (receiverId: string | number) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  leaveCall: () => Promise<void>;
  toggleMute: () => Promise<void>;
  isMuted: boolean;
  isCallActive: boolean;
  incomingCall: boolean;
  setIncomingCall: Dispatch<SetStateAction<boolean>>;
  callInfo: CallInfo | null;
  setCallInfo: Dispatch<SetStateAction<CallInfo | null>>;
  remoteUsers: unknown[];
}

const useVoiceCall = (
  currentUserId: string | number,
  conversationId: string | number
): UseVoiceCallReturn => {
  const [localTrack, setLocalTrack] = useState<LocalTrack | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callInfo, setCallInfo] = useState<CallInfo | null>(null);

  const { remoteUsers, handleUserPublished, handleUserUnpublished } =
    useAgoraEvents();

  const { client, initializeClient } = useAgoraClient(
    handleUserPublished,
    handleUserUnpublished
  );

  const joinVoiceCall = useCallback(
    async ({ token, channel, uid }: JoinVoiceCallParams) => {
      const agoraClient = initializeClient();
      await joinChannel(agoraClient, AgoraAPP_ID, channel, token, uid);

      const micTrack = await createMicrophoneTrack();
      await publishTracks(agoraClient, [micTrack]);
      setLocalTrack(micTrack);
      setIsCallActive(true);
    },
    [initializeClient]
  );

  const initiateCall = async (receiverId: string | number) => {
    const channelName = `private-call.${currentUserId}`;
    const data = await getCallToken({
      receiverId,
      channelName,
      uid: currentUserId,
      callType: "voice",
      conversationId,
    });

    if (data) {
      await joinVoiceCall({
        token: data.token,
        channel: data.channel,
        uid: data.uid,
      });
      setCallInfo(data);
    }
  };

  const acceptCall = async () => {
    if (!incomingCall || !callInfo) return;
    const { token, channelName, uid } = callInfo;
    await joinVoiceCall({ token, channel: channelName || "", uid });
    setIncomingCall(false);
  };

  const rejectCall = () => {
    setIncomingCall(false);
    setCallInfo(null);
  };

  const toggleMute = async () => {
    if (!localTrack) return;
    await localTrack.setEnabled(isMuted);
    setIsMuted((prev) => !prev);
  };

  const leaveCall = async () => {
    await leaveChannel(client, [localTrack]);

    if (callInfo) {
      await endCall({
        channelName: `private-call.${currentUserId}`,
        conversationId: callInfo.conversation_id,
      });
    }

    setLocalTrack(null);
    setIsMuted(false);
    setIsCallActive(false);
    setCallInfo(null);
  };

  return {
    initiateCall,
    acceptCall,
    rejectCall,
    leaveCall,
    toggleMute,
    isMuted,
    isCallActive,
    incomingCall,
    setIncomingCall,
    callInfo,
    setCallInfo,
    remoteUsers,
  };
};

export default useVoiceCall;



