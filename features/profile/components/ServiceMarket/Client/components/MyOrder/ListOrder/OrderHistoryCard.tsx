import Image from "next/image";
import OrderHistoryMeta from "./OrderHistoryMeta";
import OrderHistoryActions from "./OrderHistoryActions";
import { OrderHistoryItemType } from "../../../types/order";
import StatusBadge from "./OrderStatusBadge";


interface Props {
  order: OrderHistoryItemType;
  onViewDetails?: (orderId: string) => void;
}

export default function OrderHistoryCard({ order, onViewDetails }: Props) {
  const handleClick = () => {
    onViewDetails?.(order.id);
  };

  return (
    <article className="overflow-hidden rounded-[22px] border border-grayBorder bg-white shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
      <div 
        className="flex flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between lg:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={handleClick}
      >
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="relative h-[122px] w-[165px] shrink-0 overflow-hidden rounded-2xl bg-[#D9E7E7]">
            <Image
              src={order.image}
              alt={order.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#DFF4E8] px-3 py-1 text-xs font-semibold text-[#299764]">
                #{order.orderNumber}
              </span>
            </div>

            <h3 className="line-clamp-2 text-[22px] font-bold leading-[1.35] text-textColor">
              {order.title}
            </h3>

            <div className="my-4 h-px bg-grayBorder" />

            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src="/images/avatar-placeholder.png"
                  alt={order.sellerName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="text-lg font-semibold text-textColor">{order.sellerName}</p>
                <p className="text-sm text-textGrayColor">{order.sellerSubtitle || "lorem ipsum"}</p>
              </div>
            </div>

            {order.status === "cancelled" && order.rejectionReason ? (
              <div className="mt-4">
                <p className="text-xs font-medium text-textGrayColor">Rejection Reason</p>
                <p className="text-sm font-medium text-red-500">{order.rejectionReason}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
          <StatusBadge type="order" value={order.status} />
          {order.paymentStatus && <StatusBadge type="payment" value={order.paymentStatus} />}
          {order.urgentLabel ? (
            <StatusBadge
              type="custom"
              label={order.urgentLabel}
              className="border-red-200 bg-red-500 text-white"
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-grayBorder bg-[#FCFCFC] px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <OrderHistoryMeta
          orderDate={order.orderDate}
          deliveryDays={order.deliveryDays}
          total={order.total}
        />

        <OrderHistoryActions
          status={order.status}
          onReject={() => console.log("reject", order.id)}
          onAccept={() => console.log("accept", order.id)}
          onComplete={() => console.log("complete", order.id)}
          onRefund={() => console.log("refund", order.id)}
          onFeedback={() => console.log("feedback", order.id)}
        />
      </div>
    </article>
  );
}