import React from 'react';
import { ClipboardList } from 'lucide-react';

const DisputeRequestCard = ({ dispute }: { dispute?: any }) => {
  if (!dispute) return null;

  const creatorName = dispute.opened_by === 'provider' 
    ? dispute.provider?.name 
    : dispute.buyer?.name || "Unknown";

  const requestedOn = dispute.requested_on || (dispute.frozen_at ? new Date(dispute.frozen_at).toLocaleDateString() : "N/A");

  return (
    <div className="flex items-center gap-4 bg-[#FAFAFA] rounded-[16px] p-4 border border-gray-100 shadow-sm w-full">
      <div className="w-10 h-10 rounded-[12px] bg-[#15803D1A] flex items-center justify-center flex-shrink-0">
        <ClipboardList className="w-6 h-6 text-blueSite" />
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#1F2937]">Dispute Request</h3>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F3F4F6] text-gray-500 border border-gray-200 uppercase tracking-wide">
            {dispute.status}
          </span>
        </div>
        
        <div className="text-[13px] text-gray-500 flex flex-wrap gap-1 items-center mt-0.5">
          <span>Created By</span>
          <span className="font-bold text-[#1F2937]">{creatorName},</span>
          <span className="ml-1">Requested on</span>
          <span className="font-bold text-[#1F2937]">{requestedOn}</span>
        </div>
      </div>
    </div>
  );
};

export default DisputeRequestCard;
