import React from 'react';
import { Calendar } from 'lucide-react';

const ResolutionReportCard = ({ dispute }: { dispute?: any }) => {
  if (!dispute) return null;

  return (
    <div className="flex flex-col rounded-[20px] bg-[#FAFAFA] border border-gray-100 p-6 shadow-sm h-fit">
      <h3 className="text-[20px] font-bold text-subTitleColor mb-6">Resolution Report</h3>

      <div className="flex flex-col gap-6">
        {/* DISPUTE REASON */}
        <div className="flex flex-col gap-3 w-full">
          <h4 className="text-[12px] font-bold text-subTitleColor uppercase tracking-wide">
            DISPUTE REASON
          </h4>
          <div className="flex flex-col border border-gray-200 rounded-[12px] bg-white overflow-hidden shadow-sm border-s-4 border-s-blueSite">
            <div className="p-4 border-b border-gray-100">
               <span className="text-[14px] text-subTitleColor font-medium">{dispute.reason?.name || "Reason not specified"}</span>
            </div>
            <div className="p-4 bg-white">
              <p className="text-[13px] text-textGrayColor leading-relaxed whitespace-pre-wrap">
                {dispute.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        {/* Closure Date (Only show if resolved) */}
        {dispute.resolved_at && (
          <div className="flex items-center gap-4 p-3 rounded-[12px] w-fit mt-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center ">
              <Calendar className="w-5 h-5 text-subTitleColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-textGrayColor font-semibold mb-0.5">Closure Date</span>
              <span className="text-[16px] font-bold text-blueSite">
                {new Date(dispute.resolved_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full mt-2 py-3 rounded-[8px] bg-blueSite hover:bg-[#005240] text-white font-bold text-[14px] transition-colors shadow-sm">
          Contact Support Team
        </button>
      </div>
    </div>
  );
};
export default ResolutionReportCard;
