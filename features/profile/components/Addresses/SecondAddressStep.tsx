"use client";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import usePostData from "@/lib/api/usePostData";
import usePutData from "@/lib/api/usePutData";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ADDRESSES_ENDPOINT } from "@/shared/constants/urls";
import { Briefcase, Plus } from "lucide-react";
import React, { useMemo, useState, FormEvent, useCallback } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { LocationData } from "./AddressAutoComplete";
import { AddressFormData, TitleOption } from "@/features/profile/types/addresses";
import { MessageInstance } from "antd/es/message/interface";

interface SecondAddressStepProps {
  formData: LocationData;
  handleArrayChange: (field: keyof LocationData, value: any) => void;
  errors: Record<string, string | undefined>;
  handleChange: (field: string) => (value: string) => void;
  handleAddError: (field: string, error: string) => void;
  isValid: boolean;
  handleBackToMap: () => void;
  messageApi: MessageInstance;
  showNewTitleInput: boolean;
  setShowNewTitleInput: (show: boolean) => void;
  handleClose: () => void;
  refetch?: () => void;
  isEdit: boolean;
}


const PRESET_TITLES: TitleOption[] = [
  { value: "home", kind: "preset" },
  { value: "office", kind: "preset" },
  { value: "work", kind: "preset" },
];

