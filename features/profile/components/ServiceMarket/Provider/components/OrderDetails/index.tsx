"use client";

import React, { useEffect, useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { MoveLeft, HelpCircle, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Loader2, AlertCircle, Layers } from 'lucide-react';
import useFormData from '@/lib/Hooks/useFormData';
import { useOrderDetails } from '../../hooks/Orders/useOrderDetails';
import { OrderDetails as ApiOrderDetails } from '../../types/provider.types';
import { DetailedOrder, OrderStatus } from './types';
import ServiceInfoCard from './components/ServiceInfoCard';

function adaptApiOrder(api: ApiOrderDetails): DetailedOrder {
  let status: OrderStatus = api.status as unknown as OrderStatus;
  if (status === 'DELIVERED' && api.revisions && api.revisions.length > 0) {
    status = 'REVISION_COMPLETED';
  }

  return {
    id: String(api.id),
    orderNumber: api.order_number,
    paymentStatus: api.payment_status,
    status: status,
    title: api.service.title,
    imageUrl: api.service.cover ?? undefined,
    orderDate: api.purchased_on,
    deliveryDays:    api.service.estimated_delivery_days|| "-",
    totalPrice: api.summary.total,
    currency: api.currency,
    rejectionReason: api.rejection ?? undefined,

    provider: {
      id: String(api.provider?.id ?? ''),
      name: api.provider?.name ?? '',
      avatar: api.provider?.avatar ?? '',
      role: api.provider?.type ?? '',
    },
    customer: {
      id: String(api.customer?.id ?? ''),
      name: api.customer?.name ?? '',
      avatar: api.customer?.avatar ?? '',
      country: api.customer?.country,
      region: api.customer?.region,
      type: api.customer?.type,
    },
    timeRemaining: api.time_remaining ? {
      totalMinutes: api.time_remaining.total_minutes,
      formatted: api.time_remaining.formatted,
      isOverdue: api.time_remaining.is_overdue,
      started: api.time_remaining.started,
    } : undefined,

    category: api.service.category,
    rating: api.service.rating,
    reviewsCount: api.service.reviews_count,
    description: api.service.description,
    serviceType: api.service.type,
    deliveryModel: api.service.delivery_model,

    servicePrice: api.summary.service_price,
    vat: api.summary.vat,
    fees: api.summary.fees,

    serviceNotes: api.requirements?.notes || undefined,
    requirementFiles: api.requirements?.attachments?.map((a: any) => {
      if (typeof a === 'string') {
        const name = a.split('/').pop() || 'file';
        const ext = name.split('.').pop()?.toLowerCase() || '';
        let type: 'pdf' | 'png' | 'doc' | 'jpg' = 'pdf';
        
        if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
          type = (ext === 'jpeg' || ext === 'jpg') ? 'jpg' : 'png';
        } else if (['doc', 'docx'].includes(ext)) {
          type = 'doc';
        } else if (ext === 'pdf') {
          type = 'pdf';
        }
        
        return { name, type, url: a };
      }
      return {
        name: a.name || 'file',
        type: (a.type === 'image' ? 'png' : a.type) as 'pdf' | 'png' | 'doc' | 'jpg',
        url:  a.url ?? '',
      };
    }) ?? [],

    feedback: api.feedback ? {
      id: api.feedback.id,
      rating: api.feedback.rating,
      comment: api.feedback.comment,
      createdAt: api.feedback.created_at,
    } : undefined,

    deliveryFiles:   [],
    deliveries: api.deliveries?.map(d => ({
      id: d.id,
      version: d.version,
      message: d.message,
      attachments: d.attachments,
      submittedAt: d.submitted_at,
    })) || [],
    extensions: api.extensions,
    revisionPolicy: api.revision_policy ? {
      revisionsAllowed: api.revision_policy.revisions_allowed,
      revisionsUsed: api.revision_policy.revisions_used,
      revisionsRemaining: api.revision_policy.revisions_remaining,
    } : undefined,
    revisions: api.revisions,
  };
}


import OrderSummaryCard from './components/OrderSummaryCard';
import NeedHelpCard from './components/NeedHelpCard';
import TimeRemainingCard from './components/TimeRemainingCard';
import OrderRequirements from './components/OrderRequirements';
import OrderAttachments from './components/OrderAttachments';
import CustomerFeedback from './components/CustomerFeedback';
import RejectCard from './components/RejectCard';
import SubmitedSuccess from './Modals/SubmitedSuccess';
import RejectModal from './Modals/RejectModal';
import ExtensionModal from './Modals/ExtensionModal';
import ExtensionRequestSent from './Modals/ExtensionRequestSent';
import ReviewDeliveryCard from './components/ReviewDeliveryCard';
import RevisionDetailsCard from './components/RevisionDetailsCard';
import RevisionStatusCard from './components/RevisionStatusCard';
import RevisionRequestModal from './Modals/RevisionRequestModal';
import RevisionRejectModal from './Modals/RevisionRejectModal';
import RevisionRejectSuccessModal from './Modals/RevisionRejectSuccessModal';
import DisputeModal from '../../../shared/components/DisputeOrder/modal/DisputeModal';
import { useDisputes } from '../../../shared/hooks/Disputes/useDisputes';

