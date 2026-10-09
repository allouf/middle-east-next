"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { JobFormData } from "../../types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Spin } from "antd";
import { useState } from "react";
import { useSecureTinyMCE } from "@/hooks/useSecureTinyMCE";

interface JobDescriptionProps {
  data: JobFormData;
  updateData: (data: Partial<JobFormData>) => void;
  errors?: Record<string, string>;
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  data,
  updateData,
  errors = {},
}) => {
  const { t, locale } = useTranslation();
  const isRTL = locale === "ar";
  const [isEditorLoading, setIsEditorLoading] = useState(true);
  const { apiKey: tinyMceApiKey, isLoading: apiKeyLoading, error: apiKeyError } = useSecureTinyMCE();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={[
          "rounded-[10px] overflow-hidden bg-white border relative min-h-[350px]",
          errors.description ? "border-red-400" : "border-[#E0E0E0]",
        ].join(" ")}
      >
        {(isEditorLoading || apiKeyLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <Spin size="large" />
          </div>
        )}
        {apiKeyError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-red-500 text-center">
              <p>Failed to load editor</p>
              <p className="text-xs">{apiKeyError}</p>
            </div>
          </div>
        ) : (
          <Editor
            apiKey={tinyMceApiKey}
            value={data.description || ""}
            onEditorChange={(content) => updateData({ description: content })}
            onInit={() => setIsEditorLoading(false)}
            init={{
              height: 350,
              menubar: true,                 // ✅ default menus
              toolbar: "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | removeformat | code",
              plugins: "lists link code table",
              directionality: isRTL ? "rtl" : "ltr",
              branding: false,
              placeholder: t("jobs.descriptionPlaceholder", "Write text here...."),
            }}
          />
        )}
      </div>

      {errors.description ? (
        <p className="text-red-500 text-xs">{errors.description}</p>
      ) : null}
    </div>
  );
};

export default JobDescription;