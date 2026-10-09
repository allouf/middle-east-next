"use client";

import React, { useEffect } from "react";
import { 
  BsTelephone, 
  BsCameraVideo, 
  BsThreeDots, 
  BsArrowUpRight, 
  BsArrowDownLeft, 
  BsTelephoneX,
  BsInfoCircle,
  BsMic,
  BsMicMute,
  BsVolumeUp,
  BsChatSquareText,
  BsPersonPlus,
  BsTelephoneFill
} from "react-icons/bs";
import { useChatStore } from "../../store/useChatStore";

const CallArea: React.FC = () => {
  const { selectedCall, callState, setCallState } = useChatStore();

  if (!selectedCall) {
    return (
      <div className="flex-1 bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-gray-400">Select a call from the history</div>
      </div>
    );
  }

  // --- RENDERING HELPERS ---

  const renderIdleState = () => (
    <div className="flex-1 bg-white overflow-y-auto relative flex flex-col items-center py-12">
      <div className="w-full max-w-2xl px-8 flex flex-col items-center m-auto">
        
        {/* Profile Info */}
        <div className="flex flex-col items-center mb-8 relative">
           <div className="relative">
             <img src={selectedCall.photo || "/ReferralImage.png"} alt={selectedCall.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
             <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
           </div>
           <h2 className="text-2xl font-bold text-gray-800 mt-4">{selectedCall.name}</h2>
           <p className="text-sm text-gray-500 mt-1">{selectedCall.role || "Online"}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <button 
            className="flex items-center gap-2 bg-[#0d5e3d] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-opacity-90 transition"
            onClick={() => setCallState('RINGING')}
          >
            <BsTelephone /> Call Back
          </button>
          <button 
            className="flex items-center gap-2 bg-[#e6efeb] text-[#0d5e3d] px-6 py-2.5 rounded-lg font-medium hover:bg-[#d0e4d9] transition"
            onClick={() => setCallState('RINGING')}
          >
            <BsCameraVideo /> Video Call
          </button>
          <button className="flex items-center justify-center bg-gray-100 text-gray-600 w-11 h-11 rounded-lg hover:bg-gray-200 transition">
            <BsThreeDots />
          </button>
        </div>

        {/* Call History Details */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Call History</h3>
            <button className="text-xs text-red-500 cursor-pointer">Clear History</button>
          </div>
          
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between items-center py-2 text-gray-600 border-b border-gray-50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                   <BsTelephoneX />
                 </div>
                 <div className="flex flex-col">
                   <span className="font-medium text-gray-800">Missed Video Call</span>
                   <span className="text-xs text-gray-400">12:42 PM</span>
                 </div>
              </div>
              <span className="text-xs text-gray-400">No duration</span>
            </div>
            <div className="flex justify-between items-center py-2 text-gray-600 border-b border-gray-50">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                   <BsArrowDownLeft />
                 </div>
                 <div className="flex flex-col">
                   <span className="font-medium text-gray-800">Incoming Audio Call</span>
                   <span className="text-xs text-gray-400">10:15 AM</span>
                 </div>
              </div>
              <span className="text-xs text-gray-500">4 min 12 sec</span>
            </div>
            <div className="flex justify-between items-center py-2 text-gray-600">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                   <BsArrowUpRight />
                 </div>
                 <div className="flex flex-col">
                   <span className="font-medium text-gray-800">Outgoing Audio Call</span>
                   <span className="text-xs text-gray-400">09:02 AM</span>
                 </div>
              </div>
              <span className="text-xs text-gray-500">15 min 45 sec</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="w-full bg-[#f8f9fa] rounded-xl p-5 border border-gray-100">
           <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-4">
             <BsInfoCircle className="text-primary" /> Contact Information
           </div>
           <div className="flex justify-between text-sm">
             <div>
               <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Email</div>
               <div className="font-medium text-gray-800">{selectedCall.email || "N/A"}</div>
             </div>
             <div>
               <div className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Phone</div>
               <div className="font-medium text-gray-800">{selectedCall.phone || "N/A"}</div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );

  const renderRingingState = () => (
    <div className="flex-1 relative overflow-hidden bg-gray-900 flex flex-col items-center justify-center">
      {/* Blurred background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
        style={{ backgroundImage: `url(${selectedCall.photo || "/ReferralImage.png"})` }}
      />
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Top Banner */}
      <div className="absolute top-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-medium z-10">
        <BsTelephone /> END-TO-END ENCRYPTED
      </div>

      <div className="relative z-10 flex flex-col items-center mt-[-40px]">
        <div className="relative mb-6">
           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
             <img src={selectedCall.photo || "/ReferralImage.png"} alt={selectedCall.name} className="w-full h-full object-cover" />
           </div>
           {/* Ringing animation rings */}
           <div className="absolute inset-0 rounded-full border border-white/30 animate-ping" style={{ animationDuration: '2s' }}></div>
           <div className="absolute inset-[-15px] rounded-full border border-white/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">{selectedCall.name}</h2>
        <div className="flex items-center gap-2 text-green-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          Ringing...
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-16 bg-white/90 backdrop-blur-lg px-8 py-4 rounded-3xl flex items-center gap-8 shadow-2xl z-10">
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
        
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => setCallState('ENDED')}>
          <div className="w-12 h-12 rounded-full bg-red-500 text-white flex items-center justify-center text-xl shadow-lg shadow-red-500/30">
            <BsTelephoneX />
          </div>
          <span className="text-xs font-medium text-red-500">DECLINE</span>
        </div>
      </div>
      
      {/* Mock Accept Button for demo purposes since we are simulating outgoing mostly */}
      <div className="absolute bottom-16 right-10">
        <button className="bg-green-500 text-white px-4 py-2 rounded shadow text-sm" onClick={() => setCallState('ACTIVE')}>
          (Mock Accept)
        </button>
      </div>

      <button className="absolute bottom-4 bg-white/80 backdrop-blur text-gray-700 px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
        <BsChatSquareText /> Messages
      </button>
    </div>
  );

  const renderActiveState = () => (
    <div className="flex-1 bg-white relative flex flex-col p-4">
      {/* Header Info */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
         <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
           <BsCameraVideo />
         </div>
         <div>
           <div className="font-bold text-gray-800">Call with {selectedCall.name}</div>
           <div className="text-xs text-green-600 font-medium flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 08:42 • SECURE CONNECTION
           </div>
         </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-[#e8eef3] rounded-3xl mt-16 mb-4 relative overflow-hidden flex items-center justify-center border border-gray-200">
         
         {/* Simulate Avatar when camera is off */}
         <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-white shadow-md relative">
              <img src={selectedCall.photo || "/ReferralImage.png"} alt={selectedCall.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-1 right-1 bg-gray-800 text-white rounded-full p-1 border-2 border-white">
                 <BsCameraVideo className="text-xs" style={{ textDecoration: "line-through" }} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-4">{selectedCall.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Camera is currently off</p>
         </div>

         {/* Self View Picture in Picture */}
         <div className="absolute bottom-6 right-6 w-48 h-32 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-white flex items-center justify-center">
            <BsPersonPlus className="text-gray-500 text-3xl" />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">YOU</div>
         </div>
      </div>

      {/* Controls Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-2xl flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 z-10">
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition">
            <BsMic />
          </div>
          <span className="text-[10px] font-medium text-gray-500">MUTE</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition relative">
             <BsCameraVideo />
             <div className="absolute w-[2px] h-5 bg-red-500 rotate-45"></div> {/* Mock line-through */}
          </div>
          <span className="text-[10px] font-medium text-red-500">CAMERA OFF</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition">
            <BsChatSquareText />
          </div>
          <span className="text-[10px] font-medium text-gray-500">CHAT</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition">
            <BsThreeDots />
          </div>
          <span className="text-[10px] font-medium text-gray-500">MORE</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-gray-200 transition">
            <BsPersonPlus />
          </div>
          <span className="text-[10px] font-medium text-gray-500">ADD</span>
        </div>
        <div className="flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => setCallState('ENDED')}>
          <div className="w-12 h-10 rounded-full bg-[#0d5e3d] text-white flex items-center justify-center hover:bg-opacity-90 transition px-6">
            <BsTelephoneFill className="rotate-[135deg]" />
          </div>
          <span className="text-[10px] font-bold text-[#0d5e3d]">LEAVE</span>
        </div>
      </div>
    </div>
  );

  const renderEndedState = () => (
    <div className="flex-1 bg-[#f8f9fa] overflow-y-auto flex flex-col items-center py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8 flex flex-col items-center text-center m-auto">
         
         <div className="w-full flex items-center justify-center gap-2 text-[#0d5e3d] font-semibold text-sm pb-6 border-b border-gray-100 mb-6">
           <BsTelephoneFill className="rotate-[135deg] text-xs" /> Call Ended
         </div>

         <div className="relative mb-4">
           <img src={selectedCall.photo || "/ReferralImage.png"} alt={selectedCall.name} className="w-20 h-20 rounded-full object-cover border-2 border-gray-100" />
           <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#0d5e3d] text-white rounded-full flex items-center justify-center border-2 border-white">
             <BsTelephone className="text-[10px]" />
           </div>
         </div>

         <h2 className="text-xl font-bold text-gray-800">{selectedCall.name}</h2>
         <div className="text-sm font-medium text-[#0d5e3d] mt-1 mb-6">Call duration: 12:45</div>

         <p className="text-sm text-gray-500 mb-8 px-4">
           The call has ended successfully. Would you like to reach back out or return to your dashboard?
         </p>

         <div className="w-full flex flex-col gap-3">
           <button 
             className="w-full bg-[#0d5e3d] text-white py-3 rounded-lg font-medium hover:bg-opacity-90 transition flex items-center justify-center gap-2"
             onClick={() => setCallState('RINGING')}
           >
             <BsTelephone /> Call back
           </button>
           <button 
             className="w-full bg-[#e6efeb] text-[#0d5e3d] py-3 rounded-lg font-medium hover:bg-[#d0e4d9] transition"
             onClick={() => setCallState('IDLE')}
           >
             Close
           </button>
         </div>

         <div className="w-full flex justify-between px-8 mt-8 pt-6 border-t border-gray-100">
           <div className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-primary cursor-pointer transition">
             <BsChatSquareText className="text-lg" />
             <span className="text-[10px] font-bold tracking-wider">MESSAGE</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-primary cursor-pointer transition">
             <BsCameraVideo className="text-lg" />
             <span className="text-[10px] font-bold tracking-wider">VIDEO</span>
           </div>
           <div className="flex flex-col items-center gap-1.5 text-gray-500 hover:text-primary cursor-pointer transition">
             <BsPersonPlus className="text-lg" />
             <span className="text-[10px] font-bold tracking-wider">CONTACT</span>
           </div>
         </div>

         <div className="w-full mt-6 bg-gray-50 rounded-lg p-4 flex justify-between items-center text-sm border border-gray-100">
           <div>
             <div className="text-[10px] font-bold text-gray-400 tracking-wider mb-0.5">CALL SUMMARY</div>
             <div className="text-gray-600 font-medium">Time Started</div>
           </div>
           <div className="font-semibold text-gray-800">10:20 AM</div>
         </div>

      </div>
    </div>
  );

  switch (callState) {
    case 'ACTIVE': return renderActiveState();
    case 'ENDED': return renderEndedState();
    case 'RINGING':
    case 'IDLE':
    default: return renderIdleState();
  }
};

export default CallArea;
