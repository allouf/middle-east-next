"use client"
import React, { useState, useEffect } from 'react'
import { SponsoredCategory, MappedSponsoredProduct } from '../type'

import asideImg from "@/assets/images/homeAside.png"
import Button from '@/components/ui/Button'
import { FaArrowRightLong, FaArrowLeftLong } from 'react-icons/fa6'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import ProductCard from '@/components/cards/product/ProductCard'
import { useTranslation } from "@/lib/i18n/useTranslation"
import { useLocaleDirection } from "@/lib/i18n/useLocaleDirection"

interface SponsoredProductsClientProps {
    sponsoredProducts: MappedSponsoredProduct[]
    sponsoredCategories: SponsoredCategory[]
}

const SponsoredProducts_client = ({ sponsoredProducts, sponsoredCategories }: SponsoredProductsClientProps) => {
    const { t } = useTranslation()
    const { isRTL } = useLocaleDirection()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)


    useEffect(() => {
        const categoryId = searchParams.get('category_id')
        if (categoryId) {
            setSelectedCategory(Number(categoryId))
        } else {
            setSelectedCategory(null)
        }
    }, [searchParams])

    
    // console.log("sponsoredProducts", sponsoredProducts);

    const handleCategoryClick = (categoryId: number | null) => {
        const params = new URLSearchParams(searchParams.toString())
        if (categoryId) {
            params.set('category_id', categoryId.toString())
        } else {
            params.delete('category_id')
        }
        router.push(`?${params.toString()}`, { scroll: false })
    }

    return (
        <div className='flex md:flex-row flex-col gap-5 p-4 md:p-10'>
            {/* aside Card */}
            <div className=' bg-[#E6F0ED] max-h-[740px] w-full md:max-w-[250px] lg:max-w-[300px] 2xl:max-w-[350px] flex md:flex-col flex-row justify-center items-center p-6 space-y-5 rounded-sm'>
                <div>
                    <Image src={asideImg} width={280} height={350} alt={t("product.sponsoredImageAlt")} />
                </div>

                <div className='flex flex-col gap-5'>
                    <div className=' text-center space-y-4'>
                        <h2 className='text-subTitleColor text-[28px] lg:text-[30px]'>{t("product.sponsoredProductsViewed")}</h2>
                        <p className='text-textColor text-[18px] lg:text-[20px]'>{t("product.exploreSponsoredProducts")}</p>
                    </div>
                    <div className='w-full'>
                        <Button
                            scale={1.03}
                            unstyled
                            className='bg-blueSite w-full rounded-lg px-4 py-2 text-white text-[22px] flex flex-row gap-3 items-center justify-center'>
                            {t("product.shopNow")} {isRTL ? <FaArrowLeftLong /> : <FaArrowRightLong />}
                        </Button>
                    </div>
                </div>
            </div>

            <div className='flex-1'>
                {/* sponsored categories */}
                <div className='mb-6'>
                    <div className='flex flex-wrap gap-3 items-center'>
                        {/* All button */}
                        <button
                            onClick={() => handleCategoryClick(null)}
                            className={`px-6 py-2 rounded-[7px] text-sm font-medium transition-all duration-200 ${selectedCategory === null
                                ? 'bg-blueSite text-white'
                                : 'text-subTitleColor border border-[#74747433] '
                                }`}
                        >
                            {t("product.all")}
                        </button>

                        {/* Category buttons */}
                        {sponsoredCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`px-6 py-2 rounded-[7px] text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selectedCategory === category.id
                                    ? 'bg-blueSite text-white'
                                    : ' text-subTitleColor border border-[#74747433] '
                                    }`}
                            >
                                {/* {category.icon && (
                                <img 
                                    src={category.icon} 
                                    alt={category.name}
                                    className='w-4 h-4 object-cover rounded-full'
                                />
                            )} */}
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {sponsoredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {sponsoredProducts.map((product) => {
                            const firstImage = product.gallery?.[0]?.file_path;
                            const productWithImage = {
                                ...product,
                                image: firstImage,
                            };
                            return (<ProductCard
                                key={product.id}
                                product={productWithImage}
                                showCartIcon={true}
                                isSecondary={true}
                                defaultBadge={"sponsored"}
                            />);

                        })}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">{t("product.noSponsoredProductsAvailable")}</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default SponsoredProducts_client
