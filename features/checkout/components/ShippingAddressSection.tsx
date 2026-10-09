"use client";

import React from "react";
import { AddressDropdown } from "./AddressDropdown";
import { SelectedAddressMeta } from "./SelectedAddressMeta";
import { useTranslation } from "@/lib/i18n/useTranslation";

type Props = {
  addressQuery: string;
  setAddressQuery: (v: string) => void;

  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;

  shouldShowList: boolean;
  isSubmited: boolean;
  addressMatches: any[];

  selectedAddressId: number | null;
  selectedAddress: any;

  onSelectAddress: (addr: any) => void;
  onOpenAddModal: () => void;

};

export const ShippingAddressSection: React.FC<Props> = (props) => {
  const {
    addressQuery,
    setAddressQuery,
    showSuggestions,
    setShowSuggestions,
    shouldShowList,
    addressMatches,
    selectedAddressId,
    selectedAddress,
    onSelectAddress,
    onOpenAddModal,
    isSubmited
  } = props;
  const { t } = useTranslation();
  const hasAddress = !!selectedAddress && selectedAddressId !== null;
  return (
    <section className="bg-white rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-7 bg-blueSite rounded" />
        <h2 className="text-[#3C4242] text-2xl">{t('checkout.shippingAddressTitle')}</h2>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-lightGreen text-sm mb-2">  {t('checkout.addressLabel')}</label>

          <AddressDropdown
            addressQuery={addressQuery}
            setAddressQuery={setAddressQuery}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
            shouldShowList={shouldShowList}
            addressMatches={addressMatches}
            selectedAddressId={selectedAddressId}
            onSelectAddress={onSelectAddress}
            onOpenAddModal={onOpenAddModal}
          />
        </div>

        <SelectedAddressMeta address={selectedAddress} />
      </div>
      {!hasAddress && isSubmited && (
        <p className="mt-2 text-sm text-red-500">
          {t("checkout.noAddressSelected")}
        </p>
      )}
    </section>
  );
};
