'use client';

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
  FaRegHeart,
  FaShare,
} from "react-icons/fa";

const ProductGallery = ({
  images = [
    { id: 1, file_path: "/ReferralImage.png" },
    { id: 2, file_path: "/syriaFlag.png" },
    { id: 3, file_path: "/ReferralImage.png" },
    { id: 5, file_path: "/syriaFlag.png" },
    { id: 6, file_path: "/ReferralImage.png" },
    { id: 7, file_path: "/syriaFlag.png" },
    { id: 8, file_path: "/ReferralImage.png" },
  ],
}) => {
  const swiperRef = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const [inWish, setInWish] = useState(false);

  const handlePrev = () => {
    const newIndex = activeImage - 1 >= 0 ? activeImage - 1 : images.length - 1;
    setActiveImage(newIndex);
    swiperRef.current.swiper.slideTo(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeImage + 1 < images.length ? activeImage + 1 : 0;
    setActiveImage(newIndex);
    swiperRef.current.swiper.slideTo(newIndex);
  };

  const handleSlideClick = (index) => {
    setActiveImage(index);
    swiperRef.current.swiper.slideTo(index);
  };

  const handleSlideChange = (swiper) => {
    setActiveImage(swiper.activeIndex);
  };

  return (
    <div className="lg:w-[500px] xl:w-[600px] 2xl:w-[800px] w-full">
      <div className=" ">
        <Swiper
          ref={swiperRef}
          draggable={true}
          initialSlide={activeImage}
          slidesPerView={4}
          // autoplay={{
          //   delay: 1000,
          //   disableOnInteraction: false,
          // }}
          breakpoints={{
            0: {
              slidesPerView: 4,
            },
            500: {
              slidesPerView: 4.5,
            },
            640: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 3.5,
            },
            1224: {
              slidesPerView: 4,
            },
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper my-product-detail-swiper "
          onSlideChange={handleSlideChange}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div
                className={` w-full px-1`}
                onClick={() => handleSlideClick(index)}
              >
                <div
                  className={`${index === activeImage ? " border-2 border-blueSite" : ""
                    } w-full h-full`}
                >
                  <img
                    src={img?.file_path || "/ReferralImage.png"}
                    className="w-full h-full object-cover "
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <AnimatePresence>
          <div className="w-full sm:h-[380px] h-[280px] mt-3 relative overflow-hidden group">
            <motion.img
              src={images[activeImage]?.file_path || "/ReferralImage.png"}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-150 cursor-zoom-in"
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              exit={{ opacity: 0 }}
              onError={(e) => {
                e.target.src = "/dummy/prod21.png";
              }}
            />

            <div className="sm:hidden absolute top-4 right-2 flex flex-col gap-4">
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                <button
                  className="flex items-center gap-2 hover:text-blueBtn transition"
                  onClick={() => setInWish((prev) => !prev)}
                >
                  {inWish ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
                </button>
              </div>
              <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full">
                <FaShare
                  size={16}
                  className="cursor-pointer hover:text-blueSiteHover"
                />
              </div>
            </div>
          </div>
        </AnimatePresence>
        <div className="flex flex-row justify-end gap-4 my-2 max-sm:hidden">
          <button
            onClick={handlePrev}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-blueSite text-blueSite hover:bg-[#E6F0ED] transition"
          >
            <FaArrowLeft />
          </button>

          {/* Right (filled) */}
          <button
            onClick={handleNext}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-blueBtn text-textWhiteColor hover:bg-blueSiteHover transition"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;
