"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "@/lib/i18n/useTranslation";
import OrderCard from './OrderCard';
import { useOrderList } from '../../hooks/Orders/useOrderList';
import { Loader2 } from 'lucide-react';

const index = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<string>('all');
  
  const { 
    orders, 
    loading, 
    error, 
    hasNextPage, 
    loadMore, 
    updateFilters,
    refetch 
  } = useOrderList({
    initialFilters: { status: undefined }
  });

  const tabs = [
    { label: t('orders.tabs.all', { defaultValue: 'All' }), value: 'all' },
    { label: t('orders.tabs.pending', { defaultValue: 'Pending' }), value: 'PENDING' },
    { label: t('orders.tabs.in_progress', { defaultValue: 'In Progress' }), value: 'IN_PROGRESS' },
    { label: t('orders.tabs.delivered', { defaultValue: 'Delivered' }), value: 'DELIVERED' },
    { label: t('orders.tabs.completed', { defaultValue: 'Completed' }), value: 'COMPLETED' },
    { label: t('orders.tabs.cancelled', { defaultValue: 'Cancelled' }), value: 'CANCELLED' },
  ];

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    const status = value === 'all' 
      ? undefined 
      : value 
    updateFilters({ status });
  };

  console.log(
    "Orders", orders
  )

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 relative">
            <div className="w-1.5 h-6 bg-blueSite rounded-full absolute -left-1"></div>
            <h1 className="text-xl md:text-[28px] font-bold text-[#1A1A1A] pl-3">
              {t('orders.pageTitle', { defaultValue: 'Order History' })}
            </h1>
          </div>
          <p className="text-[16px] text-gray-500 mt-2 pl-3">
            {t('orders.pageSubtitle', { defaultValue: 'Track all your transactions and purchased services in one place' })}
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 hide-scrollbar w-full lg:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-6 py-1 rounded-lg text-[14px] font-bold transition-all duration-200 whitespace-nowrap border ${
                selectedTab === tab.value
                  ? "bg-blueSite text-white border-blueSite shadow-sm"
                  : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-blueSite/30 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex flex-col min-h-[400px]">
        {loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blueSite animate-spin mb-4" />
            <p className="text-gray-500">{t('common.loading', { defaultValue: 'Loading orders...' })}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-dashed border-red-200">
            <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
            <button 
              onClick={refetch}
              className="px-6 py-2 bg-blueSite text-white rounded-lg font-bold"
            >
              {t('common.retry', { defaultValue: 'Retry' })}
            </button>
          </div>
        ) : orders.length > 0 ? (
          <>
            <div className="flex flex-col">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} refetchList={refetch}/>
              ))}
            </div>
            
            {hasNextPage && (
              <div className="flex justify-center mt-8 mb-12">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white border border-[#E2E8F0] text-blueSite font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('orders.loadMore', { defaultValue: 'Load More Orders' })}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-[#F8FAFC]/50 rounded-[24px] border border-dashed border-[#E2E8F0]">
            <div className="relative w-48 h-48 mb-8 opacity-80">
              <Image
                src="/empty.svg"
                alt="No orders"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              {selectedTab === 'all' 
                ? t('orders.empty.title', { defaultValue: 'No Orders Yet' })
                : t('orders.filteredEmpty.title', { 
                    defaultValue: `No ${selectedTab.replace('_', ' ')} orders found`,
                    status: selectedTab 
                  })
              }
            </h3>
            <p className="text-[#64748B] text-center max-w-md mb-10 leading-relaxed px-6">
              {selectedTab === 'all'
                ? t('orders.empty.subtitle', { defaultValue: "Looks like you haven't received any orders in the service market yet." })
                : t('orders.filteredEmpty.subtitle', { defaultValue: `We couldn't find any orders with the status '${selectedTab.replace('_', ' ')}'. Try checking another category.` })
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
