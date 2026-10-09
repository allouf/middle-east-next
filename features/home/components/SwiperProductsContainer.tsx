import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCard from '@/components/cards/product/ProductCard';
import { MappedProdcut } from "../type";
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection";

interface SwiperProductsContainerProps {
  products: MappedProdcut[];
  selectable?: boolean;
  isDark?: boolean;
  showCartIcon?: boolean;
  navigationRefs?: { prev: React.RefObject<HTMLButtonElement>; next: React.RefObject<HTMLButtonElement> };
}

const SwiperProductsContainer = ({
  products,
  selectable = false,
  isDark = false,
  // Control cart icon visibility for all ProductCards inside the swiper
  showCartIcon = true,
  breakpoints={ 
    0: { slidesPerView: 1.8 },
    350:{ slidesPerView: 1.9, }
  , 500: { slidesPerView: 2.8, }
  , 630:{ slidesPerView: 2, },
   730: { slidesPerView: 2.2, },
    830: { slidesPerView: 2.5, },
     930: { slidesPerView: 2.8, },
      1024: { slidesPerView: 3.2, },
       1224: { slidesPerView: 4, },
        1620: { slidesPerView: 5, }, },
  navigationRefs // 👈 receive navigation buttons here
}) => {
  const { dir } = useLocaleDirection();

  return (
    <Swiper
      draggable
      slidesPerView={4}
      spaceBetween={16}
      breakpoints={breakpoints}
      modules={[Navigation, Autoplay, Pagination]}
      className="mySwiper my-product-detail-swiper"
      dir={dir}
      key={dir}
      // 👇 bind navigation to the refs from the parent
      onBeforeInit={(swiper) => {
        if (navigationRefs?.prev && navigationRefs?.next) {
          swiper.params.navigation.prevEl = navigationRefs.prev.current;
          swiper.params.navigation.nextEl = navigationRefs.next.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }
      }}
    >
      {products.map((product) => (
        <SwiperSlide key={product.id} className="md:pe-4 pe-0">
          <ProductCard
            product={product}
            selectable={selectable}
            isDark={isDark}
            showCartIcon={showCartIcon}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwiperProductsContainer;
