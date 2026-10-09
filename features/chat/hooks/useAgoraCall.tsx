"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  IRemoteAudioTrack,
  UID,
} from "agora-rtc-sdk-ng";
import { useChatStore } from "../store/useChatStore";
import { useSocket } from "./useSocket";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || "d3b8417cde224dcfa98fcf9a63690d79"; // Replace with real or allow env fallback

export const useAgoraCall = () => {
  const { activeCallDetail, setActiveCallDetail, setCallState } = useChatStore();
  const { endCall } = useSocket();
  
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  
  const [remoteUsers, setRemoteUsers] = useState<Record<string, { videoTrack?: IRemoteVideoTrack, audioTrack?: IRemoteAudioTrack }>>({});
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);

  // Initialize client if not exists
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    }
  }, []);

  const leaveCall = useCallback(async () => {
    setLocalAudioTrack((prev) => {
      if (prev) {
        prev.stop();
        prev.close();
      }
      return null;
    });
    
    setLocalVideoTrack((prev) => {
      if (prev) {
        prev.stop();
        prev.close();
      }
      return null;
    });

    if (clientRef.current) {
      try {
        await clientRef.current.leave();
      } catch (e) {
        console.warn("Agora leave error", e);
      }
      clientRef.current.removeAllListeners();
    }
    setRemoteUsers({});
  }, []);

  const endCallAction = useCallback(() => {
    leaveCall();
    
    if (activeCallDetail) {
      endCall({
        conversation_id: activeCallDetail.conversationId,
        channel_name: activeCallDetail.channelName,
      });
    }
    
    setCallState("ENDED");
    setTimeout(() => {
      setActiveCallDetail(null);
      setCallState("IDLE");
    }, 2000);
  }, [leaveCall, activeCallDetail, endCall, setCallState, setActiveCallDetail]);

  const joinCall = useCallback(async () => {
    if (!activeCallDetail || !clientRef.current) return;

    setCallState("ACTIVE");

    const client = clientRef.current;
    
    // Set up event listeners for remote users
    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("[Agora] Subscribed to remote user", user.uid, mediaType);
      
      setRemoteUsers(prev => ({
        ...prev,
        [user.uid]: {
          ...prev[user.uid],
          [mediaType === "video" ? "videoTrack" : "audioTrack"]: mediaType === "video" ? user.videoTrack : user.audioTrack
        }
      }));

      if (mediaType === "audio" && user.audioTrack) {
        user.audioTrack.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      console.log("[Agora] User unpublished", user.uid, mediaType);
      setRemoteUsers(prev => {
        const next = { ...prev };
        if (next[user.uid]) {
          if (mediaType === "video") delete next[user.uid].videoTrack;
          if (mediaType === "audio") delete next[user.uid].audioTrack;
        }
        return next;
      });
    });

    client.on("user-left", (user) => {
      console.log("[Agora] User left", user.uid);
      setRemoteUsers(prev => {
        const next = { ...prev };
        delete next[user.uid];
        return next;
      });
      // End call if the other person leaves
      endCallAction();
    });

    try {
      // 1. Create local tracks first (requests permissions immediately)
      let audioTrack: IMicrophoneAudioTrack | null = null;
      let videoTrack: ICameraVideoTrack | null = null;

      try {
        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setLocalAudioTrack(audioTrack);
        
        if (activeCallDetail.callType === "VIDEO") {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
          setLocalVideoTrack(videoTrack);
        }
      } catch (mediaError) {
        console.error("[Agora] Failed to get camera/mic permissions", mediaError);
        alert("Please allow camera and microphone permissions in your browser to make this call.");
        endCallAction();
        return;
      }

      // 2. Join the channel
      await client.join(
        APP_ID,
        activeCallDetail.channelName,
        activeCallDetail.token || null,
        activeCallDetail.uid || null
      );

      // 3. Publish tracks
      if (videoTrack && audioTrack) {
        await client.publish([audioTrack, videoTrack]);
      } else if (audioTrack) {
        await client.publish([audioTrack]);
      }
      
    } catch (error) {
      console.error("[Agora] Failed to join call", error);
      // Don't call endCallAction here because it might be just an OPERATION_ABORTED from strict mode
    }
  }, [activeCallDetail, endCallAction, setCallState]);

  const toggleMic = useCallback(async () => {
    if (localAudioTrack) {
      const newState = !isMicMuted;
      await localAudioTrack.setMuted(newState);
      setIsMicMuted(newState);
    }
  }, [localAudioTrack, isMicMuted]);

  const toggleCamera = useCallback(async () => {
    if (localVideoTrack) {
      const newState = !isCameraMuted;
      await localVideoTrack.setMuted(newState);
      setIsCameraMuted(newState);
    } else {
      // Create and publish the track if it doesn't exist (e.g. upgraded from audio call)
      try {
        const videoTrack = await AgoraRTC.createCameraVideoTrack();
        setLocalVideoTrack(videoTrack);
        setIsCameraMuted(false);
        if (clientRef.current) {
          await clientRef.current.publish(videoTrack);
        }
      } catch (e) {
        console.error("Failed to turn on camera", e);
        alert("Failed to access camera.");
      }
    }
  }, [localVideoTrack, isCameraMuted]);

  return {
    joinCall,
    leaveCall,
    endCallAction,
    localAudioTrack,
    localVideoTrack,
    remoteUsers,
    toggleMic,
    toggleCamera,
    isMicMuted,
    isCameraMuted,
  };
};
