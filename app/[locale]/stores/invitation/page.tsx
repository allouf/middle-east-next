
import Invitation_client from "@/features/stores/components/StoreMembers/Invitations/Invitation_client";
import { Metadata } from "next";
import { fetchInvitationPreview, InvitationResponse } from "@/features/stores/api/invitation";
import ErrorReload from "@/components/shared/ErrorReload";
import { getT } from "@/lib/i18n/server";


export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { token } = await searchParams;
  const isArabic = locale === "ar";

  return {
    title: isArabic
      ? `دعوة - منصة الشرق الأوسط`
      : `Invitation - Middle East Platform`,
    description: isArabic
      ? `انضم إلينا عبر دعوة خاصة واستمتع بتجربة تسوق فريدة`
      : `Join us through a special invitation and enjoy a unique shopping experience`,
    keywords: ["invitation", "join", "exclusive", "e-commerce", "Middle East"],
    openGraph: {
      title: isArabic
        ? `دعوة - منصة الشرق الأوسط`
        : `Invitation - Middle East Platform`,
      description: isArabic
        ? `انضم إلينا عبر دعوة خاصة واستمتع بتجربة تسوق فريدة`
        : `Join us through a special invitation and enjoy a unique shopping experience`,
      url: token ? `/${locale}/invitation?token=${token}` : `/${locale}/invitation`,
      siteName: "Middle East Platform",
      locale: isArabic ? "ar_SA" : "en_US",
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getT(locale);
  
  console.log('Invitation token:', token);

  let invitationData: InvitationResponse | null = null;
  let error: string | null = null;

  // Handle missing token error
  if (!token) {
    return (
      <ErrorReload
        title={t('invitation.noTokenTitle')}
        message={t('invitation.noTokenMessage')}
      />
    );
  }

  try {
    invitationData = await fetchInvitationPreview(token);
  } catch (err) {
    console.error('Failed to fetch invitation data:', err);
    error = err instanceof Error ? err.message : t('invitation.failedToLoad');
  }
    
  if (error) {
    return (
      <ErrorReload
        title={t('invitation.failedToLoadTitle')}
        message={error}
      />
    );
  }

  return <Invitation_client token={token} invitationData={invitationData} error={error} />;
}


