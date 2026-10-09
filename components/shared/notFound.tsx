import React from "react";
// import { useRouter } from 'next/router';
import Button from "@/components/ui/Button";
import { t } from "i18next";
export default function NotFound() {
  // const router = useRouter();
  // const handleGoBack = () => {
  //   router.push("/en" as unknown as string);
  // };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-subTitleColor mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-subTitleColor mb-2">
        {t("text.notFoundTitle")}
      </h2>
      <p className="text-subTitleColor mb-6">{t("text.notFoundText")}</p>
      {/* <Button
        unstyled
        onClick={handleGoBack}
        className="inline-block px-6 py-2 text-textWhiteColor bg-blueBtn hover:bg-blueSiteHover transition rounded-lg shadow"
        to="/en"
      >
        {t("buttons.goBack")}
      </Button> */}
    </div>
  );
}
