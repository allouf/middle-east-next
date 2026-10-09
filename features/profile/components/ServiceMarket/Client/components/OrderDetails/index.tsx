"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { HelpCircle, ArrowLeft, Loader2, AlertCircle, Layers } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOrderDetails } from '../../hooks/useOrderDetails';
import { OrderDetails as ApiOrderDetails } from '../../types/client.types';
import { DetailedOrder } from './types';
import ServiceInfoCard from './components/ServiceInfoCard';
import TimeRemainingCard from './components/TimeRemainingCard';
import RequirementsCard from './components/RequirementsCard';
import ReviewDeliveryCard from './components/ReviewDeliveryCard';
import OrderSummaryCard from './components/OrderSummaryCard';
import ProviderCard from './components/ProviderCard';
import NeedHelpCard from './components/NeedHelpCard';
import RevisionStatusCard from './components/RevisionStatusCard';
import RevisionDetailsCard from './components/RevisionDetailsCard';
import ExtensionModal from './modals/ExtensionModal';
import ExtensionApprovedModal from './modals/ExtensionApprovedModal';
import ExtensionRejectedModal from './modals/ExtensionRejectedModal';
import DisputeModal from '../DisputeOrder/modal/DisputeModal';
import { useClientDisputes } from '../../hooks/Disputes/useClientDisputes';
import RejectCard from './components/RejectCard';

// ── Status adapter: API statuses → legacy UI statuses ─────────────────────────
const STATUS_MAP: Record<string, DetailedOrder['status']> = {
  PENDING_PAYMENT: 'pending',
  IN_PROGRESS:     'in_progress',
  DELIVERED:       'completed',
  COMPLETED:       'completed',
  CANCELLED:       'cancelled',
  REVISION:        'revision',
  REVISION_REQUESTED: 'revision',
  REVISION_COMPLETED: 'revision_completed',
  DISPUTED: 'disputed',
  REJECTED: 'rejected',
};

/**
 * Adapts an API `OrderDetails` response (nested structure) into the flat
 * `DetailedOrder` shape expected by all OrderDetails sub-components.
 */
