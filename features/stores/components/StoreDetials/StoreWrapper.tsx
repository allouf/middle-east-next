'use client';

import React from "react";
import StoreSideBar from "./StoreSideBar";

const StoreWrapper = ({ children }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white text-subTitleColor p-6 rounded-2xl">
      {/* Left Sidebar */}
      <StoreSideBar />
      {/* Main Content */}
      <main className="flex-1 max-w-6xl">{children}</main>
    </div>
  );
};

export default StoreWrapper;
