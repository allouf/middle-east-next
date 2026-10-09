'use client';

// @ts-nocheck
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ProductRate from "../../../../components/cards/product/ProductRate";
import Star from "@/components/ui/Star";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Format date to "DD MMM, YYYY" format (e.g., "26 Apr, 2021")
const formatReviewDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

// Calculate average rating from reviews
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((sum, review) => {
    const rating = review.rating || 0;
    return sum + rating;
  }, 0);

  return totalRating / reviews.length;
};

// Calculate rating distribution from reviews
const calculateRatingDistribution = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      5: 20,
      4: 60,
      3: 5,
      2: 5,
      1: 10,
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });

  const total = reviews.length;
  return {
    5: total > 0 ? Math.round((distribution[5] / total) * 100) : 0,
    4: total > 0 ? Math.round((distribution[4] / total) * 100) : 0,
    3: total > 0 ? Math.round((distribution[3] / total) * 100) : 0,
    2: total > 0 ? Math.round((distribution[2] / total) * 100) : 0,
    1: total > 0 ? Math.round((distribution[1] / total) * 100) : 0,
  };
};

// Rating Distribution Bar Component
const RatingDistributionBar = ({ star, percentage }: { star: number; percentage: number }) => {
  return (
    <div className="flex flex-row items-center gap-[6px] w-full mx-auto" 
    style={{
      maxWidth:"470px"
    }}>
      <span
        className="text-center font-semibold leading-[1.75] tracking-[0.5%] text-lg md:text-2xl lg:text-[30px] flex-shrink-0"
        style={{
          color: "#393937",
        
          fontWeight: 600,
          minWidth: "40px"
        }}
      >
        {star}
      </span>
      <div
        className="flex-1 overflow-hidden "
        style={{ 
          height: "10.19px",
          borderRadius: "12.590471267700195px",
          backgroundColor: "#F2EBE2",
          maxWidth:"470px"
        }}
      >
        <motion.div
          className="h-full"
          style={{ 
            backgroundColor: "#00664F",
            borderRadius: "12.590471267700195px"
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span
        className="text-center font-normal leading-[1.21] text-base md:text-lg lg:text-xl flex-shrink-0"
        style={{
          color: "#393937",
          fontFamily: "Inter",
          fontWeight: 400,
          minWidth: "50px"
        }}
      >
        {percentage}%
      </span>
    </div>
  );
};

const ProductReviewsSection = ({ product }) => {
  const { t } = useTranslation();
  // Dummy review data for testing
  const dummyReviews = [
    {
      id: 1,
      user: { name: "John Smith" },
      rating: 5,
      description: "Excellent product! The quality exceeded my expectations and the customer service was outstanding. Highly recommend to anyone looking for a reliable solution.",
      created_at: "2024-01-15T10:30:00Z",
      images: [
        "/dummy/ComputerMonitor.png",
        "/dummy/smartPhone.png",
        "/dummy/drone.png"
      ]
    },
    {
      id: 2,
      user: { name: "Sarah Johnson" },
      rating: 4,
      description: "Great value for money. The product works as described and arrived quickly. Only minor issue was with packaging but overall very satisfied.",
      created_at: "2024-01-10T14:20:00Z",
      images: []
    },
    {
      id: 3,
      user: { name: "Michael Chen" },
      rating: 5,
      description: "Outstanding quality and fast shipping! This is exactly what I was looking for. Will definitely purchase again.",
      created_at: "2024-01-05T09:15:00Z",
      images: []
    },
    {
      id: 4,
      user: { name: "Emily Davis" },
      rating: 3,
      description: "Good product overall. The quality is decent and price is reasonable. Could use some improvements in the user manual.",
      created_at: "2023-12-28T16:45:00Z",
      images: []
    },
    {
      id: 5,
      user: { name: "Robert Wilson" },
      rating: 4,
      description: "Very satisfied with this purchase. The product meets all my needs and the build quality is solid. Would recommend to others.",
      created_at: "2023-12-20T11:30:00Z",
      images: []
    }
  ];

  const reviews = product?.reviews?.length > 0 ? product.reviews : dummyReviews;
  const reviewCount = reviews.length;

  // Calculate average rating from reviews array
  const avgRating = useMemo(
    () => calculateAverageRating(reviews),
    [reviews]
  );

  const ratingDistribution = useMemo(
    () => calculateRatingDistribution(reviews),
    [reviews]
  );

  // Generate avatar placeholder based on name
  const getAvatarUrl = (name) => {
    if (!name) return "https://ui-avatars.com/api/?name=User&background=00664f&color=fff&size=40";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00664f&color=fff&size=40`;
  };

  return (
    <div className="w-full">
      <div 
        className="grid grid-cols-1 lg:grid-cols-2  gap-8 lg:gap-12 xl:gap-16 w-full "
        style={{ padding: "40px 0px" }}
      >
      {/* Left Column: Rating Summary */}
      <div 
       
        style={{
          marginTop:"60px"
        }}
      >
        <div className=" flex flex-col items-center gap-8 md:gap-10">
        {/* Rating Number and Stars */}
          <div className="flex flex-col items-center justify-center gap-[15px]  w-[470px]">
            <h1
              className="text-6xl md:text-7xl lg:text-[90px] font-bold text-blueSite"

            >
              {avgRating.toFixed(1)}
            </h1>
            <div className="flex items-center gap-5">
              <ProductRate rating={avgRating} size={40} hideText={true} />
            </div>
            <p
              className="w-full text-center text-xl md:text-2xl lg:text-[32px]"
              style={{
             
                fontWeight: 600,
                lineHeight: "1.2102272510528564em",
                color: "#393937"
              }}
            >
              {t("product.reviews.basedOn")} {reviewCount} {reviewCount !== 1 ? t("product.reviews.reviews") : t("product.reviews.review")}
            </p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="w-full xl:w-[90%] flex flex-col gap-[14px]">
            {[5, 4, 3, 2, 1].map((star) => (
              <RatingDistributionBar 
                key={star} 
                star={star} 
                percentage={ratingDistribution[star]} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Comments */}
      <div 
        className="flex flex-col gap-8 md:gap-10 "
      >
        <div className="flex flex-col gap-[27px]">
          <h2
            className="text-lg md:text-xl"
            style={{ 
          
              fontWeight: 500,
              lineHeight: "1.4em",
              color: "#191C1F"
            }}
          >
            {t("product.reviews.comments")}
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: "#323232", fontSize: "18px" }}>
                {t("product.reviews.noReviewsYet")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {reviews.map((review, index) => (
                <div key={review.id || index}>
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <img
                      src={getAvatarUrl(review.user?.name)}
                      alt={review.user?.name || "User"}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        flexShrink: 0
                      }}
                    />

                    {/* Review Content */}
                    <div className="flex-1" style={{ marginLeft: "12px" }}>
                      {/* Name, Bullet, Date */}
                      <div className="flex items-center gap-[6px] mb-0">
                        <span
                          style={{
                            fontSize: "16px",
                    
                            fontWeight: 600,
                            lineHeight: "1.2102272510528564em",
                            color: "#041F2F",
                            textTransform: "uppercase"
                          }}
                        >
                          {review.user?.name || t("product.reviews.anonymous")}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                          
                            fontWeight: 400,
                            lineHeight: "1.4285714285714286em",
                            color: "#77878F"
                          }}
                        >
                          •
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                          
                            fontWeight: 400,
                            lineHeight: "1.2102272510528564em",
                            color: "#747474",
                            textTransform: "uppercase"
                          }}
                        >
                          {formatReviewDate(review.created_at)}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mt-2">
                        <ProductRate size={20} rating={review.rating} hideText={true}/>
                      </div>

                      {/* Review Text */}
                      <p
                        style={{
                          fontSize: "18px",
                          fontWeight: 400,
                          lineHeight: "1.2102272245619032em",
                          color: "#323232",
                          marginTop: "10px"
                        }}
                      >
                        {review.description || review.comment || t("product.reviews.noDescriptionProvided")}
                      </p>

                      {/* Review Images */}
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-[26px] mt-3">
                          {review.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={typeof image === "string" ? image : image.url || image.file_path}
                              alt={`Review ${index + 1} - Image ${imgIndex + 1}`}
                              style={{
                                width: "139px",
                                height: "108px",
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #000000"
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider Line */}
                  {index < reviews.length - 1 && (
                    <div
                      className="w-full"
                      style={{ 
                        height: "1px",
                        backgroundColor: "#E4E7E9",
                        marginTop: "27px",
                        marginBottom: "27px"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {reviews.length > 0 && (
          <div className="flex justify-start">
            <Button 
              unstyled
              scale={1.03}
              className="flex items-center  justify-center bg-blueLight border border-blueSite rounded-[10px] text-blueSite transition-colors hover:opacity-90 px-8 py-2 md:px-12 md:py-3 text-lg md:text-xl"
              // style={{
              //   backgroundColor: "#E7F5FD",
              //   border: "1px solid #32A7EF",
              //   borderRadius: "10px",
              //   fontFamily: "Inter",
              //   fontWeight: 700,
              //   lineHeight: "1.2102272033691406em",
              //   color: "#32A7EF"
              // }}
            >
              {t("product.reviews.loadMore")}
            </Button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default ProductReviewsSection;

