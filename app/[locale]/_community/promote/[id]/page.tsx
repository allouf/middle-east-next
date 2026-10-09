import { Metadata } from "next";
import Promote from "@/pages/Community/Components/promote/promote";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `ترويج - منصة الشرق الأوسط`
      : `Promote - Middle East Platform`,
    description: isArabic
      ? `ترويج المنشور`
      : `Promote post`,
  };
}

export default async function PromotePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  return <Promote postId={id} />;
}


