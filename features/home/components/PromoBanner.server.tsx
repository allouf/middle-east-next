import { fetchPromoBanner } from "../api/promoBanner";
import { PreOrderType } from "../type";
import PromoBannerClient from "./PromoBanner.client";

export default async function PromoBanner({ locale }: { locale: string }) {
  const data = await fetchPromoBanner(locale);

  if (!data)
    return null;

  const preOrderData: PreOrderType = data;
  return (
    <PromoBannerClient preOrderData={preOrderData} />
  );
}
