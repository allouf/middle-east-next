"use client";

import React, { useState } from "react";

import { Search, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Select, Segmented, Input } from "antd";
import "../../details/tabs/PortfolioTab.css"
import ProjectViewModal, { ProjectDetails } from "../../details/modals/ProjectViewModal";
import PortfolioCard from "../../details/tabs/PortfolioCard";
import PortfolioProjectsTable from "../../details/tabs/PortfolioProjectsTable";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";
import useGetData from "@/lib/api/useGetData";
import { PUBLIC_PROVIDER_PROFILE, SERVICES_PUBLIC_ENDPOINTS } from "@/shared/constants/api-endpoints";

import { useTranslation } from "@/lib/i18n/useTranslation";

interface PortfolioTabProps {
  onTabChange?: (key: string) => void;
  profileId:number;
}

const ProfilePortfolioTab: React.FC<PortfolioTabProps> = ({ onTabChange ,profileId}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocaleDirection();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  const { data: categoriesData, loading: categoriesLoading } = useGetData({
    url: SERVICES_PUBLIC_ENDPOINTS.getAllCategories,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const {data ,loading,error} = useGetData({
    url:PUBLIC_PROVIDER_PROFILE.portfolio(profileId),
    paginate: true,
    extraParams: { 
      page: currentPage, 
      per_page: rowsPerPage, 
      search: activeSearchQuery || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      date_range: selectedDate !== "all" ? selectedDate : undefined,
    }
  })

  const rawProjects = data?.data?.projects || [];
  const meta = data?.data?.meta || { current_page: 1, last_page: 1, per_page: 12, total: 0 };

  const projects = rawProjects.map((item: any) => ({
    id: item.id.toString(),
    title: item.title,
    description: item.description,
    longDescription: item.description,
    imageUrl: item.images?.[0] || null,
    link: item.url,
    categories: [],
    galleryUrls: item.images || []
  })) as ProjectDetails[];

  // const filteredProjects = projects.filter(project => 
  //   project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
  //   project.description.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Loading and error states are handled inside the render now


  return (
    <div className="animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">


        {/* Filters and Controls */}
        <div className="flex flex-row justify-between flex-1 w-full gap-4 md:items-end">
          {/* Search */}
          <div className="max-w-xl w-full">
            <Input
              placeholder={t("services.details.searchPortfolioPlaceholder", { defaultValue: "Search projects by name, client, or keyword..." })}
              prefix={
                <button onClick={() => setActiveSearchQuery(searchQuery)} className="hover:text-blueSite transition-colors focus:outline-none flex items-center justify-center">
                  <Search size={18} className="text-gray-400 mr-1 cursor-pointer" />
                </button>
              }
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value) setActiveSearchQuery("");
              }}
              onPressEnter={() => setActiveSearchQuery(searchQuery)}
              className="w-full h-[48px] !border-0 rounded-[12px] bg-white focus:ring-blueSite transition-all shadow-[0px_1px_2px_0px_#0000000D]"
              allowClear
            />

          </div>

          <div className="flex flex-row flex-wrap items-center justify-between  gap-4">
            {/* Filter Dropdowns */}
            <div className="flex gap-4">
              <Select
                value={selectedCategory}
                onChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1); // Reset page on filter
                }}
                style={{ width: 180 }}
                placeholder={t("services.details.categoryFilter", { defaultValue: "Category" })}
                className="portfolio-select"
                loading={categoriesLoading}
                options={[
                  { value: 'all', label: t("services.details.categoryAll", { defaultValue: 'Category: All' }) },
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
                  setCurrentPage(1); // Reset page on filter
                }}
                style={{ width: 180 }}
                placeholder={t("services.details.dateFilter", { defaultValue: "Date" })}
                className="portfolio-select"
                options={[
                  { value: 'all', label: t("services.details.dateAllTime", { defaultValue: 'Date: All Time' }) },
                  { value: 'this_year', label: t("services.details.dateThisYear", { defaultValue: 'Date: This Year' }) },
                  { value: 'last_30_days', label: t("services.details.dateLast30Days", { defaultValue: 'Date: Last 30 Days' }) },
                  { value: 'last_90_days', label: t("services.details.dateLast90Days", { defaultValue: 'Date: Last 90 Days' }) },
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
                      <span>{t("services.details.gridView", { defaultValue: 'Grid' })}</span>
                    </div>
                  ),
                  value: 'grid',
                },
                {
                  label: (
                    <div className="flex items-center gap-2 px-1">
                      <List size={16} />
                      <span>{t("services.details.tableView", { defaultValue: 'Table' })}</span>
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
      {error ? (
        <div className="text-red-500 text-center py-10 w-full">
          {t("services.details.failedToLoadProjects", { defaultValue: "Failed to load projects." })}
        </div>
      ) : viewMode === "table" ? (
        <PortfolioProjectsTable
          data={projects}
          loading={loading}
          meta={meta}
          onPageChange={(page) => setCurrentPage(page)}
          onView={(project) => setSelectedProject(project)}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {loading ? (
              // Skeleton Loader mimicking PortfolioCard
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
                  <div className="relative w-full h-52 bg-gray-200 animate-pulse"></div>
                  <div className="flex flex-col flex-grow p-5">
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 flex-grow mb-6"></div>
                    <div className="flex flex-wrap gap-2 mt-auto border-t border-gray-200 pt-4">
                      <div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div>
                      <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : projects.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">
                {t("services.providerProfile.noProjectsFoundMatching", { defaultValue: "No projects found matching your criteria." })}
              </div>
            ) : (
              projects.map((project) => (
                <PortfolioCard
                  key={project.id} 
                  project={project} 
                  onClick={() => setSelectedProject(project)}
                />
              ))
            )}
          </div>

          {/* Pagination Footer — Grid only (table has its own) */}
          {!loading && projects.length > 0 && meta.last_page > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <span className="text-sm font-medium text-blueSite">
                {t("common.showing") || "Showing"} 1 - {projects.length} {t("common.of") || "of"} {meta.total}
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-blueSite text-white hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <button 
                  disabled={currentPage === meta.last_page}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.last_page))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-blueSite text-white hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ProfilePortfolioTab;

