"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { HelpCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import OrderSummaryCard from './components/OrderSummaryCard';
import ProviderCard from './components/ProviderCard';

import RevisionStatusCard from './components/RevisionStatusCard';
import RevisionDetailsCard from './components/RevisionDetailsCard';
import BeforeSubmitCard from './components/BeforeSubmitCard';
import SubmitRevisionSuccess from './Modals/SubmitRevisionSuccess';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { adaptApiOrder } from '../OrderDetails';

const OrderRevisionPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const orderId = searchParams.get('orderId') ?? undefined;

  // Form State - Must be before early returns
  const [requestType, setRequestType] = useState('STANDARD');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<any[]>([]);

  const {
    orderDetails: apiOrder,
    loading,
    error,
    refetch,
    cancelOrder,
    isCancelling,
    requestRevision,
    isRequestingRevision
  } = useOrderDetails({ orderId, autoFetch: true });
  
  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'service_market');
    params.set('subTab', 'my_order_customer');
    router.push(`?${params.toString()}`);
  };
  

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-blueSite animate-spin mb-4" />
        <p className="text-[#64748B] font-medium">
          {t('orderDetails.loading', { defaultValue: 'Loading order details…' })}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-[#DC2626] font-semibold text-lg">{error}</p>
        <button
          onClick={refetch}
          className="px-8 py-3 bg-blueSite text-white rounded-xl font-bold hover:bg-blueSiteHover transition-colors"
        >
          {t('common.retry', { defaultValue: 'Retry' })}
        </button>
      </div>
    );
  }

  if (!apiOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <AlertCircle className="w-12 h-12 text-gray-300" />
        <p className="text-[#64748B] font-medium">
          {t('orderDetails.notFound', { defaultValue: 'Order not found.' })}
        </p>
        <button
          onClick={handleBack}
          className="px-8 py-3 bg-blueSite text-white rounded-xl font-bold hover:bg-blueSiteHover transition-colors"
        >
          {t('orderDetails.goBack', { defaultValue: 'Go Back' })}
        </button>
      </div>
    );
  }

  console.log("order Details",apiOrder)
  // Dev Only: Using mock data matching the screenshot
  const order =  adaptApiOrder(apiOrder as any) ; // We use completed because revision typically happens when a delivery is made

  const handleSubmitRequest = async () => {
    // Basic validation
    if (!notes.trim()) {
      return; // Could show toast error here
    }

    // Get the active delivery version (assuming the first/only delivery is the active one)
    const deliveryVersion = apiOrder?.deliveries?.[0]?.version || 1;

    const actualFiles = files.map(f => f.file || f).filter(f => f instanceof File);

    const success = await requestRevision({
      delivery_version: deliveryVersion,
      notes: notes,
      request_type: requestType,
      attachments: actualFiles.length > 0 ? actualFiles : undefined,
    });

    if (success) {
      setIsSuccessModalOpen(true);
    }
  };

  const handleOrderClick = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', 'service_market');
      params.set('subTab', 'order_details_consumer');
      params.set('orderId', String(order.id));
      router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col gap-6 w-full mb-8">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-blueSite font-bold hover:text-blueSiteHover transition-colors w-max uppercase text-[20px]"
        >
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
          {t('orderDetails.goBack', { defaultValue: 'GO BACK' })}
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 w-full">
          {/* Title and subtitle */}
          <div className="flex flex-col gap-2 max-w-[600px]">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-blueSite shrink-0 w-1.5 h-8 bg-blueSite rounded-full mr-2"></span>
              <h1 className="text-[24px] md:text-[28px] font-bold text-subTitleColor m-0">
                {t('orderRevision.title', { defaultValue: 'Request Revision - Order' })} #{order.id}
              </h1>
            </div>
            
            <p className="text-[15px] text-textGrayColor ml-2 md:ml-10 leading-relaxed max-w-[450px]">
              {t('orderRevision.subtitle', { 
                defaultValue: 'Provide specific feedback to help the professional finalize your delivery to your exact needs.' 
              })}
            </p>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3 self-start">
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#CCE0DC] bg-white text-subTitleColor hover:bg-gray-50 font-bold text-[14px] transition-colors shadow-sm">
              <HelpCircle className="w-4 h-4 text-gray-400" />
              {t('orderDetails.fileDispute', { defaultValue: 'File Dispute' })}
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blueSite hover:bg-blueSiteHover text-white font-bold text-[14px] transition-colors shadow-sm">
              <MessageSquareIcon className="w-4 h-4" />
              {t('orderDetails.messageProvider', { defaultValue: 'Message Provider' })}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col w-full h-full">
          <RevisionStatusCard order={order} />
          <RevisionDetailsCard 
             requestType={requestType}
             setRequestType={setRequestType}
             notes={notes}
             setNotes={setNotes}
             files={files}
             setFiles={setFiles}
          />

          {/* Bottom Submit Action */}
          <div className="mt-4">
            <button 
              onClick={handleSubmitRequest}
              disabled={isRequestingRevision || !notes.trim()}
              className="px-6 py-3 rounded-[8px] bg-blueSite text-white text-[15px] font-bold hover:bg-blueSiteHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRequestingRevision && <Loader2 className="w-4 h-4 animate-spin" />}
              {t('orderRevision.submitRequest', { defaultValue: 'Submit Revision Request' })}
            </button>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          {/* Note: In full implementation, we might pass a custom status or modifier to OrderSummary */}
          <OrderSummaryCard order={order} />
          <ProviderCard order={order} />
          <BeforeSubmitCard />
        </div>

      </div>

      <SubmitRevisionSuccess 
        isOpen={isSuccessModalOpen} 
        onClose={() =>{ 
          handleOrderClick()
          setIsSuccessModalOpen(false)

        }} 
      />
    </div>
  );
};

// Local inline helper icon
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default OrderRevisionPage;
