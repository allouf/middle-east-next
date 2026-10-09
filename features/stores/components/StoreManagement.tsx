"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Box, Shield, Package, Star } from "lucide-react";
import { MdOutlineHeadphones, MdOutlineStorefront } from "react-icons/md";
import { FiBox } from "react-icons/fi";
import { BsPeople } from "react-icons/bs";
import { RiCoupon2Line } from "react-icons/ri";
import { LuBadgePercent } from "react-icons/lu";
import { TbPackages } from "react-icons/tb";
import { useTranslation } from "@/lib/i18n/useTranslation";
import usePermissions from "@/lib/store/usePermissions";
import MyStoreWrapper from "./MyStoreWrapper";
import StoreTabShell from "./StoreTabShell";
import StoreManagementSkeleton from "./StoreManagementSkeleton";

const Loading = () => <StoreManagementSkeleton />;

const ProductsManagment   = dynamic(() => import("./ProductsManagment"),               { ssr: false, loading: Loading });
const AddProduct          = dynamic(() => import("./Product/AddProduct"),               { ssr: false, loading: Loading });
const UpdateProduct       = dynamic(() => import("./Product/UpdateProduct"),            { ssr: false, loading: Loading });
const StoreMembers        = dynamic(() => import("./StoreMembers/StoreMembers"),        { ssr: false, loading: Loading });
const StorePolicies       = dynamic(() => import("./StorePolicies/StorePolicies"),      { ssr: false, loading: Loading });
const Inventory           = dynamic(() => import("./Inventory/Inventory"),              { ssr: false, loading: Loading });
const FlashSellManagment  = dynamic(() => import("./FlashSell/FlashSellManagment"),    { ssr: false, loading: Loading });
const CouponsManagement   = dynamic(() => import("./Coupons/CouponsManagement"),       { ssr: false, loading: Loading });
const PackagesManagement  = dynamic(() => import("./Packages/PackagesManagement"),     { ssr: false, loading: Loading });
const SupportTckets       = dynamic(() => import("./SupportTckets/SupportTckets"),     { ssr: false, loading: Loading });
const SLASettings         = dynamic(() => import("./SlaRule/SLASettings"),             { ssr: false, loading: Loading });
const OrdersOverview      = dynamic(() => import("./Orders/OrdersOverview"),           { ssr: false, loading: Loading });
const ReviewsOverview     = dynamic(() => import("./Reviews/ReviewsOverview"),         { ssr: false, loading: Loading });
const StoreSettings       = dynamic(() => import("./StoreSettings"),                   { ssr: false, loading: Loading });
const UpdateStore         = dynamic(() => import("@/features/store").then(m => m.UpdateStore), { ssr: false, loading: Loading });


interface StoreManagementProps {
  storeId?: string;
}

interface StoreManagementTab {
  id: number;
  name: string;
  key: string;
  icon: React.ReactNode;
  requiredPermissions?: string[];
}

const TAB_PERMISSION_MAP: Record<string, string[]> = {
  store_managment: ["store.manage"],
  products_managment: ["products.read", "products.create", "products.update", "products.pricing"],
  add_product: ["products.create"],
  update_product: ["products.update"],
  flash_sell: ["products.pricing"],
  balance: ["analytics.view"],
  sales: ["analytics.view"],
  orders: ["orders.manage", "orders.read"],
  reviews: ["reviews.manage", "reviews.read"],
  store_members: ["members.invite", "members.manage", "members.remove"],
  store_policies: ["policies.manage"],
  support_tickets: ["support.access"],
  sla_rule: ["store.manage"],
  inventory: ["inventory.manage"],
  coupons: ["coupons.manage"],
  packages: ["products.create", "products.update"],
  settings: ["store.settings"],
};

