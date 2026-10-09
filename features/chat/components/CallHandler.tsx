"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BsTelephoneFill, BsCameraVideoFill, BsX, BsMicFill, BsMicMuteFill, BsMicMute, BsVolumeUp, BsCameraVideo, BsTelephone, BsTelephoneX, BsChatSquareText } from "react-icons/bs";
import { useSocket } from "../hooks/useSocket";
import { useChatStore } from "../store/useChatStore";
import ActiveCallWindow from "./ActiveCallWindow";
import { getCookie, STORAGE_KEYS } from "@/lib/utils/auth-storage";

const CallHandler: React.FC = () => {
  const { socket, endCall } = useSocket();
  const { callState, activeCallDetail, setActiveCallDetail, setCallState, chats, selectedCall } = useChatStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAccept = async () => {
    // Transition from INCOMING to ACTIVE
    setCallState("ACTIVE");
  };

  const handleReject = () => {
    // Reject incoming call or cancel outgoing
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
    }, 1000);
  };

  let displayName = "Unknown";
  let displayPhoto = "/ReferralImage.png";

  const currentUserEmail = typeof window !== 'undefined' ? getCookie(STORAGE_KEYS.EMAIL) : "";

  if (activeCallDetail && Array.isArray(chats)) {
    const chat = chats.find(c => c.id === activeCallDetail.conversationId);
    if (chat) {
      const isInitiator = chat.initiatorUser?.email === currentUserEmail;
      const otherUser = isInitiator ? chat.receiverUser : chat.initiatorUser;
      displayName = otherUser?.name || "Unknown";
      displayPhoto = otherUser?.photo || "/ReferralImage.png";
    } else {
      displayName = activeCallDetail.callerId || "Unknown";
    }
  } else if (selectedCall) {
    displayName = selectedCall.name;
    displayPhoto = selectedCall.photo || "/ReferralImage.png";
  }

  // If there's an active call, show the ActiveCallWindow
  if (callState === "ACTIVE" && activeCallDetail) {
    const activeContent = <ActiveCallWindow />;
    return mounted && document.body ? createPortal(activeContent, document.body) : null;
  }

  // Incoming, Outgoing, or Ringing (mock) state
  if (callState === "INCOMING" || callState === "OUTGOING" || callState === "RINGING") {
    const isIncoming = callState === "INCOMING";
    
    const overlayContent = (
      <div className="fixed inset-0 z-[10000] overflow-hidden bg-gray-900 flex flex-col items-center justify-center">
        {/* Blurred background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
          style={{ backgroundImage: `url(${displayPhoto})` }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Top Banner */}
        <div className="absolute top-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-medium z-10">
          <BsTelephone /> END-TO-END ENCRYPTED
        </div>

        <div className="relative z-10 flex flex-col items-center mt-[-40px]">
          <div className="relative mb-6">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
               <img src={displayPhoto} alt={displayName} className="w-full h-full object-cover" />
             </div>
             {/* Ringing animation rings */}
             <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '2s' }}></div>
             <div className="absolute inset-[-15px] rounded-full border border-white/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">{displayName}</h2>
          <div className="flex items-center gap-2 text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            {isIncoming ? "Incoming Call..." : "Calling..."}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-16 bg-white/90 backdrop-blur-lg px-8 py-4 rounded-3xl flex items-center gap-8 shadow-2xl z-10">
          {!isIncoming && (
            <>
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xl">
                  <BsCameraVideo />
                </div>
                <span className="text-xs font-medium text-gray-600">Video</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xl">
                  <BsMicMute />
                </div>
                <span className="text-xs font-medium text-gray-600">Mute</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80">
                <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xl">
                  <BsVolumeUp />
                </div>
                <span className="text-xs font-medium text-gray-600">Speaker</span>
              </div>
            </>
          )}

          <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition transform hover:scale-105" onClick={handleReject}>
            <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
              <BsTelephoneX />
            </div>
            <span className="text-xs font-medium text-red-500">DECLINE</span>
          </div>

          {isIncoming && (
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition transform hover:scale-105" onClick={handleAccept}>
              <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-xl shadow-lg shadow-green-500/30 animate-bounce">
                {activeCallDetail?.callType === 'VIDEO' ? <BsCameraVideoFill /> : <BsTelephoneFill />}
              </div>
              <span className="text-xs font-medium text-green-500">ACCEPT</span>
            </div>
          )}
        </div>
        
        <button className="absolute bottom-4 bg-white/80 backdrop-blur text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-white transition" onClick={() => setCallState("IDLE")}>
          <BsChatSquareText /> Messages
        </button>
      </div>
    );
    
    return mounted && document.body ? createPortal(overlayContent, document.body) : null;
  }

  return null;
};

export default CallHandler;
