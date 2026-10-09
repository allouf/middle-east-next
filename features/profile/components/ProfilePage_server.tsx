
import { Suspense } from "react";
import { Box, Building2, Heart, MapPin, Shield, Ticket, Trash2, Zap } from "lucide-react";
import { BiDevices } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa";
import { GrCompare } from "react-icons/gr";
import { MdOutlineWorkOutline } from "react-icons/md";

import Addresses from "./Addresses/Addresses";
import DevicesManagment from "./TabsContent/DevicesManagment";
import ReferralsContent from "./TabsContent/ReferralsContent";
import SettingsContent from "./TabsContent/SettingsContent";
import Wishlist from "./Wishlist";

import Trashed from "./Trashed/Trashed";
import {
  ProfileTab,
  ProfileTabKey,
} from "../types";
import ProfileSideBar from "./ProfileSideBar";
import CompanyContent_server from "./TabsContent/CompanyContent_server";
import BasicContent_server from "./TabsContent/BasicContent_server";
import MyStores_server from "@/features/store/components/MyStores/MyStores_server";
import MyStoresSkeleton from "@/features/store/components/MyStores/MyStoresSkeleton";
import { CompareProducts } from "./TabsContent/CompareProducts";
import OrdersTab from "./TabsContent/OrdersTab";
import MyTickets from "./Tickets/MyTickets";
import { getServerAuth, getServerToken } from "@/lib/utils/auth-storage-server";
import { redirect } from "next/navigation";
import { ProviderSectionWrapper } from "./ServiceMarket/Provider/components/ProviderSectionWrapper";
import ProfileTabShell from "./ProfileTabShell";
import UsedMarketContent from "./TabsContent/UsedMarketContent";
import { IoSettingsOutline } from "react-icons/io5";
import JobsServicesContent from "./TabsContent/JobsServicesContent";
import ConsumerJobsServices from "./TabsContent/ConsumerJobsServices";

import {
  MyOrder,
  MyServices,
  OurProject,
  Profile,
  MyOrdersProvider,
  OrderDetailsProvider,
  OrderRevisionClient,
  MyOrdersCustomer,
  OrderDetailsClient,
  RFQ,
  CreateOrder,
  ProviderRFQ,
  MilestonesCustomerPage,
  DisputeOrder, DisputeDetails,
  CustomersDisputeOrders,
  CustomersDisputeOrderDetails,
  ClientRefundPayment,
  BoostCampaign,
  MilestonesProviderPage,
  MilestonesProviderDetailsPage
} from "./ServiceMarket";

import { FiBox, FiLayout, FiSmartphone } from "react-icons/fi";
import { RiCoinsLine } from "react-icons/ri";
import CreateMilestonePage from "./ServiceMarket/Provider/components/milestones/createPage";
import EditMilestonePage from "./ServiceMarket/Provider/components/milestones/editPage";
import ProviderMilestoneOrderPage from "./ServiceMarket/Provider/components/milestones/providerOrderPage";



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
  "trashed",
  "compare",
  "mytickets",
  "jobs_services",
  "service_market",
];


const isProfileTabKey = (value: string | null): value is ProfileTabKey =>
  !!value && PROFILE_TAB_KEYS.includes(value as ProfileTabKey);

