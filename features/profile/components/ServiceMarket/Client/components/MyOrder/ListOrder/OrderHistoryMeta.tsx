import React from "react";
import { CalendarDays, Clock3, CircleDollarSign } from "lucide-react";

interface Props {
  orderDate: string;
  deliveryDays: number;
  total: number;
}

export default function OrderHistoryMeta({ orderDate, deliveryDays, total }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-textGrayColor">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4 text-blueSite" />
        <span>
          Order Date: <span className="font-semibold text-textColor">{orderDate}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-blueSite" />
        <span>
          Delivery Date: <span className="font-semibold text-textColor">{deliveryDays} Days</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <CircleDollarSign className="h-4 w-4 text-blueSite" />
        <span>
          Total: <span className="text-lg font-bold text-[#0A7A5A]">{total.toFixed(2)}$</span>
        </span>
      </div>
    </div>
  );
}