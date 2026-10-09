"use client";

import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useChatStore } from "../../store/useChatStore";
import CallHistoryItem from "./CallHistoryItem";
import { CallEntity } from "../../types";
import { chatApi } from "../../api/chatApi";



const CallSidebar: React.FC = () => {
  const { callFilter, setCallFilter, searchQuery, setSearchQuery, selectedCall, setSelectedCall } = useChatStore();

  const [calls, setCalls] = useState<CallEntity[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        const response = await chatApi.getCallHistory(1, 50);
        const rawData = (response.data as any)?.data?.data || [];
        const mappedCalls: CallEntity[] = rawData.map((call: any) => ({
          id: String(call.id),
          name: call.peerUser?.name || "Unknown",
          photo: call.peerUser?.photo || null,
          type: call.callType === "VIDEO" ? "VIDEO" : "AUDIO",
          status: "IDLE",
          direction: call.duration === 0 ? "MISSED" : "OUTGOING",
          timestamp: new Date(call.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          duration: call.duration ? (call.duration >= 60 ? `${Math.floor(call.duration / 60)} min` : `${call.duration} sec`) : undefined,
          email: call.peerUser?.email,
          phone: call.peerUser?.phone,
        }));
        
        setCalls(mappedCalls);
        if (!selectedCall && mappedCalls.length > 0) {
          setSelectedCall(mappedCalls[0]);
        }
      } catch (error) {
        console.error("Failed to fetch call history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, []);

  const filters = [
    { id: "all", label: "All" },
    { id: "missed", label: "Missed" },
    { id: "outgoing", label: "Outgoing" },
  ];

  const filteredCalls = calls.filter(call => {
    // text search
    if (searchQuery && !call.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // tab filter
    if (callFilter === "missed" && call.direction !== "MISSED") return false;
    if (callFilter === "outgoing" && call.direction !== "OUTGOING") return false;
    
    return true;
  });

  return (
    <div className="chat-sidebar bg-white border-r border-gray-100 flex flex-col w-[320px] h-full relative z-10">
      <div className="p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800 m-0">Calls</h2>
        
        <div className="relative">
          <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full bg-[#f5f7f9] text-sm text-gray-700 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search recent calls"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex bg-[#f5f7f9] rounded-lg p-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
                callFilter === filter.id 
                  ? "bg-white text-gray-800 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setCallFilter(filter.id as any)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between items-center px-1">
          <span className="text-sm font-semibold text-gray-800">Call History</span>
          <button className="text-xs text-red-500 hover:text-red-600 font-medium cursor-pointer">
            Clear History
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {filteredCalls.map((call) => (
          <CallHistoryItem key={call.id} call={call} />
        ))}
        {loading ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            Loading...
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No calls found
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CallSidebar;
