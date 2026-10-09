"use client"
import React, { useState } from 'react'
import { FaFacebook, FaInstagram, FaEnvelope, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { FaInternetExplorer } from 'react-icons/fa';
import Button from '../../../components/ui/Button';
import { MdOpenInNew } from 'react-icons/md';
import { SocialLinks } from '../types/type';
import { FaX } from "react-icons/fa6";
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';


interface StoreDescriptionProps {
  descriptionText: string;
  storePhones: string[];
  storeEmails: string[];
  socialLinks: SocialLinks;
  storeWebsite?: string;
  storeId: string

}

const StoreDescription = ({
  descriptionText,
  storePhones,
  storeEmails,
  socialLinks,
  storeWebsite,
  storeId

}: StoreDescriptionProps) => {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const searchParamsHook = useSearchParams();
  const { t } = useTranslation()

  const openStoreDetails = searchParamsHook.get("Details") === "true";
  const isLongDescription = descriptionText.length > 500;

  const toggleDetails = () => {
    const currentDetails = searchParamsHook.get("Details");
    console.log("paramsj", currentDetails)
    if (currentDetails === "true") {
      router.push(`/stores/${storeId}/info?Details=false`, {
        scroll: false,
      });
    } else {
      router.push(`/stores/${storeId}/info?Details=true`, {
        scroll: false,
      });
    }
  };

  return (
    <div className="mt-6 bg-grayLight p-4 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Description */}
        <div className="md:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold text-blueBtn mb-3">
            {t("store.description")}
          </h3>
          <p className="text-subTitleColor leading-relaxed text-sm">
            {showMore || !isLongDescription
              ? descriptionText
              : `${descriptionText.slice(0, 500)}...`}
          </p>
          {isLongDescription && (
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-2 text-sm font-medium text-blueSiteHover hover:underline"
            >
              {showMore ? t("store.seeLess") : t("store.seeMore")}
            </button>
          )}
        </div>
        {/* Contact Methods */}
        <div className="">
          <h4 className="text-lg font-semibold text-blueBtn mb-3">
            {t("store.contactMethods")}
          </h4>
          {/* Phone */}
          <div className="text-sm text-subTitleColor mb-2">
            <span className="font-medium">{t("store.phoneNumber")}:</span>{" "}
            {storePhones.length > 0 ? storePhones.join(", ") : t("store.noPhoneNumber")}
          </div>
          {/* Email */}
          <div className="text-sm text-subTitleColor mb-4">
            <span className="font-medium">{t("store.email")}:</span>{" "}
            {storeEmails.length > 0 ? storeEmails.join(", ") : t("store.noEmail")}
          </div>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {(Array.isArray(socialLinks) ? socialLinks : []).map((raw, index) => {
              // ✅ Normalize any possible shape into a string
              const linkStr =
                typeof raw === "string"
                  ? raw
                  : raw && typeof raw === "object"
                    ? // try common keys if backend sends objects
                    (typeof (raw as any).url === "string" && (raw as any).url) ||
                    (typeof (raw as any).link === "string" && (raw as any).link) ||
                    (typeof (raw as any).value === "string" && (raw as any).value) ||
                    ""
                    : "";

              if (!linkStr) return null;

              // ✅ Split only if it is the "platform:url" format
              const hasPlatformPrefix =
                linkStr.includes(":") &&
                !linkStr.startsWith("http://") &&
                !linkStr.startsWith("https://") &&
                !linkStr.startsWith("mailto:") &&
                !linkStr.startsWith("tel:");

              const [platformRaw, rest] = hasPlatformPrefix ? linkStr.split(/:(.+)/) : ["", linkStr];
              const platform = (platformRaw || linkStr).toLowerCase();

              // ✅ Build actual URL safely
              let actualUrl = rest || linkStr;

              // if it's email without mailto
              if (platform.includes("mail") && !actualUrl.startsWith("mailto:")) {
                actualUrl = `mailto:${actualUrl}`;
              }

              // if it's phone
              if ((platform.includes("tel") || platform.includes("phone")) && !actualUrl.startsWith("tel:")) {
                actualUrl = `tel:${actualUrl}`;
              }

              // if it's a normal website without protocol
              const looksLikeWeb =
                !actualUrl.startsWith("http://") &&
                !actualUrl.startsWith("https://") &&
                !actualUrl.startsWith("mailto:") &&
                !actualUrl.startsWith("tel:") &&
                actualUrl.includes(".");
              if (looksLikeWeb) actualUrl = `https://${actualUrl}`;

              // ✅ Icon resolver
              const getSocialIcon = (p: string) => {
                if (p.includes("facebook") || p.includes("fb")) return <FaFacebook className="text-blueIcons" />;
                if (p.includes("instagram") || p.includes("ig")) return <FaInstagram className="text-blueIcons" />;
                if (p.includes("twitter") || p === "x" || p.includes(" x ")) return <FaX className="text-blueIcons" />;
                if (p.includes("linkedin")) return <FaLinkedin className="text-blueIcons" />;
                if (p.includes("youtube")) return <FaYoutube className="text-blueIcons" />;
                if (p.includes("mailto") || p.includes("mail")) return <FaEnvelope className="text-blueIcons" />;
                return <FaInternetExplorer className="text-blueIcons" />;
              };

              return (
                <a
                  key={index}
                  href={actualUrl}
                  target={actualUrl.startsWith("mailto:") || actualUrl.startsWith("tel:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  aria-label={`social-link-${index}`}
                >
                  {getSocialIcon(platform)}
                </a>
              );
            })}

            {storeWebsite && (
              <a
                href={storeWebsite.startsWith("http") ? storeWebsite : `https://${storeWebsite}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                aria-label="website"
              >
                <FaInternetExplorer className="text-blueIcons" />
              </a>
            )}
          </div>

          {/* Actions */}
        </div>
        <div className="flex flex-col gap-2 justify-between">
          {!openStoreDetails && (
            <Button
              unstyled
              className="w-full flex flex-row gap-1 items-center py-2 rounded-md underline underline-offset-4  text-blueSiteHover cursor-pointer text-lg font-medium "
              onClick={() => toggleDetails()}
            >
              <MdOpenInNew className="" /> {t("store.openStoreDetails")}
            </Button>
          )}
          {/* <Button
            unstyled
            className="w-full flex flex-row gap-1 items-center justify-center py-2 rounded-md bg-blueBtn text-textWhiteColor text-lg font-medium  "
          >
            <MdOpenInNew className="" /> {t("store.openSupportTicket")}
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default StoreDescription