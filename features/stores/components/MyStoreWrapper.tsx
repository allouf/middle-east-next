"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, Menu } from "lucide-react";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Button as AntButton, type MenuProps } from "antd";
import useGetData from "@/lib/api/useGetData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import usePermissions, { getPermissionsForRole } from "@/lib/store/usePermissions";
import ErrorWithRetry from "@/components/ui/ErrorWithRetry";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Button from "@/components/ui/Button";
import ProfileUploader from "@/components/uploaders/ProfileUploader";
import usePostData from "@/lib/api/usePostData";
import useFormData from "@/lib/Hooks/useFormData";
import useProfile from "@/features/profile/hooks/useProfile";
import useDeleteData from "@/lib/api/useDeleteData";
const MyStoreWrapper = ({
  tabs,
  activeTab,
  handleTabChange,
  children,
}: {
  tabs: any;
  activeTab: string;
  handleTabChange: (tab: string) => void;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [hideMenuOnScroll, setHideMenuOnScroll] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const params = useParams();
  const { id, locale } = (params || {}) as { id?: string | string[]; locale?: string | string[] };
  const storeId = Array.isArray(id) ? id[0] : id;
  const setPermissions = usePermissions((state) => state.setPermissions);
  const setRole = usePermissions((state) => state.setRole);
  const [isMobile, setIsMobile] = useState(false);
  const { formData, handleChange } = useFormData({ image: "", type: "logo" });

  // Scroll effect for menu icon
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        // Hide menu when scrolling down
        setHideMenuOnScroll(currentScrollY > lastScrollY);
      } else {
        // Always show menu when at top
        setHideMenuOnScroll(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  const {
    data: resData,
    loading,
    error,
    refetch,
  } = useGetData({
    url: STORE_ENDPOINT.getStoreDetails(storeId),
  });
  const { postData, loading: loadingPost, contextHolder } = usePostData(
    `/stores/uploade-image/${storeId}`
  );
  const { deleteData: deleteLogo, loading: loadingDelete, contextHolder: DeleteContext } = useDeleteData(
    STORE_ENDPOINT.deleteStoreLogo
  );

  const {
    data: userStoresRes,
    loading: loadingStores,
    error: storesError,
    refetch: refetchStores,
  } = useGetData({
    url: STORE_ENDPOINT.getUserStores,
  });
  const { data: profileData } = useProfile();
  const { currentLang } = useLangSwitch();
  const imageOptionsRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (
        imageOptionsRef?.current &&
        !imageOptionsRef.current.contains(e.target)
      ) {
        setShowImageOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [imageOptionsRef]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint for better tablet support
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // 🔹 Handle image selection
  const storeData = resData?.data;
  const store = useMemo(
    () => (storeData as any)?.store ?? storeData ?? {},
    [storeData]
  );
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Store role from API:", store?.role, "permissions:", store?.permissions);
    }
    if (loading) return;
    const rolePermissions = store?.role ? getPermissionsForRole(store.role) : [];
    const incomingPermissions = Array.isArray(store?.permissions) ? store.permissions : [];
    const mergedPermissions = Array.from(new Set([...incomingPermissions, ...rolePermissions]));
    setPermissions(mergedPermissions);
    if (store?.role) {
      setRole(store.role);
    }
  }, [store, loading, setPermissions, setRole]);
  const userStores = useMemo(() => {
    if (Array.isArray(userStoresRes?.data)) return userStoresRes.data;
    if (Array.isArray(userStoresRes?.data?.stores)) return userStoresRes.data.stores;
    return [];
  }, [userStoresRes]);
  const activeStoreId = storeId ? String(storeId) : "";
  const profileUser = profileData?.data?.user;
  const profileName = profileUser?.name || t("profile");
  const profileAvatar = profileUser?.photo;
  const storeMenuItems = useMemo<MenuProps["items"]>(
    () =>
      [
        {
          key: "profile",
          label: (
            <div className="flex items-center justify-between gap-2 min-w-[150px]">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-subTitleColor">
                  {profileAvatar ? (
                    <img
                      src={profileAvatar}
                      alt={profileName || t("store.profilePhoto")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profileName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="truncate">{profileName}</span>
              </div>
              <span className="text-[10px] font-semibold text-blueSite bg-white px-2 py-1 rounded-full border border-blueSite/30 uppercase tracking-wide">
                {t("store.profile")}
              </span>
            </div>
          ),
        },
        ...userStores
          .filter((store) => String(store.id) !== activeStoreId)
          .map((store) => ({
            key: String(store.id),
            label: (
              <div className="flex items-center justify-between gap-2  min-w-[200px]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-subTitleColor">
                    {store.logo ? (
                      <img
                        src={store.logo}
                        alt={store.name || t("store.storeLogo")}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (store.name || "").charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="truncate">{store.name}</span>
                </div>
              </div>
            ),
          })),
      ],
    [userStores, activeStoreId, profileAvatar, profileName]
  );
  const localePrefix = currentLang || (Array.isArray(locale) ? locale[0] : locale) || "";
  const base = localePrefix ? `/${localePrefix}` : "";
  const handleStoreSelect: MenuProps["onClick"] = ({ key }) => {
    if (!key) return;

    if (key === "profile") {
      router.push(`${base}/profile`);
      return;
    }
    if (key === activeStoreId) return;
    router.push(`${base}/stores/${key}/management?tab=store_managment`);
  };
  const handleUpdateLogo = async (img: File) => {

    const payload = {
      type: "logo",
      image: img
    }

    console.log("payload", payload)
    await postData(payload, {
      onSuccess: () => {
        setTimeout(() => {
          refetch?.();

        }, 1000);
      },
    });
  };
  const handleRemoveImage = async () => {

    console.log("delete Logo")
    await deleteLogo(`${storeId}?type=logo`, {
      onSuccess: () => {
        refetch?.();
      },
    });
  }
  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen w-full ">
      {/* Mobile Overlay */}
      {showMenu && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
        />
      )}
    {showMenu && isMobile && (
        <style jsx global>{`
          body {
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }
        `}</style>
    )}
      {/* Sidebar Toggle Button - Only on mobile screens */}
      {isMobile && !showMenu && !hideMenuOnScroll && (
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={` my-2 ${currentLang == "ar" ? "right-4" : "left-4"
              } z-[80] bg-white text-subTitleColor p-3 rounded-xl shadow-lg hover:bg-blueSite hover:text-white transition-all duration-300 border border-gray-100 transform ${hideMenuOnScroll ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}`}
          >
            <Menu size={20} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      {contextHolder}
      {DeleteContext}
      <aside
        className={`${isMobile ? "fixed" : "relative"} ${isMobile ? "w-full" : "lg:min-w-[320px] lg:w-1/4 lg:max-w-[420px]"} bg-blueLight pt-10 flex flex-col items-center lg:items-start
        transition-all duration-300 ease-in-out pb-10
           ${isMobile
            ? (showMenu
              ? "translate-x-0 opacity-100"
              : (currentLang == "ar" ? "translate-x-full opacity-0" : "-translate-x-full opacity-0"))
            : "translate-x-0 opacity-100"
          }`}
        style={{
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 70 : 10,
          height: isMobile ? "calc(100vh - 145px)" : "auto",
          top: isMobile ? "145px" : 0,
          ...(currentLang == "ar" ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
          transform: isMobile ? (showMenu ? "translateX(0)" : (currentLang == "ar" ? "translateX(100%)" : "translateX(-100%)")) : "translateX(0)",
          overflowY: isMobile ? "auto" : "visible"
        }}
      >
        <div className="flex flex-row items-center justify-between w-full gap-3 mb-6 px-4 pt-2 relative">
          <div className="flex-shrink-0">
            <ProfileUploader
              onChange={(value) => {


                console.log("value", value)

                handleUpdateLogo(value);
              }}
              logoPreview={store?.logo}
              isEditing={true}
              loading={loadingPost || loadingDelete}

              handleDeleteImg={handleRemoveImage}
            />
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-[100px] h-[16px] bg-gray-300 animate-pulse rounded-lg"></div>
              <div className="w-[200px] h-[16px] bg-gray-300 animate-pulse rounded-lg"></div>
            </div>
          ) : error ? (
            <ErrorWithRetry onRetry={refetch} />
          ) : (
            <div className="text-center lg:text-start flex-grow min-w-0">
              <h2 className="text-xl lg:text-[24px] text-[#555555] font-semibold truncate">
                {store?.name || t("store.storeName")}
              </h2>
              <p className="text-xs lg:text-sm text-[#555555] truncate">
                {Array.isArray(store.phones) && store?.phones.map((ph) => ph)}
              </p>
            </div>
          )}
          {/* show preview */}
          {!loading && !error && store?.id && (
            <div className="relative group hidden lg:flex">
              <button
                type="button"
                onClick={() => router.push(`${base}/stores/${store.id}/info`)}
                className="
                          w-9 h-9 rounded-full 
                          flex items-center justify-center
                          text-subTitleColor hover:text-blueSite hover:border-gray-300
                          transition
                          "
                aria-label={t("common.showPreview")}
              >
                <Info size={20} />
              </button>

              {/* Tooltip */}
              <div
                className="
                          pointer-events-none
                          absolute top-1/2 -translate-y-1/2
                          whitespace-nowrap
                          opacity-0 scale-95
                          group-hover:opacity-100 group-hover:scale-100
                          transition
                          text-[12px] px-2 py-1 rounded-md
                          bg-[#111] text-white shadow-lg
                          z-20
                          -left-2 -translate-x-full
                        "
              >
                {t("common.showPreview") ?? "Show preview"}
              </div>
            </div>
          )}
          {/* Close Button - Only on mobile */}
          {isMobile && (
            <button
              onClick={() => setShowMenu(false)}
              className={`absolute top-6 ${currentLang == "ar" ? "left-4" : "right-4"
                } text-subTitleColor hover:text-blueSite transition-colors bg-white rounded-full p-2 shadow-md`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* Store Switcher */}
        <div className="absolute top-2 end-2">
          <Dropdown
            menu={{
              items: storeMenuItems,
              onClick: handleStoreSelect,
            }}
            trigger={["click"]}
            disabled={loadingStores || userStores.length === 0}
          >
            <button className="bg-white px-3 py-1 rounded-[104px]"><img className="w-6 h-6 object-contain" src="/switch-accounts.svg" alt="" /></button>
          </Dropdown>
          {storesError && (
            <button
              onClick={refetchStores}
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              {t("store.retryLoadingStores")}
            </button>
          )}
        </div>
        <div
          className={`w-full ${isMobile ? "overflow-auto" : "lg:overflow-auto"} px-4`}
          dir={currentLang == "ar" ? "ltr" : "rtl"}
        >
          <nav
            className={`w-full flex flex-col gap-1 transition-all duration-300 ${isMobile && !showMenu ? "opacity-0" : "opacity-100"
              }`}
            dir={currentLang == "ar" ? "rtl" : "ltr"}
          >
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                scale={1.03}
                unstyled
                onClick={() => {
                  handleTabChange(tab.key);
                  if (isMobile) setShowMenu(false);
                }}
                className={`flex flex-row items-center gap-3 w-full px-3 lg:px-4 py-3 lg:py-2 transition-all text-base lg:text-[18px] md:text-[20px] font-medium border-b border-[#555555]/50 last:border-b-0 text-left
                  ${tab.key === "products_managment" &&
                    (activeTab === "add_product" ||
                      activeTab === "update_product")
                    ? "bg-gradient-to-r from-blueSite to-blueSiteHover text-textWhiteColor"
                    : activeTab === tab.key
                      ? "bg-gradient-to-r bg-blueSite text-textWhiteColor rounded-[8px]"
                      : "bg-transparent text-[#373737]"
                  }
                `}
              >
                <div className="flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 bg-[#B0D0C8]/50 rounded-md">
                  <span
                    className={`flex items-center justify-center w-7 h-6 lg:w-8 lg:h-7 ${tab.key === "products_managment" &&
                      (activeTab === "add_product" ||
                        activeTab === "update_product")
                      ? ""
                      : activeTab === tab.key
                        ? ""
                        : "text-blueIcons "
                      }  `}
                  >
                    {tab.icon}
                  </span>
                </div>
                <span className="truncate text-sm lg:text-base">{tab.name}</span>
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-transparent shadow-sm w-full lg:w-auto overflow-x-hidden">
        <div className="relative w-full h-full pb-4">
          {children}
          <div className="absolute bottom-0 right-0 bg-[url('/worldBG.png')] bg-cover bg-no-repeat w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] -z-10 hidden lg:block"></div>
        </div>
      </main>
    </div>
  );
};
export default MyStoreWrapper;
