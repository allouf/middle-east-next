import { useLangSwitch } from "../../lib/Hooks/useLangSwitch";
import HeaderCommunity from "../layouts/HeaderCommunity";

const LayoutsCommunity = ({ children }) => {
  const {currentLang} = useLangSwitch();
  const isRTL = currentLang === "ar";
  return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={`flex flex-col relative container overflow-auto max-w-[1400px] mx-auto ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="fixed w-full z-[999]">
          {" "}
          <HeaderCommunity />
        </div>

        <main className="flex-grow m-2 mt-16">{children}</main>
      </div>
  );
};

export default LayoutsCommunity;
