"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import ProjectCard, { ProjectItem } from "../ProjectCard";
import TagPill from "../TagPill";


interface TableViewProps {
  projects: ProjectItem[];
  onProjectClick?: (project: ProjectItem) => void;
}

export default function TableView({ projects, onProjectClick }: TableViewProps) {
  const { t } = useTranslation();

  const handleProjectClick = (project: ProjectItem): void => {
    if (onProjectClick) {
      onProjectClick(project);
      return;
    }
  };


  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-grayBorder bg-white">
        {/* Table Header */}
        <div className="grid grid-cols-12 border-b border-grayBorder bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-textColor">
          <div className="col-span-4">{t('serviceMarket.projects.tableHeaders.project')}</div>
          <div className="col-span-5">{t('serviceMarket.projects.tableHeaders.description')}</div>
          <div className="col-span-2">{t('serviceMarket.projects.tableHeaders.tags')}</div>
          <div className="col-span-1 text-end">{t('serviceMarket.projects.tableHeaders.action')}</div>
        </div>

        {/* Table Body */}
        {projects.map((project) => (
          <div
            key={project.id}
            className="grid grid-cols-12 items-center border-b border-grayBorder px-4 py-4 last:border-b-0 transition-colors hover:bg-gray-50 cursor-pointer"
            onClick={() => handleProjectClick(project)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProjectClick(project);
              }
            }}
            aria-label={`View project: ${project.title}`}
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="relative h-14 w-20 overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-textColor">
                {project.title}
              </span>
            </div>

            <div className="col-span-5 pr-4 text-sm text-textGrayColor">
              {project.description}
            </div>

            <div className="col-span-2 flex flex-wrap gap-2">
              {project.tags.slice(0, 2).map((tag) => (
                <TagPill key={tag.label} tag={tag} />
              ))}
            </div>

            <div className="col-span-1 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectClick(project);
                }}
                className="text-textGrayColor transition-colors hover:text-blueSite"
                aria-label={`View project: ${project.title}`}
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>


    </>
  );
}
