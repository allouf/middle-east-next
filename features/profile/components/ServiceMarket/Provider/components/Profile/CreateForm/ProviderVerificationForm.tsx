"use client";

import React, { useRef } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { BadgeCheck, CheckCircle2, Shield, Upload, X } from "lucide-react";
import InputField from "@/components/ui/InputField";

type Props = {
  profileUpdate: any;
  errors?: any;
};

export default function ProviderVerificationForm({ profileUpdate, errors }: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('serviceMarket.verification.fileSizeError'));
        return;
      }
      
      // Validate file type (PDF or image)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(t('serviceMarket.verification.fileTypeError'));
        return;
      }
      
      profileUpdate.setIdentityDocument(file);
    }
  };

  const handleRemoveFile = () => {
    profileUpdate.setIdentityDocument(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('serviceMarket.verification.fileSizeError'));
        return;
      }
      
      // Validate file type (PDF or image)
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert(t('serviceMarket.verification.fileTypeError'));
        return;
      }
      
      profileUpdate.setIdentityDocument(file);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        {/* left side */}
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[12px] font-semibold text-blueSite">
              {t('serviceMarket.verification.currentStatus')}
            </p>

            <div className="flex items-start gap-3 rounded-lg border border-grayBorder bg-[#F7F9FB] px-4 py-4">
              <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF4F1] text-blueSite">
                <BadgeCheck className="h-4 w-4" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold uppercase text-textColor">
                    {t('serviceMarket.verification.inactive')}
                  </span>
                  <span className="text-xs text-textGrayColor">
                    {t('serviceMarket.verification.pendingDocs')}
                  </span>
                </div>

                <p className="mt-1 text-xs text-textGrayColor">
                  {t('serviceMarket.verification.profileHidden')}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-blueSite">
              {t('serviceMarket.verification.identityDocument')}
            </label>

            {errors?.identity_document && (
              <div className="mb-2 text-xs text-red-600">
                {errors.identity_document}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.gif"
              onChange={handleFileSelect}
              className="hidden"
            />

            {profileUpdate.identityDocumentFile ? (
              <div className="flex items-center justify-between rounded-lg border border-grayBorder bg-white p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blueSite/10 text-blueSite">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textColor">
                      {profileUpdate.identityDocumentFile.name}
                    </p>
                    <p className="text-xs text-textGrayColor">
                      {(profileUpdate.identityDocumentFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-grayBorder text-textGrayColor hover:border-red-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                className="flex min-h-[110px] flex-col items-center justify-center rounded-lg border border-dashed border-grayBorder bg-white px-4 text-center cursor-pointer transition-colors hover:border-blueSite hover:bg-blueSite/5"
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="mb-2 h-5 w-5 text-blueSite" />
                <button
                  type="button"
                  className="text-xs font-semibold text-blueSite underline underline-offset-2"
                >
                  {t('serviceMarket.verification.uploadFile')}
                </button>
                <p className="mt-1 text-[11px] text-textGrayColor">
                  {t('serviceMarket.verification.dragAndDrop')}
                </p>
                <p className="mt-1 text-[10px] text-textGrayColor">
                  {t('serviceMarket.verification.fileTypes')}
                </p>
                <p className="mt-1 text-[10px] text-textGrayColor">
                  {t('serviceMarket.verification.documentTypes')}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold text-blueSite">
              {t('serviceMarket.verification.verificationNotes')}
            </label>

            <InputField
              id="verification_notes"
              type="textarea"
              label={t('serviceMarket.verification.verificationNotes')}
              placeholder={t('serviceMarket.verification.notesPlaceholder')}
              value={profileUpdate.formData.verification_notes}
              onChange={profileUpdate.handleChange("verification_notes")}
              withFieldset
              rows={4}
              className="min-h-[110px] w-full resize-none"
            />
          </div>
        </div>

        {/* right card */}
        <div>
          <p className="mb-2 text-[11px]  font-semibold uppercase tracking-wide text-textGrayColor">
            {t('serviceMarket.verification.whyVerify')}
          </p>

          <div className="rounded-2xl border border-[#E9ECEF] bg-white p-5">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F3EE] text-blueSite">
              <Shield className="h-6 w-6" />
            </div>

            <h3 className="text-center text-lg font-semibold text-textColor">
              {t('serviceMarket.verification.buildTrust')}
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-textGrayColor">
              {t('serviceMarket.verification.verifiedBenefits')}
            </p>

            <div className="mt-5 space-y-3">
              {[
                t('serviceMarket.verification.benefit1'),
                t('serviceMarket.verification.benefit2'),
                t('serviceMarket.verification.benefit3'),
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blueSite" />
                  <span className="text-sm text-textGrayColor">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}