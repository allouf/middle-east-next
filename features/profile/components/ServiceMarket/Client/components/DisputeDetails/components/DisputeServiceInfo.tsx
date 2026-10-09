import React from 'react';
import { CiCalendar } from "react-icons/ci";
import { BsBox2 } from "react-icons/bs";
import { Folder } from 'lucide-react';

const DisputeServiceInfo = () => {
  return (
    <div className="flex flex-col rounded-[16px] bg-[#FAFAFA] overflow-hidden  gap-4 border border-gray-100 shadow-sm">
      <div className='p-6'>
      <div className="flex flex-col gap-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E6F4EA] text-[#00664F] w-fit">
          Graphic design
        </span>
        <h2 className="text-[20px] font-bold text-[#1F2937]">
          Professional logo design for startups with a complete visual identity.
        </h2>
      </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 mt-2 text-[14px] bg-[#F4F4F4] p-6">
        <div className="flex items-center gap-2">
          <BsBox2 className="w-[18px] h-[18px] text-[#00664F]" />
          <span className="text-gray-500">Delivery Model:</span>
          <span className="font-bold text-[#1F2937]">REMOTE</span>
        </div>
        <div className="flex items-center gap-2">
          <CiCalendar className="w-5 h-5 text-[#00664F]" />
          <span className="text-gray-500">Deadline:</span>
          <span className="font-bold text-[#1F2937]">Oct 24, 2023 .</span>
        </div>
        <div className="flex items-center gap-2">
          <Folder className="w-[18px] h-[18px] text-[#00664F]" />
          <span className="text-gray-500">Budget</span>
          <span className="font-bold text-[#00664F]">40.00$</span>
        </div>
      </div>
    </div>
  );
};

export default DisputeServiceInfo;
