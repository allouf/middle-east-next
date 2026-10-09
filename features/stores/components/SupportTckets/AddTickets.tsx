"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Flag } from "lucide-react";


import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import SelectField from "@/components/ui/SelectFiled";
import useFormData from "@/lib/Hooks/useFormData";
import usePostData from "@/lib/api/usePostData";
import { Support_Tikctes } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { TicketFormState } from "../../types/supportTikets";

type AddTicketsProps = {
  store_id?: string | number | null;
};


const AddTickets: React.FC<AddTicketsProps> = ({ store_id }) => {
  const { t } = useTranslation();

  const initialFormState: TicketFormState = useMemo(
    () => ({
      store_id: "",
      order_id: "",
      issue_type_id: "",
      subject: "",
      message: "",
      attachments: [],
    }),
    []
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [hasOrder, setHasOrder] = useState<boolean>(false);

  const { formData, setFormData, handleChange, resetForm } =
    useFormData<TicketFormState>(initialFormState);

  const { postData, loading } = usePostData(Support_Tikctes.createTikets);

  // Inject store_id when modal opens
  useEffect(() => {
    if (store_id && modalOpen) {
      setFormData((prev) => ({ ...prev, store_id: String(store_id) }));
    }
  }, [store_id, modalOpen, setFormData]);

  // If user toggles "No", clear order_id
  useEffect(() => {
    if (!hasOrder) {
      setFormData((prev) => ({ ...prev, order_id: "" }));
    }
  }, [hasOrder, setFormData]);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, attachments: files }));
  };

  // Submit ticket
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData();

    // Append normal fields
    payload.append("store_id", formData.store_id);
    payload.append("issue_type_id", formData.issue_type_id);
    payload.append("subject", formData.subject);
    payload.append("message", formData.message);

    // Append order_id only when hasOrder is true and value exists
    if (hasOrder && formData.order_id) {
      payload.append("order_id", formData.order_id);
    }

    // Append files
    formData.attachments.forEach((file) => payload.append("attachments[]", file));

    await postData(payload, {
      onSuccess: () => {
        // Swal.fire({
        //   icon: "success",
        //   title: t("common.success"),
        //   text: t("tickets.success"),
        //   timer: 1800,
        //   showConfirmButton: false,
        // });

        resetForm();
        setHasOrder(false);
        setModalOpen(false);
      },
    });
  };

  return (
    <div>
      {/* Red Flag Button */}
      <Button
        unstyled
        onClick={() => setModalOpen(true)}
        disabled={!store_id}
        className="p-4 rounded-full bg-red-600 flex items-center gap-2 text-sm"
      >
        <Flag className="text-textWhiteColor" size={16} />
      </Button>

      {/* Add Ticket Modal */}
      <Modal
        id="add-tickets-modal"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 space-y-6"
      >
        <h3 className="text-lg font-semibold">{t("tickets.addTicket")}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t("tickets.relatedToOrder")}
            </label>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hasOrder"
                  checked={hasOrder === true}
                  onChange={() => setHasOrder(true)}
                />
                {t("tickets.yes")}
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="hasOrder"
                  checked={hasOrder === false}
                  onChange={() => setHasOrder(false)}
                />
                {t("tickets.no")}
              </label>
            </div>
          </div>

          {hasOrder && (
            <SelectField
              label={t("tickets.orderLabel")}
              name="order_id"
              value={formData.order_id}
              onChange={handleChange("order_id")}
              options={[
                { label: t("tickets.paymentIssue"), value: 1 },
                { label: t("tickets.shippingIssue"), value: 2 },
                { label: t("tickets.productIssue"), value: 3 },
              ]}
            />
          )}

          <SelectField
            label={t("tickets.issueType")}
            name="issue_type_id"
            value={formData.issue_type_id}
            onChange={handleChange("issue_type_id")}
            url={Support_Tikctes.showIssueType}
          />

          <InputField
            label={t("tickets.subject")}
            name="subject"
            value={formData.subject}
            onChange={handleChange("subject")}
            required
          />

          <InputField
            label={t("tickets.message")}
            name="message"
            value={formData.message}
            onChange={handleChange("message")}
            textarea
            required
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm"
            accept="image/*,.pdf,.doc,.docx"
          />

          <Button type="submit" loading={loading} className="w-full">
            {t("tickets.submit")}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AddTickets;
