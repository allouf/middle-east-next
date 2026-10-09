 "use client"
import React, { useState, useMemo } from "react";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import useGetData from "@/lib/api/useGetData";
import StoreHeader from "../../../store/components/MyStores/StoreHeader";
import StoreList from "../../../store/components/MyStores/StoreList";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import { useTranslation } from "@/lib/i18n/useTranslation";
import TrashedSkeleton from "./TrashedSkeleton";

const Trashed = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // ✅ Fetch trashed stores only
  const { data, loading, error, refetch } = useGetData({
    url: STORE_ENDPOINT.getTrashedStores,
  });

  // ✅ Normalize trashed store data
  const stores = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.stores)) return data.data.stores;
    return [];
  }, [data]);

  // ✅ Filter + sort
  const filteredStores = useMemo(() => {
    let result = [...stores];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(lower) ||
          s.description?.toLowerCase().includes(lower)
      );
    }

    if (sort === "latest") {
      result.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
    } else {
      result.sort((a, b) => new Date(a.deleted_at) - new Date(b.deleted_at));
    }

    return result;
  }, [stores, search, sort]);

  // ✅ Loading & Error
  if (loading) return <TrashedSkeleton />;
  if (error) return <ErrorWithRetry onRetry={refetch} />;

  // ✅ UI
  return (
    <div className="space-y-8 p-6 md:p-7 md:pt-[4vh]">
      <StoreHeader
        title={t("trashed.trashedStores")}
        count={stores.length}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        hideAddButton // 🔒 hide "Add Store" button here
      />

      {filteredStores.length > 0 ? (
        <StoreList
          stores={filteredStores}
          refetch={refetch}
          is_trashed={true}
        />
      ) : (
        <p className="text-center text-textColor mt-8">
          {t("trashed.noDeletedStoresFound")}
        </p>
      )}
    </div>
  );
};

export default Trashed;
