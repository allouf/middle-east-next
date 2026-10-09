'use client';

import React from 'react'
import ProductCard from '../../../../components/cards/product/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import SwiperProductsContainer from '../../../Home/Components/SwiperProductsContainer';

const productsData = [
  {
    id: 1,
    label: "HOT",
    labelColor: "bg-red-500",
    title: "Wired Over-Ear Gaming Headphones with USB",
    image:
      "/ReferralImage.png",
    oldPrice: 1500,
    newPrice: 1500,
    rating: 4.7,
    reviews: 6211,
  },
  {
    id: 2,
    label: "25% OFF",
    labelColor: "bg-yellow-400 text-subTitleColor",
    title: "Polaroid 57-Inch Photo/Video Tripod with Deluxe Tripod Case",
    image:
      "/ReferralImage.png",
    oldPrice: 1600,
    newPrice: 1200,
    rating: 4.8,
    reviews: 8217,
  },
  {
    id: 3,
    label: "25% OFF",
    labelColor: "bg-yellow-400 text-subTitleColor",
    title: "Polaroid 57-Inch Photo/Video Tripod with Deluxe Tripod Case",
    image:
      "/ReferralImage.png",
    oldPrice: 1600,
    newPrice: 1200,
    rating: 4.8,
    reviews: 8217,
  },
    {
    id: 4,
    label: "25% OFF",
    labelColor: "bg-yellow-400 text-subTitleColor",
    title: "Polaroid 57-Inch Photo/Video Tripod with Deluxe Tripod Case",
    image:
      "/ReferralImage.png",
    oldPrice: 1600,
    newPrice: 1200,
    rating: 4.8,
    reviews: 8217,
  },
   {
    id: 5,
    label: "25% OFF",
    labelColor: "bg-yellow-400 text-subTitleColor",
    title: "Polaroid 57-Inch Photo/Video Tripod with Deluxe Tripod Case",
    image:
      "/ReferralImage.png",
    oldPrice: 1600,
    newPrice: 1200,
    rating: 4.8,
    reviews: 8217,
  },
    {
    id: 6,
    label: "25% OFF",
    labelColor: "bg-yellow-400 text-subTitleColor",
    title: "Polaroid 57-Inch Photo/Video Tripod with Deluxe Tripod Case",
    image:
      "/ReferralImage.png",
    oldPrice: 1600,
    newPrice: 1200,
    rating: 4.8,
    reviews: 8217,
  },
];

const RelatedProducts = () => {
  return (
    <div>
      <h1 className='text-[#0B5C8E] sm:text-[25px] text-[18px] font-semibold py-3'>Related Products :</h1>

      <div>
        <SwiperProductsContainer products={productsData}/>
        {/* <Swiper
            // ref={swiperRef}
            draggable={true}
            // initialSlide={activeImage}
            slidesPerView={4}
            spaceBetween={16}
            
            // autoplay={{
            //   delay: 1000,
            //   disableOnInteraction: false,
            // }}
            breakpoints={{
              0: {
                slidesPerView: 2,
              },
              500: {
                slidesPerView: 1.5,
              },
              700: {
                slidesPerView: 2.3,
              },
               840: {
                slidesPerView: 2.8,
              },
              1024: {
                slidesPerView: 3.3,
              },
              1224: {
                slidesPerView: 4,
              },
              1620: {
                slidesPerView: 5,
              },
            }}
            modules={[Autoplay, Pagination]}
            className="mySwiper my-product-detail-swiper "
            // onSlideChange={handleSlideChange}
          >
            {productsData.map((product, index) => (
              <SwiperSlide key={product.id} >
                <ProductCard product={product}/>
              </SwiperSlide>
            ))}
        </Swiper> */}
      </div>
      {/* <div className='flex flex-row flex-wrap gap-4'>
        {productsData.map((product)=><ProductCard product={product}/>)}
      </div> */}
    </div>
  )
}

export default RelatedProducts