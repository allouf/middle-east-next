import React from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import QuoteCard from "./QuoteCard";
import { QuoteItem } from "../../../types/Rfq";

type QuotesSidebarProps = {
  quotes: QuoteItem[];
  onAcceptQuote?: (quoteId: string) => void;
};

const QuotesSidebar = ({ quotes, onAcceptQuote }: QuotesSidebarProps) => {
  const { t } = useTranslation();
  const hasAccepted = quotes.some((q) => q.status === "Accepted");

  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#1F2937]">
          {t('serviceMarket.rfq.details.quotes.title')}
        </h2>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-grayLight bg-grayLight p-6 text-center">
          <p className="text-sm text-[#667085]">
            {t('serviceMarket.rfq.details.quotes.noQuotes')}
          </p>
        </div>
      ) : (
        <>
          {quotes.map((item) => (
            <QuoteCard key={item.id} item={item} onAcceptQuote={onAcceptQuote} hideAcceptButton={hasAccepted} />
          ))}

          {!hasAccepted && (
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold text-[#0B6B57]"
            >
              {t('serviceMarket.rfq.details.quotes.viewAll', { count: quotes.length })}
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </>
      )}
    </aside>
  );
};

export default QuotesSidebar;