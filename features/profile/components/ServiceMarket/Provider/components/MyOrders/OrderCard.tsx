"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { OrderHistoryItemType, OrderStatus } from '../../types/provider.types';
import { Clock, CheckCircle, AlertCircle, XCircle, RotateCcw, Play, Send, RefreshCwIcon, Lock } from 'lucide-react';
import { PiCoinsThin } from 'react-icons/pi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderDetails } from '../../hooks/Orders/useOrderDetails';
import RejectModal from '../OrderDetails/Modals/RejectModal';
import { parseBackendDate } from '@/lib/utils/format';

interface OrderCardProps {
  order: OrderHistoryItemType;
  refetchList?:()=>void
}

const OrderCard = ({ order,refetchList }: OrderCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);

  const { confirmOrder, rejectOrder, isConfirming, isRejecting ,refetch} = useOrderDetails({
    orderId: order.id,
    autoFetch: false
  });

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return '';
    // Use utility to parse GMT date and convert to local time
    const date = parseBackendDate(dateString); 
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} ${days === 1 ? t('common.time.day', { defaultValue: 'day' }) : t('common.time.days', { defaultValue: 'days' })}`;
    if (hours > 0) return `${hours} ${hours === 1 ? t('common.time.hour', { defaultValue: 'hour' }) : t('common.time.hours', { defaultValue: 'hours' })}`;
    return `${minutes} ${minutes === 1 ? t('common.time.minute', { defaultValue: 'minute' }) : t('common.time.minutes', { defaultValue: 'minutes' })}`;
  };

  const handleOrderClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'service_market');
    params.set('subTab', 'order_details_provider');
    params.set('orderId', order.id.toString());
    router.push(`?${params.toString()}`);
  };

  const handleAcceptRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await confirmOrder();
  };


  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRejectModalOpen(true);
  };

  // const handleRejectConfirm = async (reason: string, notes: string) => {
  //   await rejectOrder(reason, notes);
  //   setIsRejectModalOpen(false);
  // };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-[#F8FAFC] text-[#64748B]';
      case 'PENDING':
        return 'bg-[#F8FAFC] text-[#64748B]';
      case 'IN_PROGRESS':
        return 'bg-[#FFFBEB] text-[#D97706]';
      case 'DELIVERED':
        return 'bg-[#EFF6FF] text-[#2563EB]';
      case 'COMPLETED':
        return 'bg-[#F0FDF4] text-[#16A34A]';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'REVISION':
        return 'bg-[#FAF5FF] text-[#9333EA]';
      case 'REVISION_COMPLETED':
        return 'bg-[#F0FDF4] text-[#16A34A]';
      case 'DISPUTED':
        return 'bg-[#FFF7ED] text-[#EA580C]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
      case 'PENDING':
        return <Clock className="w-3 h-3 mr-1" />;
      case 'IN_PROGRESS':
        return <RefreshCwIcon className="w-3 h-3 mr-1" />;
      case 'DELIVERED':
        return <Send className="w-3 h-3 mr-1" />;
      case 'COMPLETED':
      case 'REVISION_COMPLETED':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'CANCELLED':
      case 'REJECTED':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'REVISION':
      case 'REVISION_REQUESTED':
        return <RotateCcw className="w-3 h-3 mr-1" />;
      case 'DISPUTED':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getPaymentStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'unpaid':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'paid':
        return 'bg-[#F0FDF4] text-[#16A34A]';
      case 'in_escrow':
        return 'bg-[#15803D1A] text-blueSite';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getPaymentIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in_escrow':
        return <Lock className="w-3 h-3 mr-1" />;
      case 'paid':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'unpaid':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const formattedDate = order.order_date 
    ? new Intl.DateTimeFormat('en-GB', { 
        day: 'numeric', month: 'short', year: 'numeric' 
      }).format(parseBackendDate(order.order_date))
    : 'N/A';

  return (
    <div className="flex flex-col rounded-[16px] border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-4">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row p-4 gap-5 bg-white">
        {/* Image */}
        <div 
          onClick={handleOrderClick}
          className="relative w-full md:w-[181px] h-[160px] md:h-[136px] rounded-xl overflow-hidden flex-shrink-0 bg-blue-50/30 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Image
            src={order.service.cover || "/anonymous.png"}
            alt={order.service.title}
            fill
            className="object-contain"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 py-1">
          {/* Header Row: ID + Status Badges */}
          <div className="flex justify-between items-start mb-3">
            <span 
              onClick={handleOrderClick}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[#15803D1A] text-blueSite cursor-pointer hover:bg-[#15803D2A] transition-colors"
            >
              #{order.order_number}
            </span>
            <div className="flex gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${getStatusStyles(order.status)}`}>
                {getStatusIcon(order.status)}
                {t(`orders.status.${order.status}`, { defaultValue: order.status.replace('_', ' ') })}
              </span>
              {order.payment_status && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${getPaymentStyles(order.payment_status)}`}>
                  {getPaymentIcon(order.payment_status)}
                  {order.payment_status === 'in_escrow' 
                    ? t('orders.payment.inEscrow', { defaultValue: 'In Escrow' })
                    : t(`orders.payment.${order.payment_status.toLowerCase()}`, { defaultValue: order.payment_status.replace('_', ' ') })}
                </span>
              )}
              {order.status === 'PENDING_PAYMENT' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEE2E2] text-[#DC2626]">
                  <Clock className="w-3 h-3 mr-1" />
                  {getTimeAgo(order.order_date)}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[20px] md:text-base font-bold text-subTitleColor line-clamp-2 pr-6">
            {order.service.title}
          </h3>

          <hr className="my-3 border-gray-100/80 h-1 w-[80%]" />

          {/* Customer row */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={order.customer.avatar || "/anonymous.png"}
                  alt={order.customer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-subTitleColor">{order.customer.name}</span>
                <span className="text-[11px] text-textGrayColor">{order.customer.country || ''}</span>
              </div>
            </div>
            
            {order.status === 'CANCELLED' && order.rejection_reason && (
              <div className="flex flex-col text-end">
                <span className="text-[12px] text-textColor mb-0.5">{t('orders.rejectionReasonTitle', { defaultValue: 'Rejection Reason' })}</span>
                <span className="text-[12px] text-[#EF4444] font-medium">{order.rejection_reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-[#FAFBFB] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100/60">
        <div className="flex items-center gap-6 md:gap-8 flex-wrap">
           <div className="flex items-center gap-2 text-[13px]">
             <Clock className="w-4 h-4 text-blueSite opacity-80" />
             <span className="text-textGrayColor text-[14px]">{t('orders.orderDateLabel', { defaultValue: 'Order Date:' })}</span>
             <span className="font-bold text-subTitleColor text-[16px]">{formattedDate}</span>
           </div>
           <div className="flex items-center gap-2 text-[13px]">
             <Clock className="w-4 h-4 text-blueSite opacity-80" />
             <span className="text-textGrayColor text-[14px]">{t('orders.deliveryDateLabel', { defaultValue: 'Delivery Time:' })}</span>
             <span className="font-bold text-subTitleColor text-[16px]">{order.delivery_time.formatted}</span>
           </div>
           <div className="flex items-center gap-2 text-[13px]">
             <PiCoinsThin className="w-4 h-4 text-blueSite opacity-80" />
             <span className="text-textGrayColor text-[14px]">{t('orders.totalLabel', { defaultValue: 'Total:' })}</span>
             <span className="font-extrabold text-blueSite text-[20px]">{order.total.toFixed(2)}{order.currency}</span>
           </div>
        </div>

        <div className="ml-auto flex gap-3">
          {(order.status === 'PENDING') && (
            <div className='flex flex-row gap-4'>
              <button 
                onClick={handleRejectClick}
                disabled={isRejecting}
                className="px-5 py-2 rounded-[8px] bg-red-100 text-red-600 text-[14px] font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {t('orders.action.reject', { defaultValue: 'Reject' })}
              </button>
               <button 
                 onClick={handleAcceptRequest}
                 disabled={isConfirming}
                 className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isConfirming
                   ? t('orders.action.accepting', { defaultValue: 'Accepting...' }) 
                   : t('orders.action.acceptRequest', { defaultValue: 'Accept Request' })}
               </button>
            </div>
          )}
          {order.status === 'IN_PROGRESS' && (
            <button className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors" onClick={handleOrderClick}>
              {t('orders.action.deliverOrder', { defaultValue: 'Deliver Order' })}
            </button>
          )}
          {order.status === 'REVISION' && (
            <button className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors">
              {t('orders.action.completeService', { defaultValue: 'Complete Service' })}
            </button>
          )}
          {order.status === 'COMPLETED' && order.payment_status?.toLowerCase() === 'paid' && (
            <button className="px-5 py-2 rounded-[8px] bg-[#E2EEF0] text-blueSite font-bold hover:bg-[#D1E0E3] transition-colors text-[14px]">
              {t('orders.action.sendFeedback', { defaultValue: 'Send your feedback' })}
            </button>
          )}
          {(order.status === 'CANCELLED' || order.status === 'REJECTED') && (
            <button className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors">
              {t('orders.action.refundPayment', { defaultValue: 'Refund Payment' })}
            </button>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={() =>{ 
          refetchList?.()
          refetch()} }
      />  
    </div>
  );
};

export default OrderCard;
