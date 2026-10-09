'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Upload, Button as AntButton, Button } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import Image from 'next/image';

import { useTranslation } from '@/lib/i18n/useTranslation';
import usePostData from '@/lib/api/usePostData';
import useFormData from '@/lib/Hooks/useFormData';
import { AdvertisementsEndpoints } from '@/shared/constants/urls';
import { images } from '@/shared/constants/images';

import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectFiled';
import type { ReasonReportType } from '../types/type';
import MultiImageUpload from '@/components/ui/MultiImageUpload';
import SuccessModal from '@/components/shered/SuccessModal';
import { BsFillFlagFill } from 'react-icons/bs';
// ✅ If you already created this union earlier, reuse it:
// export type ReasonReportType =
//   | 'spam' | 'fake' | 'inappropriate' | 'scam' | 'misleading' | 'duplicate' | 'other';

type AdReportProps = {
    onCreated?: () => void;
    advertisement_id: number | string;
};

type ReportAdFormState = {
    advertisement_id: number;
    reason: ReasonReportType | '';
    subject: string;
    message: string;
    images: UploadFile[];
};

export default function AdReport({
    advertisement_id,
    onCreated,
}: AdReportProps) {
    const { t } = useTranslation();
    const [reportOpen, setReportOpen] = useState(false)
    const [isSubmited, setIsSubmited] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const REASON_OPTIONS: { id: ReasonReportType; name: string }[] = [
        { id: 'spam', name: t('ads.report.reasons.spam') },
        { id: 'fake', name: t('ads.report.reasons.fake') },
        { id: 'inappropriate', name: t('ads.report.reasons.inappropriate') },
        { id: 'scam', name: t('ads.report.reasons.scam') },
        { id: 'misleading', name: t('ads.report.reasons.misleading') },
        { id: 'duplicate', name: t('ads.report.reasons.duplicate') },
        { id: 'other', name: t('ads.report.reasons.other') },
    ];

    const handleSuccessClose = () => setSuccessOpen(false);

    const INITIAL_FORM_STATE: ReportAdFormState = useMemo(
        () => ({
            advertisement_id,
            reason: '',
            subject: '',
            message: '',
            images: [],
        }),
        [advertisement_id]
    );

    const {
        formData,
        handleArrayChange,
        handleChange,
        resetForm,
        errors,
        handleAddError,
        isValid,
    } = useFormData<ReportAdFormState>(INITIAL_FORM_STATE);

    const {
        postData,
        loading: posting,
        contextHolder: messageHolder,
        messageApi,
    } = usePostData(AdvertisementsEndpoints.createReport);

    const handleClose = () => {
        setReportOpen(false);
    }

    const handleOpen = () => {
        setReportOpen(true);
    }
    const handleSubmit = useCallback(async () => {
        if (!isValid) {
            setIsSubmited(true);
            messageApi?.error?.(t('required') ?? 'Please fill required fields');
            return;
        }

        await postData(formData, {
            showMessage: false,
            onSuccess: (res: any) => {
                messageApi?.success?.(res?.message ?? t('usedMarket.reportSuccessTitle') ?? 'Submitted successfully');
                resetForm?.();
                setSuccessOpen(true);
                setIsSubmited(false);
                handleClose();
            },
            onError: (err: any) => {
                const resMessage =
                    err?.response?.data?.message ||
                    err?.message ||
                    (t('common.error') ?? 'Failed to submit report');
                messageApi?.error?.(resMessage);
            },
        });
    }, [formData, handleClose, isValid, messageApi, onCreated, postData, resetForm, t]);

    const handleModalClose = () => {
        setIsSubmited(false);
        handleClose();
    };

    return (
        <>
            <Button
                onClick={handleOpen}

                className="!w-[44px] !h-[44px] !p-0 rounded-full hover:!outline-none bg-red-50 flex items-center justify-center text-red-500"
            >
                <BsFillFlagFill size={18} />
            </Button>

            <Modal
                open={reportOpen}
                onCancel={handleModalClose}
                footer={null}
                width={980}
                destroyOnHidden
                style={{ top: 20 }}   // 👈 هنا الصح
                styles={{
                    body: { padding: 0, overflow: "hidden" },
                    content: { padding: 0 },
                }}
            >

                {/* {messageHolder} */}

                <div className="grid grid-cols-1 md:grid-cols-12 h-full  ">
                    {/* Left Panel */}
                    <div className="md:col-span-4 relative hidden md:flex overflow-hidden bg-blueSite rounded-l-lg ">
                        {/* Background Image */}
                        <Image
                            src={images.adReportBg}
                            alt="Report ad"
                            fill
                            priority
                            className="object-contine"
                        />

                        {/* Overlay (اختياري للتعتيم) */}

                        {/* Content */}
                        <div className="relative z-10 p-8 h-full flex flex-col items-center justify-start  text-white text-center gap-4">

                            {/* Logo */}
                            <div className="inline-flex flex-col items-center mt-16">
                                <Image
                                    src="/logo.svg"
                                    alt="Report ad"
                                    width={160}
                                    height={160}
                                    priority
                                    className="object-contain mb-2"
                                />


                                {/* Description */}
                                <p className="text-sm text-white/80 leading-6 max-w-xs">
                                    {t('support.available', {
                                        defaultValue:
                                            'Our customer support is available Saturday to Thursday: 11am–5pm',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="md:col-span-8 p-8">
                        <h2 className="text-lg md:text-xl font-semibold text-[#0F172A] mb-6">
                            {t('ads.report.title', {
                                defaultValue: 'Report this advertisement',
                            })}
                        </h2>

                        <div className="space-y-4">
                            {/* ✅ Reason (Select) */}
                            <SelectField
                                id="reason"
                                label={t('ads.report.reason', { defaultValue: 'Reason' })}
                                placeholder={t('ads.report.reasonPlaceholder', {
                                    defaultValue: 'Choose a reason',
                                })}
                                value={formData.reason || null}
                                onChange={handleChange('reason')}
                                selectorOptions={REASON_OPTIONS}
                                labelName="name"
                                unstyled
                                withFieldset
                                validate
                                required
                                formErrors={errors}
                                handleAddError={handleAddError}
                                isSubmited={isSubmited}
                                onSubmit={true}
                            />

                            {/* ✅ Subject */}
                            <InputField
                                id="subject"
                                label={t('ads.report.subject', { defaultValue: 'Title' })}
                                type="text"
                                placeholder={t('ads.report.subjectPlaceholder', {
                                    defaultValue: 'Short title for the report',
                                })}
                                value={formData.subject}
                                onChange={handleChange('subject')}
                                unstyled
                                withFieldset
                                required
                                validate
                                formErrors={errors}
                                handleAddError={handleAddError}
                                isSubmited={isSubmited}
                                onSubmit={true}
                            />

                            {/* ✅ Message */}
                            <InputField
                                id="message"
                                label={t('ads.report.message', { defaultValue: 'Details' })}
                                type="textarea"
                                placeholder={t('ads.report.messagePlaceholder', {
                                    defaultValue: 'Explain what’s wrong with this ad',
                                })}
                                value={formData.message}
                                onChange={handleChange('message')}
                                unstyled
                                withFieldset
                                required
                                validate
                                formErrors={errors}
                                handleAddError={handleAddError}
                                isSubmited={isSubmited}
                                onSubmit={true}
                            />

                            {/* ✅ Images */}
                            <div>
                                <MultiImageUpload
                                    onImagesChange={(images: unknown[]) => handleArrayChange('images', images)}
                                    value={(formData.images as any) || []}
                                    label={t('ads.report.photos')}
                                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']}
                                />

                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-2">
                                <AntButton
                                    type="primary"
                                    loading={posting}
                                    onClick={handleSubmit}
                                    className="!h-11 !px-10 !rounded-lg !bg-blueSite hover:!bg-blueSiteHover"
                                >
                                    {t('ads.report.submit', { defaultValue: 'Submit report' })}
                                </AntButton>

                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="text-[#64748B] underline underline-offset-4 hover:text-[#0F172A] h-11"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <SuccessModal
                open={successOpen}
                handleClose={handleSuccessClose}
                title={t("usedMarket.reportSuccessTitle", { defaultValue: "Your report has been submitted successfully" })}
                description={t("usedMarket.reportSuccessDescription", {
                    defaultValue: "Your report has been submitted successfully. Thank you for your cooperation; our specialized team will review it and take the necessary action shortly",
                })}
                imageLink="/sendImage.png" // أو images.success لو عندك ثابت
                textButton={t("buttons.goBack", { defaultValue: "Done" })}
            />

        </>
    );
}
