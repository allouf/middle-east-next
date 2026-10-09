"use client";

import React, { useState } from 'react';
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/lib/context/AlertProvider';
import { clientOrderService } from '@/features/profile/components/ServiceMarket/Client/services/client-order.service';

import SelectedPlanCard from './components/SelectedPlanCard';
import ServiceInfoCard from './components/ServiceInfoCard';
import OrderRequirementsCard from './components/OrderRequirementsCard';
import OrderSummaryCard from './components/OrderSummaryCard';
import ProviderCard from './components/ProviderCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import useGetData from '@/lib/api/useGetData';
import { SERVICES_PUBLIC_ENDPOINTS } from '@/shared/constants/urls';
import SelectPlanModal from './components/modals/SelectPlanModal';

const CreateOrderPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { message } = useAlert();

  const serviceId = searchParams.get('serviceId');
  const planId = searchParams.get('planId');
  const [activePlanId, setActivePlanId] = useState<string | null>(planId);

  React.useEffect(() => {
    if (planId && !activePlanId) {
      setActivePlanId(planId);
    }
  }, [planId]);

  const {data,loading,error} = useGetData({url:SERVICES_PUBLIC_ENDPOINTS.getDetails(Number(serviceId))})
  
  const serviceData = data?.data;
  const selectedPlan = serviceData?.plans?.find((p: any) => String(p.id) === String(activePlanId)) || serviceData?.plans?.[0] || null;

  const [step, setStep] = useState<'create' | 'payment'>('create');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBack = () => {
    if (step === 'payment') {
       setStep('create');
    } else {
       router.back();
    }
  };

  const handleConfirmPayment = async () => {
    if (!note.trim()) {
      message.error(t("services.orderModal.notesRequired", { defaultValue: "Please provide order notes/requirements." }));
      setStep('create'); // Make sure user can add notes
      return;
    }
    if (!serviceId || (!activePlanId && !selectedPlan?.id)) {
      message.error(t("services.orderModal.missingData", { defaultValue: "Missing required order data." }));
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    // Backend expects polymorphic order shape; legacy service_offer_id /
    // service_offer_plan_id shim was removed, so the create-order endpoint
    // 422s without orderable_type + orderable_id.
    formData.append("orderable_type", "service_offer");
    formData.append("orderable_id", String(serviceId));
    formData.append("plan_id", String(activePlanId || selectedPlan?.id));
    formData.append("notes", note);

    files.forEach((file) => {
      formData.append("attachments[]", file);
    });

    const response = await clientOrderService.createOrder(formData, {
      onError: (err: any) => {
        const status = err?.response?.status;
        const apiMessage = err?.response?.data?.message ?? err?.message;
        if (status === 422 && typeof apiMessage === "string" && /stripe|onboarding|payment/i.test(apiMessage)) {
          message.error(
            t("services.orderModal.sellerOnboardingPending", {
              defaultValue: "This seller hasn't finished payment onboarding yet, so they can't accept orders.",
            }),
          );
        } else {
          message.error(apiMessage || t("common.errorOccurred", { defaultValue: "An error occurred." }));
        }
      },
    });

    setIsSubmitting(false);

    if (!response?.status) {
      return;
    }

    // Backend returns { order, checkout_url }. For single-offer orders the
    // checkout_url is always present — redirect the buyer to Stripe Checkout.
    // Order stays PendingPayment until the webhook lands.
    const checkoutUrl: string | null | undefined = response.data?.checkout_url;

    if (checkoutUrl) {
      message.success(
        t("services.orderModal.redirectingToCheckout", { defaultValue: "Redirecting to checkout..." }),
      );
      window.location.href = checkoutUrl;
      return;
    }

    // Defensive fallback (shouldn't happen for single-offer orders).
    message.success(t("services.orderModal.success", { defaultValue: "Order created successfully!" }));
    router.push("/dashboard?tab=service_market&subTab=my_order_customer");
  };

   

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">

      {/* Top Header Navigation */}
      <div className="flex flex-col gap-6 w-full mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blueSite font-bold hover:text-blueSiteHover transition-colors w-max uppercase text-[20px]"
        >
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
          GO BACK
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
          {/* Title and Subtitle */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-blueSite font-extrabold text-[28px] w-1.5 h-8 bg-blueSite rounded-full" />
              <h1 className="text-[24px] md:text-[28px] font-bold text-subTitleColor">
                New Order
              </h1>
            </div>
            <p className="text-[16px] 2xl:text-[18px] text-textGrayColor max-w-2xl ml-2 md:ml-4 mt-2">
              Please review the details of your selected service package and make sure all information is correct before completing your payment.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col w-full h-full min-h-[500px]">
          {loading ? (
             <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blueSite" /></div>
          ) : step === 'create' ? (
            <div className="flex flex-col w-full animate-in fade-in duration-300">
              {serviceData && <ServiceInfoCard service={serviceData} />}
              {selectedPlan && (
                 <SelectedPlanCard 
                    plan={selectedPlan} 
                    onChangeClick={() => setIsModalOpen(true)} 
                 />
              )}
              <OrderRequirementsCard
                 note={note}
                 files={files}
                 onNoteChange={setNote}
                 onFilesChange={setFiles}
              />
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300 w-full">
              <PaymentMethodCard />
            </div>
          )}
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          {selectedPlan && (
            <OrderSummaryCard 
               plan={selectedPlan}
               step={step}
               onCompletePayment={() => setStep('payment')} 
               onConfirmPayment={handleConfirmPayment}
               isSubmitting={isSubmitting}
            />
          )}
          {serviceData && <ProviderCard provider={serviceData.service_provider} />}
        </div>

      </div>

      {serviceData && serviceData.plans && (
          <SelectPlanModal 
             isOpen={isModalOpen}
             onClose={() => setIsModalOpen(false)}
             plans={serviceData.plans}
             currentSelectedId={selectedPlan?.id}
             onSelect={(newPlanId) => {
                setActivePlanId(String(newPlanId));
             }}
          />
      )}
    </div>
  );
};

export default CreateOrderPage;
