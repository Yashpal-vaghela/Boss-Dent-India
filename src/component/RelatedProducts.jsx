import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// import { FaCartPlus } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaCartPlus } from 'react-icons/fa';
import 'swiper/css';

const RelatedProducts = ({
    relatedProducts,
    watchlist,
    handleWatchlistToggle,
    handleAddToCart
}) => {
    return (
        <div className="related-products">
            <h3 className="related-title">Related Products</h3>
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                navigation
                autoplay={{
                    delay: 6000, // Delay between slides in ms
                    disableOnInteraction: false, // Continue autoplay after user interactions
                }}
                // centeredSlides="false"
                loop={true}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 4,
                    },
                }}
            >
                {relatedProducts.map((relatedProduct) => {
                    return (
                        <SwiperSlide key={relatedProduct.id}>
                            <div className="related-product-card">
                                <Link
                                    to={`/products/${encodeURIComponent(
                                        relatedProduct.slug
                                    )}`}
                                >
                                    <div className="image-container">
                                        {relatedProduct.discount > 0 && (
                                            <div className="discount-badge">
                                                {`${relatedProduct.discount}% off`}
                                            </div>
                                        )}
                                    </div>
                                    <img
                                        src={
                                            relatedProduct.yoast_head_json?.og_image?.[0]?.url
                                            // relatedImageUrl.replace("https://","https://admin.")
                                        }
                                        alt={relatedProduct.title?.rendered}
                                    />
                                    <h4 className="related-product-title">
                                        {relatedProduct.title?.rendered}
                                    </h4>
                                    <p>
                                        {relatedProduct.regular_price &&
                                            relatedProduct.price ? (
                                            relatedProduct.regular_price !==
                                                relatedProduct.price ? (
                                                // If regular_price and price are different, show both
                                                <>
                                                    <span
                                                        className="regular-price"
                                                        style={{ textDecoration: "line-through" }}
                                                    >
                                                        {relatedProduct.regular_price} ₹
                                                    </span>
                                                    <span className="sale-price">
                                                        {relatedProduct.price} ₹
                                                    </span>
                                                </>
                                            ) : (
                                                // If regular_price and price are the same, show only one price
                                                <span className="price">
                                                    {relatedProduct.price} ₹
                                                </span>
                                            )
                                        ) : (
                                            // Fallback in case one of the prices is missing
                                            `Price: ${relatedProduct.price} ₹`
                                        )}
                                    </p>
                                </Link>

                                <div className="related-icons">
                                    <span
                                        className={`heart-icon ${!watchlist.includes(relatedProduct.id)
                                            ? ""
                                            : "inactive-heart"
                                            }`}
                                        onClick={() => handleWatchlistToggle(relatedProduct)}
                                    >
                                        {watchlist.includes(relatedProduct.id) ? (
                                            <FaHeart />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </span>
                                    <span
                                        className="add-to-cart-icon"
                                        onClick={(e) => handleAddToCart(e, relatedProduct)}
                                    >
                                        <FaCartPlus />
                                    </span>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    )
}

export default RelatedProducts