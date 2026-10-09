import HighlightCardsClient from "./HighlightCards.client";
import { fetchHighlightCards } from "../api/highlightCards";
import { HighlightCard } from "../type";
import { getT } from "@/lib/i18n/server";
import { TFunction } from "i18next";

function mapHighlightCards(banners :HighlightCard[], t: TFunction) {
  return banners.map((item, index) => {
    const isDark = index % 2 === 1;
    return {
      id: index + 1,
      tag: t("highlightCards.tag"),
      title: item.title || "",
      description: item.description || "",
      image: item.image || null,
      bg: isDark ? "bg-[#2D2D2D]" : "bg-[#E6F0ED]",
      textColor: isDark ? "text-textWhiteColor" : "text-subTitleColor",
      tagBg: isDark ? "bg-gray-500 text-textWhiteColor" : "bg-blueSite text-textWhiteColor",
      btnBg: isDark
        ? "bg-gray-500 text-textWhiteColor hover:bg-gray-600"
        : "bg-blueSite text-textWhiteColor hover:bg-blueSiteHover",
      reverse: isDark,
    };
  });

};

export default async function HighlightCards({ locale }: { locale: string }) {
  const t = await getT(locale);
  const data = await fetchHighlightCards(locale);

  if (!data) {
    return null;
  }

  return <HighlightCardsClient banners={mapHighlightCards(data, t)} />
};
