import AuctionCard from "./AuctionCard";
import LoaderPage from "@/components/shered/LoaderPage";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { myAuctions } from "@/shared/constants/urls";
import useInfiniteData from "@/lib/Hooks/useInfiniteData";
import { perPage } from "@/shared/constants/data";

const MyAuction = () => {
  const { t } = useTranslation();
  const {
    items: auctions,
    loading,
    error,
    isFetching,
    observerRef,
    dataKey,
  } = useInfiniteData({
    getUrl: (page, perPage) => `${myAuctions}?per_page=${perPage}&page=${page}`,
    initialPage: 1,
    targetKey: "auctions",
    perPage,
  });

  if (loading) return <LoaderPage />;
  if (error) return <p>{t("text.errorLoading")}</p>;

  return (
    <div className="p-4 space-y-4">
      {auctions.map((auction) => (
        <AuctionCard key={auction.id} {...auction} />
      ))}
      {isFetching && <LoaderPage />}
      {!isFetching && <div ref={observerRef} className="h-10" />}
    </div>
  );
};

export default MyAuction;
