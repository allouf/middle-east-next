import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export interface PortfolioCategory {
  name: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  categories: PortfolioCategory[];
}

interface PortfolioCardProps {
  project: PortfolioProject;
  onClick?: () => void;
}

const getTagStyles = (tagName: string) => {
  const normName = tagName.toLowerCase();
  
  if (normName.includes('branding') || normName.includes('fintech') || normName.includes('ui/ux')) {
    return "bg-[#EBF3FE] text-[#2F65E5]";
  } else if (normName.includes('development')) {
    return "bg-[#FEF2E5] text-[#E0791B]";
  } else if (normName.includes('mobile app') || normName.includes('strategy')) {
    return "bg-[#FCE7F3] text-[#DB2777]";
  } else if (normName.includes('design') || normName.includes('web')) {
    return "bg-[#E6F8F3] text-[#0D9A7A]";
  } else if (normName.includes('saas')) {
    return "bg-[#FEF9C3] text-[#CA8A04]";
  }
  
  // Default fallback
  return "bg-gray-100 text-gray-700";
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ project, onClick }) => {
  const { t } = useTranslation();



  // console.log("project",project)
  return (
    <div 
      className="flex flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 "
     
    >
      {/* Image Container */}
      <div className="relative w-full h-52 bg-gray-100 cursor-pointer" 
       onClick={onClick}>
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-[18px] font-bold text-subTitleColor line-clamp-1 cursor-pointer" 
           onClick={onClick}>
            {project.title}
          </h4>
          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-1 text-gray-400 hover:text-blueSite transition-colors"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
        
        <p className="text-[14px] text-textGrayColor flex-grow mb-6 line-clamp-3">
          {project.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto border-t border-gray-200 pt-4">
          {project.categories.map((category, index) => (
            <span
              key={index}
              className={`px-3 py-1 text-xs font-somar-medium rounded-full ${getTagStyles(category.name)}`}
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
