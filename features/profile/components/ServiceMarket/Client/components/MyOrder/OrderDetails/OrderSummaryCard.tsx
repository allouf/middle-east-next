import { ReceiptText, Download, ShieldCheck } from "lucide-react";

interface Props {
  servicePrice: number;
  vat: number;
  fees: number;
  total: number;
}

function SummaryRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-lg ${bold ? "font-bold text-textColor" : "text-textGrayColor"}`}>
        {label}
      </span>
      <span className={`text-lg ${bold ? "font-bold text-textColor" : "font-semibold text-textColor"}`}>
        {value}
      </span>
    </div>
  );
}

export default function OrderSummaryCard({ servicePrice, vat, fees, total }: Props) {
  return (
    <aside className="rounded-[24px] border border-grayBorder bg-white shadow-[0_8px_32px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between border-b border-grayBorder px-5 py-5">
        <div className="flex items-center gap-3">
          <ReceiptText className="h-5 w-5 text-textGrayColor" />
          <h3 className="text-[22px] font-bold text-textColor">Order Summary</h3>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blueSite text-blueSite transition hover:bg-blueSite hover:text-white"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-5 px-5 py-6">
        <SummaryRow label="service price" value={`${servicePrice.toFixed(2)}$`} />
        <SummaryRow label="VAT" value={`${vat.toFixed(2)}$`} />
        <SummaryRow label="Fees" value={`${fees.toFixed(2)}$`} />

        <div className="border-t border-grayBorder pt-5">
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-bold text-textColor">Total Amount</span>
            <span className="text-[22px] font-bold text-[#0A7A5A]">{total.toFixed(2)}$</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#9AE0B8] bg-[#EAF8EF] px-4 py-4 text-center">
          <div className="inline-flex items-center gap-2 text-lg font-bold text-[#16B364]">
            ESCROW PROTECTION
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        <p className="px-2 text-center text-sm leading-6 text-textGrayColor">
          payment is held securely and will only be released once the customer approve the final delivery.
        </p>
      </div>
    </aside>
  );
}