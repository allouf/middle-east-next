'use client';

import React, { useEffect, useState } from "react";
import Modal from "../../../../components/ui/Modal";
import useFormData from "../../../../lib/Hooks/useFormData";
import usePostData from "../../../../lib/api/usePostData";
import { message } from "antd";

import Button from "../../../../components/ui/Button";
import { FaUserPlus } from "react-icons/fa";
import InputField from "../../../../components/ui/InputField";
import useGetData from "@/lib/api/useGetData";
import { SLA_RULES, Support_Tikctes } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface AddSlaModalProps {
  store_id: string | number;
  refetch: () => void;
}

const AddSlaModal = ({ store_id, refetch }: AddSlaModalProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const { formData, setFormData, handleChange, resetForm } = useFormData({
    store_id: store_id,
    issue_type_id: "",
    sla_response_hours: "",
  });

  const { postData, loading } = usePostData(SLA_RULES.createRule);

  const { data: issueTypes } = useGetData({
    url: Support_Tikctes.getIssueType,
  });

  useEffect(() => {
    if (store_id) {
      setFormData((prev: any) => ({
        ...prev,
        store_id,
      }));
    }
  }, [store_id, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!store_id) {
       messageApi.warning(t("store_sla.Please select or create a store first."));
      return;
    }

    await postData(formData, {
      onSuccess: () => {
        messageApi.success(t("store_sla.Rule Added!"));
        resetForm();
        refetch();
        setModalOpen(false);
      },
      onError: (err:any) => {
        // handleClose();
        const resData = err?.response?.data;
        messageApi.error(resData?.message || t("store_sla.create_error",{defaultValue:"Failed to create rule"}))
      },
      showMessage:false
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        unstyled
        onClick={() => setModalOpen(true)}
        disabled={!store_id}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm ${
          store_id
            ? "bg-blueSite hover:bg-blueSiteHover text-textWhiteColor"
            : "bg-gray-300 text-textColor cursor-not-allowed"
        }`}
      >
        <FaUserPlus /> {t("store_sla.Add Rule")}
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
           classNameContent="px-2 md:px-12 mt-12 md:mt-2"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sla Hours */}
          <InputField
            id="sla_response_hours"
            label={t("store_sla.SLA Response Hours")}
            type="number"
            value={formData.sla_response_hours}
            onChange={handleChange("sla_response_hours")}
            unstyled
            withFieldset
          />

          {/* Issue Type Selector */}
          <div className="flex flex-col w-full">
            <fieldset className="py-2 px-4 border border-grayBorder rounded-lg bg-white">
              <legend className="px-2 text-blueSite font-semibold text-sm">
                {t("store_sla.Issue Type")}
              </legend>
              <select
                id="issue_type_id"
                value={formData.issue_type_id}
                onChange={(e) => handleChange("issue_type_id")(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-subTitleColor p-0"
                required
              >
                <option value="" disabled>
                  {t("store_sla.Select Issue Type")}
                </option>
                {issueTypes?.data?.map((type: any) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>

          <div className="flex justify-end items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={!store_id || loading}
              className={`px-5 py-2 rounded-lg text-sm font-medium ${
                !store_id || loading
                  ? "bg-gray-300 text-textColor cursor-not-allowed"
                  : "bg-blueSite hover:bg-blueSiteHover text-textWhiteColor"
              }`}
            >
              {loading ? t("store_sla.Adding") : t("store_sla.Add")}
            </Button>

            <Button
              unstyled
              type="button"
              onClick={() => setModalOpen(false)}
              className="text-subTitleColor hover:text-subTitleColor text-sm font-medium"
            >
              {t("store_sla.Cancel")}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddSlaModal;
