import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/ui/InputField";
import SelectFiled from "@/components/ui/SelectFiled";
import MultiImageUpload from "@/components/ui/MultiImageUpload";
import { SERVICE_MARKET_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { RfqFormState, RfqFormErrors } from "../../../types/Rfq";

interface MainFormFieldsProps {
  form: RfqFormState;
  onChangeField: (key: keyof RfqFormState, value: any) => void;
  isSubmited: boolean;
  errors: RfqFormErrors;
}

export default function MainFormFields({ form, onChangeField, isSubmited, errors }: MainFormFieldsProps) {
  const { t } = useTranslation();

  const DELIVERY_MODEL_OPTIONS = [
    { label: "Remote", value: "Remote" },
    { label: "Onsite", value: "Onsite" },
    { label: "Hybrid", value: "Hybrid" },
  ];

  return (
    <div className="space-y-6">
      {/* Title field - full width on all screens */}
      <InputField
        id="title"
        label={t('serviceMarket.rfq.createForm.fields.serviceTitle')}
        value={form.title}
        onChange={(e) => {
          if (e && typeof e === 'object' && 'target' in e && e.target) {
            const target = e.target as HTMLInputElement;
            onChangeField("title", target.value);
          } else if (typeof e === 'string') {
            onChangeField("title", e);
          }
        }}
        placeholder={t('serviceMarket.rfq.createForm.fields.serviceTitlePlaceholder')}
        withFieldset
        required
        isSubmited={isSubmited}
        error={errors.title}
      />

      {/* Budget fields - side by side on tablet and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <InputField
          id="budget_min"
          label={t('serviceMarket.rfq.createForm.fields.budgetMin')}
          value={form.budget_min}
          type="numric"
          min={0}
          onChange={(e) => {
            if (e && typeof e === 'object' && 'target' in e && e.target) {
              const target = e.target as HTMLInputElement;
              onChangeField("budget_min", target.value);
            } else if (typeof e === 'string') {
              onChangeField("budget_min", e);
            }
          }}
          placeholder="$ 40.00"
          withFieldset
          isSubmited={isSubmited}
          error={errors.budget_min}
        />

        <InputField
          id="budget_max"
          label={t('serviceMarket.rfq.createForm.fields.budgetMax')}
          value={form.budget_max}
          type="numric"
          min={0}
          onChange={(e) => {
            if (e && typeof e === 'object' && 'target' in e && e.target) {
              const target = e.target as HTMLInputElement;
              onChangeField("budget_max", target.value);
            } else if (typeof e === 'string') {
              onChangeField("budget_max", e);
            }
          }}
          placeholder="$ 80.00"
          withFieldset
          isSubmited={isSubmited}
          error={errors.budget_max}
        />
      </div>

      {/* Category and Delivery Model - side by side on tablet and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SelectFiled
          id="category_id"
          label={t('serviceMarket.rfq.createForm.fields.serviceCategory')}
          onChange={(e) => onChangeField("category_id", e.target.value)}
          value={form.category_id || null}
          url={SERVICE_MARKET_ENDPOINTS.customRequestCategories}
          placeholder={t('serviceMarket.rfq.createForm.fields.categoryPlaceholder')}
          withFieldset
          validate
          required
          isSubmited={isSubmited}
          error={errors.category_id}
        />
          <SelectFiled
            id="delivery_model"
            label={t('serviceMarket.rfq.createForm.fields.deliveryModel')}
            onChange={(e) => onChangeField("delivery_model", e.target.value)}
            value={form.delivery_model || null}
            selectorOptions={DELIVERY_MODEL_OPTIONS.map(opt => ({ id: opt.value, name: opt.label }))}
            placeholder={t('serviceMarket.rfq.createForm.fields.deliveryModelPlaceholder')}
            withFieldset
            unstyled
            // className="!max-w-[50px]"
            validate
            required
            isSubmited={isSubmited}
            error={errors.delivery_model}
          />
      </div>

      {/* Deadline field - full width */}
      <InputField
        id="deadline_date"
        label={t('serviceMarket.rfq.createForm.fields.deadline')}
        value={form.deadline_date}
        onChange={(e) => {
          if (e && typeof e === 'object' && 'target' in e && e.target) {
            const target = e.target as HTMLInputElement;
            onChangeField("deadline_date", target.value);
          } else if (typeof e === 'string') {
            onChangeField("deadline_date", e);
          }
        }}
        placeholder="dd / mm / yyyy"
        withFieldset
        type="date"
        isSubmited={isSubmited}
        error={errors.deadline_date}
      />

      {/* Attachments - full width */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-textGrayColor">
          {t('serviceMarket.rfq.createForm.fields.attachments')}
        </label>
        <div className="rounded-2xl bg-white">
          <MultiImageUpload
            id="attachments"
            label=""
            defaultImages={[]}
            value={form.attachments}
            onImagesChange={(files) => {
              onChangeField("attachments", files);
            }}
            withFieldset
          />
        </div>
      </div>
    </div>
  );
}
