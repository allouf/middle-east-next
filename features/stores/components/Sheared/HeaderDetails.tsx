'use client';

import React from "react";
import Button from "@/components/ui/Button";
import { IoIosArrowForward } from "react-icons/io";

const HeaderDetails = ({ text = "", url = "#" }) => {
  return (
    <div className="flex justify-between items-center mb-6 pb-2">
      <h2 className="text-2xl font-bold text-subTitleColor border-b-2 border-blueSite pb-1">
        {text}
      </h2>
      <Button
        to={url}
        unstyled
        className="flex items-center gap-1 text-blueSite font-medium hover:underline"
      >
        View All <IoIosArrowForward />
      </Button>
    </div>
  );
};

export default HeaderDetails;
