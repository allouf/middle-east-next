"use client";

import React, { useMemo, useState } from "react";
import { Tabs as AntTabs } from "antd";
import type { TabsProps } from "antd";
import { Briefcase, Image as ImageIcon, Users } from "lucide-react";

import AvailableJobs from "./jobs/AvailableJobs";
import OurGalley from "./Gallery/OurGallery";
import OurTeam from "./Teams/OurTeam";
import { CompanyProfile } from "../../types";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface CompanyTabsProps {
  company?: CompanyProfile | null;
  refetch?: () => Promise<any> | null;
}

const CompanyTabs: React.FC<CompanyTabsProps> = ({ company, refetch }) => {
  const [activeKey, setActiveKey] = useState("jobs");
  const { t } = useTranslation();

  const items: TabsProps["items"] = useMemo(
    () => [
      {
        key: "jobs",
        label: (
          <span className="inline-flex items-center gap-2 font-medium">
            <Briefcase className="h-4 w-4" />
            {t("jobs.availableJobs")}
          </span>
        ),
        children: <AvailableJobs />,
      },
      {
        key: "gallery",
        label: (
          <span className="inline-flex items-center gap-2 font-medium">
            <ImageIcon className="h-4 w-4" />
            {t('jobs.ourGallery')}
          </span>
        ),
        children: <OurGalley company={company} refetch={refetch} />,
      },
      {
        key: "team",
        label: (
          <span className="inline-flex items-center gap-2 font-medium">
            <Users className="h-4 w-4" />
            {t('jobs.ourTeam')}
          </span>
        ),
        children: <OurTeam company={company} refetch={refetch} />,
      },
    ],
    [company]
  );

  return (
    <div className="w-full">
      {/* Tabs Header like screenshot */}
      <div className=" bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-4">
            {/* <div className="border-t border-zinc-200"> */}
          <AntTabs
            activeKey={activeKey}
            onChange={setActiveKey}
            items={items}
            tabBarGutter={28}
            centered
            className="company-tabs"
          />
          {/* </div> */}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1100px] px-4 py-6">{/* Ant renders children */}</div>

      <style jsx global>{`
        /* target only this instance */
        .company-tabs.ant-tabs {
          margin: 0;
          
        }

        .company-tabs .ant-tabs-nav {
          margin: 0;
        }
          
        .company-tabs .ant-tabs-ink-bar {
          display: none;
        }

        .company-tabs .ant-tabs-nav::before {
         border-bottom: 1px solid rgb(228 228 231);
        }

        /* center tabs, clean look */
        .company-tabs .ant-tabs-tab {
          padding: 14px 6px;
        }

        /* default (inactive) */
        .company-tabs .ant-tabs-tab-btn {
          color: rgb(113 113 122); /* zinc-500 */
          font-size: 14px;
          line-height: 20px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .company-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
          color: rgb(63 63 70); /* zinc-700 */
        }

        /* active (green icon/text) + underline */
        .company-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: rgb(4 120 87); /* emerald-700 */
        }

        .company-tabs .ant-tabs-tab.ant-tabs-tab-active {
          position: relative;
        }

        .company-tabs .ant-tabs-tab.ant-tabs-tab-active::after {
          content: "";
          position: absolute;
          left: 10%;
          right: 10%;
          bottom: 0;
          height: 3px;
          border-radius: 9999px;
          background: rgb(4 120 87); /* emerald-700 */
        }

        /* panes spacing like screenshot */
        .company-tabs .ant-tabs-content-holder {
          padding-top: 18px;
        }
      `}</style>
    </div>
  );
};

export default CompanyTabs;