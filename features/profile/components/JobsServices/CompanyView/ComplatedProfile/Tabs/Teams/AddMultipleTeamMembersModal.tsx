"use client";

import React from "react";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Trash2 } from "lucide-react";
import { App } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import ImageField from "@/components/ui/ImageField";
import { useCompanyTeamForm } from "../../../hooks/useCompanyTeamForm";
import { JOBS_ENDPOINTS } from "@/shared/constants/api-endpoints";

interface AddMultipleTeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMultipleTeamMembersModal: React.FC<AddMultipleTeamMembersModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const teamForm = useCompanyTeamForm({
    endpoint: JOBS_ENDPOINTS.addCompanyTeam,
    required: {
      name: true,
      position: true,
      image: false, // Make image optional for better UX
    },
    onSuccess: () => {
      // message.success(
      //   t("jobs.company.messages.team.updated", {
      //     defaultValue: "Team members added successfully.",
      //   })
      // );
      onSuccess();
      onClose();
    },
  });

  const handleSave = async () => {
    const hide = message.loading(
      t("jobs.company.messages.team.updating", {
        defaultValue: "Adding team members...",
      }),
      0
    );

    const res = await teamForm.submitAll();
    hide();

    if (!res.ok) {
      if (res.failedAt) {
        message.error(
          t("jobs.company.messages.team.memberFailed", {
            defaultValue: `Failed while saving member #${res.failedAt}`,
            num: res.failedAt,
          })
        );
      } else {
        message.error(
          t("jobs.company.messages.team.updateFailed", {
            defaultValue: "Failed to add team members.",
          })
        );
      }
      return;
    }
  };

  const handleCancel = () => {
    teamForm.resetAll();
    onClose();
  };

  return (
    <Modal
      title={t("jobs.company.messages.team.addMultiple", { 
        defaultValue: "Add Team Members" 
      })}
      open={isOpen}
      onCancel={handleCancel}
      centered
      width="90vw"
      style={{ maxWidth: '800px' }}
      footer={null}
      className="add-team-members-modal "
    >
      <div className="rounded-2xl bg-white max-h-[80vh] overflow-y-auto">
        <div className="space-y-4 sm:space-y-6 p-1 sm:p-6">
          {teamForm.formData.team.map((m, index) => (
            <div
              key={index}
              className="relative rounded-xl sm:rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm"
            >
              {/* subtle green glow */}
              <div className="pointer-events-none absolute -inset-1 sm:-inset-2 -z-10 rounded-2xl sm:rounded-3xl bg-emerald-50/70 blur-xl" />

              {teamForm.formData.team.length > 1 && (
                <button
                  type="button"
                  onClick={() => teamForm.removeMember(index)}
                  className="absolute end-2 top-2 sm:end-3 sm:top-3 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
                  aria-label={t("jobs.company.team.remove", { defaultValue: "Remove member" })}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                </button>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <InputField
                  id={`team.${index}.name`}
                  type="text"
                  label={t("jobs.company.team.memberName", { defaultValue: "Member Name" })}
                  value={m.name}
                  onChange={(e: any) =>
                    teamForm.updateMember(index, { name: e.target.value })
                  }
                  formErrors={teamForm.errors}
                  withFieldset
                  required
                  isSubmited={teamForm.isSubmitted}
                  onSubmit={false}
                  validate={false}
                  placeholder={t("jobs.company.team.memberNamePlaceholder", {
                    defaultValue: "Enter member name",
                  })}
                />

                <ImageField
                  id={`team.${index}.image`}
                  label={t("jobs.company.team.memberImage", { defaultValue: "Member Image" })}
                  withFieldset
                  required={false}
                  value={m.imageFile}
                  image_path={m.image_path || undefined}
                  onChange={(file) => teamForm.updateMember(index, { imageFile: file })}
                  formErrors={teamForm.errors}
                  isSubmited={teamForm.isSubmitted}
                  onSubmit={false}
                  validate={false}
                  accept="image/*"
                />
              </div>

              {/* Row 2 */}
              <div className="mt-4 sm:mt-6">
                <InputField
                  id={`team.${index}.position`}
                  type="text"
                  label={t("jobs.company.team.position", { defaultValue: "Job Position" })}
                  value={m.position}
                  onChange={(e: any) =>
                    teamForm.updateMember(index, { position: e.target.value })
                  }
                  formErrors={teamForm.errors}
                  withFieldset
                  required
                  isSubmited={teamForm.isSubmitted}
                  onSubmit={false}
                  validate={false}
                  placeholder={t("jobs.company.team.positionPlaceholder", {
                    defaultValue: "Enter job position",
                  })}
                />
              </div>
            </div>
          ))}

          {/* Add another member */}
          <button
            type="button"
            onClick={teamForm.addMember}
            className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium text-sm sm:text-base"
          >
            <span className="inline-flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
              <PlusOutlined className="text-xs sm:text-sm" />
            </span>
            <span className="hidden sm:inline">{t("jobs.company.team.addAnother", { defaultValue: "Add another team member" })}</span>
            <span className="sm:hidden">{t("jobs.company.team.addAnother", { defaultValue: "Add member" })}</span>
          </button>

          {/* Actions */}
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
              onClick={handleSave}
              disabled={teamForm.loading}
              className="h-10 sm:h-11 rounded-xl bg-blueSite px-4 sm:px-6 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60 w-full sm:w-auto order-1 sm:order-2"
            >
              {teamForm.loading
                ? t("common.saving", { defaultValue: "Saving..." })
                : t("common.save", { defaultValue: "Save All" })}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddMultipleTeamMembersModal;
