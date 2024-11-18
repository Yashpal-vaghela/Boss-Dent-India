import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeBanner = () => {
  const [isAutoplay, setIsAutoplay] = useState(true);
  const swiperRef = useRef(null);

  const bannerImages = [
    "https://new-product-banner.s3.ap-south-1.amazonaws.com/Patient-drape-banner.webp",
    "https://new-product-banner.s3.ap-south-1.amazonaws.com/Mask-banner.webp",
    "https://new-product-banner.s3.ap-south-1.amazonaws.com/Reactors-banner.webp",
    "https://new-product-banner.s3.ap-south-1.amazonaws.com/Patient-bibs-banner.webp"
  ];

  useEffect(() => {
    // Preload each image
    bannerImages.forEach((src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = src;
      link.as = "image";
      document.head.appendChild(link);
    });

    // Cleanup function to remove preloads if component unmounts
    return () => {
      document.querySelectorAll("link[rel='preload'][as='image']").forEach((link) => link.remove());
    };
  }, []);

  const toggleAutoplay = () => {
    if (isAutoplay) {
      swiperRef.current.swiper.autoplay.stop();
    } else {
      swiperRef.current.swiper.autoplay.start();
    }
    setIsAutoplay(!isAutoplay);
  };

  // Stop autoplay on hold (MouseDown or TouchStart)
  const handleHoldStart = () => {
    swiperRef.current.swiper.autoplay.stop();
  };

  // Resume autoplay on release (MouseUp or TouchEnd)
  const handleHoldEnd = () => {
    swiperRef.current.swiper.autoplay.start();
  };

  return (
    <section style={{ position: "relative" }} className="banner-section" data-aos="fade-down">
      <Swiper
        ref={swiperRef}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        lazy={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <Link
            to="/products?category=119"
            className="banner-1-main"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onClick={() => {
              return localStorage.getItem("Product_page") > 1
                ? localStorage.setItem("Product_page", 1)
                : null;
            }}
          >
            <div className="banneer-img-main">
              <img
                src={bannerImages[0]}
                alt="banner1"
                className="banner-img"
                loading="eager"
              />
            </div>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            to="/products?category=118"
            className="banner-3-main"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            onClick={() => {
              return localStorage.getItem("Product_page") > 1
                ? localStorage.setItem("Product_page", 1)
                : null;
            }}
          >
            <div className="banneer-img-main">
              <img
                src={bannerImages[1]}
                alt="banner3"
                className="banner-img"
                loading="lazy"
              />
            </div>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            to="/products?category=125"
            className="banner-4-main"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
          >
            <div className="banneer-img-main">
              <img
                src={bannerImages[2]}
                alt="banner4"
                className="banner-img"
                loading="lazy"
              />
            </div>
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            to="/products/patient-bibs"
            className="banner-2-main"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
          >
            <div className="banneer-img-main">
              <img
                src={bannerImages[3]}
                alt="banner2"
                className="banner-img"
                loading="lazy"
              />
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>

      <button
        onClick={toggleAutoplay}
        className="homebanner_pause_btn"
      >
        {isAutoplay ? <FaPause /> : <FaPlay />}
      </button>
    </section>
  );
};

export default HomeBanner;
