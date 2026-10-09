// rtcUtils.js
import AgoraRTC from "agora-rtc-sdk-ng";

export const createAgoraClient = () => {
  return AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
};

export const createMicrophoneTrack = () => {
  return AgoraRTC.createMicrophoneAudioTrack({
    encoderConfig: "music_standard",
  });
};

export const createCameraTrack = () => {
  return AgoraRTC.createCameraVideoTrack();
};
