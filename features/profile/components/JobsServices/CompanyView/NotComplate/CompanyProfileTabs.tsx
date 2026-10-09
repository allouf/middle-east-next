"use client";

import {  Tabs } from "antd";
import { useState } from "react";
import {  Building2, Users } from "lucide-react";
import TeamTab from "./TeamTab";
import CompanyInfoTab from "./CompanyInfoTab";
import { useTranslation } from "@/lib/i18n/useTranslation";
import PageHeaderBanner from "./PageHeaderBanner";
interface CompanyProfileTabsProps {
    onBack: () => void;
    statusCode?: number;
    refetchJobs?: () => void;
    clearStatusCode?: () => void;
}

const CompanyProfileTabs : React.FC<CompanyProfileTabsProps> = ({ onBack ,statusCode, refetchJobs, clearStatusCode}) => {
  const [activeKey, setActiveKey] = useState("company");
    const { t } = useTranslation();

  const items = [
    {
      key: "company",
      label: (
        <span className="flex text-blueSite items-center gap-2 font-medium">
          <Building2 size={18} />
          {t("jobs.company.companyTab")}
        </span>
      ),
      children: <CompanyInfoTab onBack={onBack} statusCode={statusCode} refetchJobs={refetchJobs} clearStatusCode={clearStatusCode} />,
    },
    // {
    //   key: "team",
    //   label: (
    //     <span className="flex text-blueSite items-center gap-2 font-medium">
    //       <Users size={18}  />
    //       {t("jobs.company.teamTab")}
    //     </span>
    //   ),
    //   children: <TeamTab />,
    // },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md">
      {activeKey === "company" && <PageHeaderBanner onBack={onBack} title={t("jobs.company.companyTabTitle")} statusCode={statusCode} />}
      {activeKey === "team" && <PageHeaderBanner onBack={onBack} title={t("jobs.company.teamTabTitle")} statusCode={statusCode}/>}

    <Tabs
      activeKey={activeKey}
      onChange={setActiveKey}
      items={items}
      centered
    />
  </div>
  );
};

export default CompanyProfileTabs;