'use client';

import { TbWorld } from "react-icons/tb";

const LangSwitcher = () => {
  return (
    <div className="flex items-center gap-1 text-sm text-textWhiteColor md:text-base lg:text-lg font-medium sm:px-3 px-2 py-1 rounded-md">
      <TbWorld size={28} />
      <span className="tracking-wide">EN</span>
    </div>
  );
};

export default LangSwitcher;
