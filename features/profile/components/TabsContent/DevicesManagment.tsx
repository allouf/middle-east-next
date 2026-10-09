"use client";
import React, { useEffect, useState } from "react";
import useGetData from "@/lib/api/useGetData";
import usePostData from "@/lib/api/usePostData";
import { DEVIECES_ENDPOINT } from "@/shared/constants/urls";
import Button from "@/components/ui/Button";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import Modal from "@/components/ui/Modal";
import { MdOutlineDevices } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { useTranslation } from "@/lib/i18n/useTranslation";
import dayjs from "dayjs";

interface Device {
  id: number | string;
  device_name: string;
  location?: string | null;
  last_seen: string;
  is_current?: boolean;
}

const DevicesSkeleton = () => {
  const pulse = "animate-pulse bg-gray-200 rounded";

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-3 gap-4 p-4 xs:p-5 md:p-6 md:p-7 md:pt-[4vh]">
      <div className="md:col-span-2 space-y-4">
        <div className="space-y-2">
          <div className={`${pulse} h-6 xs:h-7 w-40 xs:w-48 md:w-52`} />
          <div className={`${pulse} h-3 xs:h-4 w-56 xs:w-64 md:w-72`} />
        </div>

        <div className="space-y-3">
          <div className="rounded-xl p-5 bg-[#E6F0ED] space-y-3 border border-[#D9E5DF]">
            <div className={`${pulse} h-5 xs:h-6 w-32 xs:w-36 md:w-40`} />
            <div className="flex items-center gap-4">
              <div className={`${pulse} h-3 xs:h-4 w-20 xs:w-24 md:w-28`} />
              <div className={`${pulse} h-3 xs:h-4 w-16 xs:w-20 md:w-24`} />
            </div>
          </div>

          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl p-5 bg-white shadow-sm border border-[#E8EFEA] space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className={`${pulse} h-4 xs:h-5 w-32 xs:w-36 md:w-44`} />
                <div className={`${pulse} h-4 xs:h-5 w-6 xs:w-7 md:w-8`} />
              </div>
              <div className={`${pulse} h-3 xs:h-4 w-40 xs:w-48 md:w-52`} />
              <div className={`${pulse} h-3 xs:h-4 w-36 xs:w-40 md:w-48`} />
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-1 hidden md:block ps-2 xs:ps-3">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E8EFEA] space-y-3 sticky top-32">
          <div className={`${pulse} h-4 xs:h-5 w-24 xs:w-28 md:w-32`} />
          <div className={`${pulse} h-3 xs:h-4 w-32 xs:w-36 md:w-40`} />
          <div className={`${pulse} h-3 xs:h-4 w-28 xs:w-32 md:w-36`} />
          <div className={`${pulse} h-10 w-full rounded-lg`} />
        </div>
      </div>
    </div>
  );
};