export function adaptApiOrder(api: ApiOrderDetails): DetailedOrder {
  return {
    // Base Order fields
    id:              String(api.id),
    status:          STATUS_MAP[api.status] ?? 'pending',
    title:           api.service.title,
    imageUrl:        api.service.cover ?? undefined,
    orderDate:       api.purchased_on,
    deliveryDays:    api.service.estimated_delivery_days|| "-",
    totalPrice:      api.summary.total,
    rejectionReason: api.rejection ?? undefined,

    // Provider (kept as nested object — same shape)
    provider: {
      id:     String(api.provider.id),
      name:   api.provider.name,
      avatar: api.provider.avatar ?? '',
      role:   api.provider.type,
    },

    // Flattened service fields
    category:      api.service.category,
    rating:        api.service.rating,
    reviewsCount:  api.service.reviews_count,
    description:   api.service.description,
    serviceType:   api.service.type,
    deliveryModel: api.service.delivery_model,

    // Order summary — flattened
    servicePrice: api.summary.service_price,
    vat:          api.summary.vat,
    fees:         api.summary.fees,
    currency:     api.summary.currency,

    // Requirements
    serviceNotes:     api.requirements?.notes || undefined,
    requirementFiles: Array.isArray(api.requirements?.attachments) ? api.requirements.attachments.map((url: string | any, idx: number) => {
      const urlString = typeof url === 'string' ? url : (url.url || '');
      const ext = urlString.split('.').pop()?.toLowerCase() || 'file';
      let type: 'pdf' | 'png' | 'doc' | 'jpg' = 'doc';
      if (ext === 'pdf') type = 'pdf';
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) type = 'png';
      
      const name = typeof url === 'string' 
        ? (urlString.split('/').pop()?.split('_').pop() || `Attachment ${idx + 1}.${ext}`)
        : (url.name || `Attachment ${idx + 1}.${ext}`);

      return {
        name,
        type,
        url: urlString,
      };
    }) : [],

    // Delivery (populated from deliveries array if present)
    deliveryFiles:   [],
    deliveryMessage: undefined,
    deliveredAt:     undefined,
    deliveries: api.deliveries?.map(d => ({
      id: d.id,
      version: d.version,
      message: d.message,
      attachments: d.attachments,
      submittedAt: d.submitted_at,
    })) || [],
    timeRemaining: api.delivery_time ? {
      totalMinutes: api.delivery_time.total_minutes,
      formatted: api.delivery_time.formatted,
      isOverdue: api.delivery_time.is_overdue,
      started: api.delivery_time.started,
      extensionRequest: api.delivery_time.extension_request ? {
        days: api.delivery_time.extension_request.days,
        reason: api.delivery_time.extension_request.reason,
      } : undefined,
    } : undefined,
    revisionPolicy: api.revision_policy ? {
      revisionsAllowed: api.revision_policy.revisions_allowed,
      revisionsUsed: api.revision_policy.revisions_used,
      revisionsRemaining: api.revision_policy.revisions_remaining,
    } : undefined,
    revisions: api.revisions,
    extensions: api.extensions,
  };
}

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExtensionApprovedModalOpen, setIsExtensionApprovedModalOpen] = useState(false);
  const [isExtensionRejectedModalOpen, setIsExtensionRejectedModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedExtensionId, setSelectedExtensionId] = useState<number | null>(null);

  // Read orderId from URL search params (set by OrderCard on click)
  const orderId = searchParams.get('orderId') ?? undefined;

  const {
    orderDetails: rawOrder,
    loading,
    error,
    refetch,
    cancelOrder,
    isCancelling,
    approveExtension,
    rejectExtension,
    isApprovingExtension,
    isRejectingExtension
  } = useOrderDetails({ orderId, autoFetch: true });

  const order = rawOrder ? {
    ...rawOrder,
    status: (rawOrder.status === 'DELIVERED' && rawOrder.revisions && rawOrder.revisions.length > 0) 
      ? 'REVISION_COMPLETED' as any 
      : rawOrder.status
  } : null;

  const { createDispute, isCreatingDispute } = useClientDisputes();

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'service_market');
    params.set('subTab', 'my_order_customer');
    params.delete('orderId');
    router.push(`?${params.toString()}`);
  };

  const handleMilestones = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subTab', 'customer_order_milestones');
    router.push(`?${params.toString()}`);
  };

  const handleDispute = () => {
    setIsDisputeModalOpen(true);
  };

  const handleAcceptExtension = async (extensionId: number) => {
    setSelectedExtensionId(extensionId);
    setIsExtensionModalOpen(true);
  };

  const handleRejectExtension = async (extensionId: number) => {
    setSelectedExtensionId(extensionId);
    setIsExtensionModalOpen(true);
  };

  const onModalApprove = async () => {
    if (!selectedExtensionId) return;
    const success = await approveExtension(selectedExtensionId);
    if (success) {
      setIsExtensionModalOpen(false);
      setIsExtensionApprovedModalOpen(true);
    }
  };

  const onModalReject = async () => {
    if (!selectedExtensionId) return;
    const success = await rejectExtension(selectedExtensionId);
    if (success) {
      setIsExtensionModalOpen(false);
      setIsExtensionRejectedModalOpen(true);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
      case 'IN_PROGRESS':    return 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]';
      case 'DELIVERED':      return 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]';
      case 'COMPLETED':
      case 'REVISION_COMPLETED': return 'bg-[#F0FDF4] text-[#16A34A] border-[#DCFCE7]';
      case 'CANCELLED':
      case 'REJECTED':      return 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]';
      case 'REVISION':
      case 'REVISION_REQUESTED':
      case 'IN_REVISION': return 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]';
      case 'DISPUTED':       return 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]';
      default:               return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────
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

  // ── Error ─────────────────────────────────────────────────────────────
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

  // ── No orderId / No data ──────────────────────────────────────────────
  if (!order) {
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

  // ── Adapt API data → UI shape ─────────────────────────────────────────
  const adapted = adaptApiOrder(order);

  // ── Derived values ────────────────────────────────────────────────────
  const formattedDate = order.purchased_on
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        .format(new Date(order.purchased_on))
    : '-';

  const isRevision = order.status === 'REVISION' || order.status === 'REVISION_COMPLETED' || order.status === 'REVISION_REQUESTED' || order.status === 'IN_REVISION';
  const showDispute = ['IN_PROGRESS', 'DELIVERED', 'REVISION', 'REVISION_REQUESTED'].includes(order.status);


  console.log("order details ", order);

  const renderDeliveryContent = () => {
    if (order.status !== 'COMPLETED' && order.status !== 'DELIVERED'&& order.status !== 'DISPUTED') return null;

    if (adapted.deliveries && adapted.deliveries.length > 0) {
      return adapted.deliveries.map((delivery) => (
        <ReviewDeliveryCard
          key={delivery.id}
          order={{ ...adapted, deliveries: [delivery] }}
          date={delivery.submittedAt}
        />
      ));
    }

    return <ReviewDeliveryCard order={adapted} />;
  };

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">

      {/* Top Header Navigation */}
      <div className="flex flex-col gap-6 w-full mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blueSite font-bold hover:text-blueSiteHover transition-colors w-max uppercase text-[20px]"
        >
          <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" />
          {t('orderDetails.goBack', { defaultValue: 'GO BACK' })}
        </button>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 w-full">
          {/* Title and date */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-blueSite font-extrabold text-[28px] w-1.5 h-8 bg-blueSite rounded-full mr-2" />
              <h1 className="text-[24px] md:text-[28px] font-bold text-subTitleColor">
                {t('orderDetails.order', { defaultValue: 'Order' })} #{order.order_number}
              </h1>

              {isRevision ? (
                <>
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7] mr-1">
                    <RefreshCwIcon className="w-3.5 h-3.5 mr-1" />
                    {t('orderDetails.revision', { defaultValue: 'Revision' })}
                  </span>
                  {order.status === 'REVISION_COMPLETED' && (
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize bg-[#F0FDF4] text-[#16A34A] border border-[#DCFCE7]">
                      <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5" />
                      {t('orderDetails.completed', { defaultValue: 'Completed' })}
                    </span>
                  )}
                  {order.status === 'REVISION_REQUESTED' && (
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5]">
                      <RefreshCwIcon className="w-3.5 h-3.5 mr-1.5" />
                      {t('orderDetails.requested', { defaultValue: 'Requested' })}
                    </span>
                  )}
                  {order.status === 'IN_REVISION' && (
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize bg-[#FFFBEB] text-[#D97706] border border-[#FEF3C7]">
                      <RefreshCwIcon className="w-3.5 h-3.5 mr-1.5" />
                      {t('orderDetails.inProgress', { defaultValue: 'In Progress' })}
                    </span>
                  )}
                </>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-[13px] font-bold border ${getStatusStyles(order.status)}`}>
                  {order.status === 'IN_PROGRESS'    && <RefreshCwIcon className="w-3.5 h-3.5" />}
                  {order.status === 'COMPLETED'      && <CheckCircleIcon className="w-3.5 h-3.5" />}
                  {order.status === 'PENDING_PAYMENT' && <ClockIcon className="w-3.5 h-3.5" />}
                  {t(`orders.status.${order.status.toLowerCase()}`, { defaultValue: order.status.replace(/_/g, ' ') })}
                </span>
              )}
              {adapted.extensions?.some(ext => ext.status === 'PENDING') && (
                <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize border bg-[#F8FAFC] text-[#64748B] border-[#BFDBFE]">
                  <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                  {t('orderDetails.extensionPending', { defaultValue: 'Extension Pending' })}
                </span>
              )}
            </div>

            <div className="text-[14px] text-textGrayColor flex items-center gap-1.5 ml-2 md:ml-10 flex-wrap">
              <span>{t('orderDetails.purchasedOn', { defaultValue: 'Purchased on' })}</span>
              <span className="font-bold text-subTitleColor">{formattedDate}</span>
              <span className="px-1.5">·</span>
              <span>{t('orderDetails.expectedDelivery', { defaultValue: 'Expected delivery in' })}</span>
              <span className="font-bold text-subTitleColor">{order.delivery_time?.formatted}</span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3 flex-wrap self-start xl:self-auto xl:justify-end">
            {order.status === 'IN_PROGRESS' && (
              <button 
                onClick={handleMilestones}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#CCE0DC] bg-white text-subTitleColor hover:bg-gray-50 font-bold text-[14px] transition-colors shadow-sm whitespace-nowrap"
              >
                <Layers className="w-4 h-4 text-gray-500" />
                {t('orderDetails.milestones', { defaultValue: 'Milestones' })}
              </button>
            )}
            {showDispute && (
              <button 
                onClick={handleDispute}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#CCE0DC] bg-white text-subTitleColor hover:bg-gray-50 font-bold text-[14px] transition-colors shadow-sm whitespace-nowrap"
              >
                <HelpCircle className="w-4 h-4 text-gray-500" />
                {t('orderDetails.fileDispute', { defaultValue: 'File Dispute' })}
              </button>
            )}
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blueSite hover:bg-blueSiteHover text-white font-bold text-[14px] transition-colors shadow-sm whitespace-nowrap">
              <MessageSquareIcon className="w-4 h-4" />
              {t('orderDetails.messageProvider', { defaultValue: 'Message Provider' })}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">

        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col  w-full h-full">
          {order.status === 'REJECTED' && <RejectCard order={adapted} />}
          <ServiceInfoCard order={adapted} />

          {(order.status === 'IN_PROGRESS' || (adapted.extensions && adapted.extensions.length > 0)) && (
            <TimeRemainingCard 
              timeRemaining={adapted.timeRemaining} 
              extensions={adapted.extensions}
              onAcceptExtension={handleAcceptExtension}
              onRejectExtension={handleRejectExtension}
            />
          )}

          {isRevision ? (
            <>
              <RevisionStatusCard order={adapted} />
              <RevisionDetailsCard order={adapted} />
              {adapted.deliveries && adapted.deliveries.length > 0 ? (
                adapted.deliveries.map(delivery => (
                  <ReviewDeliveryCard 
                    key={delivery.id} 
                    order={{...adapted, deliveries: [delivery]}} 
                    version={`V${delivery.version}`}
                    date={delivery.submittedAt}
                  />
                ))
              ) : (
                <>
                  {order.status === 'REVISION_COMPLETED' && (
                    <ReviewDeliveryCard order={adapted} version="V2" date="22 Oct 2024" />
                  )}
                  {/* <ReviewDeliveryCard order={adapted} version="V1" date="5 Oct 2024" /> */}
                </>
              )}
            </>
          ) : (
            <RequirementsCard order={adapted} />
          )}

          {renderDeliveryContent()}

          {/* Bottom Actions */}
          <div className="mt-6">
            {order.status === 'PENDING_PAYMENT' && (
              <button
                onClick={() =>{
                  cancelOrder()
               
                }}
                disabled={isCancelling}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#FEE2E2] text-red-600 font-bold text-[14px] hover:bg-red-200 transition-colors disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('orderDetails.cancelOrder', { defaultValue: 'Cancel Order' })}
              </button>
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <OrderSummaryCard order={adapted} />
          <ProviderCard order={adapted} />
          <NeedHelpCard />
        </div>

      </div>

      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        order={adapted}
        onApprove={onModalApprove}
        onReject={onModalReject}
        isSubmitting={isApprovingExtension || isRejectingExtension}
      />
      
      <ExtensionApprovedModal
        isOpen={isExtensionApprovedModalOpen}
        onClose={() => setIsExtensionApprovedModalOpen(false)}
        order={adapted}
        onViewOrderDetails={() => {
          console.log('View order details');
          setIsExtensionApprovedModalOpen(false);
        }}
      />

      <ExtensionRejectedModal
        isOpen={isExtensionRejectedModalOpen}
        onClose={() => setIsExtensionRejectedModalOpen(false)}
        order={adapted}
        onViewOrderDetails={() => {
          console.log('View order details');
          setIsExtensionRejectedModalOpen(false);
        }}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        isSubmitting={isCreatingDispute}
        order={adapted}
        onSubmit={async (reason_id, description) => {
      
          
          const success = await createDispute(orderId as string, reason_id, description);
          if (success) {
            setIsDisputeModalOpen(false);
            refetch();
          }
        }}
      />
    </div>
  );
};

// ── Inline Icon Helpers ───────────────────────────────────────────────────────
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default OrderDetailsPage;
