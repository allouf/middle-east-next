'use client';

import React, { useEffect } from 'react'
import InputField from "../../../../components/ui/InputField";
import SelectField from "../../../../components/ui/SelectFiled";
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FlashSellCreateFirstStepProps } from '../../types/flashSell';

const FlashSellCreateFirstStep: React.FC<FlashSellCreateFirstStepProps> = ({formData,handleChange,handleAddError,errors,isSubmited}) => {


  useEffect(()=>{
    console.log("errors",errors)
  },[errors])
  const {t} = useTranslation()
  return (
    <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        id="name"
        label={t("labels.name")}
        placeholder={t("flashSell.fields.namePlaceholder")}
        value={formData.name}
        onChange={handleChange("name")}
        unstyled
        withFieldset
        required
        handleAddError={handleAddError}
        formErrors={errors}
        validate={true}
        isSubmited = {isSubmited} 
        onSubmit={true}
        
      />
      <InputField
        id="description"
        label={t("labels.description")}
        placeholder={t("flashSell.fields.descriptionPlaceholder")}
        value={formData.description}
        onChange={handleChange("description")}
        unstyled
        withFieldset
        required
        handleAddError={handleAddError}
        formErrors={errors}
        validate={true}
        isSubmited = {isSubmited}
        onSubmit={true}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SelectField
        id="discount_type"
        label={t("labels.discount_type")}
        placeholder={t("flashSell.fields.selectDiscountType")}
        selectorOptions={[
          { id: "percentage", name: t("flashSell.discountTypes.percentage") },
          { id: "fixed", name: t("flashSell.discountTypes.flat") },
        ]}
        value={formData.discount_type}
        onChange={handleChange("discount_type")}
        unstyled
        withFieldset 
        required 
        handleAddError={handleAddError}
        formErrors={errors} 
        isSubmited = {isSubmited} 
        validate={true}
        onSubmit={true}
        
        
      />
   { formData.discount_type=="percentage"?
      <InputField
              id="discount_value"
              label={t("labels.discount_value")}
              type="number"
              placeholder={t("flashSell.fields.discountValue")}
              className={"py-1"}
              value={formData.discount_value}
              onChange={handleChange("discount_value")}
              unstyled
              withFieldset
              required
              handleAddError={handleAddError}
              formErrors={errors}
              validate={true}
              isSubmited = {isSubmited} 
              conditions={{number:{min:0,max:100}}}
              onSubmit={true}
            />:
            <InputField
              id="discount_value"
              label={t("labels.discount_value")}
              type="number"
              className={"py-1"}
              placeholder={t("flashSell.fields.discountValue")}
              value={formData.discount_value}
              onChange={handleChange("discount_value")}
              unstyled
              withFieldset
              required
              handleAddError={handleAddError}
              formErrors={errors}
              validate={true}
              isSubmited = {isSubmited} 
              onSubmit={true}
            
            />}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        id="start_date"
        label={t("labels.start_date")}
        type="datetime-local"
        value={formData.start_date}
        onChange={handleChange("start_date")}
        unstyled
        withFieldset 
        required
        handleAddError={handleAddError}
        formErrors={errors}
        validate={true}
        isSubmited = {isSubmited}
        onSubmit={true}
      />

      <InputField
        id="end_date"
        label={t("labels.end_date")}
        type="datetime-local"
        value={formData.end_date}
        onChange={handleChange("end_date")}
        unstyled
        withFieldset
        required
        handleAddError={handleAddError}
        formErrors={errors}
        validate={true}
        isSubmited = {isSubmited}
        onSubmit={true}
      />
    </div>

    <InputField
      id="max_per_user"
      label={t("labels.max_per_user")}
      type="number"
      placeholder={t("flashSell.fields.maxPerUserPlaceholder")}
      value={formData.max_per_user}
      onChange={handleChange("max_per_user")}
      unstyled
      withFieldset 
      required
      handleAddError={handleAddError}
      formErrors={errors} 
      onSubmit={true}
    />
  </div>
  )
}

export default FlashSellCreateFirstStep