const SecondAddressStep: React.FC<SecondAddressStepProps> = ({
  formData,
  handleArrayChange,
  errors,
  handleChange,
  handleAddError,
  isValid,
  handleBackToMap,
  messageApi,
  showNewTitleInput,
  setShowNewTitleInput,
  handleClose,
  refetch,
  isEdit,
}) => {
  const { t } = useTranslation();

  const [titles, setTitles] = useState<TitleOption[]>(PRESET_TITLES);
  const [newTitle, setNewTitle] = useState<string>("");
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const { postData, loading: postingAddress } = usePostData(ADDRESSES_ENDPOINT.add);
  const { putData, loading: puttingAddress } = usePutData(
    ADDRESSES_ENDPOINT.update(formData?.id || "")
  );

  const getTitleLabel = useCallback(
    (item: TitleOption) => {
      if (item.kind === "preset") return t(`address.titleButton.${item.value}`);
      return item.value;
    },
    [t]
  );

  const addNewTitle = (): void => {
    const formatted = newTitle.trim();
    if (!formatted) return;

    setTitles((prev) => [...prev, { value: formatted, kind: "custom" }]);
    handleArrayChange("title", formatted); // stored as plain text for API
    setNewTitle("");
    setShowNewTitleInput(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmited(true);

    if (!isValid) return;

    const submitData: AddressFormData = {
      title: formData.title || "",
      address: formData.address,
      lat: formData.latitude,
      lng: formData.longitude,
      city: formData.city,
      country: formData.country,
      country_code: formData.country_code,
      region: formData.region,
      postal_code: formData.postal_code || "",
      is_default: formData.is_default,
    };

    try {
      if (isEdit) {
        await putData(submitData, {
          showMessage:false,
          onSuccess: () => {
            messageApi.success(t("address.update_success"));
            setTimeout(() => refetch?.(), 1000);
            handleClose();
          },
          headers: { "Content-Type": "application/json" },
        });
      } else {
        await postData(submitData, {
           showMessage:false,
          onSuccess: () => {
            messageApi.success(t("address.create_success"));
            setTimeout(() => refetch?.(), 1000);
            handleClose();
          },
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error(`Failed to ${isEdit ? "update" : "add"} address:`, error);
      messageApi.error(t(`address.${isEdit ? "update" : "create"}_fail`));
    }
  };

  const isSaving = postingAddress || puttingAddress;

  return (
    <form onSubmit={handleSubmit}>
      <div className="border-b border-gray-300 mb-3 flex flex-row justify-between">
        <h2 className="text-lg text-textColor pb-2">{t("addressModal.moreDetails")}</h2>

        <Button
          unstyled
          type="button"
          className="text-blueIcons underline underline-offset-2 flex flex-row gap-1"
          onClick={() => handleBackToMap()}
        >
          {t("addressModal.backToMap")}
          <IoReturnUpBackOutline className="text-blueIcons text-xl" />
        </Button>
      </div>

      <div className="space-y-2 px-2">
        <div className="mb-2">
          <div className="flex items-center gap-3">
            <Button
              unstyled
              type="button"
              onClick={() => setShowNewTitleInput((prev) => !prev)}
              className="w-12 h-12 bg-blueBtn text-textWhiteColor rounded-lg flex items-center justify-center hover:bg-blueSiteHover transition-colors"
            >
              <Plus size={20} />
            </Button>

            <div className="flex gap-2 overflow-x-auto px-2 py-2">
              {titles.map((titleItem, index) => (
                <Button
                  key={index}
                  unstyled
                  type="button"
                  onClick={() => handleArrayChange("title", titleItem.value)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    formData.title === titleItem.value
                      ? "border-blueBtn bg-[#E8F5FF] text-[#0B5C8E]"
                      : "border-gray-300 text-subTitleColor hover:border-blueSite"
                  }`}
                >
                  <Briefcase size={16} className="text-blueIcons" />
                  <span>{getTitleLabel(titleItem)}</span>
                </Button>
              ))}
            </div>
          </div>

          {showNewTitleInput && (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring focus:ring-blueSite"
                placeholder={t("addressModal.titles.customPlaceholder", "Enter custom title")}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Button
                unstyled
                type="button"
                className="px-4 bg-blueBtn text-textWhiteColor rounded-lg hover:bg-blueSiteHover"
                onClick={addNewTitle}
              >
                {t("common.add")}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-5">
          <InputField
            id="country"
            label={t("form.country")}
            placeholder={t("form.placeholders.country", "Enter your country")}
            type="text"
            value={formData.country}
            onChange={handleChange("country")}
            handleAddError={handleAddError}
            unstyled
            withFieldset
            formErrors={errors}
            showErrorMessage
            validate
            required
            disabled
          />

          <InputField
            id="city"
            label={t("form.city")}
            placeholder={t("form.placeholders.city", "Enter your city")}
            type="text"
            value={formData.city}
            onChange={handleChange("city")}
            handleAddError={handleAddError}
            unstyled
            withFieldset
            formErrors={errors}
            showErrorMessage
            validate
            required
          />
        </div>

        <div className="grid grid-cols-1">
          <InputField
            id="address"
            label={t("form.street")}
            placeholder={t("form.placeholders.street", "Enter your street")}
            type="text"
            value={formData.address}
            onChange={handleChange("address")}
            handleAddError={handleAddError}
            unstyled
            withFieldset
            formErrors={errors}
            showErrorMessage
            validate
            required
            isSubmited={isSubmited}
            onSubmit
          />
        </div>

        <div className="grid grid-cols-1">
          <InputField
            id="postal_code"
            label={t("form.postal_code")}
            placeholder={t("form.placeholders.postal_code", "Enter your postal code")}
            type="text"
            value={formData.postal_code}
            onChange={handleChange("postal_code")}
            handleAddError={handleAddError}
            unstyled
            withFieldset
            formErrors={errors}
            showErrorMessage
            validate={false}
            isSubmited={isSubmited}
            onSubmit
          />
        </div>

        <label className="flex items-center gap-2 space-x-2 py-2">
          <input
            type="checkbox"
            checked={formData.is_default}
            className="w-4 h-4"
            onChange={(e) => handleArrayChange("is_default", e.target.checked)}
          />
          <span className="text-sm text-subTitleColor">{t("form.isDefault")}</span>
        </label>
      </div>

      <div className="w-full flex flex-row justify-center py-2">
        <Button
          type="submit"
          unstyled
          disabled={!isValid || isSaving}
          className={`w-[90%] py-1 rounded-lg font-medium transition-colors ${
            !isValid || isSaving
              ? "bg-gray-300 text-textWhiteColor cursor-not-allowed"
              : "bg-blueBtn text-textWhiteColor hover:bg-blueSiteHover"
          }`}
        >
          {isEdit
            ? isSaving
              ? t("form.saving")
              : t("addressModal.saveInformation")
            : isSaving
            ? t("form.adding")
            : t("addressModal.addLocation")}
        </Button>
      </div>
    </form>
  );
};

export default SecondAddressStep;
