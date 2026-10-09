"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";


import useGetData from "@/lib/api/useGetData";
import usePatchData from "@/lib/api/usePatchData";
import { PACKAGES_ENDPOINT } from "@/shared/constants/urls";
import { useTranslation } from "@/lib/i18n/useTranslation";

import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import DeleteModal from "@/components/shered/DeleteModel";

import CreatePackageModal from "./CreatePackageModal";
import ShowPackageModal from "./ShowPackageModal";
import UpdatePackageModal from "./UpdatePackageModal";
import PackagesFilters from "./PackagesFilters";

import PackagesHeader from "./PackagesHeader";
import PackagesTable from "./PackagesTable";

import type {
  DatePreset,
  DiscountFilter,
  Package,
  PackagesResponse,
  SortBy,
  StatusFilter,
} from "../../types/PackageTypes";

import { getCssVar, getPaginationRange } from "@/lib/utils/helper";
import CustomConfirmModal from "@/components/shered/CustomConfirmModal";
import { ExclamationCircleFilled } from "@ant-design/icons";

// ---------- helpers ----------
type ModalState =
  | { type: "none" }
  | { type: "create" }
  | { type: "view"; packageId: number }
  | { type: "edit"; packageId: number }
  | { type: "delete"; packageId: number };

type DateRange = { from: Date | null; to: Date | null };

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

