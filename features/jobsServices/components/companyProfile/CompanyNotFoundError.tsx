"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import Image from "next/image";
import { HiBuildingOffice2 } from "react-icons/hi2";

export default function CompanyNotFoundError() {
    const { t } = useTranslation();

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-[760px]">
                {/* ===== Main card ===== */}
                <div className="rounded-[28px] border border-gray-200 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                    <div className="px-6 sm:px-10 pt-10 sm:pt-14 pb-8 text-center relative">
                        {/* soft corner glow */}
                        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-emerald-200/40 blur-3xl" />
                        <div className="pointer-events-none absolute -left-16 -bottom-24 h-44 w-44 rounded-full bg-emerald-200/30 blur-3xl" />

                        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#00664f]/20">
                            <Image src={'/Search.png'} alt="search icon" width={40} height={40} />
                        </div>

                        <h1 className="text-[28px] sm:text-[32px] font-semibold text-emerald-800">
                            {t("jobs.errors.companyNotFound.title")}
                        </h1>

                        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-[560px] mx-auto">
                            {t("jobs.errors.companyNotFound.description")}
                        </p>

                        <div className="mt-8 flex justify-center">
                            <Link
                                href="/jobs"
                                className="inline-flex items-center justify-center h-12 sm:h-14 px-8 sm:px-12 rounded-xl bg-emerald-700 text-white font-medium shadow-sm hover:bg-emerald-800 transition"
                            >
                                {t("jobs.errors.jobNotFound.viewAllJobs")}
                            </Link>
                        </div>
                    </div>

                    {/* ===== Suggestion card ===== */}
                    <div className="px-6 sm:px-10 pb-10">
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
                            <div
                                className="relative px-5 sm:px-8 py-8"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(to right, rgba(16,185,129,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.10) 1px, transparent 1px)",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundImage: "url('/notFoundCompaniesBG.png')",
                                        backgroundRepeat: "repeat",
                                        backgroundSize: "cover",
                                    }}
                                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/80 to-white" />

                                <div
                                    className="relative text-center"

                                >


                                    <div className="mx-auto mb-4 flex h-12 w-12 md:w-16 md:h-16 p-2 items-center justify-center rounded-full bg-[#00664f]/20 text-white shadow-md">
                                        <HiBuildingOffice2 className="h-10 w-10 text-[#00664f]" />
                                    </div>


                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                                        {t("jobs.errors.companyNotFound.whatYouCanDo")}
                                    </h3>

                                    {/* <p className="mt-2 text-sm text-gray-500">
                                        {t("jobs.errors.companyNotFound.suggestionsIntro")}
                                    </p> */}

                                    <ul className="mt-6 space-y-3 text-sm text-gray-700 max-w-[520px] mx-auto text-left">
                                        <SuggestionItem
                                            text={t("jobs.errors.companyNotFound.suggestions.checkUrl")}
                                        />
                                        <SuggestionItem
                                            text={t("jobs.errors.companyNotFound.suggestions.browseCompanies")}
                                        />
                                        <SuggestionItem
                                            text={t("jobs.errors.companyNotFound.suggestions.contactSupport")}
                                        />
                                        <SuggestionItem
                                            text={t("jobs.errors.companyNotFound.suggestions.useSearch")}
                                        />
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="h-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SuggestionItem({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-3">
            <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                ✓
            </span>
            <span className="leading-relaxed">{text}</span>
        </li>
    );
}
