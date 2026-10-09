import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offers | Middle East",
  description:
    "Explore limited-time offers, promotions, and exclusive discounts on Middle East Commerce.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function OffersPage() {
  return (
    <section className="px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-4 rounded-2xl bg-white shadow-sm p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-subTitleColor">
          Offers
        </h1>
        <p className="text-textColor text-base md:text-lg leading-relaxed">
          Our offers hub is getting ready. Soon you&apos;ll find curated deals,
          seasonal promotions, and member-exclusive savings here. Check back
          shortly, or continue shopping to discover great prices today.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 rounded-full bg-blueBtn px-5 py-3 text-textWhiteColor font-semibold hover:bg-blueSiteHover transition"
          >
            Go to home
          </Link>
          <Link
            href="/en/sale"
            className="inline-flex items-center gap-2 rounded-full border border-blueBtn px-5 py-3 text-blueBtn font-semibold hover:bg-blueLight transition"
          >
            View current sale
          </Link>
        </div>
      </div>
    </section>
  );
}
