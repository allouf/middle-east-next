"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { OrderHistoryItemType, OrderStatus as HookOrderStatus } from '../../types/order';
import { Clock, Loader2, CheckCircle, AlertCircle, XCircle, RotateCcw, Play, Send, RefreshCwIcon, Lock } from 'lucide-react';
import { PiCoinsThin } from 'react-icons/pi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderDetails } from '../../hooks/useOrderDetails';

interface OrderCardProps {
  order: OrderHistoryItemType;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { cancelOrder, isCancelling } = useOrderDetails({
    orderId: String(order.id),
    autoFetch: false,
  });

  const handleOrderClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'service_market');
    params.set('subTab', 'order_details_consumer');
    params.set('orderId', String(order.id));
    router.push(`?${params.toString()}`);
  };

  const getStatusStyles = (status: OrderHistoryItemType['status']) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-[#F8FAFC] text-[#64748B]';
      case 'IN_PROGRESS':
        return 'bg-[#FFFBEB] text-[#D97706]';
      case 'DELIVERED':
        return 'bg-[#EFF6FF] text-[#2563EB]';
      case 'COMPLETED':
      case 'REVISION_COMPLETED':
        return 'bg-[#F0FDF4] text-[#16A34A]';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'REVISION':
        return 'bg-[#FAF5FF] text-[#9333EA]';
      case 'DISPUTED':
        return 'bg-[#FFF7ED] text-[#EA580C]';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderHistoryItemType['status']) => {
    switch (status) {
      case 'PENDING_PAYMENT':
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

  const handleRequestRevision = () => {
    router.push(`/dashboard?tab=service_market&subTab=order_revision&orderId=${order.id}`);
  };

  const formattedDate = order.order_date ? new Intl.DateTimeFormat('en-GB', { 
    day: 'numeric', month: 'short', year: 'numeric' 
  }).format(new Date(order.order_date)) : '-';

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
                {t(`orders.status.${order.status.toLowerCase()}`, { defaultValue: order.status.replace('_', ' ') })}
              </span>
              {order.payment_status && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold capitalize ${getPaymentStyles(order.payment_status)}`}>
                  {getPaymentIcon(order.payment_status)}
                  {order.payment_status === 'in_escrow' 
                    ? t('orders.payment.inEscrow', { defaultValue: 'In Escrow' })
                    : t(`orders.payment.${order.payment_status}`, { defaultValue: order.payment_status })}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[20px] md:text-base font-bold text-subTitleColor line-clamp-2 pr-6">
            {order.service.title}
          </h3>

          <hr className="my-3 border-gray-100/80 h-1 w-[80%]" />

          {/* Provider row & Rejection Info */}
          <div className="flex items-center  mt-auto">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={order.provider.avatar || "/anonymous.png"}
                  alt={order.provider.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-subTitleColor">{order.provider.name}</span>
                {order.provider.type && (
                  <span className="text-[11px] text-textGrayColor">{order.provider.type}</span>
                )}
              </div>
            </div>
            
            {(order.rejection || order.rejection_reason) && (
              <div className="flex items-center flex-1 justify-center">
              <div className="flex flex-col text-start  mx-2 ">
                <span className="text-[12px] text-textColor mb-0.5">{t('orders.rejectionReasonTitle', { defaultValue: 'Rejection Reason' })}</span>
                <span className="text-[12px] text-[#EF4444] font-medium">
                  {order.rejection?.reason || order.rejection_reason}
                </span>
                {order.rejection?.notes && (
                  <span className="text-[12px] text-[#EF4444] font-normal max-w-[200px] md:max-w-md truncate">{order.rejection.notes}</span>
                )}
              </div>
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
           {order.delivery_time?.formatted && (
             <div className="flex items-center gap-2 text-[13px]">
               <Clock className="w-4 h-4 text-blueSite opacity-80" />
               <span className="text-textGrayColor text-[14px]">{t('orders.deliveryDateLabel', { defaultValue: 'Delivery Date:' })}</span>
               <span className="font-bold text-subTitleColor text-[16px]">{order.delivery_time.formatted}</span>
             </div>
           )}
           <div className="flex items-center gap-2 text-[13px]">
             <PiCoinsThin className="w-4 h-4 text-blueSite opacity-80" />
             <span className="text-textGrayColor text-[14px]">{t('orders.totalLabel', { defaultValue: 'Total:' })}</span>
             <span className="font-extrabold text-blueSite text-[20px]">{order.total?.toFixed(2)} {order.currency || '$'}</span>
           </div>
        </div>

        <div className="ml-auto flex gap-3">
          {order.status === 'PENDING_PAYMENT' && (
            <button
              onClick={(e) => { e.stopPropagation(); cancelOrder(); }}
              disabled={isCancelling}
              className="flex items-center gap-2 px-5 py-2 rounded-[8px] bg-[#F8D4D4] text-red-500 text-[14px] font-bold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {t('orders.action.cancelOrder', { defaultValue: 'Cancel Order' })}
            </button>
          )}
          {(order.status==="DELIVERED") && (order.payment_status === 'unpaid'||order.payment_status === 'in_escrow') && (
            <>
               <button className="px-5 py-2 rounded-[8px] bg-[#EAEAEA] text-blueSite text-[14px] font-bold hover:bg-gray-200 transition-colors" onClick={handleRequestRevision}>
                 {t('orders.action.requestRevision', { defaultValue: 'Request Revision' })}
               </button>
               <button className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors">
                 {t('orders.action.submitPayment', { defaultValue: 'Submit Payment' })}
               </button>
            </>
          )}
          {order.status === 'COMPLETED' && order.payment_status === 'paid' && (
             <button className="px-5 py-2 rounded-[8px] bg-[#E6F0EE] text-blueSite text-[14px] font-bold hover:bg-[#d6e8e4] transition-colors">
               {t('orders.action.sendFeedback', { defaultValue: 'Send your feedback' })}
             </button>
          )}
          {order.status === 'REJECTED' && (
             <button className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors">
               {t('orders.action.refundPayment', { defaultValue: 'Refund payment' })}
             </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
