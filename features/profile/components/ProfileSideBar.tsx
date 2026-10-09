"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Menu } from "lucide-react";
import { FaSignOutAlt, FaTrash } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Button from "@/components/ui/Button";
import LogoutModal from "@/components/ui/LogoutModal";
import usePostData from "@/lib/api/usePostData";
import { useAuth } from "@/lib/context/AuthContext";
import { useLangSwitch } from "@/lib/Hooks/useLangSwitch";
import { backUrl } from "@/shared/constants/data";
import { DeleteAccountUrl, deleteProfileImage, updateProfileImage } from "@/shared/constants/urls";
import { ProfileTab, ProfileTabKey } from "../types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useParams, useRouter, useSearchParams, usePathname } from "next/navigation";
import useProfile from "../hooks/useProfile";
import useGetData from "@/lib/api/useGetData";
import { STORE_ENDPOINT } from "@/shared/constants/urls";
import { App, Dropdown, MenuProps, Tooltip } from "antd";
import ProfileUploader from "@/components/uploaders/ProfileUploader";
import useDeleteData from "@/lib/api/useDeleteData";
import { useFooterVisibility } from "@/lib/store/useFooterVisibility";

const PROFILE_TAB_KEYS: ProfileTabKey[] = [
  "basic",
  "referrals",
  "devices_managment",
  "balance",
  "wishlist",
  "orders",
  "addresses",
  "settings",
  "company_stores",
  "used_market",
  "compare",
  "trashed",
  "mytickets",
  "jobs_services",
  "service_market"
];
interface ProfileSideBarProps {
  tabs: ProfileTab[];
  stores?: Array<{ id: number | string; name?: string | null }>;
  pageType?: 'profile' | 'dashboard';
}
const ProfileSideBar = ({ tabs, stores, pageType = 'profile' }: ProfileSideBarProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageOptionsRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { currentLang } = useLangSwitch();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabKey | string>(pageType === 'profile' ? "basic" : "company_stores");
  const [selectedStore, setSelectedStore] = useState<string>("profile");
  const params = useParams();
  const { data: userData, loading: isLoading, refetch } = useProfile();
  const { id, locale } = (params || {}) as {
    id?: string | string[];
    locale?: string | string[];
  };
  const { role, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const {
    postData: updateProfilePhoto,
    loading: loadingPost,
    error,
  } = usePostData(updateProfileImage);
  const { deleteData: deletePrfilePhoto, loading: loadingDelete } = useDeleteData(
    deleteProfileImage
  );
  const { t } = useTranslation();
  const { hideFooter, showFooter } = useFooterVisibility();

  const { message: messageApi } = App.useApp();

  const {
    data: userStoresRes,
    loading: loadingStores,
    error: storesError,
    refetch: refetchStores,
  } = useGetData({
    url: STORE_ENDPOINT.getUserStores,
  });

  // <-- manage modal state
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        imageOptionsRef?.current &&
        !imageOptionsRef.current.contains(e.target as Node)
      ) {
        setShowImageOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    // Initialize activeTab from URL parameters
    const tabFromUrl = searchParams.get("tab");
    const subTabFromUrl = searchParams.get("subTab");
    
    if (tabFromUrl) {
      if (subTabFromUrl) {
        // Handle sub-tab scenario
        setActiveTab(`${tabFromUrl}/${subTabFromUrl}`);
        setExpandedTab(tabFromUrl);
      } else if (tabFromUrl.includes('/')) {
        // Handle legacy URL format (backward compatibility)
        const mainTab = tabFromUrl.split('/')[0];
        if (PROFILE_TAB_KEYS.includes(mainTab as ProfileTabKey)) {
          setActiveTab(tabFromUrl as string);
          setExpandedTab(mainTab);
        }
      } else if (PROFILE_TAB_KEYS.includes(tabFromUrl as ProfileTabKey)) {
        setActiveTab(tabFromUrl as ProfileTabKey);
      }
    } else {
      // Default case when no tab is in URL
      setActiveTab(pageType === 'profile' ? "basic" : "company_stores");
      setExpandedTab(null);
    }
  }, [searchParams, pageType]);

  // Update URL function
  const updateUrl = (tab: ProfileTabKey | string, subTab?: string) => {
    const nextParams = new URLSearchParams();
    nextParams.set("tab", tab);
    if (subTab) {
      nextParams.set("subTab", subTab);
    }
    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleStoreChange = (value: string) => {
    setSelectedStore(value);
    const localePrefix = currentLang ? `/${currentLang}` : "";
    if (value === "profile") {
      router.push(`${localePrefix}/profile`);
      return;
    }
    router.push(
      `${localePrefix}/stores/${value}/management?tab=store_managment`
    );
    if (window.innerWidth < 1100) setShowMenu(false);
  };

  const handleLogout = () => {
    logout();
    setLogoutModalOpen(false);
  };
  const userStores = useMemo(() => {
    if (Array.isArray(userStoresRes?.data)) return userStoresRes.data;
    if (Array.isArray(userStoresRes?.data?.stores))
      return userStoresRes.data.stores;
    return [];
  }, [userStoresRes]);




  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1100); // custom breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Footer visibility control for mobile sidebar
  useEffect(() => {
    if (isMobile && showMenu) {
      hideFooter();
    } else {
      showFooter();
    }

    // Cleanup: show footer when component unmounts or sidebar closes
    return () => {
      if (isMobile) {
        showFooter();
      }
    };
  }, [isMobile, showMenu, hideFooter, showFooter]);

  const handleFileChange = async (
    file: File
  ): Promise<void> => {
    if (!file) return;

    const payload = {
      photo: file,
    }
    try {

      updateProfilePhoto(payload, {
        showMessage: false,
        onSuccess: () => {
          messageApi.success(t("profileSideBar.profileImageUpdated"))
          // refetch();
        },
        onError: (err) => {
          console.log("updatte img Err", err)
        }
      });
      setShowImageOptions(false);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  const handleRemoveImage = async () => {
    await deletePrfilePhoto(``, {
      onSuccess: () => {
        refetch?.();
      },
    });
  }

  const storeMenuItems = useMemo<MenuProps["items"]>(
    () =>
      userStores.map((store: any) => ({
        key: String(store.id),
        label: (
          <div className="flex items-center justify-between gap-2 min-w-[150px]">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-subTitleColor">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name || t("profileSideBar.storeLogo")}
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
    [userStores]
  );
  const handleStoreSelect: MenuProps["onClick"] = ({ key }) => {
    if (!key || key === "0") return;
    const localePrefix =
      currentLang || (Array.isArray(locale) ? locale[0] : locale) || "";
    const base = localePrefix ? `/${localePrefix}` : "";
    router.push(`${base}/stores/${key}/management?tab=store_managment`);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {showMenu && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={() => setShowMenu(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}

      {/* Prevent body scroll when mobile menu is open */}
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

      {/* Sidebar Toggle Button - Only on screens < 1100px */}
      {isMobile && !showMenu && (
        <div className="relative">
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className={`absolute   ${currentLang == "ar" ? "right-4 " : "left-4"
              } z-[80]  text-subTitleColor p-3 rounded-lg  hover:bg-blueSite/90 transition-all duration-300`}
          >
            <Menu size={24} />
          </button>
        </div>
      )}

      <aside
        className={`${isMobile ? "fixed" : "relative"} px-3 w-full md:min-w-[320px] md:w-1/4 md:max-w-[420px] bg-blueLight pt-10 flex flex-col items-center md:items-start
        transition-all duration-300 mt-[5rem] lg:mt-0 ease-in-out pb-10
          ${isMobile
            ? (showMenu
              ? "translate-x-0 opacity-100"
              : (currentLang == "ar" ? "translate-x-full opacity-0" : "-translate-x-full opacity-0"))
            : "translate-x-0 opacity-100"
          }`}
        style={{
          position: isMobile ? "fixed" : "relative",
          zIndex: isMobile ? 70 : 10,
          height: isMobile ? "calc(100vh - 140px)" : "auto",
          top: isMobile ? "60px" : 0,
          ...(currentLang == "ar" ? { right: 0, left: 'auto' } : { left: 0, right: 'auto' }),
          transform: isMobile ? (showMenu ? "translateX(0)" : (currentLang == "ar" ? "translateX(100%)" : "translateX(-100%)")) : "translateX(0)",
          overflowY: isMobile ? "auto" : "visible"
        }}
      >
        {/* Profile Info */}
        <div className="flex flex-row items-center w-full gap-3 mb-6 relative px-4 ">
          <div className="relative group min-w-20 sm:min-w-[80px] me-3">

            <ProfileUploader
              onChange={(value) => {
                handleFileChange(value)
                // handleSubmit();
              }}
              logoPreview={userData?.data?.user?.photo}
              isEditing={true}
              loading={loadingPost || loadingDelete}
              handleDeleteImg={handleRemoveImage}
              size="w-20 h-20 sm:w-[100px] sm:h-[100px] lg:w-[100px] lg:h-[100px]"
            />
            {/* Upload / Options button */}

          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="md:w-[60%] w-[70px] h-[16px] bg-gray-300 animate-pulse rounded-lg"></div>
              <div className="md:w-full w-[100px] h-[16px] bg-gray-300 animate-pulse rounded-lg"></div>
            </div>
          ) : (
            <div className="text-start min-w-0">
              <Tooltip title={userData?.data?.user?.name}>
                <h2
                  className={`text-[20px] sm:text-[22px] font-semibold text-subTitleColor truncate cursor-default`}
                >
                  {userData?.data?.user?.name}
                </h2>
              </Tooltip>
              <Tooltip title={userData?.data?.user?.email}>
                <p 
                  className="text-xs sm:text-xs text-subTitleColor truncate cursor-default"
                >
                  {userData?.data?.user?.email}
                </p>
              </Tooltip>
            </div>
          )}

          {/* Close Button - Only on screens < 1100px */}
          {isMobile && (
            <button
              onClick={() => setShowMenu(false)}
              className={`absolute top-8 ${currentLang == "ar" ? "left-3" : "right-3"
                } text-subTitleColor hover:text-blueSite transition-colors`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {stores?.length ? (
          <div className="w-full px-4 mb-4">
            <label className="text-xs text-subTitleColor mb-2 block">
              {t("store.stores")}
            </label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-subTitleColor focus:outline-none focus:ring-2 focus:ring-blueSite"
              value={selectedStore}
              onChange={(e) => handleStoreChange(e.target.value)}
            >
              <option value="profile">
                {t("profileSideBar.personalInformation")}
              </option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name || t("store.stores")}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {/* Navigation */}
        <div className="absolute top-4 end-2">
          <Dropdown
            menu={{
              items: storeMenuItems,
              onClick: handleStoreSelect,
            }}
            trigger={["click"]}
            disabled={loadingStores || userStores.length === 0}
          >
            <button className="bg-white px-3 py-1 rounded-[104px]">
              <img
                className="w-6 h-6 object-contain"
                src="/switch-accounts.svg"
                alt=""
              />
            </button>
          </Dropdown>
          {storesError && (
            <button
              onClick={refetchStores}
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              {t("profileSideBar.retryLoadingStores")}
            </button>
          )}
        </div>
        <div
          className={`w-full ${isMobile ? "profileMenuScroll" : ""}`}
          dir={currentLang == "ar" ? "ltr" : "rtl"}
        >
          <nav
            className={`w-full flex flex-col gap-1 transition-all duration-300 ${isMobile && !showMenu ? "opacity-0" : "opacity-100"
              }`}
            dir={currentLang == "ar" ? "rtl" : "ltr"}
          >
            {tabs.map((tab) => {
              // If tab has dropdown, render as expandable with sub-tabs
              if (tab.dropdown && tab.dropdown.length > 0) {
                const isExpanded = expandedTab === tab.key;
                
                return (
                  <div key={tab.id}>
                    <Button
                      scale={1.03}
                      onClick={() => {
                        setExpandedTab(isExpanded ? null : tab.key);
                        if (window.innerWidth < 768) setShowMenu(false);
                      }}
                      unstyled
                      className={`flex flex-row items-center gap-3 w-full px-4 py-2 transition-all text-[18px] md:text-[20px] font-medium border-b border-[#555555]/50 text-start
                      ${activeTab === tab.key || activeTab.startsWith(tab.key + '/')
                          ? "bg-gradient-to-r bg-blueSite text-textWhiteColor rounded-[8px]"
                          : "bg-transparent text-[#373737]"
                        }
                      ${tab.key === "basic" ? "mb-4" : ""}
                    `}
                    >
                      <div className="flex items-center justify-center w-9 h-9 bg-[#B0D0C8]/50 rounded-md ">
                        <span
                          className={`${activeTab === tab.key || activeTab.startsWith(tab.key + '/') ? "" : "text-blueIcons"
                            } flex items-center justify-center w-8 h-7  `}
                        >
                          {tab.icon}
                        </span>
                      </div>
                      <span className="truncate text-[16px] flex-1">{t(tab.name)}</span>
                      <div className="flex items-center">
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} ml-2`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </Button>
                    
                    {/* Sub-tabs */}
                    {isExpanded && (
                      <div className="mx-6 border-[#555555]/30">
                        {tab.dropdown.map((subTab) => (
                          <Button
                            key={subTab.id}
                            scale={1.03}
                            onClick={() => {
                              updateUrl(tab.key, subTab.key);
                              if (window.innerWidth < 768) setShowMenu(false);
                            }}
                            unstyled
                            className={`flex flex-row items-center gap-3 w-full  mt-1 px-4 py-2 transition-all text-[16px] md:text-[18px] font-medium border-b border-[#555555]/50 last:border-b-0 text-left 
                            ${activeTab === `${tab.key}/${subTab.key}` || (activeTab === tab.key && searchParams.get('subTab') === subTab.key)
                                ? "bg-gradient-to-r bg-blueSite text-textWhiteColor rounded-[8px]"
                                : "bg-transparent text-[#373737]"
                              }
                          `}
                          >
                            <div className="flex items-center justify-center w-7 h-7 bg-[#B0D0C8]/30 rounded-md ">
                              <span
                                className={`${activeTab === `${tab.key}/${subTab.key}` || (activeTab === tab.key && searchParams.get('subTab') === subTab.key) ? "" : "text-blueIcons"
                                  } flex items-center justify-center w-6 h-6 text-sm`}
                              >
                                {subTab.icon}
                              </span>
                            </div>
                            <span className="truncate text-[14px]">{t(subTab.name)}</span>
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular tab rendering
              return (
                <Button
                  key={tab.id}
                  scale={1.03}
                  onClick={() => {
                    updateUrl(tab.key);
                    if (window.innerWidth < 768) setShowMenu(false);
                  }}
                  unstyled
                  className={`flex flex-row items-center gap-3 w-full px-4 py-2 transition-all text-[18px] md:text-[20px] font-medium border-b border-[#555555]/50 last:border-b-0 text-left 
                  ${activeTab === tab.key
                      ? "bg-gradient-to-r bg-blueSite text-textWhiteColor rounded-[8px]"
                      : "bg-transparent text-[#373737]"
                    }
                  ${tab.key === "basic" ? "mb-4" : ""}
                `}
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-[#B0D0C8]/50 rounded-md ">
                    <span
                      className={`${activeTab === tab.key ? "" : "text-blueIcons"
                        } flex items-center justify-center w-8 h-7  `}
                    >
                      {tab.icon}
                    </span>
                  </div>
                  <span className="truncate text-[16px] ">{t(tab.name)}</span>
                </Button>
              );
            })}

            {pageType === 'profile' && (
              <>
                <Button
                  unstyled
                  scale={1.03}
                  onClick={() => {
                    setLogoutModalOpen(true);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-2 transition-all text-[18px] md:text-[20px] font-medium border-b border-[#555555]/50  last:border-b-0 text-left text-subTitleColor w-full`}
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-[#B0D0C8]/50 rounded-md ">
                    <span
                      className={`flex items-center justify-center w-8 h-7 text-blueIcons `}
                    >
                      <FaSignOutAlt size={18} />
                    </span>
                  </div>
                  <span className="truncate text-[16px] ">{t("logOut")}</span>
                </Button>
                <Button
                  unstyled
                  scale={1.03}
                  target="_blank"
                  to={`${backUrl}${DeleteAccountUrl}`}
                  className={`flex items-center gap-3 w-full px-4 py-2 transition-all text-[18px] md:text-[20px] font-medium last:border-b-0 text-left rounded-[8px]  text-subTitleColor`}
                >
                  <div className="flex items-center justify-center w-9 h-9 bg-[#B0D0C8]/50 rounded-md ">
                    <span
                      className={`flex items-center justify-center w-8 h-7 text-blueIcons`}
                    >
                      <FaTrash size={18} />
                    </span>
                  </div>
                  <span className="truncate text-[16px] ">
                    {" "}
                    {t("deleteAccount")}
                  </span>
                </Button>
              </>
            )}

          </nav>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title={t("logOut")}
        description={t("logout.message")}
        icon={FiLogOut}
        style={{
          modal: "",
          topBar: "bg-blueSite",
          modalStyle: {
            borderRadius: "20px",
          },
          topBarStyle: {
            backgroundColor: "bg-blueIcons",
          },
        }}
      />
    </>
  );
};

export default ProfileSideBar;
