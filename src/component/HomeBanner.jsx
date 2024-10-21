import React, { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const HomeBanner = () => {
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const swiperRef = useRef(null);
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

  const handleImageLoad = () => {
    setIsLoaded(true);
  };
  return (
    <section
      style={{ position: "relative" }}
      className="banner-section"
      data-aos="fade-down"
    >
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
          >
            <div className="banneer-img-main">
              <img
                src="/asset/images/Bossdent ( Web banners-01).webp"
                alt="banner1"
                className={`banner-img ${isLoaded ? "loaded" : "loading"}`}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </div>
            {/* <div className="banner-btn-main">
                <Link to="/products" className="banner-btn-link">
                  <button className="banner-btn-shop">
                    Shop Now{""}
                    <span className="banner-btn-icon">
                      <IoMdArrowDropright />
                    </span>
                  </button>
                </Link>
              </div> */}
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link
            to="/products/2092"
            className="banner-2-main"
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
          >
            <div className="banneer-img-main">
              <img
                src="/asset/images/Bossdent ( Web banners-02).webp"
                alt="banner2"
                className={`banner-img ${isLoaded ? "loaded" : "loading"}`}
                onLoad={handleImageLoad}
                loading="lazy"
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
          >
            <div className="banneer-img-main">
              <img
                src="/asset/images/Bossdent ( Web banners-03).webp"
                alt="banner3"
                className={`banner-img ${isLoaded ? "loaded" : "loading"}`}
                onLoad={handleImageLoad}
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
                src="/asset/images/Bossdent ( Web banners-04).webp"
                alt="banner4"
                className={`banner-img ${isLoaded ? "loaded" : "loading"}`}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            </div>
            {/* <div className="banner-btn-main-4">
                <Link to="/products" className="banner-btn-link">
                  <button className="banner-btn-shop">
                    Shop Now{" "}
                    <span className="banner-btn-icon">
                      <IoMdArrowDropright />
                    </span>{" "}
                  </button>
                </Link>
              </div> */}
          </Link>
        </SwiperSlide>
      </Swiper>
      {/* <SimpleSlider/> */}

      <button
        onClick={toggleAutoplay}
        style={{
          position: "absolute",
          top: "10px",
          fontSize: "16px",
          right: "17px",
          zIndex: 10,
          padding: "10px",
          backgroundColor: "#f6f6f6",
          color: "#c89c31",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isAutoplay ? <FaPause /> : <FaPlay />}
      </button>
    </section>
  );
};

export default HomeBanner;
