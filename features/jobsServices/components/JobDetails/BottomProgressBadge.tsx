"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";

type Props = { value: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function BottomFloatingBadge({ value }: Props) {
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const [bottomPx, setBottomPx] = useState(16);

  // GSAP animation
  useEffect(() => {
    if (!badgeRef.current) return;

    const isMobile = window.innerWidth < 640;
    gsap.to(badgeRef.current, {
      y: isMobile ? -4 : -8,
      duration: isMobile ? 2.2 : 1.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(badgeRef.current, {
      scale: isMobile ? 1.02 : 1.04,
      duration: isMobile ? 2.8 : 2.2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, []);

  // Dynamic bottom based on footer overlap
  useEffect(() => {
    const footer = document.querySelector("#site-footer");
    if (!footer) return;

    const baseBottom = () => (window.innerWidth < 640 ? 16 : 24); // 16px / 24px
    const gap = 12;

    const recalc = () => {
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight;

      const visible = clamp(vh - rect.top, 0, rect.height);

      setBottomPx(baseBottom() + visible + gap);
    };

    recalc();

    window.addEventListener("scroll", recalc, { passive: true });
    window.addEventListener("resize", recalc);

    const ro = new ResizeObserver(recalc);
    ro.observe(footer);

    return () => {
      window.removeEventListener("scroll", recalc);
      window.removeEventListener("resize", recalc);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      style={{ bottom: bottomPx }}
      className="fixed right-2 sm:right-4 z-[9999]"
    >
      <Link href={"/profile?tab=jobs_services&view=user_profile"}>

        <div ref={badgeRef} className="floatingBadge">
          <div className="floatingBadge__inner">
            <span className="floatingBadge__text">{value}%</span>
          </div>
        </div>
      </Link>
      <style jsx>{`
        .floatingBadge {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #00664f33;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15),
            0 3px 6px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floatingBadge__inner {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: #eef7f5;
          box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.06),
            inset -4px -4px 8px rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floatingBadge__text {
          font-size: 14px;
          font-weight: 700;
          color: #0b6a57;
          letter-spacing: 0.3px;
        }

        @media (min-width: 640px) {
          .floatingBadge {
            width: 70px;
            height: 70px;
            border-radius: 22px;
            box-shadow: 0 15px 25px rgba(0, 0, 0, 0.18),
              0 4px 8px rgba(0, 0, 0, 0.08);
          }

          .floatingBadge__inner {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            box-shadow: inset 6px 6px 12px rgba(0, 0, 0, 0.08),
              inset -6px -6px 12px rgba(255, 255, 255, 0.8);
          }

          .floatingBadge__text {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
        }
      `}</style>
    </div>
  );
}