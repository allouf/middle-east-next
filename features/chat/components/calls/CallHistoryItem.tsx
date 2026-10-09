"use client";

import React from "react";
import { BsArrowUpRight, BsArrowDownLeft, BsTelephoneX } from "react-icons/bs";
import { useChatStore } from "../../store/useChatStore";
import { CallEntity } from "../../types";

interface CallHistoryItemProps {
  call: CallEntity;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({ call }) => {
  const { selectedCall, setSelectedCall } = useChatStore();
  const isActive = selectedCall?.id === call.id;

  const renderIcon = () => {
    switch (call.direction) {
      case "OUTGOING":
        return <BsArrowUpRight className="text-green-500 mr-1" />;
      case "INCOMING":
        return <BsArrowDownLeft className="text-green-500 mr-1" />;
      case "MISSED":
        return <BsTelephoneX className="text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  const getSubtext = () => {
    const directionText = call.direction === "MISSED" ? "Missed call" : call.direction === "OUTGOING" ? "Outgoing" : "Incoming";
    const durationText = call.duration ? `, ${call.duration}` : "";
    return (
      <span className={`text-xs ${call.direction === 'MISSED' ? 'text-red-500' : 'text-gray-500'} flex items-center`}>
        {renderIcon()} {directionText}{durationText}
      </span>
    );
  };

  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer rounded-lg mb-1 transition-colors ${
        isActive ? "bg-[#f0f9f5] border border-green-100" : "hover:bg-gray-50"
      }`}
      onClick={() => setSelectedCall(call)}
    >
      <div className="flex items-center gap-3 relative w-full">
        <div className="relative">
          <img
            src={call.photo || "/ReferralImage.png"}
            alt={call.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {isActive && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center h-full gap-1 pt-1">
          <div className="flex justify-between items-center w-full">
            <h4 className="text-sm font-semibold text-gray-800 truncate leading-none">
              {call.name}
            </h4>
            <span className="text-[10px] text-gray-400 whitespace-nowrap leading-none">
              {call.timestamp}
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
             <div className="text-xs truncate w-[130px] leading-none">
               {getSubtext()}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallHistoryItem;
