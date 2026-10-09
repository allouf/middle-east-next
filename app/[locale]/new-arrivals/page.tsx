import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "New Arrivals | Middle East",
  description:
    "Discover the latest products and deals available now on Middle East Commerce.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function NewArrivalsPage() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-4 rounded-2xl bg-white shadow-sm p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-subTitleColor">
          New Arrivals
        </h1>
        <p className="text-textColor text-base md:text-lg leading-relaxed">
          We&apos;re curating the freshest drops for you. This page is coming
          soon with the newest products across categories. In the meantime,
          browse the catalog and keep an eye on this space for updates.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 rounded-full bg-blueBtn px-5 py-3 text-textWhiteColor font-semibold hover:bg-blueSiteHover transition"
          >
            Go to home
          </Link>
          <Link
            href="/en/category"
            className="inline-flex items-center gap-2 rounded-full border border-blueBtn px-5 py-3 text-blueBtn font-semibold hover:bg-blueLight transition"
          >
            Browse categories
          </Link>
        </div>
      </div>
    </section>
  );
}
