import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
// import { FaCartPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaCartPlus } from "react-icons/fa";
import { useEffect, useState } from "react";
import "swiper/css";

const RelatedProducts = ({
  relatedProducts,
  watchlist,
  handleWatchlistToggle,
  handleAddToCart,
}) => {
  const [stockStatusList, setStockStatusList] = useState([]);

  useEffect(() => {
    if (!Array.isArray(relatedProducts) || relatedProducts.length === 0) {
      return;
    }

    fetch("https://admin.bossdentindia.com/wp-json/custom/v1/stock-status/all")
      .then((res) => res.json())
      .then((data) => {
        const relatedProductIds = relatedProducts.map((p) => String(p.id)); // Convert all IDs to string

        const filtered = data.filter((item) =>
          relatedProductIds.includes(item.product_id)
        );
        setStockStatusList(filtered); // Save only relevant stock info
      })
      .catch((err) => console.error("❌ Failed to fetch stock statuses", err));
  }, [relatedProducts]);

  const isOutOfStock = (relatedProduct) => {
    if (!relatedProduct || !relatedProduct.id) {
      return false;
    }
    const productStock = stockStatusList.find(
      (item) => item.product_id === String(relatedProduct.id)
    );
    return productStock?.stock_status === "outofstock";
  };

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
        // loop={slides.length > slidesPerView}
        // loopfillgroupwithblank={true}
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
              <div className="related-product-card position-relative">
                {isOutOfStock(relatedProduct) && (
                  <div
                    className="position-absolute start-50 bg-dark bg-opacity-75 text-danger px-3 py-2 fw-bold text-uppercase text-center w-100"
                    style={{
                      top: "35%",
                      transform: "translateX(-50%)",
                      pointerEvents: "none",
                      zIndex: 20,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Out of Stock
                  </div>
                )}
                <Link
                  to={`/products/${encodeURIComponent(relatedProduct.slug)}`}
                >
                  <div className="image-container">
                    {relatedProduct.discount > 0 && (
                      <div className="discount-badge">
                        {`${relatedProduct.discount}% off`}
                      </div>
                    )}
                  </div>
                  <img
                    src={relatedProduct.yoast_head_json?.og_image?.[0]?.url}
                    alt={relatedProduct.title?.rendered}
                  />
                  <h4 className="related-product-title">
                    {relatedProduct.title?.rendered}
                  </h4>
                  <p>
                    {relatedProduct.regular_price && relatedProduct.price ? (
                      relatedProduct.regular_price !== relatedProduct.price ? (
                        // If regular_price and price are different, show both
                        <>
                          Price:{" "}
                          <span className="regular-price">
                            {relatedProduct.regular_price}
                          </span>
                          <span className="sale-price">
                            {relatedProduct.price} ₹
                          </span>
                        </>
                      ) : (
                        // If regular_price and price are the same, show only one price
                        <span className="price">{relatedProduct.price} ₹</span>
                      )
                    ) : (
                      // Fallback in case one of the prices is missing
                      `Price: ${relatedProduct.price} ₹`
                    )}
                  </p>
                </Link>

                <div className="related-icons">
                  <span
                    className={`heart-icon ${
                      !watchlist.includes(relatedProduct.id)
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
                    className={`add-to-cart-icon ${
                      isOutOfStock(relatedProduct) ? "disabled text-muted" : ""
                    }`}
                    onClick={(e) => {
                      if (!isOutOfStock(relatedProduct)) {
                        handleAddToCart(e, relatedProduct, true);
                      }
                    }}
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
  );
};

export default RelatedProducts;
