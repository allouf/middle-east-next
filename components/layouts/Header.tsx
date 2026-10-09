'use client';

import Button from "@/components/ui/Button";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n/useTranslation";
import LangSwitcher from "@/components/shared/LangSwithcer";
import { headerAuthData } from "@/shared/constants/data";
import NavbarMenu from "@/components/shared/NavbarMenu";
import InputSearch from "@/components/ui/InputSearch";
import CurrentLang from "@/components/shared/CurrentLang";
import CartIcon from "@/components/shared/CartIcon";
import { useAuth } from "@/lib/context/AuthContext";
import { usePathname } from "next/navigation";
import { extractLocaleFromPathname, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loadingAuth } = useAuth();

  const pathname = usePathname();
  const currentLocale = extractLocaleFromPathname(pathname) || DEFAULT_LOCALE;

  return (
    <header className="w-full bg-blueSite flex justify-between items-center md:px-8 px-4 py-2 text-textWhiteColor h-[90px] sm:gap-5 gap-3 z-[999]">
      <div className="flex items-center gap-2 ">
        <Button
          unstyled
          to={`/${currentLocale}`}
          ariaLabel={t("header.home_aria")}
        >
          <Image
            src="/logo.svg"
            alt={t("header.logoAlt")}
            width={170}
            height={53}
            priority
            className="w-[100px] sm:w-[140px] md:w-[170px] h-auto mx-2"
          />
        </Button>
      </div>

      <CurrentLang />

      <InputSearch />

      <div className="flex items-center lg:gap-3 gap-1">
        {!loadingAuth && !isAuthenticated &&
          headerAuthData.map((item, index) => (
            <Button
              key={index}
              to={item.path}
              className={`text-textWhiteColor min-w-[80px] transition-colors ${item.isSmall ? 'hidden sm:flex' : ''}`}
              unstyled
            >
              {t(item.name) || item.name}
            </Button>
          ))}

        <div className="flex items-center lg:gap-3 gap-1 text-textWhiteColor  px-2 lg:px-4 py-2 rounded-md ">
          {/* {(
            <a
              href={`https://middleeastcommerce.net/${currentLocale}/links`}
              target="_blank"
              rel="noopener noreferrer"
              className="sm:p-2 p-1 rounded-md transition"
              aria-label={t("header.quick_links")}
              title={t("header.quick_links")}
            >
              <PiLinkSimpleBold className="w-5 h-5 text-textWhiteColor" />
            </a>
          )} */}
          <LangSwitcher />

          {!loadingAuth && isAuthenticated && (
            <>
              {/* <Button
                unstyled
                className="sm:p-2 p-1 rounded-md transition"
                ariaLabel={t("header.orders")}
                title={t("header.orders")}
              >
                <BsBox className="w-5 h-5 text-textWhiteColor" />
              </Button> */}

              <CartIcon />
            </>
          )}
        </div>

        <NavbarMenu />
      </div>
    </header>
  );
};
