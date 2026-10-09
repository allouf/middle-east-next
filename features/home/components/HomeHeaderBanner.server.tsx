import { fetchHomeBanner } from "../api/homeBanner";
import { storageURL } from "@/shared/constants/data";
import { BannerItem, BottomSlide, FeaturedMiniItem, HomeCarouselItem, HomeSlide, MiniSlide } from "../type";
import HomeHeaderBannerClient from "./HomeHeaderBanner.client";
import { getT } from "@/lib/i18n/server";
import { TFunction } from "i18next";

const buildImageUrl = (image?: string | null): string | null => {
  if (!image) return null;
  if (image.startsWith("data:")) return image;
  const httpsImage = image.replace(/^http:\/\//i, "https://");
  if (httpsImage.startsWith("https://")) return httpsImage;
  const sanitized = image.startsWith("/") ? image.slice(1) : image;
  return `${storageURL}/${sanitized}`;
};

const formatPrice = (value: number | undefined | null, currencySymbol: string) => {
  const safeValue = typeof value === "number" ? value : 0;
  return `${currencySymbol}${safeValue.toFixed(2)}`;
};

const resolveCurrencySymbol = (t: TFunction) => {
  const currency = t("currency");
  return currency && currency !== "currency" ? currency : "$";
};

function mapMainSlides(data: HomeCarouselItem[], currencySymbol: string): HomeSlide[] {
  const backgrounds = ["bg-[#FAFAFA]", "bg-gray-50"];

  return data.map((item, index) => ({
    id: item.id,
    title: item.title ?? "",
    description: item.subtitle ?? "",
    price: formatPrice(item.price, currencySymbol),
    image: buildImageUrl(item.image),
    bg: backgrounds[index % backgrounds.length],
    link: item.link ?? null,
  }));
}

function mapMiniSlides(data: FeaturedMiniItem[], t: TFunction): MiniSlide[] {
  return data.map((item, index) => ({
    id: item.id ?? index,
    title: item.name ?? "",
    tag:
      typeof item.discount === "number" && item.discount > 0
        ? t("topOffers.off", { value: item.discount })
        : t("search.featured"),
    btn: t("product.shopNow"),
    image: buildImageUrl(item.image),
    bg: "bg-[#323232]",
    textColor: "text-textWhiteColor",
  }));
}

function mapBottomSlides(data: BannerItem[], t: TFunction): BottomSlide[] {
  return data.map((item, index) => ({
    id: item.id ?? index,
    title: item.title ?? "",
    tag: t("topOffers.off", { value: 25 }),
    image: buildImageUrl(item.image),
    link: item.link ?? null,
  }));
}


export default async function HomeHeaderBanner({ locale }: { locale: string }) {
  const t = await getT(locale);
  const currencySymbol = resolveCurrencySymbol(t);

  const { carousel, featured, banners } = await fetchHomeBanner(locale);
  return (<HomeHeaderBannerClient
    slides={mapMainSlides(carousel ?? [], currencySymbol)}
    topSlides={mapMiniSlides(featured ?? [], t)}
    bottomSlides={mapBottomSlides(banners ?? [], t)}
  />)
};
