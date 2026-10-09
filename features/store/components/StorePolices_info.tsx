"use client"
import { useTranslation } from '@/lib/i18n/useTranslation'
import React from 'react'

const StorePolices_info = ({shippingPolicy,returnPolicy}:{shippingPolicy:string,returnPolicy:string}) => {
    const {t} = useTranslation()
  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="mt-6 bg-grayLight p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blueBtn mb-3">
            {t("store.returnPolicy")}
            </h3>
            <p className="text-subTitleColor leading-relaxed text-sm">
            {returnPolicy || t("store.noReturnPolicy")}
            </p>
        </div>
        <div className="mt-6 bg-grayLight p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blueBtn mb-3">
            {t("store.shippingPolicy")}
            </h3>
            <p className="text-subTitleColor leading-relaxed text-sm">
            {shippingPolicy || t("store.noShippingPolicy")}
            </p>
        </div>
    </div>
  )
}

export default StorePolices_info