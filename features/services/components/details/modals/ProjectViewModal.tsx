"use client";

import React from "react";
import Image from "next/image";
import { AiOutlineClose } from "react-icons/ai";
import { ChevronLeft, ChevronRight, Link as LinkIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { PortfolioCategory } from "../tabs/PortfolioCard";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Using the same getTagStyles function from PortfolioCard for consistency
const getTagStyles = (tagName: string) => {
  const normName = tagName.toLowerCase();
  
  if (normName.includes('branding') || normName.includes('fintech') || normName.includes('design') || normName.includes('ui/ux')) {
    return "bg-[#FEF9C3] text-[#CA8A04]"; // Yellow-ish
  } else if (normName.includes('research')) {
    return "bg-[#FCE7F3] text-[#DB2777]"; // Pink-ish
  } else if (normName.includes('q&a') || normName.includes('qa')) {
    return "bg-[#EBF3FE] text-[#2F65E5]"; // Blue-ish
  } else if (normName.includes('development')) {
    return "bg-[#E6F8F3] text-[#0D9A7A]"; // Green-ish
  }
  
  // Default fallback matching screenshot style
  return "bg-[#FEF9C3] text-[#CA8A04]";
};

export interface ProjectDetails {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  galleryUrls?: string[];
  link?: string;
  categories: PortfolioCategory[];
}

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetails | null;
}

const ProjectViewModal: React.FC<ProjectViewModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { t } = useTranslation();
  if (!project) return null;

  // Use dummy gallery if none provided
  const gallery = project.galleryUrls && project.galleryUrls.length > 0 
    ? project.galleryUrls 
    : Array(9).fill("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop");

  const mainImage = gallery[0];
  const sideImages = gallery.slice(1, 9); // Take up to 8 images for the grid

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showLine={false}
      showCloseButton={false}
      classNameContent="p-0"
      padding="p-0"
      className="!rounded-[16px] overflow-hidden bg-[#FAFAFA]"
      style={{ maxWidth: "1000px", maxHeight: "95vh" }}
    >
      <div className="pt-2 px-2 pb-10 relative bg-white overflow-y-auto max-h-[95vh] custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#333333] hover:bg-black text-white flex flex-col items-center justify-center transition-colors shadow-sm z-10"
          aria-label={t("services.details.closeModal", { defaultValue: "Close modal" })}
        >
          <AiOutlineClose size={14} strokeWidth={20} />
        </button>

        {/* Header content */}
        <div className="mb-8 pr-12">
          <h2 className="text-[24px] font-semibold text-[#333333] mb-4 leading-tight">
            {project.title}
          </h2>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.categories.map((category, index) => (
              <span
                key={index}
                className={`px-4 py-1.5 text-[13px] font-medium rounded-full ${getTagStyles(category.name)}`}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h3 className="text-[20px] font-medium text-[#333333] mb-3">
            {t("services.details.descriptionLabel", { defaultValue: "Description :" })}
          </h3>
          <p className="text-textGrayColor text-[15px] leading-relaxed">
            {project.longDescription || project.description}
            {" "}
            <button className="text-blueSite hover:underline font-medium">
              {t("services.details.seeMoreDots", { defaultValue: "..See more" })}
            </button>
          </p>
          
          {project.link && (
            <div className="mt-4 flex items-center gap-2 text-[#00664F] font-semibold hover:underline cursor-pointer w-fit">
              <LinkIcon size={16} />
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.link.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-[#333333]">
              {t("services.details.theGallery", { defaultValue: "The Gallery" })}{" "}
              <span className="text-[#888888] font-normal text-[15px]">
                {t("services.details.photosCount", { count: gallery.length, defaultValue: `(${gallery.length} Photos)` })}
              </span>
            </h3>
            
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#00664F33] text-blueSite hover:bg-blueSiteHover hover:text-white transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#00664F33] text-blueSite hover:bg-blueSiteHover hover:text-white transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* CSS Grid for Images */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3 aspect-[2/1] min-h-[400px]">
            {/* Main large image */}
            <div className="relative col-span-2 row-span-2 rounded-[12px] overflow-hidden bg-gray-100">
              <Image
                src={mainImage}
                alt={`${project.title} - Main Gallery Image`}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Smaller thumbnail images */}
            {sideImages.slice(0, 8).map((imgUrl, idx) => (
              <div key={idx} className="relative rounded-[8px] overflow-hidden bg-gray-100">
                <Image
                  src={imgUrl}
                  alt={`${project.title} - Gallery Image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectViewModal;
