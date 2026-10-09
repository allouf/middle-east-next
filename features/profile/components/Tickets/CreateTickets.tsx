'use client';
// Force HMR refresh

import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Upload, Button as AntButton } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import Image from 'next/image';

import { useTranslation } from '@/lib/i18n/useTranslation';
import usePostData from '@/lib/api/usePostData';
import useFormData from '@/lib/Hooks/useFormData';
import { Support_Tikctes } from '@/shared/constants/urls';
import { images } from '@/shared/constants/images';

import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectFiled';

type SimpleOption = { id: string | number; name: string };
type store_orders = Array<{
    id: string | number;
    store_id: string | number;
    store: {
        id: string | number;
        name: string;
        slug: string;
    };
}>

type CreateTicketsProps = {
    open?: boolean;
    handleClose: () => void;
    onCreated?: () => void;
    store_orders?: store_orders;
    ordersOptions?: SimpleOption[];
    orderId: string | number | '';
    order_item_ids?: number | '';
};

type TicketFormState = {
    order_item_ids: string[] | number[];
    order_id: string | number | '';
    issue_type_id: string | number | '';
    subject: string;
    message: string;
    attachments: UploadFile[];
};

export default function CreateTickets({
    order_item_ids,
    store_orders,
    ordersOptions = [],
    open = false,
    handleClose,
    orderId,
    onCreated,
}: CreateTicketsProps) {
    const { t } = useTranslation();
    const [isSubmited, setIsSubmited] = useState(false);



    const INITIAL_FORM_STATE: TicketFormState = {
        order_item_ids: [],
        order_id: orderId || '',
        issue_type_id: '',
        subject: '',
        message: '',
        attachments: [],
    };

    const {
        formData,
        handleChange,
        handleArrayChange,
        resetForm,
        errors,
        handleAddError,
        isValid,
    } = useFormData<TicketFormState>(INITIAL_FORM_STATE);

    const { postData, loading: posting,
        contextHolder: messageHolder,
        messageApi } = usePostData(Support_Tikctes.createTikets);

    useEffect(() => {
        if (!orderId) return;
    }, [orderId]);

    const handleSubmit = useCallback(async () => {
        if (!isValid) { setIsSubmited(true); return; }

        const formPayload = new FormData();

        // ✅ REQUIRED FIELDS
        formPayload.append('order_item_ids[0]', order_item_ids);
        // formPayload.append('order_id', String(formData.order_id || orderId));
        formPayload.append('issue_type_id', String(formData.issue_type_id));
        formPayload.append('subject', formData.subject);
        formPayload.append('message', formData.message);

        // ✅ FILES AS REAL FILE OBJECTS
        formData.attachments.forEach((file, index) => {
            const realFile = file?.originFileObj;
            if (realFile instanceof File) {
                formPayload.append(`attachments[${index}]`, realFile);
            }
        });

        await postData(formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' },

            showMessage: false,
            onSuccess: (res) => {
                onCreated?.();
                messageApi.success(res.message);
                resetForm();
                setTimeout(() => {
                    handleClose();
                }, 2000);
            },
            onError: (err) => {
                const resMessage =
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to submit review";
                // messageApi.error(resMessage);
            },
        });
        setIsSubmited(false);
    }, [formData, isValid, orderId, postData, resetForm, handleClose, onCreated]);

    const handleModalClose = () => {
        setIsSubmited(false);
        handleClose();
    }
    return (
        <Modal
            open={open}
            onCancel={handleModalClose}
            footer={null}
            centered
            width={980}
            destroyOnHidden
            styles={{ 
                body: { padding: 0, margin: 0 },
                content: { padding: 0, margin: 0 },
                header: { padding: 0, margin: 0 }
            }}
        >
            {messageHolder}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[560px] rounded-lg overflow-hidden">
                {/* Left Panel */}
                <div className="md:col-span-4 bg-[#0E3B37] text-white   p-8 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-white/10" />
                        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-white/10" />
                    </div>

                    <div className="relative z-10">
                        <div className="mb-8 flex items-center justify-center">
                            <div className="relative w-44 h-44 rounded-full overflow-hidden">
                                <Image
                                    src={images.tiketsun}
                                    alt="Support Ticket"
                                    fill
                                    priority
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        <p className="text-sm text-white/80 leading-6 text-center">
                            {t('support.available', {
                                defaultValue: 'Our customer support is available Saturday to Thursday: 11am–5pm',
                            })}
                        </p>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="md:col-span-8 p-8">
                    <h2 className="text-lg md:text-xl font-semibold text-[#0F172A] mb-6">
                        {t('tickets.createTitle', {
                            defaultValue: 'Create A Ticket About This Product, Stating The Reasons.',
                        })}
                    </h2>

                    <div className="space-y-4">
                        {/* List Of Reasons (API) */}
                        <SelectField
                            id="issue_type_id"
                            label={t('tickets.listOfReasons', { defaultValue: 'List Of Reasons' })}
                            placeholder={t('tickets.reasonPlaceholder', {
                                defaultValue: 'Choose a reason to report this product.',
                            })}
                            value={formData.issue_type_id}
                            url={Support_Tikctes.getIssueType}
                            onChange={handleChange('issue_type_id')}
                            unstyled
                            withFieldset
                            validate
                            formErrors={errors}
                            handleAddError={handleAddError}
                            isSubmited={isSubmited}
                            onSubmit={true}
                            required
                        />

                        {/* Reasons Title */}
                        <InputField
                            id="subject"
                            label={t('tickets.reasonTitle', { defaultValue: 'Reasons Title' })}
                            type="text"
                            placeholder={t('tickets.reasonTitlePlaceholder', {
                                defaultValue: 'Write a reason to report this product.',
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

                        {/* Reason Description */}
                        <InputField
                            id="message"
                            label={t('tickets.reasonDescription', { defaultValue: 'Reason Description' })}
                            type="textarea"
                            placeholder={t('tickets.reasonDescPlaceholder', {
                                defaultValue: 'Write your comment here to explain the reasons.',
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

                        {/* Attachments */}
                        <div>
                            <label className="block text-sm font-semibold text-[#167E72] mb-2">
                                {t('tickets.attachments', { defaultValue: 'Attachments' })}
                            </label>

                            <Upload.Dragger
                                multiple
                                listType="picture"
                                accept="image/jpeg,image/png,image/jpg,video/mp4,video/avi,video/quicktime"
                                fileList={formData.attachments}
                                beforeUpload={() => false}
                                onChange={({ fileList }) => handleArrayChange('attachments', fileList as UploadFile[])}
                                className="rounded-lg"
                            >
                                <p className="text-sm font-medium text-[#0F172A]">
                                    {t('tickets.addFile', { defaultValue: 'Add File' })}
                                </p>
                                <p className="text-xs text-[#64748B]">
                                    {t('tickets.dragDrop', { defaultValue: 'Or drag and drop Images and Videos' })}
                                </p>
                            </Upload.Dragger>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-2">
                            <AntButton
                                type="primary"
                                loading={posting}
                                onClick={handleSubmit}
                                className="!h-11 !px-10 !rounded-lg !bg-[#0E6B5F] hover:!bg-[#0C5E54]"
                            >
                                {t('tickets.addTicket', { defaultValue: 'Add Ticket' })}
                            </AntButton>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="text-[#64748B] underline underline-offset-4 hover:text-[#0F172A] h-11"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
