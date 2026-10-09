'use client';

import React, { useEffect, useMemo, useState } from "react";
import { FaTrashAlt, FaPen, FaEye } from "react-icons/fa";
import useGetData from "@/lib/api/useGetData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import LoaderPage from "@/components/shared/LoaderPage";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import AddMember from "./AddMember";
import DeleteModal from "@/components/shered/DeleteModel";
import EditMemberModal from "./EditMemberModal";
import StatCard from "./StatCard";
import { useParams } from "next/navigation";
import CouponDeleteModal from "../Coupons/CouponDeleteModal";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { message } from "antd";
import ShowMember from "./ShowMember";
import { Member, MembersResponse } from '@/features/stores/types/storeMembers'
import usePermissions from "@/lib/store/usePermissions";
const StoreMembers = () => {
  const { id } = useParams() as { id: string };
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMemId, setIsSelectedMemId] = useState<string | number | null>(null)
  const [isShowMember, setIsShowMember] = useState(false);
  const {
    data: resData,
    loading,
    error,
    refetch,
  } = useGetData({
    url: STORE_ENDPOINT.getMembers(id),
  });
  const { t } = useTranslation()
  const [messageApi, contextHolder] = message.useMessage()
  const can = usePermissions((state) => state.can);
  const canInvite = can("members.invite");
  const canManage = can("members.manage");
  const canRemove = can("members.remove");
  const members = useMemo(() => resData?.data || [], [resData]);
  const stats = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((m: any) => m.status === "active").length,
      invited: members.filter((m: any) => m.status === "invited").length,
      revoked: members.filter((m: any) => m.status === "revoked").length,
    };
  }, [members]);


  useEffect(() => {
    console.log("store Members ", resData)
  }, [resData])


  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    const lower = searchTerm.toLowerCase();
    return members.filter(
      (m: any) =>
        m.user?.name?.toLowerCase().includes(lower) ||
        m.email?.toLowerCase().includes(lower) ||
        m.role?.toLowerCase().includes(lower)
    );
  }, [members, searchTerm]);


  const handleDeleteMember = (id: number) => {
    if (!canRemove) return;
    setIsSelectedMemId(id);
    setIsDeleteOpen(true);
  };
  const handleEditMember = (member: any) => {
    if (!canManage) return;
    setSelectedMember(member);
    setIsEditOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {contextHolder}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div className="flex flex-row items-center gap-4 md:w-1/3 min-w-[350px]">
          <h2 className="text-xl font-semibold text-subTitleColor">
            {t("members.title")}
          </h2>
          <div className="relative flex-1 w-full  bg-grayLight rounded-full border focus:ring-2 focus:ring-blueSite outline-none">
            {/* <Search className="absolute left-3 top-2.5 text-textColor" size={18} /> */}
            <input
              type="text"
              placeholder={t("members.searchPlaceholder")}
              className="w-full  px-3 py-2 bg-transparent outline-none text-textColor text-sm"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {id && canInvite && <AddMember store_id={id} refetch={refetch} />}
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title={t("members.stats.total")}
          value={stats.total}
          trend="down"
          change="-12.6%"
          iconColor="#6852D6"

        />
        <StatCard
          title={t("members.stats.active")}
          value={stats.active}
          trend="up"
          change="+28.4%"
          iconColor="#56E8A7"
        />
        <StatCard
          title={t("members.stats.invited")}
          value={stats.invited}
          trend="up"
          change="+15.8%"
          iconColor="#00664F"
        />
        <StatCard
          title={t("members.stats.revoked")}
          value={stats.revoked}
          trend="down"
          change="-9.1%"
          iconColor="#BF2033"
        />
      </div>
      {/* Members Table */}


      {loading ? <LoaderPage type="table" count={5} /> :
        error ? <ErrorWithRetry onRetry={refetch} /> :
          <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-subTitleColor">
                <thead className="bg-gray-50 border-b text-subTitleColor font-semibold">
                  <tr className="[&_th]:px-4 [&_th]:py-3 [&_th]:text-start">
                    <th>{t("table.id")}</th>
                    <th>{t("table.image")}</th>
                    <th>{t("table.fullName")}</th>
                    <th>{t("table.email")}</th>
                    <th>{t("table.role")}</th>
                    <th>{t("table.status")}</th>

                    {/* end = right in EN / left in AR */}
                    <th className="text-end">{t("table.actions")}</th>
                  </tr>
                </thead>

                <tbody className="[&_td]:px-4 [&_td]:py-2 [&_td]:text-start">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member: any) => (
                      <tr
                        key={member.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td >{member.id}</td>
                        <td >
                          <img
                            src={member.user?.photo || "https://placehold.co/40x40?text=M"}
                            alt={member.user?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </td>
                        <td>{member.user?.name}</td>
                        <td >{member.user?.email}</td>
                        <td className=" capitalize">
                          {t(`roles.${member.role}`)}
                        </td>

                        {/* Status مترجم + لون */}
                        <td>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium whitespace-nowrap ${member.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {t(`members.stats.${member.status}`)}
                          </span>
                        </td>

                        <td className="px-4 py-2 text-end space-x-3 gap-2">
                          {canManage && (
                            <button
                              onClick={() => {
                                setSelectedMember(member);
                                setIsEditOpen(true);
                              }}
                              className="text-blueSite hover:text-blueSiteHover m-2"
                            >
                              <FaPen />
                            </button>
                          )}
                          {canRemove && (
                            <button
                              onClick={() => {
                                setIsSelectedMemId(member.id);
                                setIsDeleteOpen(true);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrashAlt />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setIsSelectedMemId(member.id);
                              setIsShowMember(true);
                            }}
                            className="text-blueSite hover:text-blueSiteHover">
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-textColor">
                        {t("members.empty")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-3 text-xs text-textColor flex justify-between">
              <span>
                {t("members.showing")} {filteredMembers.length} {t("common.of")}{" "}
                {members.length}
              </span>
            </div>
          </div>}
      {/* Edit Member Modal */}
      {isEditOpen && selectedMember && canManage && (
        <EditMemberModal
          member={selectedMember}
          onClose={() => setIsEditOpen(false)}
          refetch={refetch}
          open={isEditOpen}
          messageApi={messageApi}
          handleDeleteMember={handleDeleteMember}
        />
      )}
      {/* Delete Modal */}
      {isDeleteOpen && selectedMemId && canRemove && (
        <DeleteModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false)

          }}
          title={t("members.deleteTitle")}
          description={t("members.deleteDescription")}
          url={STORE_ENDPOINT.removeMember}
          id={selectedMemId}
          refetch={() => {
            messageApi.success(t("members.deleteSuccess"))
            setTimeout(() => {
              refetch()
            }, 1000);
          }}

        />

      )}

      {
        isShowMember && selectedMemId &&
        <ShowMember open={isShowMember}
          handleClose={() => {
            setIsShowMember(false)
            setIsSelectedMemId(null)
          }}
          memberId={selectedMemId}
          handleEditMember={handleEditMember}
          handleDeleteMember={handleDeleteMember}
          refetch={refetch}
          messageApi={messageApi}
          store_id={Number(id)}
        />
      }
    </div>
  );
};
export default StoreMembers;
