'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Button, Carousel } from 'antd';
import type { CarouselRef } from 'antd/es/carousel';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/useTranslation';

import OnboardingHeader from './OnboardingHeader';
import OnboardingSlide from './OnboardingSlide';
import {
    HOME_TUTORIAL,
    PROFILE_TUTORIAL,
    STORE_TUTORIAL,
    type TutorialConfig,
} from './tutorial.config';

import Image from 'next/image';
import Banner from '@/assets/images/BannerONbording.jpeg';
import { useAuth } from '@/lib/context/AuthContext';

function normalizePath(path: string) {
    const parts = path.split('/').filter(Boolean);
    if (!parts.length) return '/';

    const locales = ['en', 'ar'];
    if (locales.includes(parts[0])) {
        const rest = parts.slice(1).join('/');
        return rest ? `/${rest}` : '/';
    }
    return path;
}



const OnboardingModal: React.FC = () => {
    const pathname = usePathname() || '/';
    const cleanPath = useMemo(() => normalizePath(pathname), [pathname]);
    const {isAuthenticated} = useAuth();

    
    function getTutorialByPath(path: string): TutorialConfig | null {
    if (path.startsWith('/profile')){
        if (!isAuthenticated) return null;
        return PROFILE_TUTORIAL
    } ;
    if (path.startsWith('/store')){
        if (!isAuthenticated) return null;
        return STORE_TUTORIAL
    } ;
    if (path === '/' || path.startsWith('/home')) return HOME_TUTORIAL;
    return null;
}

    const { t } = useTranslation();
    const tutorial = useMemo(() => getTutorialByPath(cleanPath), [cleanPath]);

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);

    const carouselRef = useRef<CarouselRef>(null);

    const safeT = (key?: string) => (key ? t(key) : '');

    useEffect(() => {
        if (!tutorial) return;

        try {
            const seen = localStorage.getItem(tutorial.storageKey);
            setOpen(!seen);
        } catch {
            setOpen(true);
        }
    }, [tutorial?.storageKey]);

    const closeAndRemember = () => {
        setOpen(false);
        if (!tutorial) return;

        try {
            localStorage.setItem(tutorial.storageKey, 'true');
        } catch { }
    };

    useEffect(() => {
        if (!tutorial) return;
        setActive(0);
        carouselRef.current?.goTo?.(0, true);
    }, [tutorial?.storageKey]);

    if (!tutorial) return null;

    const slidesCount = tutorial.slides.length;
    const isFirst = active === 0;
    const isLast = slidesCount <= 1 ? true : active === slidesCount - 1;

    const handleBack = () => {
        if (isFirst) return;
        carouselRef.current?.prev();
    };

    const handleNext = () => {
        if (isLast) return closeAndRemember();
        carouselRef.current?.next();
    };

    return (
        <Modal
            open={open}
            onCancel={closeAndRemember}
            footer={null}
            centered
            closable={false}
            // ✅ responsive widths
            width="min(760px, calc(100vw - 24px))"
            // ✅ responsive: remove default margin/padding issues on mobile
            style={{ top: 12 }}
            styles={{
                content: {
                    padding: 0,
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: 'transparent',
                },
                body: {
                    padding: 0,
                    background: 'white',
                },
                mask: {
                    backdropFilter: 'blur(2px)',
                },
            }}
        >
            <div className="bg-white overflow-hidden">
                {/* ✅ Banner (responsive height) */}
                <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px]">
                    <Image src={Banner} alt="Banner" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-black/30" />

                    <OnboardingHeader
                        title={safeT(tutorial.modalTitleKey)}
                        subtitle={tutorial.modalSubtitleKey ? safeT(tutorial.modalSubtitleKey) : undefined}
                        stepText={`${safeT('common.step')} ${Math.min(active + 1, slidesCount)}/${slidesCount}`}
                        onSkip={closeAndRemember}
                        skipText={safeT('common.skip')}
                    />
                </div>

                {/* ✅ Slides (add safe paddings on small screens if your slide needs it) */}
                <Carousel
                    ref={carouselRef}
                    dots
                    adaptiveHeight
                    beforeChange={(_, next) => setActive(next)}
                    className="w-full"
                >
                    {tutorial.slides.map((s) => (
                        <OnboardingSlide key={s.key} slide={s} t={t} />
                    ))}
                </Carousel>

                {/* ✅ Footer buttons (responsive stacking already, refine spacing) */}
                <div className="px-3 sm:px-6 pb-4 sm:pb-5 pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2">
                    <Button
                        className="!rounded-lg w-full sm:w-auto"
                        disabled={isFirst}
                        onClick={handleBack}
                    >
                        {safeT('common.back')}
                    </Button>

                    <Button
                        type="primary"
                        className="!rounded-lg w-full sm:w-auto !bg-blueSite hover:!bg-blueSiteHover !border-blueSite hover:!border-blueSiteHover"
                        onClick={handleNext}
                    >
                        {isLast ? safeT('common.got_it_continue') : safeT('common.next')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default OnboardingModal;