const StoreManagement = ({ storeId: _storeId }: StoreManagementProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tabFromURL = searchParams.get("tab");
  const requestedTab = tabFromURL || "store_managment";
  const canAny = usePermissions((state) => state.canAny);
  const permissionRole = usePermissions((state) => state.role);
  const permissionsInitialized = usePermissions((state) => state.initialized);
  const canAccessTab = useCallback(
    (tabKey: string) => {
      const required = TAB_PERMISSION_MAP[tabKey];
      if (!required?.length) return true;
      if (permissionRole === "STORE_OWNER") return true;
      return canAny(required);
    },
    [canAny, permissionRole]
  );

  const allTabs = useMemo<StoreManagementTab[]>(
    () => [
      {
        id: 1,
        name: t("store_management.tab"),
        key: "store_managment",
        icon: <MdOutlineStorefront size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.store_managment,
      },
      {
        id: 2,
        name: t("store_management.products_management"),
        key: "products_managment",
        icon: <FiBox size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.products_managment,
      },
      {
        id: 9,
        name: t("store_management.store_members"),
        key: "store_members",
        icon: <BsPeople size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.store_members,
      },
      {
        id: 14,
        name: t("store_management.coupons"),
        key: "coupons",
        icon: <RiCoupon2Line size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.coupons,
      },
      {
        id: 11,
        name: t("store_management.support_tickets"),
        key: "support_tickets",
        icon: <MdOutlineHeadphones size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.support_tickets,
      },
      {
        id: 3,
        name: t("store_management.flash_sell_management"),
        key: "flash_sell",
        icon: <LuBadgePercent size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.flash_sell,
      },
      // {
      //   id: 4,
      //   name: t("store_management.balance"),
      //   key: "balance",
      //   icon: <LiaCoinsSolid size={20} />,
      //   requiredPermissions: TAB_PERMISSION_MAP.balance,
      // },
      // {
      //   id: 5,
      //   name: t("store_management.sales"),
      //   key: "sales",
      //   icon: <Heart size={20} />,
      // },
      {
        id: 6,
        name: t("store_management.orders"),
        key: "orders",
        icon: <Box size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.orders,
      },
      {
        id: 7,
        name: t("store_management.reviews"),
        key: "reviews",
        icon: <Star size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.reviews,
      },
      {
        id: 8,
        name: t("store_management.settings"),
        key: "settings",
        icon: <Shield size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.settings,
      },
      // {
      //   id: 10,
      //   name: t("store_management.store_policies"),
      //   key: "store_policies",
      //   icon: <FileText size={20} />,
      // },
      // {
      //   id: 12,
      //   name: t("store_management.sla"),
      //   key: "sla_rule",
      //   icon: <Ticket size={20} />,
      // },
      {
        id: 13,
        name: t("store_management.inventory.title"),
        key: "inventory",
        icon: <Package size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.inventory,
      },
      {
        id: 15,
        name: t("store_management.packages_management"),
        key: "packages",
        icon: <TbPackages size={20} />,
        requiredPermissions: TAB_PERMISSION_MAP.packages,
      },
    ],
    [t]
  );

  const visibleTabs = useMemo(
    () => {
      const allowed = allTabs.filter((tab) => canAccessTab(tab.key));
      if (!allowed.length && permissionRole === "STORE_OWNER") {
        // Fallback: Store owner should see everything if permissions are delayed/missing
        return allTabs;
      }
      return allowed;
    },
    [allTabs, canAccessTab, permissionRole]
  );

  // Determine the effective tab based on permissions and URL.
  const activeTab = useMemo(() => {
    if (!visibleTabs.length) return requestedTab;
    if (canAccessTab(requestedTab)) return requestedTab;
    return visibleTabs[0].key;
  }, [requestedTab, visibleTabs, canAccessTab]);

  // If the requested tab is not allowed, rewrite the URL to the fallback once.
  useEffect(() => {
    if (!visibleTabs.length) return;
    if (canAccessTab(requestedTab)) return;
    const fallbackTab = visibleTabs[0].key;
    if (requestedTab !== fallbackTab) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("tab", fallbackTab);
      router.replace(`?${newParams.toString()}`);
    }
  }, [requestedTab, visibleTabs, canAccessTab, searchParams, router]);

  const handleTabChange = (newTab: string) => {
    if (!canAccessTab(newTab)) return;
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", newTab);
    router.push(`?${newParams.toString()}`);
  };

  const hasVisibleTabs = visibleTabs.length > 0;
  const renderContent = () => {
    if (!permissionsInitialized) {
      return <StoreManagementSkeleton />;
    }
    if (!hasVisibleTabs) {
      return (
        <NoPermissionCard
          headline={
            t("common.noPermissionTitle") ||
            t("common.noPermission")
          }
          message={
            t("common.noPermission")
          }
        />
      );
    }
    if (!canAccessTab(activeTab)) {
      return (
        <NoPermissionCard
          headline={
            t("common.noPermissionTitle") ||
            t("common.noPermission")
          }
          message={
            t("common.noPermission")
          }
        />
      );
    }
    switch (activeTab) {
      case "store_managment":
        return <UpdateStore />;
      case "products_managment":
        return <ProductsManagment handleTabChange={handleTabChange} />;
      case "flash_sell":
        return <FlashSellManagment />;
      case "add_product":
        return <AddProduct handleTabChange={handleTabChange}/>;
      case "update_product":
        return <UpdateProduct handleTabChange={handleTabChange} />;
      case "settings":
        return <StoreSettings />;
      case "balance":
        return <SectionText text={t("store_management.balance_section")} />;
      case "sales":
        return <SectionText text={t("store_management.sales_section")} />;
      case "orders":
        return <OrdersOverview/>;
      case "reviews":
        return <ReviewsOverview />;
      case "store_members":
        return <StoreMembers />;
      case "store_policies":
        return <StorePolicies />;
      case "support_tickets":
        return <SupportTckets handleTabChange={handleTabChange} />;
      case "sla_rule":
        return <SLASettings />;
      case "inventory":
        return <Inventory />;
      case "coupons":
        return <CouponsManagement />;
      case "packages":
        return <PackagesManagement />;
      default:
        return null;
    }
  };

  return (
    <MyStoreWrapper
      tabs={visibleTabs}
      activeTab={activeTab}
      handleTabChange={handleTabChange}
    >
      <StoreTabShell activeKey={activeTab}>{renderContent()}</StoreTabShell>
    </MyStoreWrapper>
  );
};

const NoPermissionCard = ({
  headline,
  message,
}: {
  headline: string;
  message: string;
}) => (
  <div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-10">
    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-blueSite/10 bg-white px-8 py-10 shadow-sm text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-blueLight/50 via-white to-transparent pointer-events-none" />
      <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blueLight text-blueSite">
        <Shield size={26} />
      </div>
      <h3 className="relative text-[22px] font-semibold text-[#1f2937]">
        {headline}
      </h3>
      <p className="relative mt-2 text-[16px] leading-6 text-subTitleColor">
        {message}
      </p>
    </div>
  </div>
);

const SectionText = ({ text }: { text: string }) => (
  <p className="text-subTitleColor text-[20px]">{text}</p>
);

export default StoreManagement;
