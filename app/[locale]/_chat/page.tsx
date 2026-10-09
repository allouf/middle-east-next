import { Metadata } from "next";
import ChatApp from "@/pages/Chats";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return {
    title: isArabic ? "المحادثات - منصة الشرق الأوسط" : "Chat - Middle East Platform",
    description: isArabic
      ? "إرسال واستقبال الرسائل"
      : "Send and receive messages",
  };
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;
  return <ChatApp />;
}


