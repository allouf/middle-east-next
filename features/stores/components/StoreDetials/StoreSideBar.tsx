'use client';

import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaGlobe,
  FaStar,
  FaPhone,
} from "react-icons/fa";
import { MdLocationOn, MdAccessTime } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";

const StoreSidebar = () => {
  return (
    <aside className="w-full lg:w-1/4 space-y-6">
      {/* Store Profile Card */}
      <div className="bg-white shadow-sm rounded-2xl border p-6 flex flex-col items-center text-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Store Logo"
          className="w-24 h-24 rounded-full object-cover border mb-3"
        />
        <h2 className="text-lg font-semibold text-subTitleColor">Name Storeeee</h2>
        <div className="flex items-center justify-center gap-1 text-blueSite mt-1">
          {[...Array(4)].map((_, i) => (
            <FaStar key={i} className="text-yellow-400" />
          ))}
          <FaStar className="text-gray-300" />
          <span className="text-textColor text-sm ml-1">(877)</span>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <p className="font-semibold text-subTitleColor mb-2">Bio :</p>
        <p className="text-subTitleColor text-sm leading-relaxed mb-4">
          I offer services for creating Brand Identity, Websites, and Web Design
          services service service serviceservice.
        </p>

        <p className="font-semibold text-subTitleColor mb-2">Information :</p>
        <ul className="space-y-2 text-sm text-subTitleColor">
          <li className="flex items-center gap-2">
            <MdLocationOn className="text-blueSite" />
            From North Sumatra
          </li>
          <li className="flex items-center gap-2">
            <HiOutlineMail className="text-blueSite" />
            <a
              href="mailto:ahlihaikal@hasibuan.com"
              className="hover:text-blueSiteHover"
            >
              ahlihaikal@hasibuan.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <FaGlobe className="text-blueSite" />
            <a
              href="https://ahlihaikalhasibuan.com"
              className="hover:text-blueSiteHover"
            >
              ahlihaikalhasibuan.com
            </a>
          </li>
          <li className="flex items-center gap-2">
            <MdAccessTime className="text-blueSite" />
            Opening time : 12:12 pm
          </li>
          <li className="flex items-center gap-2">
            <MdAccessTime className="text-red-500" />
            Closing time : 12:12 pm
          </li>
        </ul>

        {/* Social Icons */}
        <div className="flex items-center gap-4 mt-4 justify-center text-subTitleColor">
          <FaFacebook className="text-blueIcons cursor-pointer hover:scale-110 transition" />
          <FaInstagram className="text-pink-500 cursor-pointer hover:scale-110 transition" />
          <FaGlobe className="text-subTitleColor cursor-pointer hover:scale-110 transition" />
        </div>

        <button className="w-full mt-5 py-2.5 bg-[#E6F0ED] text-blueSite border border-blue-200 font-medium rounded-lg hover:bg-blueSiteHover hover:text-textWhiteColor transition">
          More Details
        </button>
      </div>

      {/* Second Card Example (optional, if you want like image’s duplicate) */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <p className="font-semibold text-subTitleColor mb-2">Bio :</p>
        <p className="text-subTitleColor text-sm leading-relaxed mb-4">
          I offer services for creating Brand Identity, Websites, and Web
          Designservices service service serviceservice.
        </p>

        <p className="font-semibold text-subTitleColor mb-2">Information :</p>
        <ul className="space-y-2 text-sm text-subTitleColor">
          <li className="flex items-center gap-2">
            <MdLocationOn className="text-blueIcons" />
            From North Sumatra
          </li>
          <li className="flex items-center gap-2">
            <MdAccessTime className="text-blueIcons" />
            Opening time : 12:12 pm
          </li>
          <li className="flex items-center gap-2">
            <MdAccessTime className="text-red-500" />
            Closing time : 12:12 pm
          </li>
        </ul>

        <div className="flex items-center gap-4 mt-4 justify-center text-subTitleColor">
          <FaFacebook className="text-blueIcons cursor-pointer hover:scale-110 transition" />
          <FaInstagram className="text-pink-500 cursor-pointer hover:scale-110 transition" />
          <FaGlobe className="text-subTitleColor cursor-pointer hover:scale-110 transition" />
        </div>

        <button className="w-full mt-5 py-2.5 bg-[#E6F0ED] text-blueSite border border-blue-200 font-medium rounded-lg hover:bg-blueSiteHover hover:text-textWhiteColor transition">
          More Details
        </button>
      </div>
    </aside>
  );
};

export default StoreSidebar;
