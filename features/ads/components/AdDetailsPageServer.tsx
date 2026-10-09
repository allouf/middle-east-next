import React from "react";
import AdDetails from "./AdDetails";
import { Ad } from "../types/type";
import { notFound } from "next/navigation";
import { fetchAdDetails } from "../api/getAdById";
import { fetchSimilarAds } from "../api/getSimilarAds";

interface AdDetailsPageServerProps {
  adId: string;
  locale?: string;
}

const AdDetailsPageServer: React.FC<AdDetailsPageServerProps> = async ({ adId, locale = "en" }) => {
  // Fetch ad details from API
  const adIdNum = parseInt(adId);
  if (isNaN(adIdNum)) {
    return notFound();
  }

  const adData = await fetchAdDetails("", adIdNum, locale);
  const similarAds = await fetchSimilarAds(adIdNum,"",locale);

  if (!adData) {
    return notFound();
  }

  // Use dummy ads for similar ads (this could be replaced with API call later)
  // const similarAds = dummyAds.filter((a) => a.id !== adData?.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      <AdDetails ad={adData as Ad} similarAds={similarAds} />
    </div>
  );
};

export default AdDetailsPageServer;
