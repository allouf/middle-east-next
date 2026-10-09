import { FaGift, FaTicketAlt } from "react-icons/fa";
import { getBalance } from "@/shared/constants/urls";
import useGetData from "@/lib/api/useGetData";
import { t } from "i18next";
import LoaderPage from "@/components/shared/LoaderPage";

const PointsRewards = () => {
  const { data: resData, loading } = useGetData({
    url: getBalance,
  });

  if (loading) {
    return <LoaderPage />;
  }

  const points = resData?.data?.points || 0;
  const rewards = resData?.data?.rewards || [];

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
      {/* Left: Points Balance */}
      <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-xl shadow-sm w-full md:w-1/3">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <FaGift className="text-blueSite text-4xl" />
        </div>
        <div className="text-2xl font-bold text-blueSiteHover">
          {points} {t("referrals.points")}
        </div>
        <div className="text-textColor text-sm mt-2">
          {" "}
          {t("referrals.myPointsBalance")}
        </div>
      </div>

      {/* Right: Rewards */}
      <div className="flex-1">
        <p className="text-subTitleColor mb-4">{t("referrals.prizesAvailable")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.length === 0 && (
            <p className="text-textColor col-span-full">
              {" "}
              {t("referrals.noRewardsAvailable")}
            </p>
          )}
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl shadow-sm border hover:border-blueSite transition cursor-pointer ${
                reward.redeemed ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="bg-blue-100 p-3 rounded-full mb-2">
                <FaTicketAlt className="text-blueSite text-2xl" />
              </div>
              <div className="text-sm font-semibold text-subTitleColor">
                {reward.milestone.name}
              </div>
              <div className="text-xs text-textColor mt-1">
                {reward.milestone.value} {t("referrals.off")}
              </div>
              <div className="text-xs text-textColor">
                Requires {reward.milestone.required_points} pts
              </div>
              <div className="text-xs text-textColor">
                Valid for {reward.milestone.valid_days} days
              </div>
              {reward.redeemed && (
                <span className="text-xs mt-2 text-green-600 font-medium">
                  {t("referrals.alreadyRedeemed")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PointsRewards;
