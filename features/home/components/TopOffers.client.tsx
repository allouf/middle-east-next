'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import HeaderHome from "./HeaderHome";
import SwiperProductsContainer from "./SwiperProductsContainer";
import ProductCard from "@/components/cards/product/ProductCard";

import { MappedProdcut } from "../type";

interface TopOffersClientProps {
    products: MappedProdcut[];
}
const TopOffersClient: React.FC<TopOffersClientProps> = ({ products }) => {
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    // console.log("topOffers",products)
    return (
        <section className=" p-4 md:p-10">
            <div className="mx-auto">
                <HeaderHome
                    text={t("topOffers.title")}
                    url="/products?attr=top_offers"
                    // onClick={() => setExpanded(!expanded)}
                    // showText={
                    //     expanded
                    //         ? t("topOffers.viewFewer")
                    //         : t("topOffers.viewAll")
                    // }
                />
                {expanded ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                toggleProduct={() => { }}
                                selected={[]}
                                selectable={false}
                                showCartIcon={true}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="w-full">
                        <SwiperProductsContainer
                            products={products}
                            showCartIcon={true}
                            navigationRefs={[]}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default TopOffersClient;
