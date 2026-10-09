"use client";

import { usePathname } from "next/navigation";
import Layouts from "@/components/layouts/Layouts";
import { useFooterVisibility } from "@/lib/store/useFooterVisibility";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const AUTH_PATHS = [
  "/login",
  "/register",
  "/verify",
  "/verification-code",
  "/forget-password",
  "/reset-password",
  "/login-success",
];

const CATEGORY_PATHS = ["/category"];
const CHAT_PATHS = ["/chat"];

const isCategoryPage = (pathname: string): boolean => {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");

  return CATEGORY_PATHS.some((path) => {
    return (
      pathWithoutLocale === path ||
      pathWithoutLocale.startsWith(`${path}/`)
    );
  });
};

const isAuthPage = (pathname: string): boolean => {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  
  return AUTH_PATHS.some((authPath) => {
    return pathWithoutLocale === authPath || pathWithoutLocale.startsWith(`${authPath}/`);
  });
};

const isChatPage = (pathname: string): boolean => {
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
  return CHAT_PATHS.some((path) => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`));
};

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isVisible: isFooterVisible } = useFooterVisibility();
  const shouldHideHeaderFooter = isAuthPage(pathname || "");

  return (
    <Layouts 
      header={!shouldHideHeaderFooter} 
      footer={isFooterVisible && !shouldHideHeaderFooter && !isChatPage(pathname || "")}
       padding={!shouldHideHeaderFooter && !isCategoryPage && !isChatPage(pathname || "")}
      paddingTop={!shouldHideHeaderFooter}
    >
      {children}
    </Layouts>
  );
}

