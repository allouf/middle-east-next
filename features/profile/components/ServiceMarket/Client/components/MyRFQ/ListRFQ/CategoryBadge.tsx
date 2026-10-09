interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex rounded-full bg-[#DDEAE6] px-4 py-2 text-sm font-semibold text-blueSite">
      {category}
    </span>
  );
}
