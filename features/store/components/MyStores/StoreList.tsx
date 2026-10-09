import React from "react";
import StoreCard from "./StoreCard";
import { Store } from "@/features/store/types/type";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface StoreListProps {
  stores: Store[];
  refetch: () => void;
  is_trashed: boolean;
}

const StoreList: React.FC<StoreListProps> = ({ stores, refetch, is_trashed }) => {
  const { t } = useTranslation();
  
  if (stores.length === 0) {
    return <p className="text-center text-subTitleColor py-10">{t("storeList.noStoresFound")}</p>
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          refetch={refetch}
          is_trashed={is_trashed}
        />
      ))}
    </div>
  );
};

export default StoreList;
