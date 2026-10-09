/**
 * Project Tag Type
 * 
 * Defines the structure of a project tag with label and styling.
 */
export type ProjectTag = {
  label: string;
  color: string;
  bg: string;
};

/**
 * Tag Pill Component
 * 
 * Displays a styled pill/tag for project categorization.
 * Uses dynamic styling based on tag properties.
 */
interface TagPillProps {
  tag: ProjectTag;
}

function TagPill({ tag }: TagPillProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${tag.bg} ${tag.color}`}
      role="badge"
      aria-label={`Tag: ${tag.label}`}
    >
      {tag.label}
    </span>
  );
}

export default TagPill;