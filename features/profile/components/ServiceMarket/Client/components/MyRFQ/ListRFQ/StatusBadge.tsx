import { RequestStatus } from "../../../types/Rfq";

const statusClasses: Record<RequestStatus, string> = {
  Open: "bg-[#F4ECFF] text-[#8B3DFF]",
  Awarded: "bg-[#E8F8EC] text-[#1FA750]",
  Canceled: "bg-[#EEF2F6] text-[#708198]",
  Expired: "bg-[#FFF0F0] text-[#F04438]",
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-[92px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
