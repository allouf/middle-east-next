"use client";

import React, { useEffect } from "react";
import { App, Modal } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import ImageField from "@/components/ui/ImageField";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { TeamMember } from "../../../types";
import { useEditCompanyTeamMember } from "../../../hooks/useEditCompanyTeamMember";

interface EditTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSuccess: () => void;
}

const EditTeamMemberModal: React.FC<EditTeamMemberModalProps> = ({
  isOpen,
  onClose,
  member,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const { formState, errors, loading, isSubmitted, updateField, submit, reset } =
    useEditCompanyTeamMember({
      endpointBase: JOBS_ENDPOINTS.updateCompanyTeam,
      member,
      required: { name: true, position: true, image: false },
      onSuccess,
    });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const handleCancel = () => {
    onClose();
    reset();
  };

  const handleSubmit = async () => {
    const res = await submit();
    if (res.ok) {
      // message.success(
      //   t("jobs.company.messages.team.updated", {
      //     defaultValue: "Team member updated successfully.",
      //   })
      // );
      onClose();
      reset();
    }
  };

  return (
    <Modal
      title={t("jobs.company.messages.team.edit", { defaultValue: "Edit member" })}
      open={isOpen}
      onCancel={handleCancel}
      centered
      width="90vw"
      style={{ maxWidth: '600px' }}
      footer={null}
      className="team-member-edit-modal"
    >
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {/* optional general error */}
          {errors.general ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-700">
              {errors.general}
            </div>
          ) : null}

          <div className="mt-3 sm:mt-4">
            <InputField
              id="name"
              type="text"
              label={t("jobs.company.team.memberName", { defaultValue: "Member Name" })}
              value={formState.name}
              onChange={(e: any) => updateField({ name: e.target.value })}
              formErrors={errors as any}
              withFieldset
              required
              isSubmited={isSubmitted}
              onSubmit={false}
              validate={false}
              placeholder={t("jobs.company.team.memberNamePlaceholder", {
                defaultValue: "Enter member name",
              })}
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <ImageField
              id="image"
              label={t("jobs.company.team.memberImage", { defaultValue: "Member Image" })}
              withFieldset
              required={false}
              value={formState.imageFile}
              image_path={member?.image || undefined}
              onChange={(file) => updateField({ imageFile: file })}
              formErrors={errors as any}
              isSubmited={isSubmitted}
              onSubmit={false}
              validate={false}
              accept="image/*"
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <InputField
              id="position"
              type="text"
              label={t("jobs.company.team.position", { defaultValue: "Job Position" })}
              value={formState.position}
              onChange={(e: any) => updateField({ position: e.target.value })}
              formErrors={errors as any}
              withFieldset
              required
              isSubmited={isSubmitted}
              onSubmit={false}
              validate={false}
              placeholder={t("jobs.company.team.positionPlaceholder", {
                defaultValue: "Enter job position",
              })}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end pt-2 sm:pt-4 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="h-10 sm:h-11 rounded-xl border border-zinc-200 px-4 sm:px-6 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 w-full sm:w-auto order-2 sm:order-1"
            >
              {t("common.cancel", { defaultValue: "Cancel" })}
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="h-10 sm:h-11 rounded-xl bg-blueSite px-4 sm:px-6 text-sm font-semibold text-white hover:bg-blueSiteHover disabled:opacity-60 w-full sm:w-auto order-1 sm:order-2"
            >
              {loading
                ? t("common.saving", { defaultValue: "Saving..." })
                : t("common.save", { defaultValue: "Save" })}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditTeamMemberModal;