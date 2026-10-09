interface Props {
  onReject?: () => void;
  onConfirm?: () => void;
}

export default function OrderActionBar({ onReject, onConfirm }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onReject}
        className="rounded-xl bg-red-100 px-6 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-200"
      >
        Reject
      </button>

      <button
        type="button"
        onClick={onConfirm}
        className="rounded-xl bg-blueSite px-6 py-3 text-sm font-semibold text-white transition hover:bg-blueSiteHover"
      >
        Confirm & Start Service
      </button>
    </div>
  );
}