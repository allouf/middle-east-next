"use client";

import { useCallback, useState, useEffect } from "react";
import DescriptionSection from "./DescriptionSection";
import MainFormFields from "./MainFormFields";
import SectionTitle from "./SectionTitle";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useRfqClient } from "../../../hooks/useRfqClient";
import { useRfqClientApi } from "../../../hooks/useRfqClientApi";
import { RfqFormState } from "../../../types/Rfq";
import Button from "@/components/ui/Button";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import SuccessModal from "@/components/shered/SuccessModal";

interface CreateCustomRequestFormProps {
  onClose?: () => void;
  isEditMode?: boolean;
  requestId?: string | null;
}

export default function CreateCustomRequestForm({ onClose, isEditMode = false, requestId }: CreateCustomRequestFormProps) {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { showRequest } = useRfqClientApi();

  const rfqHook = useRfqClient({
    required: {
      title: true,
      category_id: true,
      description: true,
    },
    onSuccess: () => {
      setShowSuccessModal(true);
    },
  });

  useEffect(() => {
    if (isEditMode && requestId) {
      showRequest(requestId, {
        onSuccess: (data) => {
          const detail = data.data;
          if (detail) {
            rfqHook.setTitle(detail.title || '');
            rfqHook.setCategoryId(String(detail.category?.id || ''));
            rfqHook.setDeliveryModel(detail.delivery_model || '');
            rfqHook.setDeadlineDate(detail.deadline_date || '');
            rfqHook.setBudgetMin(detail.budget_min ?? "");
            rfqHook.setBudgetMax(detail.budget_max ?? "");
            rfqHook.setDescription(detail.description || '');
          }
        }
      });
    }
  }, [isEditMode, requestId, showRequest]);

  // Create form object from rfqHook data for UI components
  const form: RfqFormState = {
    title: rfqHook.formData.title,
    category_id: rfqHook.formData.category_id,
    delivery_model: rfqHook.formData.delivery_model,
    deadline_date: rfqHook.formData.deadline_date,
    budget_min: rfqHook.formData.budget_min,
    budget_max: rfqHook.formData.budget_max,
    description: rfqHook.formData.description,
    attachments: rfqHook.formData.attachments,
  };

  const handleChangeField = useCallback((key: keyof RfqFormState, value: any) => {
    switch (key) {
      case 'title':
        rfqHook.setTitle(value);
        break;
      case 'category_id':
        rfqHook.setCategoryId(value);
        break;
      case 'delivery_model':
        rfqHook.setDeliveryModel(value);
        break;
      case 'deadline_date':
        rfqHook.setDeadlineDate(value);
        break;
      case 'budget_min':
        rfqHook.setBudgetMin(value);
        break;
      case 'budget_max':
        rfqHook.setBudgetMax(value);
        break;
      case 'description':
        rfqHook.setDescription(value);
        break;
      case 'attachments':
        rfqHook.setAttachments(value);
        break;
    }
  }, [rfqHook]);

  const handleButtonClick = useCallback(async (e?: React.MouseEvent) => {
    await rfqHook.submitForm(isEditMode && requestId ? requestId : undefined);
  }, [rfqHook, isEditMode, requestId]);

  const handleModalClose = useCallback(() => {
    setShowSuccessModal(false);
    onClose?.();
  }, [onClose]);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-10">
      <section className="w-full mx-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 inline-flex items-center gap-2 text-blueSite hover:opacity-80"
          >
            {isRTL ? <IoArrowForward size={20} /> : <IoArrowBack size={20} />}
            <span className="font-medium text-sm sm:text-base">{t('serviceMarket.rfq.createForm.backToRequests')}</span>
          </button>
        )}
        <SectionTitle
          title={isEditMode ? t('serviceMarket.rfq.createForm.editTitle') : t('serviceMarket.rfq.createForm.title')}
          description={isEditMode ? t('serviceMarket.rfq.createForm.editDescription') : t('serviceMarket.rfq.createForm.description')}
        />

        <div className="rounded-[24px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.20),_transparent_16%),linear-gradient(180deg,#F7FAF9_0%,#F5F7F6_100%)] p-4 sm:p-5 md:p-6 lg:p-7">
          <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-2">
            <MainFormFields
              form={form}
              onChangeField={handleChangeField}
              isSubmited={rfqHook.isSubmitted}
              errors={rfqHook.errors}
            />
            <DescriptionSection
              form={form}
              onChangeField={handleChangeField}
              isSubmited={rfqHook.isSubmitted}
              errors={rfqHook.errors}
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 pt-2">
            <Button
              onClick={handleButtonClick}
              unstyled
              disabled={rfqHook.loading}
              className="!h-12 !px-6 sm:!px-10 bg-blueSite rounded-lg text-white !text-sm sm:!text-base !font-semibold w-full sm:w-auto"
            >
              {rfqHook.loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isEditMode ? t('serviceMarket.rfq.createForm.saving') : t('serviceMarket.rfq.createForm.sending')}
                </div>
              ) : (
                <>
                  {isEditMode ? t('serviceMarket.rfq.createForm.saveChanges') : t('serviceMarket.rfq.createForm.sendRequest')}
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="text-base sm:text-lg font-medium text-textColor underline underline-offset-4 w-full sm:w-auto text-center"
            >
              {t('serviceMarket.rfq.createForm.cancel')}
            </button>
          </div>
        </div>
      </section>

      <SuccessModal
        open={showSuccessModal}
        handleClose={handleModalClose}
        imageLink="/exceeded.png"
        titleKey={isEditMode ? "serviceMarket.rfq.createForm.editSuccessTitle" : "serviceMarket.rfq.createForm.successTitle"}
        descriptionKey={isEditMode ? "serviceMarket.rfq.createForm.editSuccessDescription" : "serviceMarket.rfq.createForm.successDescription"}
        buttonTextKey={isEditMode ? "serviceMarket.rfq.createForm.done" : "serviceMarket.rfq.createForm.viewMyRfqs"}
      />
    </div>
  );
}