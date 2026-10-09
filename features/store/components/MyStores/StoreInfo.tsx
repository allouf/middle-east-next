import React from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FaBoxOpen, FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { Store as StoreType } from "@/features/store/types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface StoreInfoProps {
  store: StoreType & {
    categories_count?: number;
    products_count?: number;
  };
}

const StoreInfo = ({ store }: StoreInfoProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-sm text-subTitleColor space-y-1">
        {store.address && (
          <p className="flex items-start gap-1 text-xs md:text-[14px] text-textColor">
            <MdLocationOn className="text-blueSite text-xl md:text-2xl flex-shrink-0 mt-[2px]" />
            <span className="leading-snug line-clamp-2">{store.address}</span>
          </p>
        )}
        {store.categories_count && (
          <p className="flex items-center gap-1 text-xs md:text-sm text-textColor pl-1">
            <BiSolidCategoryAlt className="text-blueSite text-sm md:text-base " />
            <span className="leading-snug line-clamp-1 flex gap-2">
              {store.categories_count}
              <span>{t("storeInfo.categoriesAvailable")}</span>
            </span>
          </p>
        )}

        {store.products_count !== undefined && (
          <p className="flex items-center gap-1 text-xs md:text-[14px] text-textColor pl-1">
            <FaBoxOpen className="text-blueSite text-sm md:text-base" />
            <span>{store.products_count} {t("storeInfo.productsCount")}</span>
          </p>
        )}
        <p className="flex items-center gap-1 text-xs md:text-[14px] text-textColor pl-1">
          <FaStar className="text-blueSite text-xs md:text-sm" />
          <span>{store.rating}</span>
        </p>
      </div>
    </>
  );
};

export default StoreInfo;
