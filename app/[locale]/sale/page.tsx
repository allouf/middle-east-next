import { redirect } from "next/navigation";

interface PageProps {
  params: { locale?: string };
}

export default function SaleRedirect({ params }: PageProps) {
  const locale = params?.locale || "en";
  redirect(`/${locale}`);
}
