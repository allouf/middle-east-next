'use client';

import React, { useEffect, useState } from "react";

import ProductCard from "../../../../components/cards/product/ProductCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
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
];

const BundleOfferSection = () => {
  const [selected, setSelected] = useState(productsData.map((product) =>({id:product.id,value:true})));

  useEffect(()=>{
    console.log("selected ",selected)
  },[selected])

  const toggleProduct = (id) => {
    const updated = [...selected];
     const index = updated.findIndex(item => item.id === id);
    console.log("index",index)

    if (index !== -1) {
      updated[index] = { ...updated[index], value: !updated[index].value };
    setSelected(updated);
    }
  };

const totalPrice = selected.reduce((sum, s) => {
  if (!s.value) return sum;

  const product = productsData.find(p => p.id === s.id);
  return sum + (product?.newPrice || 0);
}, 0);

  return (
    <div className="bg-white p-4 space-y-5">
      <h2 className="font-semibold text-[#0B5C8E] sm:text-[24px] text-[18px]">
        All users buy the product to take advantage of this offer :
      </h2>

      <div className="flex sm:flex-row flex-col  gap-4">
        {/* --- Products Section --- */}
        <div className="min-w-[330px] max-w-[950px] ">
        <Swiper
              // ref={swiperRef}
              draggable={true}
              // initialSlide={activeImage}
              slidesPerView={4}
              spaceBetween={32}
              
              // autoplay={{
              //   delay: 1000,
              //   disableOnInteraction: false,
              // }}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },
                500: {
                  slidesPerView:2.5 ,
                },
                650: {
                  slidesPerView: 1.4,
                },
                840: {
                  slidesPerView: 1.8,
                },
                1024: {
                  slidesPerView: 2.3,
                },
                1224: {
                  slidesPerView: 3,
                },
                1620: {
                  slidesPerView: 3,
                },
              }}
              modules={[Autoplay, Pagination]}
              className="mySwiper my-product-detail-swiper "
              // onSlideChange={handleSlideChange}
            >
              {productsData.map((product, index) => (
                <SwiperSlide key={product.id} >
                  <div key={product.id} className="relative">
                      {/* Offer Label */}
                      <ProductCard product={product} toggleProduct={toggleProduct} selected={selected} selectable={true}/>
                      {/* Plus sign except last */}
                    {index < productsData.length - 1 ? (
                      <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-blueSite font-bold text-2xl">
                        +
                      </div>
                    ):""}
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
        </div>
        {/* <div className="flex flex-wrap lg:flex-nowrap items-start gap-6 ">
          {productsData.map((product, index) => (
            <div key={product.id} className="relative">
              
              <ProductCard product={product} toggleProduct={toggleProduct} selected={selected} selectable={true}/>
              
              {index < productsData.length - 1 ? (
                <div className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-blueSite font-bold text-2xl">
                  +
                </div>
              ):<div className="absolute -right-5 top-1/2 transform -translate-y-1/2 text-blueSite font-bold text-2xl">
                  =
                </div>}
            </div>
          ))}
        </div> */}

        {/* --- Total Section --- */}
        <div className="min-w-[240px] flex sm:flex-row flex-col items-center gap-2">
          <div className="  text-blueSite font-bold text-2xl">
              =
          </div>
          <div className=" flex flex-col justify-center gap-4 items-center">
            
          
            <div className='flex flex-col items-start'>
              <span className='sm:text-[18px] text-[16px] '>Total Price :</span>
              <span className='sm:text-[33px] text-[20px] text-[#0B5C8E] font-semibold'>$ {totalPrice}</span>
            </div>
            <button className="sm:px-14 px-8  py-2 bg-blueSite sm:text-[20px] text-[18px] text-textWhiteColor rounded-lg hover:bg-blueSiteHover transition font-medium">
                Add To Cart
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundleOfferSection;
