import { useState } from "react";
import PointsRewards from "./PointsRewards";
import ReferralComponent from "./ReferralComponent";
import { t } from "i18next";

const Referrals = () => {
  const [activeTab, setActiveTab] = useState("referrals");

  return (
    <div className="w-full md:max-w-3xl mx-auto p-1 md:p-6 bg-white  space-y-8">
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === "referrals"
              ? "text-blueSiteHover border-b-2 border-blueSiteHover"
              : "text-textColor"
          }`}
          onClick={() => setActiveTab("referrals")}
        >
          {t("profileSideBar.referrals")}
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === "pointsRewards"
              ? "text-blueSiteHover border-b-2 border-blueSiteHover"
              : "text-textColor"
          }`}
          onClick={() => setActiveTab("pointsRewards")}
        >
          {t("profileSideBar.pointsRewards")}
        </button>
      </div>

      <main className="p-4">
        {activeTab === "referrals" && <ReferralComponent />}
        {activeTab === "pointsRewards" && <PointsRewards />}
      </main>
    </div>
  );
};

export default Referrals;
