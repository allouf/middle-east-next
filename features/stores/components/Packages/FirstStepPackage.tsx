import React from 'react'
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectFiled';
import { DiscountType, PackageFormState } from '../../types/PackageTypes';
import { useTranslation } from '@/lib/i18n/useTranslation';



type FormErrors = Record<string, string>;

export interface FirstStepPackageProps {
  formData: PackageFormState;

  handleChange: (
    field: keyof PackageFormState
  ) => (value: any) => void;

  handleAddError?: (id: string, value: string) => void;
  errors?: FormErrors;

  isSubmited?: boolean;

  discountType: DiscountType;
  setDiscountType: React.Dispatch<React.SetStateAction<DiscountType>>;
}

const FirstStepPackage: React.FC<FirstStepPackageProps> = ({ formData, handleChange, handleAddError, errors, isSubmited, discountType, setDiscountType }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 m-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          id="title"
          label={t('create_package.package_title')}
          placeholder={t('create_package.package_title_placeholder')}
          value={formData.title}
          onChange={handleChange('title')}
          unstyled
          withFieldset
          required
          validate
          formErrors={errors}
          handleAddError={handleAddError}
          isSubmited={isSubmited}
          onSubmit={true}
        />

        <InputField
          id="description"
          label={t('create_package.description')}
          placeholder={t('create_package.description_placeholder')}
          value={formData.description}
          onChange={handleChange('description')}
          unstyled
          withFieldset
          required
          validate
          formErrors={errors}
          handleAddError={handleAddError}
          isSubmited={isSubmited}
          onSubmit={true}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          id="discount_type"
          label={t('create_package.discount_type')}
          placeholder={t('create_package.select_discount_type')}
          selectorOptions={[
            { id: 'percentage', name: t('create_package.percentage') },
            { id: 'flat', name: t('create_package.flat_amount') },
          ]}
          value={discountType}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDiscountType(e.target.value as DiscountType)
          }
          unstyled
          withFieldset
          required
          validate
          formErrors={errors}
          handleAddError={handleAddError}
          isSubmited={isSubmited}
        />

        {discountType === 'percentage' ? (
          <InputField
            id="discount_percent"
            label={t('create_package.discount_value')}
            type="number"
            placeholder={t('create_package.discount_value')}
            value={formData.discount_percent}
            onChange={handleChange('discount_percent')}
            unstyled
            withFieldset
            required
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            isSubmited={isSubmited}
            conditions={{ number: { min: 0, max: 100 } }}
            onSubmit={true}
          />
        ) : (
          <InputField
            id="fixed_discount"
            label={t('create_package.fixed_discount_value')}
            type="number"
            placeholder={t('create_package.fixed_discount_value')}
            value={formData.fixed_discount}
            onChange={handleChange('fixed_discount')}
            unstyled
            withFieldset
            required
            validate
            formErrors={errors}
            handleAddError={handleAddError}
            isSubmited={isSubmited}
            onSubmit={true}
          />
        )}
      </div>
    </div>
  )
}

export default FirstStepPackage