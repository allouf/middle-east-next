import React from "react";
import { useTranslation } from "react-i18next";
import InputField from "@/components/ui/InputField";
import { RfqFormState, RfqFormErrors } from "../../../types/Rfq";
import RFQBenefitsCard from "./RFQBenefitsCard";

interface DescriptionSectionProps {
  form: RfqFormState;
  onChangeField: (key: keyof RfqFormState, value: any) => void;
  isSubmited: boolean;
  errors: RfqFormErrors;
}

export default function DescriptionSection({ form, onChangeField, isSubmited, errors }: DescriptionSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <InputField
        id="description"
        label={t('serviceMarket.rfq.createForm.fields.projectDescription')}
        value={form.description}
        onChange={(e) => {
          if (e && typeof e === 'object' && 'target' in e && e.target) {
            const target = e.target as HTMLTextAreaElement;
            onChangeField("description", target.value);
          } else if (typeof e === 'string') {
            onChangeField("description", e);
          }
        }}
        placeholder={t('serviceMarket.rfq.createForm.fields.projectDescriptionPlaceholder')}
        withFieldset
        type="textarea"
        rows={6}
        required
        isSubmited={isSubmited}
        error={errors.description}
      />

      <RFQBenefitsCard />
    </div>
  );
}
