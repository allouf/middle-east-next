"use client"
import React, { useState } from "react";
import ChangePassword from "../ScurityTabs/ChangePassword";
import DeleteAccount from "../ScurityTabs/DeleteAccount";
import { useTranslation } from "@/lib/i18n/useTranslation";

const SettingsContent = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("reset_password");

  return (
    <div className="flex flex-col md:flex-row gap-3 xs:gap-4 p-4 xs:p-5 sm:p-6 md:p-7 md:pt-[4vh]">
      {/* Left Sidebar - Navigation Buttons */}
      <nav className="flex flex-row md:flex-col gap-2 xs:gap-3 md:w-auto w-full overflow-x-auto md:overflow-x-visible">
        <button
          onClick={() => setActiveTab("reset_password")}
          className={`w-full xs:w-[200px] sm:w-[250px] h-[60px] xs:h-[70px] sm:h-[80px] px-3 xs:px-4 py-2 xs:py-2.5 rounded-md text-xs xs:text-sm font-medium transition-all whitespace-nowrap ${activeTab === "reset_password"
            ? "bg-[#E6F0ED] text-blueBtn border-l-[3px] border-l-blueBtn"
            : "bg-white text-blueBtn border border-blueBtn"
            }`}
        >
          {t("settings.resetPassword")}
        </button>

        {/* <button
          onClick={() => setActiveTab("delete_account")}
          className={`w-[250px] h-[80px] px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === "delete_account"
              ? "bg-[#E6F0ED] text-blueBtn border-l-[3px] border-l-blueBtn"
              : "bg-white text-blueBtn border border-blueBtn"
          }`}
        >
          {t("settings.deleteAccount")}
        </button> */}
      </nav>

      {/* Right Content Area */}
      <main className="bg-[#FBFBFB] w-full py-4 xs:py-5 px-3 xs:px-4 sm:pl-4 lg:pr-[100px] xl:pr-[150px] rounded-[8px] xs:rounded-[10px]">
        {activeTab === "reset_password" && <ChangePassword />}
        {activeTab === "delete_account" && <DeleteAccount />}
      </main>
    </div>
  );
};

export default SettingsContent;
