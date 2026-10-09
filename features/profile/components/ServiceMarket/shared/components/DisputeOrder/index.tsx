"use client";

import React, { useState } from "react";
import DisputeTable from "./components/DisputeTable";
import DisputeModal from "./modal/DisputeModal";
import { Plus, RefreshCw, AlertCircle } from "lucide-react";
import { useDisputes } from "../../hooks/Disputes/useDisputes";
import Pagination from "@/components/ui/Pagination";

const DisputeOrderPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { disputes, meta, currentPage, handlePageChange, loadingList, error } = useDisputes({
    autoFetchList: true,
  });

  const formattedDisputes = disputes?.map((d: any) => {
    const isMeProvider = d.my_role === 'provider';
    const isMeCustomer = d.my_role === 'buyer' || d.my_role === 'client' || d.my_role === 'customer';

    const providerName = isMeProvider ? 'Me' : (d.provider?.name || 'N/A');
    const customerName = isMeCustomer ? 'Me' : (d.customer?.name || d.buyer?.name || 'N/A');

    let openedAgainst = 'N/A';
    if (d.opened_against_me) {
      openedAgainst = 'Me';
    } else if (d.opened_against_me === false) {
      openedAgainst = isMeProvider ? 'Customer' : 'Provider';
    }

    return {
      key: d.id.toString(),
      id: d.order_number,
      reason: d.reason?.name || "N/A",
      provider: providerName,
      customer: customerName,
      opened_against: openedAgainst,
      deadline: d.deadline ? new Date(d.deadline).toLocaleDateString() : "N/A",
      escrow: d.escrow ? `${d.escrow.amount} ${d.escrow.currency}` : "N/A",
      opened_by: d.opened_by || "N/A",
      status: d.status,
    };
  }) || [];

  console.log("Provider Disputes", disputes)
  console.log("Provider Disputes", disputes)


  return (
    <div className="w-full flex md:max-w-6xl flex-col gap-6 font-sans mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-blueSite rounded-full"></div>
          <h1 className="text-[20px] md:text-[24px] font-semibold text-[#1F2937]">My Disputes</h1>
        </div>

      
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} className="shrink-0" />
          <div className="flex flex-col">
            <p className="text-sm font-bold">Error loading disputes</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-[#00664F33] overflow-hidden mb-6">
        {/* Table Section */}
        <div className="w-full">
          <DisputeTable 
            data={formattedDisputes} 
            loading={loadingList} 
            pagination={false}
          />
        </div>
      </div>

      {meta && (
        <div className="flex justify-center mb-6">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(meta.total / meta.per_page)}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <DisputeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(reason, explanation) => {
          console.log("Dispute Request Submitted", { reason, explanation });
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default DisputeOrderPage;
