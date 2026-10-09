import React, { useState } from "react";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

import useGetData from "@/lib/api/useGetData";
import { getInvintLink } from "@/shared/constants/urls";
import { t } from "i18next";

const ReferralComponent = () => {
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    data: resData,
    loading,
    refetch,
  } = useGetData({
    url: getInvintLink,
  });

  const referralLink = resData?.data?.link;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold">{t("referrals.title")}</h2>
        <p className="text-textColor">{t("referrals.subtitle")}</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row justify-around items-center text-center gap-6">
        <div>
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blueSiteHover text-xl">
            💬
          </div>
          <h4 className="font-semibold">{t("referrals.step1.title")}</h4>
          <p className="text-sm text-textColor">{t("referrals.step1.desc")}</p>
        </div>
        <div>
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blueSiteHover text-xl">
            🧾
          </div>
          <h4 className="font-semibold">{t("referrals.step2.title")}</h4>
          <p className="text-sm text-textColor">{t("referrals.step2.desc")}</p>
        </div>
        <div>
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center text-blueSiteHover text-xl">
            🔄
          </div>
          <h4 className="font-semibold">{t("referrals.step3.title")}</h4>
          <p className="text-sm text-textColor">{t("referrals.step3.desc")}</p>
        </div>
      </div>

      {/* Email Invite */}
      {/* <div>
        <h4 className="font-semibold mb-2">{t("referrals.invite.title")}</h4>
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-gray-50">
          <input
            type="email"
            placeholder={t("referrals.invite.placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow bg-transparent outline-none text-sm"
          />
          <button className="text-blueSiteHover">
            <FaTelegramPlane size={20} />
          </button>
        </div>
      </div> */}

      {/* Referral Link Sharing */}
      <div>
        <h4 className="font-semibold mb-2">{t("referrals.share.title")}</h4>
        <div className="flex flex-col sm:flex-row sm:items-center bg-[#E6F0ED] rounded-xl px-4 py-4 space-y-3 sm:space-y-0 sm:space-x-4">
          {/* Link */}
          <div className="flex-1 text-sm text-blue-800 break-words bg-white px-4 py-2 rounded-md shadow-inner">
            {referralLink}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="bg-blueSiteHover text-textWhiteColor px-4 py-2 rounded-full text-sm hover:bg-blueSiteHover transition"
          >
            {copied ? t("referrals.share.copied") : t("referrals.share.copy")}
          </button>

          {/* Share Icons */}
          <div className="flex space-x-2 text-textWhiteColor">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              title={t("referrals.share.whatsapp")}
              className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition m-2"
            >
              <FaWhatsapp />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                referralLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title={t("referrals.share.facebook")}
              className="bg-blueSiteHover hover:bg-blueSiteHover p-2 rounded-full transition m-2"
            >
              <FaFacebook />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                referralLink
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              title={t("referrals.share.twitter")}
              className="bg-sky-400 hover:bg-sky-500 p-2 rounded-full transition m-2"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralComponent;
