import { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const NotFoundPage = dynamic(() => import("@/components/shared/notFound"), {
  loading: () => <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueSite"></div></div>,
  ssr: true,
});

export const metadata: Metadata = {
  title: "404 - Page Not Found | Middle East Platform",
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}

