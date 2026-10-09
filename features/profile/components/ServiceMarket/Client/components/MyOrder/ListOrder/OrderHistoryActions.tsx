import React from "react";
import { OrderStatus } from "../../../types/order";

interface Props {
  status: OrderStatus;
  onReject?: () => void;
  onAccept?: () => void;
  onComplete?: () => void;
  onRefund?: () => void;
  onFeedback?: () => void;
}

export default function OrderHistoryActions({
  status,
  onReject,
  onAccept,
  onComplete,
  onRefund,
  onFeedback,
}: Props) {
  if (status === "pending") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReject}
          className="rounded-xl bg-red-50 px-6 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onAccept}
          className="rounded-xl bg-blueSite px-6 py-3 text-sm font-semibold text-white transition hover:bg-blueSiteHover"
        >
          Accept Request
        </button>
      </div>
    );
  }

  if (status === "in_progress") {
    return (
      <button
        type="button"
        onClick={onComplete}
        className="rounded-xl bg-blueSite px-6 py-3 text-sm font-semibold text-white transition hover:bg-blueSiteHover"
      >
        Complete Order
      </button>
    );
  }

  if (status === "completed") {
    return (
      <button
        type="button"
        onClick={onFeedback}
        className="rounded-xl bg-[#DDF1EA] px-6 py-3 text-sm font-semibold text-[#4F8F7D] transition hover:bg-[#cfe9df]"
      >
        Send your feedback
      </button>
    );
  }

  if (status === "cancelled") {
    return (
      <button
        type="button"
        onClick={onRefund}
        className="rounded-xl bg-blueSite px-6 py-3 text-sm font-semibold text-white transition hover:bg-blueSiteHover"
      >
        Refund Payment
      </button>
    );
  }

  return null;
}