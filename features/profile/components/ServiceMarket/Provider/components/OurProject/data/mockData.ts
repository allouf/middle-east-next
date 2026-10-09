import { ProjectItem } from "../ProjectCard";

export const projectsData: ProjectItem[] = [
  {
    id: 1,
    title: "Nebula Branding",
    description:
      "Complete identity system and digital presence for a future-forward space tech startup.",
    image: "/images/project-1.jpg",
    tags: [
      { label: "Branding", color: "text-blue-600", bg: "bg-blue-50" },
      { label: "UI/UX", color: "text-violet-600", bg: "bg-violet-50" },
    ],
  },
  {
    id: 2,
    title: "DataViz Pro Dashboard",
    description:
      "Enterprise-level data visualization dashboard for financial analytics and reporting.",
    image: "/images/project-2.jpg",
    tags: [
      { label: "Development", color: "text-orange-600", bg: "bg-orange-50" },
      { label: "Fintech", color: "text-indigo-600", bg: "bg-indigo-50" },
    ],
  },
  {
    id: 3,
    title: "Zenith App Design",
    description:
      "Wellness and meditation mobile application with focus on micro-interactions and accessibility.",
    image: "/images/project-3.jpg",
    tags: [
      { label: "Mobile App", color: "text-pink-600", bg: "bg-pink-50" },
      { label: "Design", color: "text-cyan-700", bg: "bg-cyan-50" },
    ],
  },
  {
    id: 4,
    title: "E-comm Transformation",
    description:
      "Complete digital overhaul for a legacy retail brand moving to direct-to-consumer sales.",
    image: "/images/project-4.jpg",
    tags: [
      { label: "Strategy", color: "text-rose-600", bg: "bg-rose-50" },
      { label: "Web", color: "text-emerald-700", bg: "bg-emerald-50" },
    ],
  },
  {
    id: 5,
    title: "Vortex SaaS Platform",
    description:
      "A cloud-based infrastructure monitoring tool for high-traffic DevOps environments.",
    image: "/images/project-5.jpg",
    tags: [
      { label: "UI/UX", color: "text-blue-600", bg: "bg-blue-50" },
      { label: "SaaS", color: "text-amber-700", bg: "bg-amber-50" },
    ],
  },
];
