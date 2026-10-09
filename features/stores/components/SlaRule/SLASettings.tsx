'use client';

import React, { useState } from "react";
import useGetData from "@/lib/api/useGetData";
import { SLA_RULES } from "@/shared/constants/urls";
import { Eye, Trash2 } from "lucide-react";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import AddSlaModal from "./AddSlaModal";
import DeleteModal from "@/components/shered/DeleteModel";
import Button from "@/components/ui/Button";
import ViewSla from "./ViewSla";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import SLASettingsSkeleton from "./SLASettingsSkeleton";
const SLASettings = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { data: resData, loading, error, refetch } = useGetData({
    url: SLA_RULES.viewStoreSla(id as string),
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);

  const openDeleteModal = (rule: any) => {
    setSelectedRule(rule);
    setIsDeleteOpen(true);
  };

  const openViewModal = (rule: any) => {
    setSelectedRule(rule);
    setIsViewOpen(true);
  };
  if (loading) return <SLASettingsSkeleton />;
  if (error) return <ErrorWithRetry onRetry={refetch} />;

  return (
    <div className="w-full p-4 sm:p-6 bg-white">
      {/* Title removed - moved to StoreSettings */}
      <div className="flex items-center justify-end mb-4 sm:mb-6">
        <AddSlaModal store_id={id as string} refetch={refetch} />
      </div>
      {/* Table Container */}
      <div>
        {/* Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#347d6a] text-textWhiteColor py-3 px-4 sm:px-6 font-medium text-base sm:text-lg rounded-t-xl">
          <div className="text-center mb-1 sm:mb-0">{t("store_sla.Problem type")}</div>
          <div className="text-center">{t("store_sla.Response time")}</div>
        </div>

        {/* Rows */}
        <div className="bg-[#FCFCFC] border border-gray-100 rounded-b-xl p-3 sm:p-4 space-y-3 sm:space-y-4">
          {resData?.data?.map((row: any, i: number) => (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-start sm:items-center border-b border-[#727272]/20 pb-3 sm:pb-4"
            >
              {/* Problem Type */}
              <div className="text-subTitleColor font-medium bg-[#f9fafb] rounded-lg px-4 sm:px-6 py-3 text-center text-sm sm:text-base">
                {row.issue_type?.name}
              </div>

              {/* Response Time */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className={`w-full text-subTitleColor font-medium flex justify-center items-center rounded-lg px-4 sm:px-6 py-3 text-center bg-[#F5F5F5] border-2 border-blueSite text-black relative text-sm sm:text-base`}>
                  {row.sla_response_hours} {t("time.hours")}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 justify-center sm:justify-start">
                  <Button
                    unstyled
                    type="button"
                    className="p-2 text-gray-400 hover:text-blueSite"
                    onClick={() => openViewModal(row)}
                  >
                    <Eye size={18} />
                  </Button>
                  <Button
                    unstyled
                    type="button"
                    className="p-2 text-gray-400 hover:text-red-500"
                    onClick={() => openDeleteModal(row)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* View Modal */}
      {isViewOpen && selectedRule && (
        <ViewSla
          id={selectedRule.id as string}
          modalOpen={isViewOpen}
          setModalOpen={setIsViewOpen}
        />
      )}
      {/* Delete Modal */}
      {isDeleteOpen && selectedRule && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title={t("store_sla.Delete Rule?")}
          description={t(
            "store_sla.Are you sure you want to delete this SLA rule?"
          )}
          url={SLA_RULES.deleteRule}
          id={selectedRule.id}
          refetch={refetch}
        />
      )}
    </div>
  );
};
export default SLASettings;
