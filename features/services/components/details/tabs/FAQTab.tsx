"use client";

import React from "react";
import { Collapse } from "antd";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ServiceFAQ } from "../../../types/type";
import "./FAQTab.css"

interface FAQTabProps {
  faqs?: ServiceFAQ[];
  isEmbedded?: boolean;
}

const faqData = [
  {
    key: "1",
    label: "Do you provide source Figma files?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        Yes, all project packages include the original Figma source files. These are organized with proper layer naming, auto-layout components, and a local style guide to ensureensureensureensure your development team can easily implement thdesigns.
      </p>
    ),
  },
  {
    key: "2",
    label: "What is your revision policy?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        We offer a standard set of revisions for each package to ensure you are completely satisfied with the final result. Additional revisions can be requested at an hourly rate.
      </p>
    ),
  },
  {
    key: "3",
    label: "Can you help with front-end development?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        While my primary focus is on UI/UX design, I have a trusted network of front-end developers I can collaborate with to bring the designs to life.
      </p>
    ),
  },
  {
    key: "4",
    label: "How do we handle the discovery phase?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        The discovery phase involves a kickoff call, a brief questionnaire, and initial research to ensure we are fully aligned on the project goals and target audience.
      </p>
    ),
  },
  {
    key: "5",
    label: "Do you offer discounts for long-term projects?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        Yes, for ongoing or retainer-based projects, I offer customized pricing structures. Please contact me directly to discuss your specific needs.
      </p>
    ),
  },
  {
    key: "6",
    label: "What is your average response time?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        I typically respond to all client communications within 24 hours during regular business days.
      </p>
    ),
  },
  {
    key: "7",
    label: "Do you sign NDAs?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        Absolutely. I understand the importance of confidentiality and am happy to sign an NDA before we begin discussing your project specifics.
      </p>
    ),
  },
  {
    key: "8",
    label: "Can I upgrade my package later?",
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        Yes, you can upgrade your package at any time during the project. We can adjust the scope and timeline accordingly.
      </p>
    ),
  },
];

const FAQTab: React.FC<FAQTabProps> = ({ faqs = [], isEmbedded = false }) => {
  const { t } = useTranslation();
  const dynamicFaqData = faqs.length > 0 ? faqs.map((faq) => ({
    key: faq.id.toString(),
    label: faq.question,
    children: (
      <p className="text-[#475569] leading-relaxed text-[15px]">
        {faq.answer}
      </p>
    ),
  })) : faqData; // Fallback to dummy data if empty for now

  return (
    <div className={isEmbedded ? "w-full" : "animate-in fade-in duration-500 container max-sm:px-4 2xl:max-w-[1440px] mx-auto py-10 2xl:py-16"}>
      <div className="mb-8">
        <h3 className="text-[28px] font-bold text-subTitleColor mb-2">
          {t("services.details.faqTabHeader", { defaultValue: "Common Questions" })}
        </h3>
        <p className="text-[#475569] text-[15px]">
          {t("services.details.faqTabSubheader", { defaultValue: "Everything you need to know about the process and deliverables." })}
        </p>
      </div>



      <Collapse
        accordion
        expandIconPosition="end"
        expandIcon={({ isActive }) =>
          isActive ? (
            <ChevronUp className="text-[#00664F]" size={20} />
          ) : (
            <ChevronDown className="text-[#00664F]" size={20} />
          )
        }
        className="faq-collapse bg-transparent border-none"
        items={dynamicFaqData}
      />
    </div>
  );
};

export default FAQTab;
