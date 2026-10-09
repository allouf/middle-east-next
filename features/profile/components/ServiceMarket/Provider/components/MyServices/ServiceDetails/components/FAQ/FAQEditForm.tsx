import React from 'react';
import { Save, X, Loader2 } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface FAQData {
    question: string;
    answer: string;
}

interface FAQEditFormProps {
    faqData: FAQData;
    editingIndex?: number | null;
    isSubmitted:boolean;
    loading?: boolean;
    onFAQChange: (faq: FAQData) => void;
    onAdd?: () => void;
    onUpdate?: () => void;
    onCancel: () => void;
}

const FAQEditForm = ({
    faqData,
    editingIndex, 
    isSubmitted,
    loading = false,
    onFAQChange,
    onAdd,
    onUpdate,
    onCancel
}: FAQEditFormProps) => {
    const { t } = useTranslation();

    const updateFAQField = (key: keyof FAQData, value: string) => {
        onFAQChange({ ...faqData, [key]: value });
    };

    return (
        <div className="relative overflow-hidden rounded-[22px] space-y-4 border border-[#DDE3E7] bg-[#FCFCFD] p-5 md:p-6">
            <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[0_0_90px_rgba(53,208,182,0.12)_inset]" />

            <div className="relative space-y-5">
                <InputField
                    id={`faqQuestion-${editingIndex !== null ? editingIndex : 'new'}`}
                    label={t("serviceMarket.myServices.details.tabs.faq.question")}
                    placeholder={t("serviceMarket.myServices.details.tabs.faq.questionPlaceholder")}
                    value={faqData.question}
                    onChange={(e: any) => updateFAQField('question', e.target.value)}
                    withFieldset
                    validate
                    required
                    isSubmited={isSubmitted}
                />

                <InputField
                    id={`faqAnswer-${editingIndex !== null ? editingIndex : 'new'}`}
                    label={t("serviceMarket.myServices.details.tabs.faq.answer")}
                    placeholder={t("serviceMarket.myServices.details.tabs.faq.answerPlaceholder")}
                    value={faqData.answer}
                    onChange={(e: any) => updateFAQField('answer', e.target.value)}
                    type="textarea"
                    rows={6}
                    withFieldset
                    validate
                    required
                    isSubmited={isSubmitted}
                />
            </div>

            <div className="flex justify-end gap-3 mt-2">
                <button
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-textColor border border-[#DDE3E7] bg-white rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("common.cancel")}
                </button>
                <button
                    onClick={editingIndex !== null ? onUpdate : onAdd}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#00664F] rounded-lg hover:bg-[#005543] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {loading ? t("common.saving") : (editingIndex !== null ? t("common.update") : t("serviceMarket.myServices.details.tabs.faq.addQuestion"))}
                </button>
            </div>
        </div>
    );
};

export default FAQEditForm;
