"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useGetData from '@/lib/api/useGetData';
import useDeleteData from '@/lib/api/useDeleteData';
import { SERVICE_OFFERS } from '@/shared/constants/urls';
import ServiceOffersFilters from './ServiceOffersFilters';
import ServiceOffersTable, { ServiceOffer } from './ServiceOffersTable';
import ServiceOffersStats, { ServiceStatsData } from './ServiceOffersStats';
import AddForm from './AddForm';
import { App } from 'antd';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useLocaleDirection } from '@/lib/i18n/useLocaleDirection';
import { ArrowLeft } from 'lucide-react';
import { ServiceDetails } from './ServiceDetails';
import CustomConfirmModal from '@/components/shered/CustomConfirmModal';

type ApiResponse = {
  data?: {
    offers?: ServiceOffer[];
    meta?: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
  };
};

export default function MyServices() {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const { modal } = App.useApp();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deliveryModel, setDeliveryModel] = useState("all");
  const [serviceType, setServiceType] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("draft");

  // URL-based state
  const action = searchParams.get('action');
  const serviceId = searchParams.get('id');
  
  // Delete Confirmation Modal (keep as local state since it's a transient modal)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<{ id: number; data: any } | null>(null);

  // Fetch service data when editing
  const { data: serviceData, refetch: refetchService } = useGetData<{ data: any }>({
    url: action === 'edit' && serviceId ? SERVICE_OFFERS.show(serviceId) : undefined,
  });

  // Sync editing service when URL changes
  useEffect(() => {
    if (action === 'edit' && serviceId && serviceData?.data) {
      setEditingService({ id: parseInt(serviceId), data: serviceData.data });
    } else if (action !== 'edit') {
      setEditingService(null);
    }
  }, [action, serviceId, serviceData]);

  // Fetch Stats
  const { data: statsData } = useGetData<{ data: ServiceStatsData }>({
    url: SERVICE_OFFERS.getStats,
  });

  const { data: categoriesData } = useGetData<{ data: { id: number; name: string }[] }>({
    url: SERVICE_OFFERS.getCategories,
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  const extraParams = {
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    delivery_model: deliveryModel === "all" ? undefined : deliveryModel,
    service_type: serviceType === "all" ? undefined : serviceType,
    category_id: categoryId === "all" ? undefined : categoryId,
    service_date_from: dateFrom || undefined,
    service_date_to: dateTo || undefined,
    sort: sortBy === "all" ? undefined : sortBy,
  };

  const { data: resData, loading, error, refetch } = useGetData<ApiResponse>({
    url: SERVICE_OFFERS.getAll,
    paginate: true,
    page,
    per_page: pageSize,
    extraParams,
  });

  const { deleteData, loading: deleting } = useDeleteData(SERVICE_OFFERS.getAll);

  const handlePageChange = useCallback((nextPage: number, newPageSize: number) => {
    setPage(nextPage);
    setPageSize(newPageSize);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStatus("all");
    setDeliveryModel("all");
    setServiceType("all");
    setCategoryId("all");
    setDateFrom("");
    setDateTo("");
    setSortBy("draft");
    setPage(1);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (serviceToDelete) {
      try {
        await deleteData(serviceToDelete, { endpoint: SERVICE_OFFERS.getAll + '/delete' });
        refetch();
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
      } catch (err) {
        // error handled in hook
      }
    }
  }, [serviceToDelete, deleteData, refetch]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setServiceToDelete(null);
  }, []);

  const handleView = useCallback((offer: ServiceOffer) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('action', 'details');
    params.set('id', offer.id.toString());
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleEdit = useCallback((offer: ServiceOffer) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('action', 'edit');
    params.set('id', offer.id.toString());
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleAddService = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('action', 'add');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const handleBackFromAddForm = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('action');
    params.delete('id');
    router.push(`?${params.toString()}`);
  }, [router, searchParams]);

  const offers = Array.isArray(resData?.data?.offers) ? resData.data.offers : [];
  const meta = resData?.data?.meta;

  return (
    <div className="p-6 md:p-7 md:pt-[4vh]  min-h-screen">
      {action === 'add' || action === 'edit' ? (
        <AddForm 
          onBack={handleBackFromAddForm} 
          serviceId={editingService?.id}
          initialData={editingService?.data}
          onSuccess={refetch}
        />
      ) : action === 'details' && serviceId ? (
        <ServiceDetails
          offerId={parseInt(serviceId)}
          onBack={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('action');
            params.delete('id');
            router.push(`?${params.toString()}`);
          }}
        />
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            {/* Optional Go Back */}
            {/* <button className="flex items-center text-[#00664F] hover:underline font-medium text-sm">
              <ArrowLeft className={`h-4 w-4 mr-1 ${isRTL ? 'rotate-180' : ''}`} />
              {t("serviceMarket.myServices.goBack")}
            </button> */}
          </div>

          <ServiceOffersStats stats={statsData?.data} />

          <ServiceOffersFilters
            search={search} setSearch={setSearch}
            status={status} setStatus={setStatus}
            deliveryModel={deliveryModel} setDeliveryModel={setDeliveryModel}
            serviceType={serviceType} setServiceType={setServiceType}
            categoryId={categoryId} setCategoryId={setCategoryId}
            dateFrom={dateFrom} setDateFrom={setDateFrom}
            dateTo={dateTo} setDateTo={setDateTo}
            sortBy={sortBy} setSortBy={setSortBy}
            categories={categories}
            onReset={handleResetFilters}
            onAddService={handleAddService}
          />

          <ServiceOffersTable
            data={offers}
            loading={loading || deleting}
            error={Boolean(error)}
            meta={meta}
            onPageChange={handlePageChange}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
      {/* Delete Confirmation Modal */}
      <CustomConfirmModal
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={t("common.confirmDeleteTitle", { defaultValue: "Are you sure you want to delete this?" })}
        subtitle={t("common.confirmDeleteContent", { defaultValue: "This action cannot be undone." })}
        type="danger"
        confirmText={t("common.delete", { defaultValue: "Delete" })}
        cancelText={t("common.cancel", { defaultValue: "Cancel" })}
      />
    </div>
  )
}
