"use client";

import React, { useCallback, useMemo, useState } from "react";
import { App } from "antd";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";

import UsedMarketStats from "../UsedMarket/UsedMarketStats";
import UsedMarketFilters from "../UsedMarket/UsedMarketFilters";
import UsedMarketTable from "../UsedMarket/UsedMarketTable";
import UsedMarketInbox from "../UsedMarket/UsedMarketInbox";
import UsedMarketSavedAds from "../UsedMarket/UsedMarketSavedAds";
import EditForm from "../UsedMarket/EditForm";
import AddAdForm, { AdFormData } from "../UsedMarket/AddAdForm";
import AddAdSuccessModal from "../UsedMarket/AddAdSuccessModal";
import RateLimitModal from "../UsedMarket/RateLimitModal";
import useGetData from "@/lib/api/useGetData";
import { AdvertisementsEndpoints } from "@/shared/constants/urls";
import DeleteModal from "@/components/shered/DeleteModel";
import usePostData from "@/lib/api/usePostData";

type IdLike = string | number;
import type {
  UserAd,
  AdStatistics,
  FilterState,
  PaginationConfig,
} from "../UsedMarket/types";
import Button from "@/components/ui/Button";
import { Package } from "lucide-react";
import ViewDetails from "../UsedMarket/ViewDetails";
import { USER_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { FaRegHeart } from "react-icons/fa";


// ✅ Replace mock later with API stats if you have it
const mockStats: AdStatistics = {
  activeAds: { count: 124, trend: 2.08 },
  pausedAds: { count: 42, trend: -1.38 },
  soldAds: { count: 187, trend: 4.03 },
  expiredAds: { count: 28, trend: -0.99 },
};

// ✅ helper: convert filters -> API params
const buildQueryParams = (filters: FilterState) => {
  // map "case" to API fields
  // case: "negotiable" | "free" | null
  // API: is_price_negotiable, is_free
  const params: Record<string, any> = {};

  // state/status
  if (filters.state && filters.state !== "all") {
    params.status = filters.state;
  }

  // condition
  if (filters.condition) {
    params.condition = filters.condition;
  }

  // case
  if (filters.case === "free") {
    params.is_free = 1;
  } else if (filters.case === "negotiable") {
    params.is_price_negotiable = 1;
  }

  // search
  if (filters.search?.trim()) {
    params.search = filters.search.trim();
  }

  // date (from)
  if (filters.date) {
    params.date_from = filters.date; // adjust key if your backend expects something else
  }

  // sort
  // match your backend contract:
  // most_viewed, latest, price_high, price_low
  if (filters.sortBy) {
    params.sort_by = filters.sortBy;
  }

  return params;
};

const UsedMarketContent: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { modal } = App.useApp();

  const [openInbox, setOpenInbox] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState<string | number>("");
  const [viewId, setViewId] = useState<string | number>();
  const [newItemId, setNewId] = useState<string | number>();
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showRateLimitModal, setShowRateLimitModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<IdLike | null>(null);
  const [openSaved, setOpenSaved] = useState<boolean>(false)

  const openDelete = useCallback((id: IdLike) => setDeleteId(id), []);
  const closeDelete = useCallback(() => setDeleteId(null), []);


  // ✅ filters (source of truth)
  const [filters, setFilters] = useState<FilterState>({
    case: null,
    condition: null,
    state: null,
    date: null,
    sortBy: "",
    search: "",
  });

  // ✅ pagination (server-side)
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // ✅ Build params from filters (stable memo)
  const extraParams = useMemo(() => buildQueryParams(filters), [filters]);

  // ✅ Fetch API with pagination + filters
  const {
    data: resData,
    loading,
    refetch,
  } = useGetData({
    url: AdvertisementsEndpoints.getAllMyAds,
    paginate: true,
    per_page: pagination.pageSize,
    page: pagination.current,
    extraParams,
  });

  // ✅ Normalize API response -> table data
  const tableData: UserAd[] = useMemo(() => {
    const payload = (resData as any)?.data ?? resData;

    // common patterns:
    // payload.data = items
    // payload.meta.total = total
    const items = payload?.data ?? payload?.items ?? payload ?? [];
    return Array.isArray(items) ? (items as UserAd[]) : [];
  }, [resData]);


  const {
    postData: postChangeStatus,
    loading: lodginChangeStatus,
    contextHolder: changeStatusHolder,
  } = usePostData();

  const {
    postData: createAd,
    loading: loadingCreateAd,
  } = usePostData();
  // ✅ total from backend
  const totalFromApi = useMemo(() => {
    const payload = (resData as any)?.data ?? resData;
    return (
      payload?.meta?.total ??
      payload?.total ??
      payload?.pagination?.total ??
      0
    );
  }, [resData]);


  // keep total in state (optional) to reflect in table pagination
  const effectivePagination = useMemo(
    () => ({
      ...pagination,
      total: totalFromApi || pagination.total,
    }),
    [pagination, totalFromApi]
  );

  // ✅ change filters (live typing)
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // ✅ apply button: reset page to 1 + refetch
  const handleApplyFilters = () => {
    setPagination((prev) => ({ ...prev, current: 1 }));

    refetch?.();
  };

  // ✅ handle server pagination
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize,
    }));
  };

  const handleView = (id: string | number) => {
    setEditId('');
    setViewId(id)
  };

  const handleEdit = (id: string | number) => {
    setViewId('')
    setEditId(id);
    setOpenEdit(true);
  };
  const onChangeStatus = useCallback(async (id: string | number, status: string) => {
    await postChangeStatus({ status: status }, { endpoint: AdvertisementsEndpoints.changeStatus(id) })
  }, [postChangeStatus]);

  const handleDelete = (id: string | number) => {
    openDelete(id);
  }
  const handleAddAd = () => {
    setShowAddForm(true);
  };

  const handleSubmitAd = async (data: AdFormData): Promise<void> => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.category) formData.append("advertisement_category_id", String(data.category));
    if (data.sub_category) formData.append("advertisement_subcategory_id", String(data.sub_category));
    formData.append("description", data.description);

    // Price
    formData.append("price", data.case === "free" ? "0" : data.price);

    // Case handling (negotiable/free)
    if (data.case === "negotiable") {
      formData.append("is_price_negotiable", "1");
      formData.append("is_free", "0");
    } else if (data.case === "free") {
      formData.append("is_price_negotiable", "0");
      formData.append("is_free", "1");
    } else if (data.case === "price") {
      formData.append("is_price_negotiable", "0");
      formData.append("is_free", "0");
    } else {
      formData.append("is_price_negotiable", "0");
      formData.append("is_free", "0");
    }

    if (data.condition) formData.append("condition", data.condition);
    if (data.contact_method) formData.append("contact_method", data.contact_method);
    if (data.phone) formData.append("phone", data.phone);
    formData.append("show_phone", String(data.show_phone ?? 0));

    // Images
    data.images.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Country must be sent by country_code
    formData.append("country_code", data.country_code || "");
    if (data.region) formData.append("region", String(data.region));

    try {
      const result = await createAd(formData, {
        endpoint: USER_ENDPOINTS.Create_Advertisement,
      });

      if (result) {
        const newId =
          result?.id ||
          result?.data?.id ||
          result?.advertisement?.id;

        setNewId(newId);
        await refetch?.();
      }
    } catch (error) {
      throw error;
    }
  };

  const handleAdSuccess = () => {
    setShowAddForm(false);
    setShowSuccessModal(true);
  };

  const handleRateLimitExceeded = () => {
    setShowRateLimitModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };
  const handleViewDeatilaModal = () => {
    setShowSuccessModal(false);
    setViewId(newItemId);
  };

  const handleCloseRateLimitModal = () => {
    setShowRateLimitModal(false);
    setShowAddForm(false);
  };

  const handleGoHome = () => {
    setShowRateLimitModal(false);
    setShowAddForm(false);
    router.push("/");
  };


  if (openInbox) {
    return <UsedMarketInbox onBack={() => setOpenInbox(false)} />;
  }
  if (openSaved) {
    return <UsedMarketSavedAds onBack={() => setOpenSaved(false)} />;
  }
  if (viewId) {
    return (
      <>
        {changeStatusHolder}
        <ViewDetails
          id={viewId}
          onBack={() => setViewId('')}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatus={onChangeStatus}
        />
        <DeleteModal
          isOpen={deleteId !== null}
          onClose={closeDelete}
          title={t("store.delete.title")}
          description={t("store.delete.description")}
          url={AdvertisementsEndpoints.deleteAdvertisements}
          id={deleteId ?? ""}
          refetch={refetch}
          confirm
        />
      </>
    )
  }
  if (openEdit) {
    return (
      <EditForm
        onBack={() => setOpenEdit(false)}
        refetch={refetch}
        id={editId}
      />
    );
  }
  // Show Add Ad form view
  if (showAddForm) {
    return (
      <AddAdForm
        onBack={() => setShowAddForm(false)}
        onSubmit={handleSubmitAd}
        onSuccess={handleAdSuccess}
        onRateLimitExceeded={handleRateLimitExceeded}
      />
    );
  }
  return (
    <div className="p-6">
      {/* Page Title */}
      <div className="flex justify-between mb-6">
        <h1 className="text-xl text-gray-800">{t("usedMarket.title")}:</h1>
        <div className="flex flex-row gap-3 items-center">
          {/* <Button
            onClick={() => setOpenInbox(true)}
            className="bg-blueIcons hover:bg-blueIcons/90 text-white px-6 h-10 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Package className="w-5 h-5 text-white" />
            {t("usedMarket.inbox")}
          </Button> */}
          <Button
            onClick={() => setOpenSaved(true)}
            unstyled
            className="bg-[#00664F33] text-[#00664F] px-6 h-10 rounded-[10px] font-medium transition-colors flex items-center gap-2"
          >
            <FaRegHeart className="w-5 h-5" />
            {t("usedMarket.savedAds.title")}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <UsedMarketStats stats={mockStats} />

      {/* Filters */}
      <UsedMarketFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={handleApplyFilters}
        onAddAd={handleAddAd}
      />

      {/* Data Table (✅ server-side filtered + paginated) */}
      <UsedMarketTable
        data={tableData}
        loading={loading}
        pagination={effectivePagination}
        onPageChange={handlePageChange}
        onView={handleView}
        refetch={refetch}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddAdSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        onViewDetails={handleViewDeatilaModal}
      />


      <DeleteModal
        isOpen={deleteId !== null}
        onClose={closeDelete}
        title={t("usedMarket.delete.delete")}
        description={t("usedMarket.delete.description")}
        url={AdvertisementsEndpoints.deleteAdvertisements}
        id={deleteId ?? ""}
        refetch={refetch}
        confirm
      />
      <RateLimitModal
        isOpen={showRateLimitModal}
        onClose={handleCloseRateLimitModal}
        onGoHome={handleGoHome}
      />

    </div>
  );
};

export default UsedMarketContent;

