import React from "react";
import { BsBoxSeamFill, BsStack } from "react-icons/bs";
import { useTranslation } from "@/lib/i18n/useTranslation";

const stats = [
  { labelKey: "store.active", color: "#56E8A7" },
  { labelKey: "store.warned", color: "#F5DF4C" },
  { labelKey: "store.banned", color: "#BF2033" },
  { labelKey: "store.suspended", color: "#878787" },
];

const StoreStats = ({ count }:{count:number}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 ">
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex flex-col  md:flex-row gap-2 md:gap-3 items-center p-3 md:p-4 rounded-lg shadow-sm border transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: `${s.color}20` }} // light background with opacity
        >
          <div
            className="flex-shrink-0 p-2 md:p-3 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${s.color}30` }} // icon background with opacity
          >
            <BsBoxSeamFill
              size={16} // small for mobile
              className="md:w-6 md:h-6" // medium for larger screens
              color={s.color}
            />
          </div>

          <div className="flex flex-col lg:flex-shrink-0  justify-between  gap-1 ">
            <p className="font-medium text-xs md:text-sm lg:text-[16px] text-subTitleColor">
              {t(s.labelKey)}   {" "}
            </p>
            <p
              className="font-bold text-sm md:text-lg lg:text-xl"
              style={{ color: s.color }}
            >
              {t("text.soon")}
              {/* {count} */}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreStats;