// This is a placeholder for development. In production, `orderId` would come from props/params.
const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'service_market');
    params.set('subTab', 'my_order_provider');
    router.push(`?${params.toString()}`);
  };

  const handleMilestones = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subTab', 'provider_order_milestones');
    router.push(`?${params.toString()}`);
  };

  const handleDispute = () => {
    setIsDisputeModalOpen(true);
  };
  
  const orderId = searchParams.get('orderId') ?? undefined;

  const {
    orderDetails: apiOrder,
    loading,
    error,
    refetch,
    confirmOrder,
    rejectOrder,
    cancelOrder,
    deliverRevision,
    acceptRevision,
    rejectRevision,
    isDelivering,
    isConfirming,
    isAcceptingRevision,
    isRejectingRevision,
    devChangeOrderStatus,
    isChangingStatus,
    deliverOrder,
    isDeliveringRevision,
    isCancelling
  } = useOrderDetails({ orderId, autoFetch: true });

  // Milestone orders have a completely different shape (phases + cursor
  // instead of a single service + deadline). Rather than thread two
  // very different render paths through this whole component, redirect
  // to the dedicated ProviderMilestoneOrderPage as soon as we know the
  // orderable_type. The existing render below stays focused on the
  // service_offer flow it was originally built for.
  useEffect(() => {
    if ((apiOrder as any)?.orderable_type === 'milestone_template' && orderId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', 'service_market');
      params.set('subTab', 'provider_milestone_order_details');
      params.set('orderId', String(orderId));
      router.replace(`${pathname}?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(apiOrder as any)?.orderable_type, orderId]);

  const { createDispute, isCreatingDispute } = useDisputes();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isExtensionSuccessOpen, setIsExtensionSuccessOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isRevisionRejectModalOpen, setIsRevisionRejectModalOpen] = useState(false);
  const [isRevisionRejectSuccessOpen, setIsRevisionRejectSuccessOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    formData: attachmentsFormData,
    handleChange: handleAttachmentsChange,
    errors: attachmentsErrors,
    handleAddError: handleAttachmentsAddError,
    handleArrayChange: handleAttachmentsArrayChange
  } = useFormData<Record<string, any>>({ note: '', files: [] });
  const [isAttachmentsSubmited, setIsAttachmentsSubmited] = useState(false);

  const handleSubmitOrder = async () => {
    setIsAttachmentsSubmited(true);
    if (!attachmentsFormData.note) {
      handleAttachmentsAddError('note', 'Note is required');
      return;
    }
    const success = order?.status === 'IN_REVISION'
      ? await deliverRevision(attachmentsFormData.note, attachmentsFormData.files || [])
      : await deliverOrder(attachmentsFormData.note, attachmentsFormData.files || []);
      
    if (success) {
      setIsSubmitModalOpen(true);
    }
  };

  const getStatusStyles = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'bg-[#F8FAFC] text-[#64748B]';
      case 'PENDING':
        return 'bg-[#FFFBEB] text-[#D97706]';
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
      case 'REVISION_REQUESTED':
      case 'IN_REVISION':
        return 'bg-[#FAF5FF] text-[#9333EA] border-[#E9D5FF]';
      case 'REVISION_COMPLETED':
        return 'bg-[#F0FDF4] text-[#16A34A]';
      case 'DISPUTED':
        return 'bg-[#FFF7ED] text-[#EA580C]';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const order = adaptApiOrder(apiOrder);

  const formattedDate = apiOrder.purchased_on
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        .format(new Date(apiOrder.purchased_on))
    : '-';

  const isRevision = order.status === 'REVISION' || order.status === 'REVISION_COMPLETED' || order.status === 'REVISION_REQUESTED' || order.status === 'IN_REVISION';
  const showDispute = ['IN_PROGRESS', 'DELIVERED', 'REVISION', 'REVISION_REQUESTED'].includes(order.status);


    console.log("order",apiOrder)
  return (
    <div className="w-full  mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">

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
              <span className="text-blueSite font-extrabold text-[28px] w-1.5 h-8 bg-blueSite rounded-full mr-2"></span>
              <h1 className="text-[24px] md:text-[28px] font-bold text-subTitleColor">
                {t('orderDetails.order', { defaultValue: 'Order' })} #{order.id}
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
                  {order.status === 'IN_PROGRESS' && <RefreshCwIcon className="w-3.5 h-3.5" />}
                  {(order.status === 'COMPLETED' || order.status === 'DELIVERED') && <CheckCircleIcon className="w-3.5 h-3.5" />}
                  {(order.status === 'PENDING' || order.status === 'PENDING_PAYMENT') && <ClockIcon className="w-3.5 h-3.5" />}
                  {t(`orders.status.${order.status}`, { defaultValue: order.status.replace('_', ' ') })}
                </span>
              )}
              {order.extensions?.some(ext => ext.status === 'PENDING') && (
                <span className="inline-flex items-center px-4 py-1 rounded-full text-[13px] font-bold capitalize border bg-[#F8FAFC] text-[#64748B] border-[#BFDBFE]">
                  <ClockIcon className="w-3.5 h-3.5 mr-1.5" />
                  {t('orderDetails.extensionPending', { defaultValue: 'Extension Pending' })}
                </span>
              )}
            </div>
            
            <div className="text-[14px] text-textGrayColor flex items-center gap-1.5 ml-2 md:ml-10">
              <span>{t('orderDetails.purchasedOn', { defaultValue: 'Purchased on' })}</span>
              <span className="font-bold text-subTitleColor">{formattedDate}</span>
              <span className="px-1.5">.</span>
              <span>{t('orderDetails.expectedDelivery', { defaultValue: 'Expected delivery in' })}</span>
              <span className="font-bold text-subTitleColor">
                {(order.status === 'COMPLETED' || order.status === 'DELIVERED') ? 'Few hours' : `${order.deliveryDays} Days`}
              </span>
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
            {process.env.NODE_ENV === 'development' && (
              <div className="relative group">
                <button 
                  disabled={isChangingStatus}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100 font-bold text-[14px] transition-colors shadow-sm disabled:opacity-50"
                >
                  {isChangingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
                  Dev: Change Status
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  {[
                    'PENDING_PAYMENT',
                    'PENDING',
                    'IN_PROGRESS',
                    'DELIVERED',
                    'COMPLETED',
                    'CANCELLED',
                    'REJECTED',
                    'DISPUTED'
                  ].map(status => (
                    <button
                      key={status}
                      onClick={() => devChangeOrderStatus(status)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors font-medium border-b border-gray-100 last:border-b-0"
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(order.status === 'IN_PROGRESS' || order.status === 'COMPLETED' || order.status === 'DELIVERED') && (
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
               {t('orderDetails.messageCustomer', { defaultValue: 'Message Customer' })}
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 w-full items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col w-full h-full">
          {order.status === 'REJECTED' && <RejectCard order={order} />}
          <ServiceInfoCard order={order} />
         {(order.status === 'IN_PROGRESS' || (order.extensions && order.extensions.length > 0)) && <TimeRemainingCard timeRemaining={order.timeRemaining} extensions={order.extensions} />}
          
         {isRevision ? (
            <>
              <RevisionStatusCard order={order} />
              {order.status === 'IN_REVISION' && (
                <OrderAttachments 
                  formData={attachmentsFormData}
                  handleChange={handleAttachmentsChange}
                  errors={attachmentsErrors}
                  handleAddError={handleAttachmentsAddError}
                  handleArrayChange={handleAttachmentsArrayChange}
                  isSubmited={isAttachmentsSubmited}
                />
              )}
              <RevisionDetailsCard order={order} />
              {order.deliveries && order.deliveries.length > 0 ? (
                order.deliveries.map(delivery => (
                  <ReviewDeliveryCard 
                    key={delivery.id} 
                    order={{ ...order, deliveries: [delivery] }} 
                  />
                ))
              ) : (
                <ReviewDeliveryCard order={order} />
              )}
            </>
          ) : (
            <OrderRequirements order={order} />
          )}

          {(!isRevision && (order.status === 'COMPLETED' || order.status === 'DELIVERED' || order.status === 'DISPUTED')) && (
            (order.deliveries && order.deliveries.length > 0) ? (
              order.deliveries.map((delivery) => (
                <ReviewDeliveryCard 
                  key={delivery.id} 
                  order={{ ...order, deliveries: [delivery] }} 
                />
              ))
            ) : (
              <ReviewDeliveryCard order={order} />
            )
          )}
          
          {order.status === 'IN_PROGRESS' && (
            <OrderAttachments 
              formData={attachmentsFormData}
              handleChange={handleAttachmentsChange}
              errors={attachmentsErrors}
              handleAddError={handleAttachmentsAddError}
              handleArrayChange={handleAttachmentsArrayChange}
              isSubmited={isAttachmentsSubmited}
            />
          )}
          {order.feedback && <CustomerFeedback order={order} />}

          {/* Bottom Actions (Left Column) */}
          <div className="mt-6">
            {(order.status === 'PENDING') && (
              <div className='flex flex-row gap-4'>
              <button
                onClick={() => setIsRejectModalOpen(true)}
                className="px-6 py-2.5 rounded-lg bg-[#FEE2E2] text-[#DC2626] font-bold text-[14px] hover:bg-red-200 transition-colors"
              >
                {t('orderDetails.reject', { defaultValue: 'Reject' })}
              </button>
              <button 
                onClick={confirmOrder}
                disabled={isConfirming}
                className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors disabled:opacity-50"
              >
                {isConfirming ? 'Confirming...' : t('orders.action.confirmService', { defaultValue: 'Confirm & Start Service' })}
              </button>
              </div>
            )}

            {(order.status === 'IN_PROGRESS' || order.status === 'IN_REVISION') && (
              <div className='flex flex-row justify-between'>
                <div className='flex flex-row gap-4'>
                <button 
                  onClick={() => cancelOrder()}
                  disabled={isCancelling}
                  className="px-6 py-2.5 rounded-lg bg-[#FEE2E2] text-red-600 font-bold text-[14px] hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {isCancelling ? t('orderDetails.cancelling', { defaultValue: 'Cancelling...' }) : t('orderDetails.cancelOrder', { defaultValue: 'Cancel Order' })}
                </button>
                <button
                  onClick={handleSubmitOrder}
                  disabled={isDelivering || isDeliveringRevision}
                  className="px-5 py-2 rounded-[8px] bg-blueSite text-white text-[14px] font-bold hover:bg-blueSiteHover transition-colors disabled:opacity-50"
                >
                  {isDelivering || isDeliveringRevision ? 'Submitting...' : t('orders.action.submitOrder', { defaultValue: 'Submit Order' })}
                </button>
                </div>

                <div>
                  <button 
                    onClick={() => setIsExtensionModalOpen(true)}
                    className='text-[16px] text-blueSite hover:scale-105 transition-transform'
                  >
                   + Add Extension  Days
                  </button>
                </div>
              </div>
            )}

            {order.status === 'REVISION_REQUESTED' && (
              <div className='flex flex-row gap-4'>
                <button
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-[#F8D4D4] text-[#DC2626] font-bold text-[14px] hover:bg-red-200 transition-colors"
                >
                  {t('orderDetails.reject', { defaultValue: 'Reject' })}
                </button>
                <button 
                  onClick={() => setIsRevisionModalOpen(true)}
                  className="px-5 py-2 rounded-[8px] bg-blueSite  text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
                >
                  {t('orderDetails.approveRevision', { defaultValue: 'Approve Revision' })}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <OrderSummaryCard order={order} />
   
          <NeedHelpCard />
        </div>

      </div>

      <SubmitedSuccess
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={() => refetch()}
      />

      <ExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        onSubmit={() => {
          setIsExtensionSuccessOpen(true);
          refetch()
        }}
      />

      <ExtensionRequestSent
        isOpen={isExtensionSuccessOpen}
        onClose={() => setIsExtensionSuccessOpen(false)}
      />

      <RevisionRequestModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        order={order}
        isSubmitting={isAcceptingRevision}
        onApprove={async () => {
          const activeRevisionId = order.revisions && order.revisions.length > 0 ? order.revisions[0].id : null;
          if (activeRevisionId) {
            const success = await acceptRevision(activeRevisionId);
            if (success) {
              setIsRevisionModalOpen(false);
            }
          }
        }}
        onReject={() => {
          // Implement reject logic
          setIsRevisionModalOpen(false);
          setIsRevisionRejectModalOpen(true);
        }}
      />

      <RevisionRejectModal
        isOpen={isRevisionRejectModalOpen}
        onClose={() => setIsRevisionRejectModalOpen(false)}
        order={order}
        isSubmitting={isRejectingRevision}
        onSubmit={async (reason) => {
          const activeRevisionId = order.revisions && order.revisions.length > 0 ? order.revisions[0].id : null;
          if (activeRevisionId) {
            const success = await rejectRevision(activeRevisionId, reason);
            if (success) {
              setRejectionReason(reason);
              setIsRevisionRejectModalOpen(false);
              setIsRevisionRejectSuccessOpen(true);
            }
          }
        }}
      />

      <RevisionRejectSuccessModal
        isOpen={isRevisionRejectSuccessOpen}
        onClose={() => setIsRevisionRejectSuccessOpen(false)}
        order={order}
        reason={rejectionReason}
      />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        isSubmitting={isCreatingDispute}
        order={order}
        onSubmit={async (reason_id, description) => {
          if (!orderId) return;
          const success = await createDispute(orderId, reason_id as number, description);
          if (success) {
            setIsDisputeModalOpen(false);
            refetch();
          }
        }}
      />
    </div>
  );
};

// Local inline helper icons
const MessageSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);
const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
const RefreshCwIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

export default OrderDetailsPage;
