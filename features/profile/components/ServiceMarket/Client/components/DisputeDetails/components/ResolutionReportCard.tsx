import React from 'react';
import { Calendar } from 'lucide-react';

const ResolutionReportCard = () => {
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
               <span className="text-[14px] text-subTitleColor font-medium">Primary reason goes here</span>
            </div>
            <div className="p-4 bg-white">
              <p className="text-[13px] text-textGrayColor  leading-relaxed">
                "The council determines that while significant professional value was transferred in the initial phases, the failure to deliver the core analytic framework justifies a 50% reduction in the total contract value. Both parties are encouraged to review the updated communication protocols to prevent future escrow delays."
              </p>
            </div>
          </div>
        </div>

        {/* ADJUDICATION SUMMARY */}
        <div className="flex flex-col gap-3 w-full">
          <h4 className="text-[14px] font-bold text-subTitleColor uppercase tracking-wide">
            ADJUDICATION SUMMARY
          </h4>
          <div className="p-4 border border-gray-200 rounded-[12px] bg-white shadow-sm">
            <p className="text-[13px] text-textGrayColor leading-relaxed font-light">
              Following a thorough review of the artifacts provided by the Client and the partial deliverables submitted by Dr. Abernathy, the arbitration council has reached a final determination. The dispute was centered on the delivery of the 'Advanced Clinical Strategy Review,' specifically the omission of the Phase III Diagnostic Framework.
            </p>
          </div>
        </div>

        {/* ADMINISTRATIVE ACTION */}
        <div className="flex flex-col gap-3 w-full">
          <h4 className="text-[12px] font-bold text-subTitleColor uppercase tracking-wide">
            ADMINISTRATIVE ACTION
          </h4>
          <div className="p-4 border border-gray-200 rounded-[12px] bg-white shadow-sm">
            <p className="text-[13px] text-textGrayColor leading-relaxed font-light">
              The Emerald Counsel finance team has initiated the split disbursement. Funds should be visible in respective accounts within 3-5 business days. This case is now considered closed and archived.
            </p>
          </div>
        </div>

        {/* Closure Date */}
        <div className="flex items-center gap-4  p-3 rounded-[12px]  w-fit mt-2">
          <div className="w-10 h-10 rounded-lg  flex items-center justify-center ">
            <Calendar className="w-5 h-5 text-subTitleColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-textGrayColor font-semibold mb-0.5">Closure Date</span>
            <span className="text-[16px] font-bold text-blueSite">October 24, 2024</span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-2 py-3 rounded-[8px] bg-blueSite hover:bg-[#005240] text-white font-bold text-[14px] transition-colors shadow-sm">
          Contact Support Team
        </button>
      </div>
    </div>
  );
};
export default ResolutionReportCard;
