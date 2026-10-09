'use client';

import React from "react";
import { RefreshCcw, Truck } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface DeliveryInfo {
  freeReturns?: boolean;
  deliveryDate?: string;
  orderWindow?: string;
}

interface ProductDeliveryProps {
  deliveryInfo?: string | DeliveryInfo | null;
}

const ProductDelivery: React.FC<ProductDeliveryProps> = ({ deliveryInfo }) => {
  const {t} = useTranslation();
  // If no delivery info provided from API, don't render anything
  if (!deliveryInfo) return null;

  // If deliveryInfo is a string, display it as simple text
  if (typeof deliveryInfo === 'string') {
    return (
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-subTitleColor">
          <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
          <span className="break-words">{deliveryInfo}</span>
        </div>
      </div>
    );
  }

  // If deliveryInfo is an object, display structured delivery information
  return (
    <div className="space-y-2 sm:space-y-3">
      {/* Free Returns */}
      {deliveryInfo.freeReturns && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-subTitleColor">
          <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
          <span className="font-semibold break-words">{t('product.freeReturns')}</span>
        </div>
      )}

      {/* Delivery Info */}
      {deliveryInfo.deliveryDate && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-green-600">{t('product.free')}</span>
            <span className="text-xs sm:text-sm text-subTitleColor break-words">
              {t('product.delivery')} {deliveryInfo.deliveryDate}
            </span>
          </div>
          {deliveryInfo.orderWindow && (
            <p className="text-xs text-textColor ml-6 break-words">
              {t('product.orderWithin', { time: deliveryInfo.orderWindow })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDelivery;
