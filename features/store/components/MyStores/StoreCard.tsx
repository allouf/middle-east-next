'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import DotMenu from "@/components/ui/DotMenu";
import { FaBan, FaEye, FaTrashAlt, FaUndo } from "react-icons/fa";
import CustomConfirmModal from "@/components/shered/CustomConfirmModal";
import storeIcon from "@/assets/icons/storeIcon.svg";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import DeleteModal from "@/components/shered/DeleteModel";
import usePostData from "@/lib/api/usePostData";
import StoreInfo from "./StoreInfo";
import {
  MdToggleOff,
  MdToggleOn,
} from "react-icons/md";
import { message } from "antd";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Store as StoreType } from "@/features/store/types/type";
import Image from "next/image";

type StoreStatus = 'active' | 'suspended' | 'banned' | 'warned' | 'inactive';

interface Store extends Omit<StoreType, 'logo'> {
  logo?: string;
}

interface MenuItem {
  icon: React.ReactNode;
  action: () => void;
  danger?: boolean;
}

interface StoreCardProps {
  store: Store;
  refetch?: () => void;
  is_trashed?: boolean;
}

const getStatusBadge = (status: StoreStatus): string => {
  const styles: Record<StoreStatus, string> = {
    active: "bg-[#05C168] text-green-700",
    suspended: "bg-[#878787] text-yellow-700",
    banned: "bg-[#BF2033] text-subTitleColor",
    warned: "bg-[#F5DF4C] text-red-700",
    inactive: "bg-gray-100 text-subTitleColor",
  };
  return styles[status] || "bg-gray-100 text-subTitleColor";
};

const getStatusLabel = (store: Store): StoreStatus => {
  if (store.is_active) return "active";
  if (store.is_suspended) return "suspended";
  if (store.is_banned) return "banned";
  if (store.is_warned) return "warned";
  return "inactive";
};

const StoreCard = ({ store, refetch, is_trashed = false }: StoreCardProps) => {
  const status = getStatusLabel(store);
  const router = useRouter();
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalForceDeleteOpen, setIsModalForceDeleteOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { postData: updateStatus, loading: updating } = usePostData(
    STORE_ENDPOINT.deactiveStore(store.id)
  );
  const { postData: restoreStore } = usePostData(
    STORE_ENDPOINT.restoreStore(store.id)
  );
  const { t } = useTranslation()
  const handleRestore = async () => {
    await restoreStore(
      {},
      {
        onSuccess: () => {
          refetch?.();
        },
      }
    );
  };
  // ✅ Confirm and change store status (activate/deactivate)
  const handleStatusChange = () => {
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    await updateStatus(
      {},
      {
        onSuccess: () => {
          messageApi.success(t("store.status.success"));
          refetch?.();
        },
        onError: () => {
          messageApi.error(t("store.status.error"));
        },
      }
    );
  };

  const menuItems: MenuItem[] = is_trashed
    ? [
      {
        // label: t("store.menu.restoreStore", "Restore Store"),
        icon: <FaUndo className="text-green-600" />,
        action: handleRestore, // ✅ your restore function
      },
      {
        // label: t("store.menu.deleteStore", "Delete Permanently"),
        icon: <FaTrashAlt className="text-red-600" />,
        action: () => setIsModalForceDeleteOpen(true),
        danger: true,
      },
    ]
    : [
      {
        // label: t("store.menu.viewStore", "View Store"),
        icon: <FaEye className="text-blueSite" />,
        // action: () => router.push(`/stores/${store.id}/info`),
        action: () => router.push(`/stores/${store.id}/management?tab=store_managment`),
      },
      {
        // label: store.is_active
        //   ? t("store.menu.deactivateStore", "Deactivate Store")
        //   : t("store.menu.activateStore", "Activate Store"),
        icon: store.is_active ? (
          <MdToggleOn className="text-green-500 text-xl" />
        ) : (
          <MdToggleOff className="text-gray-400 text-xl" />
        ),
        action: handleStatusChange,
      },
      {
        // label: t("store.menu.moveToTrash", "Move to Trash"),
        icon: <FaBan className="text-[#D02F44]" />,
        action: () => setIsModalDeleteOpen(true),
      },
      {
        // label: t("store.menu.deleteStore", "Delete Store"),
        icon: <FaTrashAlt className="text-red-600" />,
        action: () => setIsModalForceDeleteOpen(true),
        danger: true,
      },
    ];
  return (
    <div className="bg-grayLight2 relative min-h-56 rounded-lg p-3 hover:shadow-lg transition border border-grayLight2">
      {/* Header */}
      {contextHolder}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <img
            src={store.logo ?? "https://placehold.co/40x40?text=S"}
            alt={store.name}
            className="w-14 h-14 rounded-full object-cover"
          />
          <h3 className="font-medium text-subTitleColor text-base md:text-[18px]">
            {store.name}
          </h3>
          <div
            className={`text-xs font-semibold w-[12px] h-[12px] rounded-full ${getStatusBadge(
              status
            )}`}
          >
            {/* {status.toUpperCase()} */}
          </div>{" "}
        </div>
        <div className="flex items-center gap-2">
          {store.permissions?.includes("store.manage") && (
            <DotMenu
              direction="vertical"
              iconBg="bg-blueIcons"
              menuBg="bg-grayLight"
              shadow="shadow-xl"
              items={menuItems}
              className="!w-auto !m-0 !bg-transparent border-none !shadow-none"
              bgBtnColor="bg-blueLight"
              bgBtnHover="hover:bg-blueLightHover"
            />
          )}
        </div>
      </div>
      <div className="pl-2">
        {/* Description */}
        <p className="text-textColor font-normal text-[12px] mb-4 line-clamp-2 ">
          {store.description}
        </p>
        {/* Store Info */}
        <StoreInfo store={store} />
      </div>
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isModalDeleteOpen}
        onClose={() => setIsModalDeleteOpen(false)}
        title={t("store.trash.title")}
        description={t("store.trash.description")}
        url={STORE_ENDPOINT.deleteStore}
        id={store.id}
        refetch={refetch}
      />

      <CustomConfirmModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        type="danger"
        icon={<Image src={storeIcon} alt="" width={32} height={32} />}
        title={
          store.is_active
            ? t("store.status.deactivateTitle", "Deactivate store?")
            : t("store.status.activateTitle", "Activate store?")
        }
        subtitle={
          store.is_active
            ? t("store.status.deactivateText", "This will hide the store from customers.")
            : t("store.status.activateText", "This will make the store visible to customers.")
        }
        confirmText={
          store.is_active
            ? t("store.status.deactivateConfirm", "Deactivate")
            : t("store.status.activateConfirm", "Activate")
        }
        cancelText={t("common.cancel")}
        loading={updating}
        onConfirm={handleConfirmStatusChange}
        confirmButtonProps={{
          danger: store.is_active,
        }}
        styles={{
          okButton: store.is_active
            ? { boxShadow: "0 2px 6px rgba(245, 34, 45, 0.25)" }
            : { boxShadow: "0 2px 6px rgba(24, 144, 255, 0.18)" },
        }}
      />

      <DeleteModal
        isOpen={isModalForceDeleteOpen}
        onClose={() => setIsModalForceDeleteOpen(false)}
        title={t("store.delete.title")}
        description={t("store.delete.description")}
        url={STORE_ENDPOINT.forceDeleteStore}
        id={store.id}
        refetch={refetch}
        confirm={true}
      />
    </div>
  );
};
export default StoreCard;
