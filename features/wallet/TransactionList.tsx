"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowDownCircle, ArrowUpCircle, Lock, Unlock, RotateCcw, AlertCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { WALLET_TX_TYPE, type WalletTxType } from "@/shared/constants/api-endpoints";
import { walletService, type WalletTransaction } from "./service";

const PER_PAGE = 15;

const TYPE_META: Record<
  WalletTxType,
  { label: string; classes: string; icon: React.ReactNode }
> = {
  CREDIT: { label: "Credit", classes: "text-emerald-700 bg-emerald-50", icon: <ArrowDownCircle className="w-4 h-4" /> },
  DEBIT:  { label: "Debit",  classes: "text-red-700 bg-red-50",         icon: <ArrowUpCircle className="w-4 h-4" /> },
  LOCK:   { label: "Lock",   classes: "text-amber-700 bg-amber-50",     icon: <Lock className="w-4 h-4" /> },
  UNLOCK: { label: "Unlock", classes: "text-blue-700 bg-blue-50",       icon: <Unlock className="w-4 h-4" /> },
  REFUND: { label: "Refund", classes: "text-purple-700 bg-purple-50",   icon: <RotateCcw className="w-4 h-4" /> },
};

type Props = {
  currency: string;
};

export default function TransactionList({ currency }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<WalletTxType | null>(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<WalletTransaction[]>([]);
  const [meta, setMeta] = useState<{ total: number; last_page: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const result = await walletService.getTransactions({
          page,
          perPage: PER_PAGE,
          type: filter,
        });
        if (cancelled) return;
        setData(result.data);
        setMeta({ total: result.meta.total, last_page: result.meta.last_page });
      } catch (err: any) {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            t("common.errorOccurred", { defaultValue: "Failed to load transactions." }),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, filter, t]);

  const onFilterChange = (next: WalletTxType | null) => {
    setFilter(next);
    setPage(1); // reset to first page on filter change
  };

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-subTitleColor">
          {t("wallet.transactions.title", { defaultValue: "Transactions" })}
        </h2>
        <span className="text-xs text-gray-500">
          {meta
            ? t("wallet.transactions.totalCount", {
                defaultValue: `${meta.total} entr${meta.total === 1 ? "y" : "ies"}`,
              })
            : ""}
        </span>
      </header>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <FilterChip active={filter === null} onClick={() => onFilterChange(null)}>
          {t("wallet.transactions.all", { defaultValue: "All" })}
        </FilterChip>
        {(Object.values(WALLET_TX_TYPE) as WalletTxType[]).map((value) => (
          <FilterChip
            key={value}
            active={filter === value}
            onClick={() => onFilterChange(value)}
          >
            {TYPE_META[value].label}
          </FilterChip>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#00664F]" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="text-sm text-gray-700">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-gray-500">
            {filter
              ? t("wallet.transactions.emptyFiltered", {
                  defaultValue: "No transactions of that type yet.",
                })
              : t("wallet.transactions.empty", { defaultValue: "No transactions yet." })}
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100">
            {data.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} currency={currency} />
            ))}
          </ul>

          {meta && meta.last_page > 1 && (
            <nav className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                {t("common.previous", { defaultValue: "Previous" })}
              </button>
              <span className="text-sm text-gray-600">
                {t("wallet.transactions.pageOf", {
                  defaultValue: `Page ${page} of ${meta.last_page}`,
                })}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                {t("common.next", { defaultValue: "Next" })}
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "px-3 py-1.5 text-xs font-medium rounded-full transition " +
        (active
          ? "bg-[#00664F] text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200")
      }
    >
      {children}
    </button>
  );
}

function TransactionRow({ tx, currency }: { tx: WalletTransaction; currency: string }) {
  const meta = TYPE_META[tx.type];
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(tx.created_at));

  // Render the reference as a hint, not a link — we don't have a generic
  // "open this referenceable" route yet. When the FE has per-kind routing
  // (e.g. /orders/<id>) this can become an actual link.
  const referenceLabel = tx.reference
    ? `${shortReferenceType(tx.reference.type)} #${tx.reference.id}`
    : null;

  return (
    <li className="flex items-center gap-4 py-3">
      <div
        className={
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + meta.classes
        }
      >
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium text-gray-900 text-sm">{meta.label}</p>
          <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
            {tx.type === "DEBIT" || tx.type === "REFUND" || tx.type === "LOCK" ? "−" : "+"}
            {Number(tx.amount).toFixed(2)} {currency}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 mt-0.5">
          <p className="text-xs text-gray-500 truncate">
            {referenceLabel ?? date}
          </p>
          {referenceLabel && <p className="text-xs text-gray-400 whitespace-nowrap">{date}</p>}
        </div>
      </div>
    </li>
  );
}

// Drops the namespace prefix from polymorphic types — turns
// "Modules\\Wallet\\Models\\Invoice" into "Invoice" for display.
function shortReferenceType(type: string): string {
  const parts = type.split("\\");
  return parts[parts.length - 1] || type;
}
