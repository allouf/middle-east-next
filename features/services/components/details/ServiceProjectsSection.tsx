"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ServiceProject } from "../../types/type";

interface ServiceProjectsSectionProps {
  projects?: ServiceProject[];
  onTabChange?: (key: string) => void;
}

const ServiceProjectsSection: React.FC<ServiceProjectsSectionProps> = ({ projects = [], onTabChange }) => {
  const { t } = useTranslation();

  const displayProjects = projects.map((p: ServiceProject) => {
    const categoryName = p.categories && p.categories.length > 0 
      ? p.categories.map(c => c.name).join(", ") 
      : "-"

    return {
      id: p.id.toString(),
      title: p.title,
      category: categoryName,
      image: p.images?.[0] || "/dummy/prod21.png"
    };
  });


  // console.log("projects",projects)
  
  const projectsToRender = displayProjects.slice(0, 3);

  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h3 className="text-[28px] font-bold text-subTitleColor mb-2">
            {t("services.details.relatedProjectsHeader", { defaultValue: "Projects related to this service:" })}
          </h3>
          <p className="text-[#475569] text-[15px]">
            {t("services.details.relatedProjectsSubheader", { defaultValue: "Everything you need to know about the process and deliverables." })}
          </p>
        </div>
        <button
          onClick={() => onTabChange?.("3")}
          className="flex items-center gap-2 text-[#475569] font-bold text-[14px] hover:text-[#00664F] transition-colors"
        >
          {t("services.details.viewAllProjects", { defaultValue: "View All Projects" })} <ArrowRight size={16} />
        </button>
      </div>

      {projectsToRender.length === 0 ? (
        <div className="py-8 text-center text-[#747474] border border-dashed border-gray-200 rounded-[12px]">
          {t("services.details.noProjectsAvailable", { defaultValue: "No projects available for this service." })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToRender.map((project: any) => (
            <div key={project.id} className="group cursor-pointer flex flex-col gap-3">
              <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden bg-gray-100 border border-gray-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  // Fallback style if image isn't found
                  style={{ backgroundColor: '#F3F4F6' }}
                />
              </div>
              <div>
                <h4 className="text-[18px] font-bold text-subTitleColor  group-hover:text-[#00664F] transition-colors">
                  {project.title}
                </h4>
                <p className="text-[13px] text-[#747474] font-medium">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProjectsSection;
