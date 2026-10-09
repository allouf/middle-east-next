import React from "react";

const PageHeader = ({ title }) => {
  return (
    <div className="bg-[#AFE9AF] text-blueSite pl-[100px]">
      <p className="font-medium text-3xl p-1">{title}</p>
    </div>
  );
};

export default PageHeader;
