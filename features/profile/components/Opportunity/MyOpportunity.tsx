'use client';
import useGetData from "@/lib/api/useGetData";
import OpportunityCard from "./OpportunityCard";
import LoaderPage from "@/components/shared/LoaderPage";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { myJobs } from "@/shared/constants/urls";
import useInfiniteData from "@/lib/Hooks/useInfiniteData";
import { perPage } from "@/shared/constants/data";

const MyOpportunity = () => {
  const { t } = useTranslation();
  const {
    items: jobs,
    loading,
    error,
    isFetching,
    observerRef,
    dataKey,
  } = useInfiniteData({
    getUrl: (page, perPage) => `${myJobs}?per_page=${perPage}&page=${page}`,
    initialPage: 1,
    targetKey: "jobs",
    perPage,
  });

  if (loading) return <LoaderPage />;
  if (error) return <p>{t("text.errorLoading")}</p>;

  return (
    <div className="p-4 space-y-4">
      {jobs.map((opportunity) => (
        <OpportunityCard key={opportunity.id} {...opportunity} />
      ))}

      {/* Loader */}
      {isFetching && <LoaderPage />}
      {!isFetching && <div ref={observerRef} className="h-10" />}
    </div>
  );
};

export default MyOpportunity;
