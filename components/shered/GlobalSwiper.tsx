import {
  Autoplay,
  EffectCreative,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper } from "swiper/react";

const GlobalSwiper = ({
  children,
  // General behavior
  loop = true,
  speed = 1500,
  direction = "horizontal",

  // Autoplay
  autoplay = true,
  autoplayDelay = 1500,
  pauseOnMouseEnter = true,
  disableOnInteraction = false,
  showNavigation = false,
  showPagination = false,
  effect = "creative",
  creativeEffect = {
    prev: {
      shadow: true,
      translate: ["-20%", 0, -1],
    },
    next: {
      translate: ["100%", 0, 0],
    },
  },
  className,
}) => {
  const modules = [EffectCreative];
  if (autoplay) modules.push(Autoplay);
  if (showNavigation) modules.push(Navigation);
  if (showPagination) modules.push(Pagination);

  return (
    <Swiper
      modules={modules}
      loop={loop}
      speed={speed}
      direction={direction}
      effect={effect}
      creativeEffect={effect === "creative" ? creativeEffect : undefined}
      autoplay={
        autoplay
          ? {
              delay: autoplayDelay,
              pauseOnMouseEnter,
              disableOnInteraction,
            }
          : false
      }
      navigation={showNavigation}
      pagination={showPagination ? { clickable: true } : false}
      className={`overflow-hidden ${className || ""}`}
    >
      {children}
    </Swiper>
  );
};

export default GlobalSwiper;
