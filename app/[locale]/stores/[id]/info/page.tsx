import { fetchStoreDetails } from "@/features/store/api/getStoreDetails";
import StoreUserDetails from "@/features/store/components/StoreUserDetails";
import { Metadata } from "next";
import { StoreDetailsResponse } from "@/features/store/types/type";
import ErrorReload from "@/components/shared/ErrorReload";
import { getT } from "@/lib/i18n/server";


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
      ? `معلومات المتجر - منصة الشرق الأوسط`
      : `Store Info - Middle East Platform`,
    description: isArabic
      ? `عرض معلومات المتجر`
      : `View store information`,
  };
}

export default async function StoreInfoPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams:Promise<{Details:string}>
}) {
  const { id ,locale} = await params;
   const t = await getT(locale);
  const resolvedSearchParams = await searchParams ?? {};
   let error: Error | null = null;
   let storeRes: StoreDetailsResponse | null = null
  try{
   storeRes = await fetchStoreDetails("",locale,id)
  }catch(err){
        console.error("Error fetching store details:", err);
    error = err instanceof Error ? err : new Error("Failed to fetch store details");
  }

  console.log( "store ",storeRes)

  // Handle error state
  if (error || !storeRes) {
    return (
      <div className="container mx-auto">
        <ErrorReload 
          title={t('storeInfo.unavailable')}
          message={t('storeInfo.couldntLoad')}
        />
      </div>
    );
  }

  return <StoreUserDetails storeId={id} locale={locale} data={storeRes} searchParams={resolvedSearchParams}/>;
}