const getDateRange = (preset: DatePreset, dateFrom: string, dateTo: string): DateRange => {
  if (preset === "all") return { from: null, to: null };
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "last7": {
      const from = startOfDay(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
      return { from, to: endOfDay(now) };
    }
    case "last30": {
      const from = startOfDay(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
      return { from, to: endOfDay(now) };
    }
    case "custom": {
      const from = dateFrom ? startOfDay(new Date(dateFrom)) : null;
      const to = dateTo ? endOfDay(new Date(dateTo)) : null;
      return { from, to };
    }
    default:
      return { from: null, to: null };
  }
};

const isWithinRange = (date: Date | null, range: DateRange) => {
  if (!date) return true;
  const { from, to } = range;
  if (!from && !to) return true;
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
};

const matchesDiscount = (pack: any, filter: DiscountFilter) => {
  if (filter === "all") return true;
  const isFixed = Boolean(pack.fixed_discount);
  return filter === "fixed" ? isFixed : !isFixed;
};

const matchesStatus = (pack: any, filter: StatusFilter) => {
  if (filter === "all") return true;
  return filter === "active" ? Boolean(pack.is_active) : !Boolean(pack.is_active);
};

const matchesSearch = (pack: any, query: string) => {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return String(pack.id).toLowerCase().includes(q) || String(pack.title ?? "").toLowerCase().includes(q);
};

// ---------- page ----------
const PackagesManagement: React.FC = () => {
  const { t } = useTranslation();
  const { id: storeId } = useParams<{ id: string }>();

  const [search, setSearch] = useState("");
  const [discountFilter, setDiscountFilter] = useState<DiscountFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortBy>("latest");
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useState<Record<number, boolean>>({});
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ id: number; status: boolean } | null>(null);

  const { patchData } = usePatchData();

  const { data, loading: isFetching, error, refetch } = useGetData<PackagesResponse>({
    url: PACKAGES_ENDPOINT.getByStore(storeId),
    enabled: Boolean(storeId),
    paginate: true,
    page: currentPage,
    extraParams: {
      discount_type: discountFilter === "all" ? "" : discountFilter,
      status: statusFilter === "all" ? "" : statusFilter,
      date_preset: datePreset,
      date_from: datePreset === "custom" ? dateFrom : "",
      date_to: datePreset === "custom" ? dateTo : "",
      sort_by: sort === "latest" ? "" : sort,
    },
  });

  const meta = data?.data?.meta || { current_page: 1, last_page: 1, per_page: 10, total: 0 };
  const { from, to } = getPaginationRange(meta);

  const allPackages = data?.data?.packages ?? [];

  const displayedPackages: Package[] = useMemo(
    () => allPackages.map((p) => ({ ...p, is_active: optimisticStatus[p.id] ?? p.is_active })),
    [allPackages, optimisticStatus]
  );

  const dateRange = useMemo(() => getDateRange(datePreset, dateFrom, dateTo), [datePreset, dateFrom, dateTo]);

  const filteredPackages = useMemo(() => {
    return displayedPackages.filter((pack: any) => {
      const createdAt = pack.created_at ? new Date(pack.created_at) : null;
      return (
        matchesSearch(pack, search) &&
        matchesDiscount(pack, discountFilter) &&
        matchesStatus(pack, statusFilter) &&
        isWithinRange(createdAt, dateRange)
      );
    });
  }, [displayedPackages, search, discountFilter, statusFilter, dateRange]);

  const resetFilters = useCallback(() => {
    setDatePreset("all");
    setDateFrom("");
    setDateTo("");
    setDiscountFilter("all");
    setStatusFilter("all");
  }, []);

  const openCreate = useCallback(() => setModal({ type: "create" }), []);
  const openView = useCallback((packageId: number) => setModal({ type: "view", packageId }), []);
  const openEdit = useCallback((packageId: number) => setModal({ type: "edit", packageId }), []);
  const openDelete = useCallback((packageId: number) => setModal({ type: "delete", packageId }), []);
  const closeModal = useCallback(() => setModal({ type: "none" }), []);

  const handleToggleStatus = useCallback(
    (id: number, nextStatus: boolean) => {
      setPendingStatusChange({ id, status: nextStatus });
      setStatusModalOpen(true);
    },
    []
  );

  const handleConfirmStatusChange = useCallback(async () => {
    if (!pendingStatusChange) return;
    
    const { id, status } = pendingStatusChange;
    setOptimisticStatus((prev) => ({ ...prev, [id]: status }));
    setTogglingId(id);

    patchData(
      {},
      {
        endpoint: PACKAGES_ENDPOINT.toggleActivation(id),
        onSuccess: () => {
          setTogglingId(null);
          setStatusModalOpen(false);
          setPendingStatusChange(null);
          refetch();
        },
        onError: () => {
          setOptimisticStatus((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
          });
          setTogglingId(null);
          setStatusModalOpen(false);
          setPendingStatusChange(null);
        },
      }
    );
  }, [pendingStatusChange, patchData, refetch]);

  if (error) return <ErrorWithRetry onRetry={refetch} />;

  return (
    <div className="p-4">
      <PackagesHeader t={t} search={search} setSearch={setSearch} onCreate={openCreate} />

      <div className="overflow-x-auto p-1">
        <div className="flex items-center justify-start py-2">
          <div className="text-[16px] sm:text-[20px] text-blueIcons">
            {t("packages.packaging")} ({meta.total})
          </div>
        </div>

        <PackagesFilters
          datePreset={datePreset}
          setDatePreset={setDatePreset}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          discountFilter={discountFilter}
          setDiscountFilter={setDiscountFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onReset={resetFilters}
          sortBy={sort}
          setSortBy={setSort}
        />

        <div className="mt-3">
          <PackagesTable
            t={t}
            data={filteredPackages}
            loading={isFetching}
            meta={{ current_page: meta.current_page, per_page: meta.per_page, total: meta.total }}
            from={from}
            to={to}
            togglingId={togglingId}
            onPageChange={setCurrentPage}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>

      {/* Modals */}
      <CreatePackageModal open={modal.type === "create"} handleClose={closeModal} refetch={refetch} />
      {/* Status Confirmation Modal */}
      <CustomConfirmModal
        open={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setPendingStatusChange(null);
        }}
      type={ "success"}
        icon={<ExclamationCircleFilled />}
        title={
          pendingStatusChange?.status
            ? t("packages.activate_confirm", "Activate package?")
            : t("packages.deactivate_confirm", "Deactivate package?")
        }
        subtitle={
          pendingStatusChange?.status
            ? t("packages.activate_text", "This will make the package active and available to customers.")
            : t("packages.deactivate_text", "This will deactivate the package and hide it from customers.")
        }
        confirmText={
          pendingStatusChange?.status
            ? t("packages.activate", "Activate")
            : t("packages.deactivate", "Deactivate")
        }
        cancelText={t("common.cancel")}
        loading={!!togglingId}
        onConfirm={handleConfirmStatusChange}
        confirmButtonProps={{
          danger: !pendingStatusChange?.status,
        }}
      />
      <ShowPackageModal
        open={modal.type === "view"}
        handleClose={closeModal}
        package_id={modal.type === "view" ? modal.packageId : null}
        handleEditPackage={(pkg: { id?: number } | null) => {
          if (pkg?.id) openEdit(pkg.id);
        }}
      />

      <UpdatePackageModal
        open={modal.type === "edit"}
        handleClose={closeModal}
        package_id={modal.type === "edit" ? modal.packageId : null}
        refetch={refetch}
      />

      {modal.type === "delete" && (
        <DeleteModal
          isOpen
          onClose={closeModal}
          title={t("packages.delete_package")}
          description={t("packages.delete-mes")}
          url={PACKAGES_ENDPOINT.delete}
          id={modal.packageId}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default PackagesManagement;
