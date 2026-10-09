'use client';

import React, { useState, useMemo } from "react";
import { STORE_ENDPOINT } from "@/shared/constants/urls";

import AddStore from "@/features/store/components/addStore/AddStore";
import StoreHeader from "./StoreHeader";
import StoreStats from "./StoreStats";
import StoreList from "./StoreList";
import { MyStoresResponse, Store } from "@/features/store/types/type";

const MyStores = ({ data }: { data: MyStoresResponse }) => {
  const [showAddStore, setShowAddStore] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // Normalize store data
  const stores = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  // Filtered and sorted stores
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
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }

    return result;
  }, [stores, search, sort]);

  // if (loading) return <LoaderPage type="stores" />;
  // if (error) return <ErrorWithRetry onRetry={refetch} />;

  const refetch = () => {
    window.location.reload()
  }

  if (showAddStore) {
    return (
      <div>
        <div className="flex justify-between items-center ">
          {/* <button
            onClick={() => setShowAddStore(false)}
            className="bg-gray-100 hover:bg-gray-200 text-subTitleColor px-4 py-2 rounded-lg transition"
          >
            Back to Stores
          </button> */}
        </div>
        <AddStore
          refetch={() => {
            refetch();
            // setShowAddStore(false);
          }}
          handleClose={() => setShowAddStore(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-7 p-6 md:p-7 md:pt-[4vh]">
      <StoreHeader
        count={stores.length}
        onAddStore={() => setShowAddStore(true)}
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      <StoreStats count={stores.length} />

      <StoreList stores={filteredStores} refetch={refetch} is_trashed={false} />
    </div>
  );
};

export default MyStores;
