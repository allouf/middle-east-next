"use client";

import React, { useState } from "react";
import PortfolioCard, { PortfolioProject } from "./PortfolioCard";
import { ServiceProject } from "../../../types/type";
import { ArrowLeft, Search, LayoutGrid, List, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Select, Segmented, Input } from "antd";
import "./PortfolioTab.css"
import ProjectViewModal, { ProjectDetails } from "../modals/ProjectViewModal";
import PortfolioProjectsTable from "./PortfolioProjectsTable";
import useGetData from "@/lib/api/useGetData";
import { SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";


interface PortfolioTabProps {
  onTabChange?: (key: string) => void;
  id:number;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({ onTabChange, id }) => {
  const { t } = useTranslation();
  const {isRTL} = useLocaleDirection();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const {data:categoriesData,loading:categoriesLoading,error:categoriesError} = useGetData({url:SERVICES_PUBLIC_ENDPOINTS.getAllCategories})

  // Add filters to extraParams
  const extraParams = {
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    date_range: selectedDate !== "all" ? selectedDate : undefined,
    page: currentPage,
  }; 

  const { data, loading, error } = useGetData({
    url: SERVICES_PUBLIC_ENDPOINTS.getServiceProjects(id),
    extraParams
  });

  // Extract the actual projects array and meta data from the data response
  const apiProjects: ServiceProject[] = data?.data?.projects || [];
  const meta = data?.data?.meta;



  console.log("projects",apiProjects)

  // Map ServiceProject from API to match ProjectDetails interface used internally
  const mappedProjects: ProjectDetails[] = apiProjects.map((p) => ({
    id: p.id.toString(),
    title: p.title,
    description: p.description,
    longDescription: p.description,
    imageUrl: p.images?.[0] || "https://images.unsplash.com/photo-1512758117926-7ba1b332b8aa?q=80&w=2070&auto=format&fit=crop",
    link: p.url,
    categories: p.categories || [],
    galleryUrls: p.images || [],
  }));


  console.log(
    "Projects",
    mappedProjects,
    "Meta",
    meta
  )

  // console.log("fetched categories ",categoriesData)
  // Remove dummy data fallback and show empty state if API returns no projects.
  const dataToUse = mappedProjects;

  // We can also let the API do the filtering and just render what comes back, but we keep this client filter too
  const filteredProjects = dataToUse.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.categories.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Pagination calculations
  const perPage = meta?.per_page || 15;
  const total = meta?.total || 0;
  const lastPage = meta?.last_page || 1;
  const startCount = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endCount = Math.min(currentPage * perPage, total);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < lastPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="animate-in fade-in duration-500 container max-sm:px-4 2xl:max-w-[1440px] mx-auto w-full py-8 font-inter">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => onTabChange?.("1")}
            className="flex items-center gap-2 text-[20px] font-somar-semibold text-blueSite hover:text-blueSiteHover transition-colors uppercase tracking-wider w-fit"
          >
           {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {t("services.details.goBack", { defaultValue: "GO BACK" })}
          </button>
          
          <div>
            <h2 className="text-[35px] font-extrabold text-black mb-2">
              {t("services.details.portfolioTabHeader", { defaultValue: "Portfolio Projects" })}
            </h2>
            <p className="text-gray-500">
              {t("services.details.portfolioTabSubheader", { defaultValue: "Show projects related to this service ." })}
            </p>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col flex-1 max-w-2xl gap-4 md:items-end">
          {/* Search */}
          <div className="w-full">
            <Input
              placeholder={t("services.details.searchPortfolioPlaceholder", { defaultValue: "Search projects by name, client, or keyword..." })}
              prefix={<Search size={18} className="text-gray-400 mr-1" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="w-full h-[48px] !border-0 rounded-[12px] bg-white focus:ring-blueSite transition-all shadow-[0px_1px_2px_0px_#0000000D]"
              allowClear
            />
          </div>

          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            {/* Filter Dropdowns */}
            <div className="flex gap-4">

              <Select
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                style={{ width: 180 }}
                placeholder={t("services.details.categoryFilter", { defaultValue: "Category" })}
                className="portfolio-select"
                loading={categoriesLoading}
                options={[
                  { value: 'all', label: t("services.details.categoryAll", { defaultValue: "Category: All" }) },
                  ...(categoriesData?.data || []).map((cat: any) => ({
                    value: cat.id.toString(),
                    label: cat.name
                  }))
                ]}
              />
              
              <Select
                value={selectedDate}
                onChange={(val) => {
                  setSelectedDate(val);
                  setCurrentPage(1); // Reset to page 1 on filter change
                }}
                style={{ width: 160 }}
                placeholder={t("services.details.dateFilter", { defaultValue: "Date" })}
                className="portfolio-select"
                options={[
                  { value: 'all', label: t("services.details.dateAllTime", { defaultValue: "Date: All Time" }) },
                  { value: 'this_year', label: t("services.details.dateThisYear", { defaultValue: "Date: This Year" }) },
                  { value: 'last_30_days', label: t("services.details.dateLast30Days", { defaultValue: "Date: Last 30 Days" }) },
                  { value: 'last_90_days', label: t("services.details.dateLast90Days", { defaultValue: "Date: Last 90 Days" }) },
                ]}
              />
            </div>

            {/* View Toggle */}
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as "grid" | "table")}
              options={[
                {
                  label: (
                    <div className="flex items-center gap-2 px-1">
                       <LayoutGrid size={16} />
                      <span>{t("services.details.gridView", { defaultValue: "Grid" })}</span>
                    </div>
                  ),
                  value: 'grid',
                },
                {
                  label: (
                    <div className="flex items-center gap-2 px-1">
                      <List size={16} />
                      <span>{t("services.details.tableView", { defaultValue: "Table" })}</span>
                    </div>
                  ),
                  value: 'table',
                },
              ]}
              className="bg-gray-100 p-1 rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Content — Grid or Table based on viewMode */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">
          {t("services.details.loadingProjects", { defaultValue: "Loading projects..." })}
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 border border-red-200 bg-red-50 rounded-lg">
          {t("services.details.failedToLoadProjects", { defaultValue: "Failed to load projects." })}
        </div>
      ) : viewMode === "table" ? (
        <PortfolioProjectsTable
          data={dataToUse}
          loading={loading}
          error={!!error}
          meta={meta}
          onPageChange={(page) => setCurrentPage(page)}
          onView={(project) => setSelectedProject(project)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {dataToUse.map((project) => (
              <PortfolioCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)}
              />
            ))}
            {dataToUse.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                {searchQuery 
                  ? t("services.details.noProjectsMatchingCriteria", { defaultValue: "No projects found matching your criteria." }) 
                  : t("services.details.noProjectsAvailablePortfolio", { defaultValue: "No projects available for this service." })}
              </div>
            )}
          </div>

          {/* Pagination Footer — Grid only (table has its own) */}
          {total > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className="text-sm font-medium text-blueSite">
                {t("services.details.paginationCount", { 
                  start: startCount, 
                  end: endCount, 
                  total: total, 
                  defaultValue: `${startCount} - ${endCount} of ${total}` 
                })}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === 1 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-blueSite text-white hover:bg-teal-800"
                  }`}
                >
                  {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage >= lastPage}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    currentPage >= lastPage 
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                      : "bg-blueSite text-white hover:bg-teal-800"
                  }`}
                >
                  {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          )}
        </>
      )}



      <ProjectViewModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </div>
  );
};

export default PortfolioTab;

