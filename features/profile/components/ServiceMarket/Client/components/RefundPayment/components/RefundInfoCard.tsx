"use client";

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import ChangePaymentModal from './modals/ChangePaymentModal';

const RefundInfoCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col rounded-[20px] bg-[#FAFAFA] border border-[#E2E8F0] overflow-hidden mb-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row p-5 gap-3 justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#15803D1A] flex items-center justify-center flex-shrink-0">
             <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M9 15L10.4 13.6L8.825 12H13V10H8.825L10.4 8.4L9 7L5 11L9 15ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM9 3.25C9.21667 3.25 9.39583 3.17917 9.5375 3.0375C9.67917 2.89583 9.75 2.71667 9.75 2.5C9.75 2.28333 9.67917 2.10417 9.5375 1.9625C9.39583 1.82083 9.21667 1.75 9 1.75C8.78333 1.75 8.60417 1.82083 8.4625 1.9625C8.32083 2.10417 8.25 2.28333 8.25 2.5C8.25 2.71667 8.32083 2.89583 8.4625 3.0375C8.60417 3.17917 8.78333 3.25 9 3.25Z" fill="#00664F"/>
             </svg>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-[18px] 2xl:text-[20px] font-bold text-subTitleColor">
                Refund Payment
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#DC262633] text-[#DC2626] uppercase tracking-wider">
                REASON HERE
              </span>
            </div>
            <p className="text-[14px] text-textGrayColor">
              Canceled By <span className="font-bold text-subTitleColor">Bilal Mardine</span> On 21 Oct 2026
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 text-[14px] font-bold text-blueSite hover:underline mt-2 md:mt-0">
          View Original Order
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#F4F4F4] px-5 py-4 flex justify-between items-center border-t border-gray-100/60">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] text-textGrayColor">Return Destination</span>
          <div className="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 12V6.75H3.75V12H2.25ZM6.75 12V6.75H8.25V12H6.75ZM0 15V13.5H15V15H0ZM11.25 12V6.75H12.75V12H11.25ZM0 5.25V3.75L7.5 0L15 3.75V5.25H0ZM3.3375 3.75H7.5H11.6625H3.3375ZM3.3375 3.75H11.6625L7.5 1.6875L3.3375 3.75Z" fill="#191C1C"/>
            </svg>
            <span className="text-[14px] font-bold text-subTitleColor">Visa ending in 4242</span>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-[14px] font-bold text-blueSite hover:underline"
        >
          Change
        </button>
      </div>

      <ChangePaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default RefundInfoCard;
