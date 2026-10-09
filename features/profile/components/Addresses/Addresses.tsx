"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Briefcase, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import DeleteModal from "@/components/shered/DeleteModel";
import useGetData from "@/lib/api/useGetData";
import { ADDRESSES_ENDPOINT } from "@/shared/constants/urls";
import { Address, AddressesResponse, TitleOption } from "@/features/profile/types/addresses";

import AddressModal from "./AddressModal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { App } from "antd";
import AddressAutoComplete from "@/features/profile/components/Addresses/AddressAutoComplete";
import noAddressIcon from "@/assets/icons/noAddress.svg"
import Image from "next/image";
import { MdLocationOn } from "react-icons/md";

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<
    Address["id"] | null
  >(null);
  const { message: messageApi } = App.useApp();

  const { data, loading, error, refetch } = useGetData<AddressesResponse>({
    url: ADDRESSES_ENDPOINT.getAll,
  });

  const { t } = useTranslation();

  useEffect(() => {
    if (data?.data) {
      setAddresses(data.data);
    }
  }, [data]);

  const handleDelete = (id: Address["id"]) => {
    setIsDeleteOpen(true);
    setSelectedAddressId(id);
  };

 const getTitleLabel = useCallback(
    (item: string) => {
      if (item === "home" || item === "office" || item === "work") return t(`address.titleButton.${item}`);
      return item;
    },
    [t]
  );


  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen space-y-4 p-6 md:p-7 md:pt-[4vh]">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="border border-gray-200 rounded-lg p-4 bg-bgGray animate-pulse"
          >
            <div className="flex items-start gap-4">
              {/* Icon skeleton */}
              <div className="w-5 h-5 rounded-full bg-gray-300 mt-1" />

              {/* Text skeleton */}
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-4/5 bg-gray-300 rounded" />
              </div>

              {/* Actions skeleton */}
              <div className="flex gap-4 self-end">
                <div className="h-4 w-14 bg-gray-300 rounded" />
                <div className="h-4 w-16 bg-gray-300 rounded" />
              </div>

              {/* Checkbox skeleton */}
              <div className="w-5 h-5 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }


  if (error) return <ErrorWithRetry onRetry={refetch} />;

  return (
    <div className="w-full  bg-white min-h-screen p-6 md:p-7 md:pt-[4vh]">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-5">
          <h1 className="lg:text-[26px] text-[20px] font-semibold text-subTitleColor mb-4">
            {t("address.title2")}
          </h1>
        </div>

        {/* Add New Address */}

        <AddressModal

          refetch={refetch}
        />
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">

          <div className="flex items-center justify-center">
            <Image src={noAddressIcon} width={200} height={200} alt="No address" />
          </div>
          <p className="text-subTitleColor text-[26px] mb-4">
            {t("address.noAddresses")}
          </p>
          <p className="text-textColor text-[16px] mb-4 ">
            {t("address.noAddress_message")}
          </p>

          <AddressModal
            refetch={refetch}
            noAddress={true}
          />

        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-lg p-4 bg-[#FCFCFC] hover:shadow-md transition-shadow min-h-[100px]"
            >
              <div className="min-h-[80px] flex items-start justify-between gap-4">
                {/* Icon */}
                <div className="flex-1 min-h-[80px] flex items-start  gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Briefcase size={20} className="text-blueIcons" />
                  </div>
                  <div className="flex-1 min-h-[80px] flex sm:flex-row flex-col justify-between sm:gap-0 gap-2">
                    {/* Address Content */}
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-subTitleColor text-[20px] mb-2">
                     {getTitleLabel(address.title)}
                      </span>
                      <p className="text-textColor text-[18px] leading-relaxed break-words">
                        {address.address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="self-end flex items-center justify-end gap-6 flex-shrink-0">
                      <AddressAutoComplete
                        id="location"
                        refetch={refetch}
                        isEdit={true}
                        oldData={address}
                        noAddress={false}
                      />

                      <Button
                        unstyled
                        onClick={() => handleDelete(address.id)}
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={18} />
                        <span className="text-[18px] underline underline-offset-2 font-medium text-subTitleColor">
                          {t("address.delete")}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Default Checkbox */}
                <input
                  type="checkbox"
                  checked={address.is_default || false}
                  readOnly
                  aria-label={t("address.isDefault")}
                  className="min-w-5 min-h-5 accent-blueSite cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      )}


      {isDeleteOpen && selectedAddressId && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title={t("deleteAddress.title")}
          description={t("deleteAddress.description")}
          url={ADDRESSES_ENDPOINT.delelte}
          id={selectedAddressId}
          icon={<MdLocationOn size={32} color="#00664f"/>}
          style={{
            iconWrap: {
              backgroundColor: "#E6F0ED",
            },
          }}
          refetch={() => {
            messageApi.success(t("deleteAddress.success"))
            setTimeout(() => {
              refetch?.();
            }, 1000);
          }}
        />
      )}
    </div>
  );
};

export default Addresses;
