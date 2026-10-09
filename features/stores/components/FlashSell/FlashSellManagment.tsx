'use client';

import React, { useEffect, useState } from "react";
import useGetData from "@/lib/api/useGetData";
import { categories, FLASHSELL_ENDPOINT } from "@/shared/constants/urls";
import UpdateFlashSellModal from "./UpdateFlashSellModal";
import SelectField from "@/components/ui/SelectFiled";
import CreateFlashSellModal from "./CreateFlashSellModal";
import { BsStack } from "react-icons/bs";
import { Plus, Search } from "lucide-react";
import FlashSellRow from "./FlashSellRow";
import ShowFlashSellModal from "./ShowFlashSellModal";
import LoaderPage from "@/components/shared/LoaderPage";
import DeleteModal from "@/components/shered/DeleteModel";
import { FlashSellListItem } from "@/features/stores/types/flashSell";

import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import Button from "@/components/ui/Button";

import Pagination from "@/components/ui/Pagination";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";

const FlashSellManagment = () => {
  const { id } = useParams<{ id: string }>() || { id: "" };
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [openEditFlashSellModal, setOpenEditFlashSellModal] = useState(false);
  const [selectedFlashSellId, setSelectedFlashSellId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [discountType, setDiscountType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("latest");

  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useTranslation()

  const {
    data: flashSell,
    loading,
    error,
    refetch,
  } = useGetData({
    url: FLASHSELL_ENDPOINT.getByStore(id),
    enabled: !!id,
    paginate: true,
    page: currentPage,
    extraParams: {
      search: search
    }
  });
  const meta = flashSell?.data?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  // Filter and sort flash sales based on criteria
  const filteredFlashSales = flashSell?.data?.flash_sales?.filter((flashSale: FlashSellListItem) => {
    let matchesStartDate = true;
    let matchesEndDate = true;
    let matchesDiscountType = true;

    // Filter by start date
    if (startDate) {
      const flashSellStartDate = new Date(flashSale.start_date);
      const filterStartDate = new Date(startDate);
      // Normalize dates to compare only date parts (ignore time)
      flashSellStartDate.setHours(0, 0, 0, 0);
      filterStartDate.setHours(0, 0, 0, 0);
      matchesStartDate = flashSellStartDate >= filterStartDate;
    }

    // Filter by end date
    if (endDate) {
      const flashSellEndDate = new Date(flashSale.end_date);
      const filterEndDate = new Date(endDate);
      // Normalize dates to compare only date parts (ignore time)
      flashSellEndDate.setHours(0, 0, 0, 0);
      filterEndDate.setHours(0, 0, 0, 0);
      matchesEndDate = flashSellEndDate <= filterEndDate;
    }

    // Filter by discount type
    if (discountType) {
      matchesDiscountType = flashSale.discount_type === discountType;
    }

    return matchesStartDate && matchesEndDate && matchesDiscountType;
  })
  // .sort((a: any, b: any) => {
  //   // Sort based on the selected sort option
  //   if (sort === "latest") {
  //     // Sort by ID descending (assuming higher ID means newer)
  //     return b.id - a.id;
  //   } else if (sort === "oldest") {
  //     // Sort by ID ascending (assuming lower ID means older)
  //     return a.id - b.id;
  //   }
  //   return 0;
  // }) || [];

  const handlePageChange = (newPage: number) => {

    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (flashSell) {
      console.log("Flash Sell Data:", flashSell);
    }
  }, [flashSell]);

  // const handleDeleteFlashSell = async (id) => {

  //   try {
  //     const res = await api
  //       .delete(FLASHSELL_ENDPOINT.delete(id))
  //       .then((res) => {
  //         if (res.status == 200) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Success",
  //             text: res.message,
  //             confirmButtonColor: "#3085d6",
  //           });
  //         }
  //         console.log(res);
  //       });
  //     // deleteFlashSell({},{endpoint:FLASHSELL_ENDPOINT.delete(id)})
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleDeleteFlashSell = (id: string | number) => {
    setSelectedFlashSellId(id.toString());
    setIsDeleteOpen(true);
  }

  const stats = [
    {
      label: t("flashSell.statistics.all"),
      value: flashSell?.data?.meta?.total || 0,
      color: "#6852D6",
      icon: BsStack,
    },
    { label: t("flashSell.statistics.active"), value: 12, color: "#56E8A7", icon: BsStack },
    { label: t("flashSell.statistics.draft"), value: 8, color: "#32A5EF", icon: BsStack },
    { label: t("flashSell.statistics.expired"), value: 2, color: "#D02F44", icon: BsStack },
  ];

  const handleEditFlashSell = (id: number | string) => {
    setSelectedFlashSellId(id.toString());
    setOpenEditFlashSellModal(true);
  };
  const handleOpenViewModal = (id: number) => {
    setSelectedFlashSellId(id.toString());
    setOpenViewModal(true);
  };



  return (
    <div className="p-4">
      {/* Header */}
      {contextHolder}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex flex-row items-center gap-4 md:w-1/3 min-w-[350px]">
          <span className="text-blueSite font-semibold text-[20px]">{t("flashSell.title")}</span>
          <div className="relative flex-1 w-full  bg-grayLight rounded-full border focus:ring-2 focus:ring-blueSite outline-none">
            {/* <Search className="absolute left-3 top-2.5 text-textColor" size={18} /> */}
            <input
              type="text"
              placeholder={t("flashSell.search_placeholder")}
              className="w-full  px-3 py-2 bg-transparent outline-none text-textColor text-sm"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row gap-3 items-center">
          <Button
            unstyled
            className="bg-blueBtn text-textWhiteColor px-5 py-2 rounded-lg flex items-center gap-2  transition"
            onClick={() => setOpenOfferModal(true)}
          >
            <Plus size={18} /> {t("flashSell.add_btn")}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat: { label: string; value: string; color: string; icon: React.ElementType }, i: number) => {
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
              <div className="flex flex-col flex-shrink-0">
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
                    className="text-xs font-semibold  text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"
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
      <div className="flex flex-row items-center gap-4 justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 items-end">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">{t("flashSell.fields.startDate")}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-[#D9D9D933] text-[12px] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blueSite"
            />
          </div>


          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">{t("flashSell.fields.endDate")}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-[#D9D9D933] text-[12px] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blueSite"
            />
          </div>
          <SelectField
            id="filter_discountType"
            label={t("flashSell.fields.discountType")}
            className="bg-[#D9D9D933] text-[12px]"
            hideLable={true}
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            selectorOptions={[
              { id: "percentage", name: t("coupons.create.discountTypes.percentage") },
              { id: "fixed", name: t("coupons.create.discountTypes.fixed") },
            ]}
            placeholder={t("flashSell.fields.discountType")}
          />


          {/* <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setDiscountType("");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            Clear Filters
          </button> */}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[16px] text-subTitleColor whitespace-nowrap">
            {t("common.sortBy")}:
          </label>
          <select
            className="border rounded-md px-8 py-[6px] text-sm text-textColor focus:outline-none"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">{t("common.latest")}</option>
            <option value="oldest">{t("common.oldest")}</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {/* Flash Sell Table */}
      {loading ? (
        <LoaderPage type="table" count={5} />
      ) : error ? <ErrorWithRetry onRetry={refetch} />
        : filteredFlashSales.length > 0 ? (
          <div className="overflow-x-auto rounded-xl shadow-md border border-black p-1">
            <div className={`flex flex-row justify-between px-4 py-2 border-b border-blueSite ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="text-[20px] text-blueIcons">{t("flashSell.all_flashsell")}</div>
              <span className="text-[16px] text-blueIcons">
                {(meta.current_page - 1) * meta.per_page + 1} –{" "}
                {Math.min(meta.current_page * meta.per_page, meta.total)} of{" "}
                {meta.total}
              </span>
            </div>

            <table className={`w-full text-sm text-subTitleColor bg-white ${isRTL ? "text-right" : "text-left"}`}>
              <thead className="text-blueIcons border-b">
                <tr>
                  <th className={`font-semibold p-3 ${isRTL ? "text-right" : "text-left"}`}>{t("table.headers.id")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-right" : "text-left"}`}>{t("table.headers.name")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-right" : "text-left"}`}>{t("table.headers.discount_type")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-center" : "text-center"}`}>{t("table.headers.discount_value")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-center" : "text-center"}`}>{t("table.headers.number_products")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-center" : "text-center"}`}>{t("table.headers.start_date")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-center" : "text-center"}`}>{t("table.headers.end_date")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-center" : "text-center"}`}>{t("table.headers.status")}</th>
                  <th className={`font-semibold p-3 ${isRTL ? "text-left" : "text-right"}`}>{t("table.headers.actions")}</th>
                </tr>
              </thead>

              <tbody className="p-3">
                {filteredFlashSales.map((sale: FlashSellListItem) => (
                  <FlashSellRow
                    key={sale.id}
                    sale={sale}
                    handleEditFlashSell={handleEditFlashSell}
                    handleDeleteFlashSell={handleDeleteFlashSell}
                    handleViewFlashSell={handleOpenViewModal}
                    isRTL={isRTL}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-textColor py-10">
            {" "}
            {startDate || endDate || discountType
              ? t("flashSell.review.noFlashSalesFound")
              : t("flashSell.review.noFlashSalesFound")
            }
          </p>
        )}

      {/* pagination */}
      <Pagination currentPage={currentPage} totalPages={meta.last_page} onPageChange={handlePageChange} />

      <CreateFlashSellModal
        open={openOfferModal}
        handleClose={() => setOpenOfferModal(false)}
        refetch={refetch}
        messageApi={messageApi}
      />

      <UpdateFlashSellModal
        open={openEditFlashSellModal}
        handleClose={() => {
          setOpenEditFlashSellModal(false)
          setSelectedFlashSellId(null)
        }}
        flashSell_id={selectedFlashSellId || undefined}
        refetch={refetch}
        messageApi={messageApi}
      />

      <ShowFlashSellModal
        open={openViewModal}
        handleClose={() => {
          setOpenViewModal(false)
          setSelectedFlashSellId(null)
        }}
        handleDeleteFlashSell={handleDeleteFlashSell}
        handleEditFlashSell={handleEditFlashSell}
        flashSell_id={selectedFlashSellId || undefined}
        refetch={refetch}
      />

      {isDeleteOpen && selectedFlashSellId && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false)
            setSelectedFlashSellId(null)
          }}
          title={t("flashSell.delete.title")}
          description={t("flashSell.delete.message")}
          url={FLASHSELL_ENDPOINT.delete}
          id={selectedFlashSellId}
          refetch={() => {
            messageApi.success(t("flashSell.delete.success"))
            setTimeout(() => {
              refetch()
            }, 1000);
          }}

        />
      )}
    </div>
  );
};

export default FlashSellManagment;
