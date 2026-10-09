import { useTranslation } from '@/lib/i18n/useTranslation'
import { formatDate } from '@/lib/utils/format'
import React from 'react'
import { FaEye } from 'react-icons/fa'
import { Coupon } from '@/features/stores/types/coupons'

interface CouponRowProps {
  coupon: Coupon;
  handleDeleteCoupon: (id: string | null) => void;
  handleOpenShowModal: (id: string | null) => void;
}

const CouponRow = ({ coupon, handleDeleteCoupon, handleOpenShowModal }: CouponRowProps) => {
  const { t } = useTranslation()
  return (
    <tr key={coupon.id} className="border-b hover:bg-gray-50 [&_td]:p-3 [&_td]:text-start">
      <td >{coupon.id}</td>
      <td className=" font-medium">{coupon.code}</td>
      <td >
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.discount_type === "percentage"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
            }`}
        >
          {t(`coupons.create.discountTypes.${coupon.discount_type}`)}
        </span>

      </td>
      <td >
        {coupon.discount_value}
        {coupon.discount_type === 'percentage' ? '%' : ''}
      </td>
      <td >{coupon.min_cart_amount} USD</td>
      <td >{formatDate(coupon.expires_at)}</td>
      <td >
        {coupon.max_usage_per_user}
      </td>
      <td >
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${coupon.is_expired
          ? "bg-red-100 text-red-600"
          : "bg-green-100 text-green-600"
          }`}>
          {coupon.is_expired ? t("status.expired") : t("status.active")}
        </span>
      </td>
      <td className="p-1 text-end">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleOpenShowModal(coupon.id.toString())}
            className="p-2 text-blueblueSite hover:text-blueSiteHover hover:bg-[#E6F0ED] rounded-lg transition-colors"
            title={t("coupons.viewCoupon")}
          >
            <FaEye className="text-lg" />
          </button>
          <button
            onClick={() => handleDeleteCoupon(coupon.id.toString())}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            title={t("coupons.deleteCoupon")}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CouponRow