"use client";


import ProjectCard, { ProjectItem } from "../ProjectCard";
import NewProjectCard from "../NewProjectCard";

interface GridViewProps {
  projects: ProjectItem[];
  onProjectClick?: (project: ProjectItem) => void;
}

export default function GridView({ projects, onProjectClick }: GridViewProps) {
  const handleProjectClick = (project: ProjectItem): void => {
    if (onProjectClick) {
      onProjectClick(project);
      return;
    }
  };


  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="cursor-pointer"
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
            <ProjectCard project={project} />
          </div>
        ))}

        <NewProjectCard />
      </div>

    
    </>
  );
}