const ProfilePage_server = async ({ searchParams, locale, pageType = 'profile' }: { searchParams?: { tab?: string; subTab?: string }, locale: string, pageType?: 'profile' | 'dashboard' }) => {

  const { role } = await getServerAuth();
  const normalizedRole = role === "consumer" || role === "company" ? role : null;
  const tabFromParams = searchParams?.tab ?? null;
  const subTabFromParams = searchParams?.subTab ?? null;

  const profileTabsKeys: ProfileTabKey[] = [
    "basic",
    "devices_managment",
    "wishlist",
    "orders",
    "addresses",
    "settings",
    "trashed",
    "compare",
    "mytickets",
  ];

  const dashboardTabsKeys: ProfileTabKey[] = [
    "company_stores",
    "jobs_services",
    "used_market",
    "service_market",
  ];

  const activeTab = isProfileTabKey(tabFromParams) ? tabFromParams : (pageType === 'profile' ? "basic" : "company_stores");

  // Combine tab and subTab for nested routing
  const fullActiveTab = subTabFromParams ? `${activeTab}/${subTabFromParams}` : activeTab;



  const allTabs: ProfileTab[] = [
    {
      id: 1,
      name: "profileSideBar.personalInformation",
      key: "basic",
      icon: <FaRegUser size={20} />,
      roles: ["consumer", "company"],
    },
    // {
    //   id: 2,
    //   name: "profileSideBar.referrals",
    //   key: "referrals",
    //   icon: <FaLink size={20} />,
    //   roles: ["consumer", "company"],
    // },
    {
      id: 6,
      name: "profileSideBar.devicesManagement",
      key: "devices_managment",
      icon: <BiDevices size={20} />,
      roles: ["consumer", "company"],
    },
    // {
    //   id: 3,
    //   name: "profileSideBar.balance",
    //   key: "balance",
    //   icon: <LiaCoinsSolid size={20} />,
    //   roles: ["consumer", "company"],
    // },
    {
      id: 4,
      name: "profileSideBar.wishlist",
      key: "wishlist",
      icon: <Heart size={20} />,
      roles: ["consumer", "company"],
    },
    {
      id: 5,
      name: "profileSideBar.orders",
      key: "orders",
      icon: <Box size={20} />,
      roles: ["consumer", "company"],
    },
    {
      id: 11,
      name: "profileSideBar.addresses",
      key: "addresses",
      icon: <MapPin size={20} />,
      roles: ["consumer", "company"],
    },
    {
      id: 7,
      name: "profileSideBar.security",
      key: "settings",
      icon: <Shield size={20} />,
      roles: ["consumer", "company"],
    },
    {
      id: 9,
      name: "profileSideBar.myStores",
      key: "company_stores",
      icon: <Building2 size={20} />,
      roles: ["company", "consumer"],
    },
    {
      id: 15,
      name: "profileSideBar.jobsServices",
      key: "jobs_services",
      icon: <MdOutlineWorkOutline size={20} />,
      roles: ["company", "consumer"],
    },
    {
      id: 14,
      name: "profileSideBar.usedMarket",
      key: "used_market",
      icon: <IoSettingsOutline size={20} />,
      roles: ["company", "consumer"],
    },
    {
      id: 16,
      name: "profileSideBar.serviceMarket",
      key: "service_market",
      icon: <MdOutlineWorkOutline size={20} />,
      roles: ["consumer", "company"],
      dropdown: [
        {
          id: 160,
          name: "serviceMarket.profile.title",
          key: "profile",
          icon: <FaRegUser />,
          component: <Profile />,
          roles: ["consumer", "company"],
        },
        {
          id: 161,
          name: "serviceMarket.myOffer.title",
          key: "my_offer",
          icon: <RiCoinsLine />,
          component: <RFQ />,
          roles: ["consumer", "company"],
        },
        {
          id: 162,
          name: "serviceMarket.myOrder.requested",
          key: "my_order_customer",
          icon: <FiBox />,
          component: <MyOrdersCustomer />,
          roles: ["consumer", "company"],
        },
        {
          id: 163,
          name: "serviceMarket.myOrder.incoming",
          key: "my_order_provider",
          icon: <FiBox />,
          component: <MyOrdersProvider />,
          roles: ["consumer", "company"],
        },
        {
          id: 166,
          name: "serviceMarket.myOrder.order_dispute",
          key: "order_dispute",
          icon: <FiBox />,
          component: <DisputeOrder />,
          roles: ["consumer", "company"],
        },

        {
          id: 164,
          name: "serviceMarket.myServices.title",
          key: "my_services",
          icon: <FiSmartphone />,
          component: <MyServices />,
          roles: ["consumer", "company"],
        },
        {
          id: 165,
          name: "serviceMarket.ourProject.title",
          key: "our_project",
          icon: <FiLayout />,
          component: <OurProject />,
          roles: ["consumer", "company"],
        },
        {
          id: 169,
          name: "serviceMarket.providerRfq.title",
          key: "provider_rfq",
          icon: <FiLayout />,
          component: <ProviderRFQ />,
          roles: ["consumer", "company"],
        },
        {
          id: 170,
          name: "serviceMarket.boostCampaign.title",
          key: "boost_campaign",
          icon: <Zap />,
          component: <BoostCampaign />,
          roles: ["consumer", "company"],
        },
      ]
    },
    {
      id: 10,
      name: "profileSideBar.trashedItems",
      key: "trashed",
      icon: <Trash2 size={20} />,
      roles: ["company"],
    },
    {
      id: 12,
      name: "profileSideBar.compareProducts",
      key: "compare",
      icon: <GrCompare size={20} />,
      roles: ["consumer", "company"],
    },
    {
      id: 13,
      name: "profileSideBar.myTickets",
      key: "mytickets",
      icon: <Ticket size={20} />,
      roles: ["consumer", "company"],
    },
  ];

  const filteredTabs = allTabs.filter((tab) => {
    const isRoleAllowed = normalizedRole ? tab.roles.includes(normalizedRole) : true;
    const isPageTypeAllowed = pageType === 'profile'
      ? profileTabsKeys.includes(tab.key)
      : dashboardTabsKeys.includes(tab.key);
    return isRoleAllowed && isPageTypeAllowed;
  }).map(tab => {
    // Filter dropdown items based on role as well
    if (tab.dropdown && tab.dropdown.length > 0) {
      return {
        ...tab,
        dropdown: tab.dropdown.filter(subTab =>
          normalizedRole ? subTab.roles.includes(normalizedRole) : true
        )
      };
    }
    return tab;
  });
  const renderContent = () => {
    if (normalizedRole === "consumer") {
      switch (activeTab) {
        case "basic":
          return (
            <BasicContent_server locale={locale} />
          );
        case "referrals":
          return <ReferralsContent />;
        case "settings":
          return <SettingsContent />;
        case "company_stores":

          return <Suspense fallback={<MyStoresSkeleton />}>
            <MyStores_server locale={locale} />;
          </Suspense>
        case "used_market":
          return <UsedMarketContent />;
        case "jobs_services":
          return <ConsumerJobsServices />;
        case "devices_managment":
          return <DevicesManagment />;
        case "balance":
          return (
            <p className="text-subTitleColor">Balance section for consumers</p>
          );
        case "wishlist":
          return <Wishlist />;
        case "orders":
          return <OrdersTab />;
        case "addresses":
          return <Addresses />;
        case "mytickets":
          return <MyTickets />;
        case "compare":
          return <CompareProducts />;
        case "service_market":
          // Handle nested routing for service_market dropdown
          if (fullActiveTab.includes('/')) {
            const subTab = fullActiveTab.split('/')[1];
            switch (subTab) {

              case "my_offer":
                return (
                  // <ProviderSectionWrapper>
                  <RFQ />
                  // </ProviderSectionWrapper>
                );
              case "create_order":
                return (
                  //<ProviderSectionWrapper>
                  <CreateOrder />
                  //</ProviderSectionWrapper>
                );
              case "my_order_customer":
                return (
                  //<ProviderSectionWrapper>
                  <MyOrdersCustomer />
                  // </ProviderSectionWrapper>
                );
              case "my_order_provider":
                return (
                  <ProviderSectionWrapper>
                    <MyOrdersProvider />
                  </ProviderSectionWrapper>
                );
              case "order_details_consumer":
                return (
                  // <ProviderSectionWrapper>
                  <OrderDetailsClient />
                  // </ProviderSectionWrapper>
                );
              case "order_dispute":
                return (
                    <DisputeOrder />         
                );
              case "customer_order_dispute":
                return (
                  // <ProviderSectionWrapper>
                  <CustomersDisputeOrders />
                  // </ProviderSectionWrapper>
                );
              case "dispute_details":
                return (
                    <DisputeDetails />          
                );

              case "customer_dispute_details":
                return (
                  // <ProviderSectionWrapper>
                  <CustomersDisputeOrderDetails />
                  // </ProviderSectionWrapper>
                );
              case "customer_order_milestones":
                return (
                  <MilestonesCustomerPage />
                );

              case "provider_order_milestones":
                return (
                  <ProviderSectionWrapper>
                    <MilestonesProviderPage />
                  </ProviderSectionWrapper>
                );
              case "milestone_provider_details":
                return (
                  <ProviderSectionWrapper>
                    <MilestonesProviderDetailsPage />
                  </ProviderSectionWrapper>
                );
              case "create_milestone":
                return (
                  <ProviderSectionWrapper>
                    <CreateMilestonePage />
                  </ProviderSectionWrapper>
                )
              case "edit_milestone":
                return (
                  <ProviderSectionWrapper>
                    <EditMilestonePage />
                  </ProviderSectionWrapper>
                )
              case "provider_milestone_order_details":
                return (
                  <ProviderSectionWrapper>
                    <ProviderMilestoneOrderPage />
                  </ProviderSectionWrapper>
                )

              case "order_revision":
                return (
                  // <ProviderSectionWrapper>
                  <OrderRevisionClient />
                  // </ProviderSectionWrapper>
                );
              case "refund_payment":
                return (
                  // <ProviderSectionWrapper>
                  <ClientRefundPayment />
                  // </ProviderSectionWrapper>
                );
              case "my_services":
                return (
                  <ProviderSectionWrapper>
                    <MyServices />
                  </ProviderSectionWrapper>
                );
              case "our_project":
                return (
                  <ProviderSectionWrapper>
                    <OurProject />
                  </ProviderSectionWrapper>
                );
              case "profile":
                return (
                  <ProviderSectionWrapper>
                    <Profile />
                  </ProviderSectionWrapper>
                );
              case "provider_rfq":
                return (
                  <ProviderSectionWrapper>
                    <ProviderRFQ />
                  </ProviderSectionWrapper>
                );
              case "boost_campaign":
                return (
                  <ProviderSectionWrapper>
                    <BoostCampaign />
                  </ProviderSectionWrapper>
                );
              default:
                return (
                  <ProviderSectionWrapper>
                    {normalizedRole === "consumer" ? <MyOrder /> : <RFQ />}
                  </ProviderSectionWrapper>
                );

            }
          }
          return (
            <ProviderSectionWrapper>
              {normalizedRole === "consumer" ? <MyOrder /> : <RFQ />}
            </ProviderSectionWrapper>
          ); // Default based on role
        default:
          return <p className="text-textColor">Content coming soon...</p>;
      }
    }

    if (normalizedRole === "company") {
      switch (activeTab) {
        case "basic":
          return (
            <CompanyContent_server locale={locale} />
          );
        // case "referrals":
        // return <ReferralsContent />;
        // case "balance":
        // return (
        //     <p className="text-subTitleColor">Balance section for companies</p>
        // );
        case "wishlist":
          return <Wishlist />;
        case "orders":
          return <OrdersTab />;
        case "addresses":
          return <Addresses />;
        case "mytickets":
          return <MyTickets />;
        case "settings":
          return <SettingsContent />;
        case "devices_managment":
          return <DevicesManagment />;
        case "company_stores":
          return <Suspense fallback={<MyStoresSkeleton />}>
            <MyStores_server locale={locale} />
          </Suspense>
        case "used_market":
          return <UsedMarketContent />;
        case "jobs_services":
          return <JobsServicesContent />;
        case "trashed":
          return <Trashed />;
        case "compare":
          return <CompareProducts />;
        case "service_market":
          if (fullActiveTab.includes('/')) {
            const subTab = fullActiveTab.split('/')[1];
            switch (subTab) {
              case "my_offer":
                return (
                  // <ProviderSectionWrapper>
                  <RFQ />
                  // </ProviderSectionWrapper>
                );
              case "create_order":
                return (
                  //  <ProviderSectionWrapper>
                  <CreateOrder />
                  //  </ProviderSectionWrapper>
                );
              case "my_order_customer":
                return (
                  // <ProviderSectionWrapper>
                  <MyOrdersCustomer />
                  //</ProviderSectionWrapper>
                );
              case "my_order_provider":
                return (
                  <ProviderSectionWrapper>
                    <MyOrdersProvider />
                  </ProviderSectionWrapper>
                );
              case "order_details_provider":
                return (
                  <ProviderSectionWrapper>
                    <OrderDetailsProvider />
                  </ProviderSectionWrapper>
                );

              case "order_details_consumer":
                return (
                  // <ProviderSectionWrapper>
                  <OrderDetailsClient />
                  // </ProviderSectionWrapper>
                );

              case "order_dispute":
                return (
                
                    <DisputeOrder />
           
                );

              case "customer_order_dispute":
                return (
                  // <ProviderSectionWrapper>
                  <CustomersDisputeOrders />
                  // </ProviderSectionWrapper>
                );
              case "dispute_details":
                return (
                 
                    <DisputeDetails />
                  // </ProviderSectionWrapper>
                );

              case "customer_dispute_details":
                return (
                  // <ProviderSectionWrapper>
                  <CustomersDisputeOrderDetails />
                  // </ProviderSectionWrapper>
                );
              case "customer_order_milestones":
                return (
                  <MilestonesCustomerPage />
                );
              case "provider_order_milestones":
                return (
                  <ProviderSectionWrapper>
                    <MilestonesProviderPage />
                  </ProviderSectionWrapper>
                );
              case "milestone_provider_details":
                return (
                  <ProviderSectionWrapper>
                    <MilestonesProviderDetailsPage />
                  </ProviderSectionWrapper>
                );
              case "create_milestone":
                return (
                  <ProviderSectionWrapper>
                    <CreateMilestonePage />
                  </ProviderSectionWrapper>
                )
              case "edit_milestone":
                return (
                  <ProviderSectionWrapper>
                    <EditMilestonePage />
                  </ProviderSectionWrapper>
                )
              case "provider_milestone_order_details":
                return (
                  <ProviderSectionWrapper>
                    <ProviderMilestoneOrderPage />
                  </ProviderSectionWrapper>
                )
              case "my_services":
                return (
                  <ProviderSectionWrapper>
                    <MyServices />
                  </ProviderSectionWrapper>
                );

              case "our_project":
                return (
                  <ProviderSectionWrapper>
                    <OurProject />
                  </ProviderSectionWrapper>
                );

              case "profile":
                return (
                  <ProviderSectionWrapper>
                    <Profile />
                  </ProviderSectionWrapper>
                );

              case "provider_rfq":
                return (
                  <ProviderSectionWrapper>
                    <ProviderRFQ />
                  </ProviderSectionWrapper>
                );

              case "boost_campaign":
                return (
                  <ProviderSectionWrapper>
                    <BoostCampaign />
                  </ProviderSectionWrapper>
                );

              default:
                return (
                  <ProviderSectionWrapper>
                    <RFQ />
                  </ProviderSectionWrapper>
                ); // Default to first tab

            }
          }
          return (
            <ProviderSectionWrapper>
              <RFQ />
            </ProviderSectionWrapper>
          ); // Default to first tab

        default:
          return <p className="text-textColor">Content coming soon...</p>;
      }
    }

    return (
      <p className="text-textColor">No content available for your role.</p>
    );
  };

  const token = await getServerToken();

  if (!token) {
    redirect('/login');
  }

  return (
    <div className=" flex flex-col md:flex-row md:pt-0 ">
      <ProfileSideBar tabs={filteredTabs} pageType={pageType} />
      <main className="flex-1 bg-white mt-5 lg:mt-0 max-h-full relative md:overflow-auto !overflow-hidden">
        <ProfileTabShell activeKey={fullActiveTab}>
          {renderContent()}
        </ProfileTabShell>
      </main>
    </div>
  )
}

export default ProfilePage_server
