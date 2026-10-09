"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';

const NeedHelpCard: React.FC = () => {

  return (
    <div className="rounded-[16px] overflow-hidden mb-6 shadow-sm" style={{ backgroundColor: '#2A110F' }}>
      <div className="p-6">
        <h3 className="text-[16px] font-bold text-[#FFFFFF] mb-2">
          Need Help?
        </h3>
        
        <p className="text-[12px] text-[#94A3B8] leading-relaxed mb-6 pr-6">
          If you have any issues with this order, our support team is available 24/7.
        </p>

        <button className="flex items-center gap-2 text-[#EC5B13] font-bold text-[14px] hover:text-[#ff7430] transition-colors group">
          Contact Support
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:-scale-x-100 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default NeedHelpCard;
