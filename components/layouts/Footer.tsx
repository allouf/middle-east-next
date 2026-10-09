'use client';

import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaFacebook,
} from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

import DownloadButtons from "@/components/shered/DownloadButtons";
import {
  ABOUT_MIDDLE_EAST_LINKS,
  LEGAL_NOTICES_LINKS,
  PROFESSIONAL_SECTION_LINKS,
} from "@/shared/constants/data";

const CONTACT_PHONE_FALLBACK = "+966 50 000 000";
const CONTACT_EMAIL_FALLBACK = "info@middleeastcommerce.net";

const Footer = () => {
  const { t } = useTranslation();
  const socialLinks = [
    {
      key: "instagram",
      defaultLabel: "Instagram",
      href: "https://www.instagram.com",
      Icon: FaInstagram,
    },
    {
      key: "youtube",
      defaultLabel: "YouTube",
      href: "https://www.youtube.com",
      Icon: FaYoutube,
    },
    {
      key: "facebook",
      defaultLabel: "Facebook",
      href: "https://www.facebook.com",
      Icon: FaFacebook,
    },
    {
      key: "website",
      defaultLabel: "Website",
      href: "https://middleeastcommerce.net",
      Icon: BiWorld,
    },
  ];

  const resolvedSocialLinks = socialLinks.map(({ key, defaultLabel, ...rest }) => ({
    key,
    label: t(`footer.socialLinks.${key}`) || defaultLabel,
    ...rest,
  }));

  const contactPhone = t("footer.phone_value") || CONTACT_PHONE_FALLBACK;
  const contactEmail = CONTACT_EMAIL_FALLBACK;

  const contactItems = [
    // {
    //   key: "phone",
    //   label: t("footer.phone"),
    //   value: contactPhone,
    // },
    {
      key: "email",
      label: t("footer.email"),
      value: contactEmail,
    },
  ];

  return (
    <footer id="site-footer" className="relative bg-darkbg text-textWhiteColor text-sm px-4 sm:px-6 pt-16 pb-8 z-10">

      <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 max-lg:gap-5 mb-20 ">
        <div className="flex justify-center ">
          <div>
            <h2 className="text-md font-bold mb-3">
              {t("footer.about")}
            </h2>
            <ul className="flex flex-col gap-2">
              {ABOUT_MIDDLE_EAST_LINKS.map((link, index) => (
                <li
                  key={index}
                  className="text-[#D9D9D9] text-[13px] hover:text-textWhiteColor"
                >
                  {link.path ? (
                    <Link href={link.path}>
                      {t(`footer.links.${link.key}`) || link.label}
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed opacity-60">
                      {t(`footer.links.${link.key}`) || link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <div>
            <h2 className="text-md font-bold mb-3">
              {t("footer.professional")}
            </h2>
            <ul className="flex flex-col gap-2">
              {PROFESSIONAL_SECTION_LINKS.map((link, index) => (
                <li
                  key={index}
                  className="text-[#D9D9D9] text-[13px] hover:text-textWhiteColor"
                >
                  {link.path ? (
                    <Link href={link.path}>
                      {t(`footer.links.${link.key}`) || link.label}
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed opacity-60">
                      {t(`footer.links.${link.key}`) || link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-start md:justify-center  px-2">
          <div>
            <h2 className="text-md font-bold mb-3">
              {t("footer.legal")}
            </h2>
            <ul className="flex flex-col gap-2">
              {LEGAL_NOTICES_LINKS.map((link, index) => (
                <li
                  key={index}
                  className="!text-[#D9D9D9] text-[13px] hover:text-textWhiteColor"
                >
                  {link.path ? (
                    <Link href={link.path}>
                      {t(`footer.links.${link.key}`) || link.label}
                    </Link>
                  ) : (
                    <span className="cursor-not-allowed opacity-60">
                      {t(`footer.links.${link.key}`) || link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* <div className="flex justify-center col-span-1 sm:col-span-2 lg:col-span-1">
          <div>
            <h2 className="text-md font-bold mb-3">
              {t("footer.contact")}
            </h2>
            <ul className="flex flex-col gap-2 text-[#D9D9D9] text-[13px] mb-3">
              {contactItems.map((item) => (
                <li key={item.key} suppressHydrationWarning>
                  {`${item.label} : ${item.value}`}
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <h2 className="text-md font-bold mb-3">
                {t("footer.social")}
              </h2>
              <ul className="grid sm:grid-cols-4 grid-cols-2 gap-2">
                {resolvedSocialLinks.map(({ Icon, label, href, key }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                    >
                      <div className="p-3 rounded-full border border-white bg-white/25 w-fit" role="presentation">
                        <Icon className="text-[18px]" aria-hidden="true" />
                        <span className="sr-only">{label}</span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div> */}

        {/* <div className="flex justify-center col-span-2 sm:col-span-1">
          <DownloadButtons />
        </div> */}
      </div>

      <div className="pt-4">
        <p className="text-center text-[14px] text-[#D9D9D9]">
          {"\u00A9"} {new Date().getFullYear()}{" "}
          {t("footer.rights")}
        </p>
        <p className="text-center text-[12px] text-[#8F8F8F]">
          {t("footer.beta")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

