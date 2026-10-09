"use client";

import{ useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Trash2 } from "lucide-react";
import { App } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";

import InputField from "@/components/ui/InputField";
import ImageField from "@/components/ui/ImageField";
import { useCompanyTeamForm } from "../hooks/useCompanyTeamForm";
import { JOBS_ENDPOINTS } from "@/shared/constants/urls";

export default function TeamTab() {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const teamForm = useCompanyTeamForm({
    endpoint: JOBS_ENDPOINTS.addCompanyTeam, // ✅ adds ONE member per request
    required: {
      name: true,
      position: true,
      image: true,
    },
    onSuccess: () => {},
  });

  const onSave = useCallback(async () => {
    const hide = message.loading(
      t("jobs.company.messages.team.updating", {
        defaultValue: "Updating team members...",
      }),
      0
    );

    const res = await teamForm.submitAll();
    hide();

    if (!res.ok) {
      // message.error(
      //   t("company.messages.team.updateFailed", {
      //     defaultValue: "Failed to update team members.",
      //   })
      // );

      if (res.failedAt) {
        message.error(
          t("jobs.company.messages.team.memberFailed", {
            defaultValue: `Failed while saving member #${res.failedAt}`,
            num: res.failedAt,
          })
        );
      }
      return;
    }

    message.success(
      t("jobs.company.messages.team.updated", {
        defaultValue: "Team members updated successfully.",
      })
    );

    // message.success(
    //   t("company.messages.team.updatedCount", {
    //     defaultValue: `Saved successfully (${res.sent})`,
    //     count: res.sent,
    //   })
    // );
  }, [message, t, teamForm]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="space-y-6">
        {teamForm.formData.team.map((m, index) => (
          <div
            key={index}
            className="relative rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm"
          >
            {/* subtle green glow */}
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-3xl bg-emerald-50/70 blur-xl" />

            {teamForm.formData.team.length > 1 && (
              <button
                type="button"
                onClick={() => teamForm.removeMember(index)}
                className="absolute end-2 top-2 grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50"
                aria-label={t("jobs.company.team.remove")}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                onSubmit
                validate={false}
                placeholder={t("jobs.company.team.memberNamePlaceholder", {
                  defaultValue: "Enter member name",
                })}
              />

              <ImageField
                id={`team.${index}.image`}
                label={t("jobs.company.team.memberImage", { defaultValue: "Member Image" })}
                withFieldset
                required
                value={m.imageFile} // ✅ new field name
                image_path={m.image_path || undefined}
                onChange={(file) => teamForm.updateMember(index, { imageFile: file })}
                formErrors={teamForm.errors}
                isSubmited={teamForm.isSubmitted}
                onSubmit
                validate={false}
                accept="image/*"
              />
            </div>

            {/* Row 2 */}
            <div className="mt-4">
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
                onSubmit
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
          className="flex items-center gap-2 text-blueSite hover:text-blueSite font-medium"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
            <PlusOutlined style={{ fontSize: 12 }} />
          </span>
          {t("jobs.company.team.addAnother", { defaultValue: "Add another team member" })}
        </button>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onSave}
            disabled={teamForm.loading}
            className="h-11 rounded-xl bg-blueSite px-6 text-sm font-semibold text-white hover:bg-blueSite disabled:opacity-60"
          >
            {teamForm.loading
              ? t("common.saving", { defaultValue: "Saving..." })
              : t("common.save", { defaultValue: "Save" })}
          </button>
        </div>
      </div>
    </div>
  );
}