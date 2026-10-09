import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

type FAQsStepProps = {
  form: {
    faqs: {
      question: string;
      answer: string;
    }[];
  };
  serviceForm: any;
  isSubmitted: boolean;
};

type FAQItem = {
  question: string;
  answer: string;
};

function QuestionCard({ item, onEdit, onDelete }: { item: FAQItem; onEdit?: () => void; onDelete?: () => void; }) {
  return (
    <div className="rounded-2xl border border-grayBorder bg-white px-5 py-4">
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="text-[20px] font-bold leading-7 text-textColor flex-1 pr-4">
          {item.question}
        </h3>

        <div className="flex items-center gap-3 pt-1">
          <Button
            onClick={onEdit}
            className="text-blueSite transition hover:opacity-80"
            unstyled
            aria-label="Edit question"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            onClick={onDelete}
            className="text-red-500 transition hover:opacity-80"
            unstyled
            aria-label="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="text-[15px] leading-7 text-textGrayColor">
        {item.answer}
      </p>
    </div>
  );
}

export default function FAQsStep({ form, serviceForm, isSubmitted }: FAQsStepProps) {
  const { t } = useTranslation();
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      serviceForm.setFaqs([...form.faqs, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const handleEditQuestion = (index: number) => {
    setEditingIndex(index);
    setNewQuestion(form.faqs[index].question);
    setNewAnswer(form.faqs[index].answer);
  };

  const handleUpdateQuestion = () => {
    if (editingIndex !== null && newQuestion.trim() && newAnswer.trim()) {
      serviceForm.updateFAQ(editingIndex, { question: newQuestion, answer: newAnswer });
      setEditingIndex(null);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedFaqs = form.faqs.filter((_, i) => i !== index);
    serviceForm.setFaqs(updatedFaqs);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setNewQuestion("");
    setNewAnswer("");
  };

  return (
    <div>
      <div className="space-y-6">

        <div className="space-y-5">
          {form.faqs.map((item, index) => (
            <QuestionCard
              key={index}
              item={{
                question: typeof item.question === 'string' ? item.question : String(item.question),
                answer: typeof item.answer === 'string' ? item.answer : String(item.answer)
              }}
              onEdit={() => handleEditQuestion(index)}
              onDelete={() => handleDeleteQuestion(index)}
            />
          ))}
        </div>

        <div className="space-y-5">
          <InputField
            id="questionText"
            label={t('serviceMarket.myServices.faqs.questionText')}
            placeholder={t('serviceMarket.myServices.faqs.questionPlaceholder')}
            value={newQuestion}
            onChange={(e: any) => setNewQuestion(e.target.value)}
            withFieldset
            required
          />

          <InputField
            id="answerText"
            label={t('serviceMarket.myServices.faqs.answerText')}
            placeholder={t('serviceMarket.myServices.faqs.answerPlaceholder')}
            value={newAnswer}
            onChange={(e: any) => setNewAnswer(e.target.value)}
            type="textarea"
            rows={3}
            withFieldset
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          {editingIndex !== null ? (
            <>
              <Button
                onClick={handleUpdateQuestion}
                className="!h-12 !px-10 !text-base !font-semibold"
              >
                <div className="flex items-center gap-2">
                  {t('serviceMarket.myServices.faqs.updateQuestion')}
                </div>
              </Button>
              <Button
                onClick={handleCancelEdit}
                className="!h-12 !px-10 !text-base !text-black !font-semibold border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                {t('serviceMarket.myServices.faqs.cancel')}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAddQuestion}
              className="!h-12 !px-10 !text-base !font-semibold"
            >
              <div className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                {t('serviceMarket.myServices.faqs.addQuestion')}
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
