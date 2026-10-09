import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import TagPill, { ProjectTag } from "./TagPill";

/**
 * Project Item Type
 * 
 * Defines the structure of a portfolio project.
 */
export type ProjectItem = {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: ProjectTag[];
};

/**
 * Project Card Component
 * 
 * Displays a single project in a card format with image, title,
 * description, and tags. Includes hover effects and external link.
 */
interface ProjectCardProps {
  project: ProjectItem;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-[#F1F5F9] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 text-[16px] font-semibold text-textColor">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-textGrayColor">
              {project.description}
            </p>
          </div>

          <button
            type="button"
            className="mt-0.5 shrink-0 text-textGrayColor transition-colors hover:text-blueSite"
            aria-label={`View project: ${project.title}`}
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <TagPill key={tag.label} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;