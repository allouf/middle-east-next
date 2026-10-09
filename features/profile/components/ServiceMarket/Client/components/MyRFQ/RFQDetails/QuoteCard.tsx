import React from "react";
import { Clock3 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { QuoteItem } from "../../../types/Rfq";

type QuoteCardProps = {
  item: QuoteItem;
  onAcceptQuote?: (quoteId: string) => void;
  hideAcceptButton?: boolean;
};

const QuoteCard = ({ item, onAcceptQuote, hideAcceptButton }: QuoteCardProps) => {
  const { t } = useTranslation();

  // Get initials from provider name
  const initials = item.provider.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative rounded-2xl border border-gray-300 bg-grayLight  p-4 shadow-[0_6px_18px_rgba(16,24,40,0.04)]">
      {(item.status === 'Pending' || item.status === 'Accepted') && (
        <span className={`absolute left-4 top-0 -translate-y-1/2 rounded-full px-3 py-1 text-[10px] font-bold ${item.status === 'Accepted' ? 'bg-[#D1FAE5] text-blueSite' : 'bg-[#DDF5EA] text-[#0B6B57]'}`}>
          {t('serviceMarket.rfq.details.quotes.status', { status: item.status })}
        </span>
      )}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B6B57] text-sm font-bold text-white">
            {item.provider.photo ? (
              <img src={item.provider.photo} alt={item.provider.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#1F2937]">{item.provider.name}</h4>
            <div className="mt-0.5 flex items-center gap-2">
              <p className="text-xs text-[#98A2B3]">{item.provider.provider_type}</p>
              <span className="text-xs text-[#98A2B3]">• {item.provider.country_code}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[28px] font-bold leading-none text-[#103B32]">
            ${item.proposed_budget}
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#98A2B3]">
            {t('serviceMarket.rfq.details.quotes.proposedBudget')}
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-xl bg-[#EEF0F2] px-4 py-3 text-sm leading-6 text-[#667085] line-clamp-3">
        "{item.cover_letter_or_message}"
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#667085]">
          <Clock3 className="h-3.5 w-3.5" />
          <span>{t('serviceMarket.rfq.details.quotes.estimated')}{item.estimated_delivery_date}</span>
        </div>

        {!hideAcceptButton && (
          <button
            type="button"
            onClick={() => onAcceptQuote?.(String(item.id))}
            className="inline-flex h-10 min-w-[96px] items-center justify-center rounded-xl bg-blueSite px-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {t('serviceMarket.rfq.details.quotes.acceptQuote')}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;