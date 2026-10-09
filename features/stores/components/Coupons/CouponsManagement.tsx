'use client';

import React, { useEffect, useState } from "react";
import useGetData from "@/lib/api/useGetData";
import { COUPONS_ENDPOINT } from "@/shared/constants/urls";

import { Plus, Search, Ticket } from "lucide-react";
import LoaderPage from "@/components/shared/LoaderPage";
import DeleteModal from "@/components/shered/DeleteModel";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import Button from "@/components/ui/Button";

import Pagination from "@/components/ui/Pagination";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import CreateCouponModal from "./CreateCouponModal";
import { Coupon, CouponsMeta, CouponsResponse } from "@/features/stores/types/coupons";
import CouponRow from "./CouponRow";
import { FaUser } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import ShowCouponModal from "./ShowCouponModal";
import { message } from "antd";
import { formatDate } from "@/lib/utils/format";

const CouponsManagement = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openShowModal, setOpenShowModal] = useState(false);
  const [messageApi, contextHolder] = message.useMessage()

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState<string>("all");
  const [discountValueFilter, setDiscountValueFilter] = useState<string>("all");

  const {
    data: resData,
    loading,
    error,
    refetch,
  } = useGetData<CouponsResponse>({
    url: COUPONS_ENDPOINT.getByStore(id),
    enabled: !!id,
    paginate: true,
    page: currentPage,
    extraParams: {
      search: search,
      status: statusFilter !== "all" ? statusFilter : undefined,
      discount_type: discountTypeFilter !== "all" ? discountTypeFilter : undefined,
      discount_value_range: discountValueFilter !== "all" ? discountValueFilter : undefined
    }
  });

  const coupons = resData?.data?.coupons || [];

  // Client-side filtering (in case API doesn't support all filters)
  const filteredCoupons = coupons.filter(coupon => {
    // Status filter
    if (statusFilter === "active" && coupon.is_expired) return false;
    if (statusFilter === "expired" && !coupon.is_expired) return false;

    // Discount type filter
    if (discountTypeFilter !== "all" && coupon.discount_type !== discountTypeFilter) return false;

    // Discount value filter
    if (discountValueFilter !== "all") {
      const value = coupon.discount_value;
      switch (discountValueFilter) {
        case "0-10":
          return value >= 0 && value <= 10;
        case "10-25":
          return value > 10 && value <= 25;
        case "25-50":
          return value > 25 && value <= 50;
        case "50+":
          return value > 50;
        default:
          return true;
      }
    }

    return true;
  });
  const meta: CouponsMeta = resData?.data?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    has_more: false,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (resData) {
      console.log("Coupons Data:", resData);
    }
  }, [resData]);

  const stats = [
    {
      label: t("coupons.statistics.all"),
      value: filteredCoupons.length,
      color: "#6852D6",
      icon: FaUser,
    },
    { label: t("coupons.statistics.active"), value: filteredCoupons.filter(c => !c.is_expired).length, color: "#56E8A7", icon: FaUser },
    { label: t("coupons.statistics.new"), value: filteredCoupons.filter(c => c.is_expired).length, color: "#00664F", icon: FaUser },
    { label: t("coupons.statistics.deleted"), value: filteredCoupons.filter(c => c.is_expired).length, color: "#BF2033", icon: FaUser },
  ];

  const handleDeleteCoupon = (id: string | null) => {
    setSelectedCouponId(id);
    setIsDeleteOpen(true);
  };

  const handleOpenShowModal = (id: string | null) => {
    setSelectedCouponId(id);
    setOpenShowModal(true);
  };



  return (
    <div className="p-4">
      {/* Header */}
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex flex-col md:flex-row w-full md:w-2/4  item-start md:items-center gap-4">
          <span className="text-[18px] lg:text-[20px] font-semibold text-blueSite">
            {t("coupons.title")}
          </span>
          <div className="w-full md:w-[300px] bg-bgGray rounded-full">
            {/* <Search className="absolute left-3 top-2.5 text-textColor" size={18} /> */}
            <input
              type="text"
              placeholder={t("coupons.search_placeholder")}
              className="w-full px-3 py-2 text-sm text-textColor outline-none bg-transparent"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row  w-full gap-3 items-center">
          <Button
            unstyled
            className="bg-blueBtn w-full md:max-w-[200px] justify-center text-textWhiteColor px-5 py-2 rounded-lg flex items-center gap-2 transition"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} /> {t("coupons.addCoupon")}
          </Button>
        </div>
      </div>



      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-[7px] border bg-[#F5FAFF] shadow-sm flex items-center gap-3"
              style={{ backgroundColor: `${stat.color}10` }}
            >
              {/* Icon circle */}
              <div
                className="p-3 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Icon size={22} color={stat.color} />
              </div>

              {/* Text and value */}
              <div className="flex flex-col">
                <p className="font-medium text-subTitleColor">{stat.label}</p>
                <div className="flex flex-row items-center gap-2 mt-1">
                  <span
                    className="text-lg font-semibold"
                    style={{ color: `${stat.color}` }}
                  >
                    {stat.value}
                  </span>

                  {/* Trend indicator */}
                  <span
                    className="text-xs font-semibold text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{
                      backgroundColor: `${stat.color}20`,
                      color: `${stat.color}`,
                    }}
                  >
                    28.4%{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 4a.75.75 0 0 1 .75.75v8.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06L9.25 12.94V4.75A.75.75 0 0 1 10 4Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 mb-6 w-full">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-stretch sm:items-end">
          {/* Status Filter */}
          <div className="flex flex-col w-full sm:w-[140px] min-w-[140px]">
            <label className="text-sm font-medium text-subTitleColor mb-1">
              {t("filters.status")}
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blueSite w-full"
            >
              <option value="all">{t("filters.all")}</option>
              <option value="active">{t("coupons.statistics.active")}</option>
              <option value="expired">{t("coupons.statistics.new")}</option>
            </select>
          </div>

          {/* Discount Type Filter */}
          <div className="flex flex-col w-full sm:w-[140px] min-w-[140px]">
            <label className="text-sm font-medium text-subTitleColor mb-1">
              {t("filters.discount_type")}
            </label>
            <select
              value={discountTypeFilter}
              onChange={(e) => setDiscountTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blueSite w-full"
            >
              <option value="all">{t("filters.all")}</option>
              <option value="percentage">{t("coupons.create.discountTypes.percentage")}</option>
              <option value="fixed">{t("coupons.create.discountTypes.fixed")}</option>
            </select>
          </div>

          {/* Discount Value Filter */}
          <div className="flex flex-col w-full sm:w-[140px] min-w-[140px]">
            <label className="text-sm font-medium text-subTitleColor mb-1">
              {t("filters.discount_value")}
            </label>
            <select
              value={discountValueFilter}
              onChange={(e) => setDiscountValueFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blueSite w-full"
            >
              <option value="all">{t("filters.all")}</option>
              <option value="0-10">0-10%</option>
              <option value="10-25">10-25%</option>
              <option value="25-50">25-50%</option>
              <option value="50+">50%+</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end w-full sm:w-auto">
            <button
              onClick={() => {
                setStatusFilter("all");
                setDiscountTypeFilter("all");
                setDiscountValueFilter("all");
              }}
              className="w-full sm:w-auto px-4 py-2 text-sm text-blueSite border border-blueSite rounded-lg hover:bg-blueSite hover:text-white transition-colors"
            >
              {t("filters.reset_all")}
            </button>
          </div>

        </div>
      </div>

      {/* Coupons Table */}
      {loading ? (
        <LoaderPage type={"table"} count={5} />
      ) : error ? (
        <ErrorWithRetry onRetry={refetch} />
      ) : filteredCoupons.length > 0 ? (
        <div className="rounded-xl shadow-md border border-black p-1">
          <div className="flex flex-col sm:flex-row sm:justify-between px-4 py-2 border-b border-blueSite gap-2">
            <div className="text-[18px] sm:text-[20px] text-blueIcons">{t("coupons.all_coupons")}</div>
            <span className="text-[14px] sm:text-[16px] text-blueIcons">
              {filteredCoupons.length} {filteredCoupons.length === 1 ? t("coupons.list.unit") : t("coupons.list.units")} {filteredCoupons.length !== meta.total ? t("coupons.list.filtered_from", { total: meta.total }) : ""}
            </span>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <div dir={isArabic ? "rtl" : "ltr"} className="w-full">
              <table className="w-full text-sm text-subTitleColor bg-white">
                <thead className="text-blueIcons border-b">
                  <tr className="[&_th]:p-3 [&_th]:font-semibold [&_th]:text-start">
                    <th>{t("table.headers.id")}</th>
                    <th>{t("table.headers.code")}</th>
                    <th>{t("table.headers.discount_type")}</th>
                    <th>{t("table.headers.discount_value")}</th>
                    <th>{t("table.headers.min_cart_amount")}</th>
                    <th>{t("table.headers.expires_at")}</th>
                    <th>{t("table.headers.usage")}</th>
                    <th>{t("table.headers.status")}</th>
                    <th className="!text-center">{t("table.headers.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCoupons.map((coupon) => (
                    <CouponRow
                      key={coupon.id}
                      coupon={coupon}
                      handleDeleteCoupon={handleDeleteCoupon}
                      handleOpenShowModal={handleOpenShowModal}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="sm:hidden p-4 space-y-4">
            {filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                {/* Header with ID and Code */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-gray-500">ID: {coupon.id}</span>
                    <h3 className="font-semibold text-lg text-blueSite">{coupon.code}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenShowModal(coupon.id.toString())}
                      className="p-2 text-blueSite hover:text-blueSiteHover hover:bg-[#E6F0ED] rounded-lg transition-colors"
                      title={t("coupons.viewCoupon")}
                    >
                      <FaEye className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id.toString())}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title={t("coupons.deleteCoupon")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Discount Info */}
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.discount_type === "percentage"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {t(`coupons.create.discountTypes.${coupon.discount_type}`)}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    {coupon.discount_value}
                    {coupon.discount_type === 'percentage' ? '%' : ''}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    Min: {coupon.min_cart_amount} USD
                  </span>
                </div>

                {/* Status and Usage */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      coupon.is_expired
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {coupon.is_expired ? t("status.expired") : t("status.active")}
                  </span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Usage Limit</div>
                    <div className="text-sm font-medium">{coupon.max_usage_per_user}</div>
                  </div>
                </div>

                {/* Expiry Date */}
                <div className="text-xs text-gray-500 border-t pt-2">
                  Expires: {formatDate(coupon.expires_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-textColor py-10">
          {t("coupons.noCoupons")}
        </p>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={meta.last_page} onPageChange={handlePageChange} />

      {/* Delete Modal */}
      {isDeleteOpen && selectedCouponId && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedCouponId(null);
          }}
          title={t("coupons.deleteModal.title")}
          description={t("coupons.deleteModal.description")}
          url={COUPONS_ENDPOINT.delete}
          id={selectedCouponId}
          refetch={() => {
            messageApi.success(t("coupons.deleteModal.success"))
            setTimeout(() => {
              refetch()
            }, 1000);
          }}
        />
      )}

      {/* Create Coupon Modal */}
      <CreateCouponModal
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        refetch={refetch}
        messageApi={messageApi}
      />

      <ShowCouponModal open={openShowModal} handleClose={() => setOpenShowModal(false)} handleDeleteCoupon={handleDeleteCoupon} couponId={selectedCouponId} />
    </div>
  );
};

export default CouponsManagement;
