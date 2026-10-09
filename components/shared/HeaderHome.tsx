import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import Button from "../ui/Button";

const HeaderHome = ({ text = "", url = "#", onClick, showText = "View All" }: { text?: string; url?: string; onClick?: () => void; showText?: string }) => {
  const isExpanded = showText === "View Fewer";
  
  return (
    <div className="flex justify-between items-center sm:mb-6 mb-3 pb-2">
      <h2 className="sm:text-2xl text-[14px] font-bold text-subTitleColor border-b-2 border-blueSite pb-1">
        {text}
      </h2>
      <Button
        to={onClick ? undefined : url}
        onClick={onClick}
        unstyled
        className="flex items-center gap-1 font-medium hover:underline"
      >
        {showText}{" "}
        {isExpanded ? (
          <ArrowDown size={28} className="text-blueSite" />
        ) : (
          <ArrowRight size={28} className="text-blueSite" />
        )}
      </Button>
    </div>
  );
};

export default HeaderHome;