const DevicesManagment = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const refreshToken = localStorage.getItem("refresh_token");
  const { data, loading, error, refetch } = useGetData<{ data: Device[] }>({
    url: DEVIECES_ENDPOINT.devices,
    paginate: true,
    page: 1,
    extraParams: { refresh_token: refreshToken },
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { postData: revokeDevice, loading: revokingDevice } = usePostData();
  const { postData: revokeAllDevices, loading: revokingAllDevices } =
    usePostData();

  useEffect(() => {
    if (data?.data) setDevices(data.data || []);
  }, [data]);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint is 768px
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const handleRevoke = (id: Device["id"]) => {
    revokeDevice(
      {},
      {
        endpoint: DEVIECES_ENDPOINT.revokeDevice(id),
        showMessage: false,
        onSuccess: () => {
          refetch();
          setSelectedDevice(null);
          if (isMobile) {
            setIsModalOpen(false);
          }
        },
      }
    );
  };

  const handleRevokeAll = () => {
    revokeAllDevices(
      {},
      {
        endpoint: DEVIECES_ENDPOINT.revokeAll,
        showMessage: false,
        onSuccess: () => {
          refetch();
          setSelectedDevice(null);
          if (isMobile) {
            setIsModalOpen(false);
          }
        },
      }
    );
  };

  if (loading) return <DevicesSkeleton />;
  if (error) return <ErrorWithRetry onRetry={refetch} />;

  const currentDevice = devices.find((d) => d.is_current);
  const otherDevices = devices.filter((d) => !d.is_current);

  // Device details content component
  const DeviceDetailsContent: React.FC<{ device: Device }> = ({ device }) => (
    <>
      <h3 className="font-semibold mb-3 text-md text-blueSite line-clamp-2 ">
        <span className="pe-2 text-subTitleColor">
          {t("profile-word.devices-managment.logins_on")}
        </span>
        <span>
          {t("profile-word.devices-managment.device-logins-title", {
            device: device.device_name,
          })}
        </span>
      </h3>

      <p className="text-subTitleColor mb-2">
        {device.location ||
          t("profile-word.devices-managment.unknown-location")}
      </p>

      <p className="mb-6">
        <span className="text-[#A1A1A1]">
          {t("profile-word.devices-managment.last-login")} :
        </span>
        <span className="text-subTitleColor block pt-1">
          {device.last_seen && dayjs(device.last_seen).isValid()
            ? dayjs(device.last_seen).format("dddd DD / MM / YYYY hh : mm a")
            : t("profile-word.devices-managment.unknown-date")}
        </span>
      </p>

      <Button
        unstyled
        disabled={revokingDevice}
        onClick={() => handleRevoke(device.id)}
        className={`w-full py-2 text-textWhiteColor font-medium rounded-md transition ${revokingDevice
          ? "bg-red-400 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
          }`}
      >
        {revokingDevice
          ? t("profile-word.devices-managment.logging-out")
          : t("profile-word.devices-managment.logout")}
      </Button>
    </>
  );

  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-3 p-4 xs:p-5 md:p-6 md:p-7 md:pt-[4vh]">
      {/* Left Section */}
      <div className="md:col-span-2 space-y-6 md:overflow-y-auto profileMenuScroll pe-3">
        {/* Header */}
        <div className=" rounded-xl ">
          <h2 className="text-[18px] xs:text-[20px] lg:text-[26px] 2xl:text-[28px] font-semibold text-subTitleColor">
            {t("profile-word.devices-managment.account-log-activity")}
          </h2>

          <p className="text-textColor text-xs xs:text-sm">
            {t("profile-word.devices-managment.devices_login-p")}
          </p>
        </div>

        {/* Current Device */}
        {currentDevice && (
          <div
            onClick={() => handleDeviceSelect(currentDevice)}
            className={`rounded-xl p-4 xs:p-5 border border-[transparent] shadow-sm transition cursor-pointer ${selectedDevice?.id === currentDevice.id ? "!border-[#D9D9D9]" : ""
              } bg-[#E6F0ED] flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-0`}
          >
            <div className="flex flex-col justify-between items-center text-center xs:text-left w-full">
              <div>
                <p className="font-semibold text-blueSite flex flex-col xs:flex-row items-center justify-center xs:justify-start gap-2 text-[14px] xs:text-[16px] 2xl:text-[20px]">
                  <span>
                    <MdOutlineDevices className="text-blueIcons text-[18px] xs:text-[20px] 2xl:text-[24px]" />
                  </span>
                  {currentDevice.device_name}
                </p>
              </div>
              <div className="w-full flex flex-col xs:flex-row items-center gap-3 xs:gap-5 2xl:text-[20px] text-[14px] xs:text-[16px]">
                <p className="text-subTitleColor xs:mt-0 xs:mt-1 text-center xs:text-left">
                  {currentDevice.location ||
                    t("profile-word.devices-managment.unknown-location")}
                </p>
                <span className="text-[#06B187] font-medium text-center xs:text-left">
                  ● {t("profile-word.devices-managment.this-device")}
                </span>
              </div>
            </div>
            <span className="text-textColor text-lg xs:text-xl">
              <HiOutlineLogout
                className={`text-red-500 2xl:text-[24px] text-[18px] xs:text-[20px] ${isRTL ? "scale-x-[-1]" : ""}`}
                style={isRTL ? { transform: "scaleX(-1)" } : undefined}
              />
            </span>
          </div>
        )}

        {/* Other Devices */}
        <div className="mt-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <h3 className="font-medium text-textColor 2xl:text-[20px] text-[14px] xs:text-[16px]">
              {t("profile-word.devices-managment.other-devices-title")} :
            </h3>

            <Button
              unstyled
              scale={1.02}
              onClick={handleRevokeAll}
              disabled={revokingAllDevices}
              className={`px-3 xs:px-4 py-2 2xl:text-[20px] text-[14px] xs:text-[16px] font-medium rounded-md text-red-500 hover:text-red-600 transition-all ${revokingAllDevices
                ? "text-red-400 cursor-not-allowed"
                : "text-red-500 hover:text-red-600"
                } underline underline-offset-2`}
            >
              {revokingAllDevices
                ? t("profile-word.devices-managment.logouting")
                : t("profile-word.devices-managment.logout-all")}
            </Button>
          </div>

          <div className="space-y-3">
            {otherDevices.length === 0 && (
              <p className="text-xs xs:text-sm text-textColor p-3 rounded-lg border shadow-sm">
                {t("profile-word.devices-managment.no-other-devices")}
              </p>
            )}

            {otherDevices.map((device) => (
              <div
                key={device.id}
                onClick={() => handleDeviceSelect(device)}
                className={`rounded-xl p-4 xs:p-5 shadow-sm transition cursor-pointer ${selectedDevice?.id === device.id
                  ? "bg-[#E6F0ED]"
                  : "bg-[#FCFCFC] hover:shadow-md"
                  }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blueSite flex flex-col xs:flex-row items-center justify-center xs:justify-start gap-2 text-[14px] xs:text-[16px] 2xl:text-[20px]">
                      <span>
                        <MdOutlineDevices className="text-blueIcons text-[18px] xs:text-[20px] 2xl:text-[24px]" />
                      </span>{" "}
                      {device.device_name}
                    </p>
                    <p className="text-subTitleColor text-[14px] xs:text-[16px] 2xl:text-[20px] mt-1">
                      {device.location ||
                        t("profile-word.devices-managment.unknown-location")}
                    </p>
                    <p className="text-textColor text-[14px] xs:text-[16px] 2xl:text-[20px] mt-1">
                      {device.last_seen && dayjs(device.last_seen).isValid()
                        ? dayjs(device.last_seen).format(
                          "dddd DD / MM / YYYY hh : mm a"
                        )
                        : t("profile-word.devices-managment.unknown-date")}
                    </p>
                  </div>

                  <span className="text-textColor text-lg xs:text-xl">
                    <HiOutlineLogout
                      className={`text-red-500 2xl:text-[24px] text-[18px] xs:text-[20px] ${isRTL ? "scale-x-[-1]" : ""}`}
                      style={isRTL ? { transform: "scaleX(-1)" } : undefined}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side Details - Desktop Only */}
      <div className="md:col-span-1 ps-2 xs:ps-3 max-md:hidden border-s">
        {selectedDevice ? (
          <div
            className={`bg-[#FCFCFC] rounded-xl px-3 xs:px-4 py-5 xs:py-6 shadow-sm sticky top-32 bottom-5`}
          >
            <style>
              {`main {
                overflow: visible !important;
              }`}
            </style>
            <DeviceDetailsContent device={selectedDevice} />
          </div>
        ) : (
          <div className="text-center text-textColor mt-8 xs:mt-10 text-xs xs:text-sm">
            {t("profile-word.devices-managment.select-device")}
          </div>
        )}
      </div>

      {/* Modal for Mobile - Device Details */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} showLine={false}>
        {selectedDevice && (
          <div className=" rounded-xl  ">
            <DeviceDetailsContent device={selectedDevice} />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DevicesManagment;
