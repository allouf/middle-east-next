import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { AgoraAPP_ID } from "../../shared/constants/data";
import { createCameraTrack, createMicrophoneTrack } from "../utils/rtcUtils";
import useAgoraClient from "./useAgoraClient";
import useAgoraEvents from "./useAgoraEvents";
import { joinChannel, leaveChannel, publishTracks } from "../utils/callUtils";
import { endCall, getCallToken } from "../api/callApi";

interface LocalTracks {
  audio: { setEnabled: (enabled: boolean) => Promise<void> } | null;
  video: { setEnabled: (enabled: boolean) => Promise<void> } | null;
}

interface VideoCallConfig {
  token: string;
  channel: string;
  channelName?: string;
  uid: string | number;
  conversation_id?: string | number;
}

interface JoinRTCParams {
  token: string;
  channel: string;
  uid: string | number;
}

interface UseVideoCallReturn {
  initiateCall: (receiverId: string | number) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  leaveCall: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  isMuted: boolean;
  localTracks: LocalTracks;
  isCameraOff: boolean;
  isCallActive: boolean;
  remoteUsers: unknown[];
  incomingCall: boolean;
  setIncomingCall: Dispatch<SetStateAction<boolean>>;
  videoCallConfig: VideoCallConfig | null;
  setVideoCallConfig: Dispatch<SetStateAction<VideoCallConfig | null>>;
  setIsCallActive: Dispatch<SetStateAction<boolean>>;
}

const useVideoCall = (
  currentUserId: string | number,
  conversationId: string | number
): UseVideoCallReturn => {
  const [localTracks, setLocalTracks] = useState<LocalTracks>({ audio: null, video: null });
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [videoCallConfig, setVideoCallConfig] = useState<VideoCallConfig | null>(null);

  const { remoteUsers, handleUserPublished, handleUserUnpublished } =
    useAgoraEvents();

  const { client, initializeClient } = useAgoraClient(
    handleUserPublished,
    handleUserUnpublished
  );

  const joinRTC = useCallback(
    async ({ token, channel, uid }: JoinRTCParams) => {
      console.log({ token: token, channel: channel, uid: uid });

      const agoraClient = initializeClient();
      await joinChannel(agoraClient, AgoraAPP_ID, channel, token, uid);

      const audioTrack = await createMicrophoneTrack();
      const videoTrack = await createCameraTrack();

      await publishTracks(agoraClient, [audioTrack, videoTrack]);
      setLocalTracks({ audio: audioTrack, video: videoTrack });
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
      callType: "video",
      conversationId,
    });

    if (data) {
      await joinRTC({
        token: data.token,
        channel: data.channel,
        uid: data.uid,
      });
    }
    setVideoCallConfig(data);
  };

  const acceptCall = async () => {
    if (!incomingCall || !videoCallConfig) return;
    const { token, channelName, uid } = videoCallConfig;
    await joinRTC({ token, channel: channelName || "", uid });
    setIncomingCall(false);
  };

  const rejectCall = () => {
    setIncomingCall(false);
    setVideoCallConfig(null);
  };

  const toggleMute = async () => {
    const { audio } = localTracks;
    if (!audio) return;
    await audio.setEnabled(isMuted);
    setIsMuted((prev) => !prev);
  };

  const toggleCamera = async () => {
    const { video } = localTracks;
    if (!video) return;
    await video.setEnabled(isCameraOff);
    setIsCameraOff((prev) => !prev);
  };

  const leaveCall = async () => {
    await leaveChannel(client, [localTracks.audio, localTracks.video]);
    console.log("videoCallConfig in leave", videoCallConfig);

    if (videoCallConfig) {
      await endCall({
        channelName: `private-call.${currentUserId}`,
        conversationId: videoCallConfig.conversation_id,
      });
    }

    setLocalTracks({ audio: null, video: null });
    setVideoCallConfig(null);
    setIsMuted(false);
    setIsCameraOff(false);
    setIsCallActive(false);
  };

  return {
    initiateCall,
    acceptCall,
    rejectCall,
    leaveCall,
    toggleMute,
    toggleCamera,
    isMuted,
    localTracks,
    isCameraOff,
    isCallActive,
    remoteUsers,
    incomingCall,
    setIncomingCall,
    videoCallConfig,
    setVideoCallConfig,
    setIsCallActive,
  };
};

export default useVideoCall;



