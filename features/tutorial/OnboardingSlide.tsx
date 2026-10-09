'use client';

import React from 'react';
import Image from 'next/image';
import type { TutorialSlide } from './tutorial.config';
import { useLangSwitch } from '@/lib/Hooks/useLangSwitch';

type Props = {
    slide: TutorialSlide;
    t: (key: string) => string;
};

const OnboardingSlide: React.FC<Props> = ({ slide, t }) => {
    const { currentLang } = useLangSwitch();
    const isRTL = currentLang === 'ar';

    return (
        <div className={` ${isRTL ? 'text-right' : 'text-left '}`} >
            <div className="px-4 sm:px-6 py-5">
                {/* ✅ Case 1: sections (multiple titles) */}
                {slide.sections?.length ? (
                    <div className="space-y-5">
                        {slide.sections.map((sec, idx) => (
                            <div key={`${sec.headingKey}-${idx}`} className="space-y-2">
                                <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 text-start">
                                    {t(sec.headingKey)}
                                </h3>

                                {sec.subtitleKey ? (
                                    <p className="text-[12px] sm:text-[13px] text-gray-500 text-start">
                                        {t(sec.subtitleKey)}
                                    </p>
                                ) : null}

                                {sec.paragraphKeys?.length ? (
                                    <div
                                        className={`space-y-2 text-[13px] sm:text-[14px] text-gray-700 leading-6 `}
                                    >
                                        {sec.paragraphKeys.map((k) => (
                                            <p key={k}>{t(k)}</p>

                                        ))}
                                    </div>
                                ) : null}

                                {idx !== slide.sections!.length - 1 ? (
                                    <div className="pt-1">
                                        <div className="h-px w-full bg-gray-100" />
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ✅ Case 2: normal (single title) */
                    <>
                        {slide.headingKey ? (
                            <h3 className="text-[16px] sm:text-[18px] font-semibold text-gray-900 text-start">
                                {t(slide.headingKey)}
                            </h3>
                        ) : null}

                        {slide.subtitleKey ? (
                            <p className="mt-2 text-[12px] sm:text-[13px] text-gray-500 text-start">
                                {t(slide.subtitleKey)}
                            </p>
                        ) : null}

                        {slide.paragraphKeys?.length ? (
                            <div
                                className={`mt-3 space-y-2 text-[13px] sm:text-[14px] text-gray-700 leading-6 `}
                            >
                                {slide.paragraphKeys.map((k) => (
                                    <p key={k}>{t(k)}</p>
                                ))}
                            </div>
                        ) : null}
                    </>
                )}

                {/* items list */}
                {slide.items?.length ? (
                    <div className="mt-4 space-y-3">
                        {slide.items.map((it) => (
                            <div
                                key={it.titleKey}
                                className="rounded-lg border border-gray-100 bg-gray-50 px-3 sm:px-4 py-3"
                            >
                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left '}`}>
                                    <span className="text-[18px] leading-6"><it.icon size={24} /></span>
                                    <div className="min-w-0">
                                        <p className="text-[13px] sm:text-[14px] font-semibold text-gray-900">
                                            {t(it.titleKey)}
                                        </p>
                                        <p className="mt-1 text-[12px] sm:text-[13px] text-gray-600 leading-5">
                                            {t(it.descKey)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}

                {/* closing */}
                {slide.closingKeys?.length ? (
                    <div
                        className={`mt-4 space-y-2 text-[13px] sm:text-[14px] text-gray-700 leading-6 `}
                    >
                        {slide.closingKeys.map((k) => (
                            <p key={k}>{t(k)}</p>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OnboardingSlide;
