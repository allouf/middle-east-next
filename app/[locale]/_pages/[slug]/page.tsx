import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

const PagesStatic = dynamic(() => import("@/_pages/Pages/PagesStatic"), {
  ssr: false,
});

interface Props {
  params: { slug?: string };
}

export default function StaticPage({ params }: Props) {
  const slug = params?.slug;
  if (!slug) return notFound();
  return <PagesStatic slug={slug} />;
}
