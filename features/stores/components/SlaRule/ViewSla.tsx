'use client';

import React from "react";
import useGetData from "@/lib/api/useGetData";
import { SLA_RULES } from "@/shared/constants/urls";
import LoaderPage from "../../../../components/shared/LoaderPage";
import ErrorWithRetry from "../../../../components/ui/ErrorWithRetry";
import Modal from "../../../../components/ui/Modal";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ViewSlaProps {
  id: string | number;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const ViewSla = ({ id, modalOpen, setModalOpen }: ViewSlaProps) => {
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useGetData({
    url: SLA_RULES.viewRuleDetails(id),
  });

  return (
    <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
      {loading ? (
        <LoaderPage count={1} />
      ) : error ? (
        <ErrorWithRetry onRetry={refetch} />
      ) : !data?.data ? (
        <div className="text-textColor p-6 text-center">
          {t("store_sla.No SLA data found")}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6 bg-white space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-subTitleColor">
              {t("store_sla.SLA Details")}
            </h2>
          </div>

          <div className="grid gap-6">
            {/* Issue Type Info */}
            <div className="bg-[#f9fafb] p-5 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-subTitleColor text-lg">
                  {data.data.issue_type?.name}
                </h3>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${data.data.issue_type?.priority === "high"
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : data.data.issue_type?.priority === "medium"
                        ? "bg-yellow-50 text-yellow-600 border border-yellow-100"
                        : "bg-[#eefcf6] text-[#347d6a] border border-[#347d6a]/20"
                    }`}
                >
                  {data.data.issue_type?.priority}
                </span>
              </div>

              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {data.data.issue_type?.description || t("store_sla.No description provided.")}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-3">
                <span>{t("store_sla.Created")}:</span>
                <span className="font-medium text-gray-600">
                  {new Date(data.data.issue_type?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* SLA Response Hours */}
            <div className="bg-[#eefcf6] border border-[#347d6a] p-5 rounded-xl flex items-center justify-between">
              <span className="font-medium text-[#347d6a]">
                {t("store_sla.SLA Response Hours")}
              </span>
              <span className="text-xl font-bold text-[#347d6a]">
                {data.data.sla_response_hours}{t("time.hours_short")}
              </span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ViewSla;
