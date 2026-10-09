"use client"
import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { LuNotebookPen } from "react-icons/lu";
import { TfiGift } from "react-icons/tfi";
import InputField from "@/components/ui/InputField";
import { FaFacebook, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useAlert } from "@/lib/context/AlertProvider";

import { t } from "i18next";

const referralLink = "https://example.com/referral-link";
const ReferralsContent = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const { message } = useAlert();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        message.success("copied");
        // Optionally show a toast or temporary text saying "Copied!"
      })
      .catch((err) => {
        message.error("Failed to copy");
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="w-full p-6 md:p-7 md:pt-[4vh]">
      <div className="mx-auto ">
        <div className="flex flex-row justify-between flex-wrap items-center gap-5">
          <div className="flex-1 flex flex-col items-center justify-center gap-5 border border-blueLight py-7 rounded-[17px] ">
            <div className="bg-blue-100 rounded-full w-[80px] h-[80px] flex items-center justify-center">
              <AiOutlineMessage size={22} className="text-[#32a5ef]" />
            </div>
            <div>
              <h2 className="text-center text-black font-semibold text-lg">
                {t("referrals.step1.title")}
              </h2>
              {/* <p className='text-center text-gray-500'>send your referral link to your friends .</p> */}
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-5 border border-blueLight py-7 rounded-[17px]">
            <div className="bg-blue-100 rounded-full w-[80px] h-[80px] flex items-center justify-center">
              <LuNotebookPen size={22} className="text-[#32A5EF]" />
            </div>
            <div>
              <h2 className="text-center text-black font-semibold text-lg">
                {t("referrals.step2.title")}
              </h2>
              {/* <p className='text-center text-gray-220'>
                let them register to our services using your referral like .</p> */}
            </div>
          </div>

          <div
            className="flex-1 flex flex-col items-center justify-center gap-5 py-7 rounded-[17px] relative"
            style={{
              backgroundColor: "#E7F5FD",
              borderLeft: "4px solid #32A7EF",
              borderTop: "none",
              borderRight: "none",
              borderBottom: "none",
            }}
          >
            <div
              className="rounded-full w-[80px] h-[80px] flex items-center justify-center"
              style={{ backgroundColor: "#E7F5FD" }}
            >
              <TfiGift size={22} className="text-[#338572]" />
            </div>
            <div>
              <h2 className="text-center text-gray-700 font-semibold text-lg">
                {t("referrals.step3.title")}
              </h2>
              {/* <p className='text-center text-gray-220'>you and your friend get 2 points free!</p> */}
            </div>
          </div>
        </div>

        {/* Referral Fields and Contact Information - Two Column Layout */}
        <div className="flex flex-col md:flex-row gap-12 mt-7">
          {/* Left Column - Referral Fields */}
          <div
            className="flex-1 flex flex-col gap-8"
            style={{ maxWidth: "55%" }}
          >
            {/* Share the referral link */}
            <div className="">
              <h1 className="text-[#1A202C] text-[18px] font-semibold mb-2">
                {t("referrals.share.title")} :
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                {t("referrals.share.description")}
              </p>

              <div
                className="w-full rounded-[10px] h-[64px] flex flex-row items-center justify-between p-3"
                style={{ backgroundColor: "#E7F5FD" }}
              >
                <InputField
                  type="text"
                  className="bg-transparent text-gray-500 focus:outline-none flex-1"
                  placeholder=""
                  unstyled={true}
                  value={referralLink}
                  disabled={true}
                />
                <button
                  className="cursor-pointer flex-shrink-0 ml-2"
                  onClick={handleCopy}
                  style={{ width: "58px", height: "46px" }}
                >
                  <svg
                    width="58"
                    height="46"
                    viewBox="0 0 58 46"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="58" height="46" rx="10" fill="#32A7EF" />
                    <path
                      d="M25.2192 30.5339C24.8995 30.8323 24.6521 31.0321 24.3993 31.1781C23.1617 31.8926 21.6369 31.8926 20.3993 31.1781C19.9432 30.9147 19.5048 30.4763 18.6281 29.5997C17.7513 28.7229 17.3129 28.2845 17.0496 27.8283C16.335 26.5907 16.335 25.0659 17.0496 23.8283C17.3129 23.3723 17.7513 22.9339 18.6281 22.0571L22.3993 18.2859C23.2761 17.4091 23.7145 16.9707 24.1705 16.7074C25.4081 15.9929 26.9329 15.9929 28.1705 16.7074C28.6265 16.9707 29.0649 17.4091 29.9417 18.2859C30.8185 19.1627 31.2569 19.6011 31.5203 20.0571C32.2348 21.2947 32.2348 22.8195 31.5203 24.0571C31.3743 24.3099 31.1745 24.5574 30.876 24.877M27.1219 21.1229C26.8233 21.4425 26.6236 21.6899 26.4776 21.9427C25.7631 23.1803 25.7631 24.7051 26.4776 25.9427C26.7409 26.3989 27.1793 26.8373 28.0561 27.7139C28.9329 28.5907 29.3713 29.0291 29.8273 29.2925C31.0649 30.007 32.5897 30.007 33.8273 29.2925C34.2835 29.0291 34.7219 28.5907 35.5987 27.7139L39.3699 23.9427C40.2467 23.0659 40.6851 22.6275 40.9483 22.1715C41.6628 20.9339 41.6628 19.4091 40.9483 18.1715C40.6851 17.7155 40.2467 17.2771 39.3699 16.4003C38.4931 15.5235 38.0547 15.0851 37.5987 14.8218C36.3609 14.1073 34.8363 14.1073 33.5987 14.8218C33.3457 14.9678 33.0984 15.1675 32.7787 15.466"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Invite your friend */}
            <div className="">
              <h1 className="text-[#1A202C] text-[18px] font-semibold mb-2">
                {t("referrals.invite.title")}
              </h1>
              <p className="text-gray-500 text-sm mb-4">
                {t("referrals.inviteDescription")}
              </p>

              <div
                className="w-full rounded-[10px] h-[64px] flex flex-row items-center justify-between p-3"
                style={{ backgroundColor: "#E7F5FD" }}
              >
                <div className="flex items-center gap-3 flex-1">
                  <FaEnvelope className="text-gray-500" size={20} />
                  <InputField
                    type="text"
                    className="bg-transparent focus:outline-none flex-1"
                    placeholder="Enter Your Email"
                    unstyled={true}
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                </div>
                <button
                  className="cursor-pointer flex-shrink-0 ml-2"
                  onClick={() => {
                    // Handle send invitation
                    message.success("Invitation sent!");
                  }}
                  style={{ width: "123px", height: "64px" }}
                >
                  <svg
                    width="123"
                    height="64"
                    viewBox="0 0 123 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 0H113.997C118.969 0 123 4.03085 123 9.00315V54.9969C123 59.9692 118.969 64 113.997 64H0V0Z"
                      fill="url(#paint0_linear_send_btn)"
                    />
                    <path
                      d="M78.3188 15.4906C77.4479 14.6006 76.1591 14.2714 74.9573 14.6198L46.9337 22.7168C45.6658 23.0687 44.767 24.0736 44.525 25.3485C44.2776 26.6478 45.1415 28.2989 46.2701 28.9886L55.0325 34.3391C55.9312 34.8894 57.0912 34.7518 57.8349 34.0064L67.8687 23.9726C68.3738 23.4483 69.2098 23.4483 69.7149 23.9726C70.22 24.4759 70.22 25.2963 69.7149 25.8188L59.6636 35.8526C58.9182 36.598 58.7789 37.7545 59.3275 38.655L64.6814 47.4504C65.3084 48.4937 66.3883 49.0876 67.5726 49.0876C67.7119 49.0876 67.8687 49.0876 68.008 49.0685C69.3665 48.896 70.4464 47.9712 70.847 46.6649L79.1548 18.8521C79.5205 17.6677 79.1896 16.3789 78.3188 15.4906Z"
                      fill="white"
                    />
                    <path
                      opacity="0.4"
                      d="M57.4613 44.3394C57.9699 44.8497 57.9699 45.677 57.4613 46.1873L55.0822 48.5647C54.8279 48.8207 54.4935 48.9479 54.1591 48.9479C53.8247 48.9479 53.4903 48.8207 53.236 48.5647C52.7257 48.0544 52.7257 47.2288 53.236 46.7185L55.6134 44.3394C56.1237 43.8308 56.951 43.8308 57.4613 44.3394ZM56.0964 37.7419C56.6049 38.2522 56.6049 39.0795 56.0964 39.5898L53.7172 41.9672C53.4629 42.2232 53.1285 42.3504 52.7941 42.3504C52.4597 42.3504 52.1253 42.2232 51.871 41.9672C51.3607 41.4569 51.3607 40.6313 51.871 40.121L54.2484 37.7419C54.7587 37.2333 55.586 37.2333 56.0964 37.7419ZM49.5455 35.6651C50.0541 36.1754 50.0541 37.0027 49.5455 37.513L47.1664 39.8904C46.9121 40.1465 46.5777 40.2736 46.2433 40.2736C45.9089 40.2736 45.5745 40.1465 45.3202 39.8904C44.8099 39.3801 44.8099 38.5546 45.3202 38.0443L47.6976 35.6651C48.2079 35.1565 49.0352 35.1565 49.5455 35.6651Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_send_btn"
                        x1="-2.04107e-07"
                        y1="32"
                        x2="208.465"
                        y2="-34.7939"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#32A5EF" />
                        <stop offset="1" stopColor="white" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div
            className="flex flex-col gap-6"
            style={{ minWidth: "350px", maxWidth: "450px", marginLeft: "auto" }}
          >
            <div
              className="bg-white rounded-[10px] shadow-sm p-6"
              style={{ borderTop: "3px solid #32A7EF", height: "273px" }}
            >
              <h1 className="text-[#1A202C] text-[18px] font-semibold mb-4">
                {t("referrals.contactInfo")}
              </h1>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-[#338572]" size={20} />
                  <span className="text-gray-600">Hello@Eweewee.Com</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-[#338572]" size={20} />
                  <span className="text-gray-600">+91 91813 23 2309</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#338572]" size={20} />
                  <span className="text-gray-600">{t("referrals.address")}</span>
                </div>
              </div>

              {/* Social Media Buttons */}
              <div className="flex flex-row items-center gap-4">
                <button
                  className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E7F5FD" }}
                >
                  <FaWhatsapp size={24} className="text-[#338572]" />
                </button>
                <button
                  className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E7F5FD" }}
                >
                  <FaFacebook size={24} className="text-[#338572]" />
                </button>
                <button
                  className="w-[50px] h-[50px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#E7F5FD" }}
                >
                  <FaTwitter size={24} className="text-[#338572]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsContent;
