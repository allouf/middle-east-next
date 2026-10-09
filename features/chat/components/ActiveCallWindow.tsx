"use client";

import React, { useEffect, useRef } from "react";
import { BsMicFill, BsMicMuteFill, BsCameraVideoFill, BsCameraVideoOffFill, BsTelephoneXFill } from "react-icons/bs";
import { useAgoraCall } from "../hooks/useAgoraCall";
import { useChatStore } from "../store/useChatStore";

const ActiveCallWindow: React.FC = () => {
  const { 
    localVideoTrack, 
    remoteUsers, 
    toggleMic, 
    toggleCamera, 
    isMicMuted, 
    isCameraMuted, 
    leaveCall,
    endCallAction,
    joinCall
  } = useAgoraCall();

  const { activeCallDetail } = useChatStore();

  const localVideoRef = useRef<HTMLDivElement>(null);
  // Automatically join call on mount and cleanup on unmount
  useEffect(() => {
    let mounted = true;

    const initCall = async () => {
      if (mounted) {
        await joinCall();
      }
    };
    
    initCall();

    return () => {
      mounted = false;
      leaveCall();
    };
  }, [joinCall, leaveCall]);

  // Local video playback is handled by LocalVideoPlayer component below

  const remoteUsersList = Object.values(remoteUsers);
  const mainRemoteUser = remoteUsersList[0]; // For 1:1 calls, just get the first remote user

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10 absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent">
        <h2 className="text-xl font-medium">
          {activeCallDetail?.callType === 'VIDEO' ? 'Video Call' : 'Voice Call'}
        </h2>
        <div className="bg-black/30 px-3 py-1 rounded-full text-sm font-mono backdrop-blur-sm">
          {/* Mock duration timer */}
          00:00
        </div>
      </div>

      {/* Main Video Area (Remote) */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {mainRemoteUser?.videoTrack ? (
          <RemoteVideoPlayer track={mainRemoteUser.videoTrack} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-4">
               <span className="text-4xl text-gray-500 font-bold">U</span>
            </div>
            <p className="text-gray-400">
              {activeCallDetail?.callType === 'VIDEO' ? 'Remote video is disabled' : 'Voice Call'}
            </p>
          </div>
        )}

        {/* Local Video Picture-in-Picture */}
        {activeCallDetail?.callType === 'VIDEO' && (
          <div className="absolute bottom-28 right-6 w-32 h-48 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700 z-20">
            {isCameraMuted ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <BsCameraVideoOffFill className="text-gray-500 text-2xl" />
              </div>
            ) : (
              localVideoTrack && <LocalVideoPlayer track={localVideoTrack} />
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-24 bg-gray-900/90 backdrop-blur-md flex items-center justify-center gap-6 px-6 relative z-10">
        <button 
          onClick={toggleMic}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isMicMuted ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
        >
          {isMicMuted ? <BsMicMuteFill className="text-xl" /> : <BsMicFill className="text-xl" />}
        </button>

        {activeCallDetail?.callType === 'VIDEO' && (
          <button 
            onClick={toggleCamera}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isCameraMuted ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
          >
            {isCameraMuted ? <BsCameraVideoOffFill className="text-xl" /> : <BsCameraVideoFill className="text-xl" />}
          </button>
        )}

        <button 
          onClick={endCallAction}
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-lg shadow-red-900/50"
        >
          <BsTelephoneXFill className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ActiveCallWindow;

// Helper component to play remote video track
const RemoteVideoPlayer = ({ track }: { track: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track && ref.current) {
      track.play(ref.current);
    }
    return () => {
      if (track) track.stop();
    };
  }, [track]);

  return <div ref={ref} className="w-full h-full object-cover" />;
};

// Helper component to play local video track
const LocalVideoPlayer = ({ track }: { track: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track && ref.current) {
      track.play(ref.current);
    }
    return () => {
      if (track) {
        track.stop();
      }
    };
  }, [track]);

  return <div ref={ref} className="w-full h-full object-cover" />;
};
