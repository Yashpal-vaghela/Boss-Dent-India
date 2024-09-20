import React, {  useRef, useState } from "react";
import { Link } from "react-router-dom";
// import cat1 from "../images/hom_cat-1.png";
// import cat2 from "../images/home_cat-2.png";
// import cat3 from "../images/home_cat-3.webp";
// import cat4 from "../images/home_cat-4.png";
// import gloves from "../images/gloves.png";
// import vincismile from "../images/v2-logo.png";
// import banner1 from "../images/Bossdent-Web-banners-01.jpg";
// import banner2 from "../images/Bossdent-Web-banners-02.jpg";
// import banner3 from "../images/Bossdent-Web-banners-03.jpg";
// import banner4 from "../images/Bossdent-Web-banners-04.jpg";
import { FaPlay, FaPause } from "react-icons/fa";
import { MdLocalShipping, MdSecurity, MdSupportAgent } from "react-icons/md";
import "../css/othercard.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Cards from "../component/Cards";
// import SimpleSlider from "../component/SimpleSlider";

const Home = () => {
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
  }
 
  return (
    <div className="home-main">
      {/* Banner Section */}
      <section>
        <div className="banner-main">
          {/* <div className="banner-sub">
            <div className="banner-p1">
              <div className="banner-p1-txt">
                <div className="banner-p1-txt-head">
                  <p>100% Premium Quality</p>
                  <h1>GENERAL DENTIST</h1>
                </div>
                <div className="banner-p1-txt-content">
                  <ul>
                    <li>
                      <p>Fast and Safe Delivery</p>
                    </li>
                    <li>
                      <p>Cash on delivery available</p>
                    </li>
                    <li>
                      <p>Best Support & Services</p>
                    </li>
                  </ul>
                </div>
                <div className="banner-p1-txt-btn">
                  <button className="banner-btn">
                    SHOP NOW{" "}
                    <span>
                      <IoIosArrowDroprightCircle />
                    </span>
                  </button>
                </div>
              </div>
              <div className="banner-p1-img-div">
                <div className="banner-p1-image-main">
                  <Link>
                    <img
                      src={banner1}
                      alt=""
                      style={{ borderRadius: "10px" }}
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="banner-p2">
              <div className="banner-p2-fbox">
                <div className="banner-p2-fbox-sub">
                  <div className="banner-p2-fbox-content">
                    <div className="banner-p2-fbox-content-txt">
                      <h1>LAB MATERIAL</h1>
                      <p>DENTAL PRODUCT</p>
                    </div>
                    <div className="banner-p2-fbox-content-btn">
                      <button className="banner-btn">
                        SHOP NOW            
                        <span>
                          <IoIosArrowDroprightCircle />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="banner-p2-fbox-img">
                    <div className="banner-p2-fbox-img-sub">
                      <img src={banner2_1} alt="" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="banner-p2-sbox">
                <div className="banner-p2-sbox-sub">
                  <div className="banner-p2-sbox-img">
                    <div className="banner-p2-sbox-img-sub">
                     
                     <img src={banner2_2} alt="" />
                    </div>
                  </div>
                  <div className="banner-p2-sbox-content">
                    <div className="banner-p2-sbox-content-txt">
                      <h1>PROSTHODONTIST</h1>
                      <p>QUALITY PRODUCT</p>
                    </div>
                    <div className="banner-p2-sbox-content-btn">
                      <button className="banner-btn">
                        SHOP NOW{" "}
                        <span>
                          <IoIosArrowDroprightCircle />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </section>
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
                  src="/asset/images/Bossdent-Web-banners-01.jpg"
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
                  src="/asset/images/Bossdent-Web-banners-02.jpg"
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
                  src="/asset/images/Bossdent-Web-banners-03.jpg"
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
                  src="/asset/images/Bossdent-Web-banners-04.jpg"
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
            backgroundColor: "transparent",
            color: "#c89c31",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isAutoplay ? <FaPause /> : <FaPlay />}
        </button>
      </section>
      {/* Category Section */}
      <section>
        <div className="home-cat-main">
          <div className="home-cat-sub">
            <div
              className="home-cat-content-box"
              data-aos="fade-down"
              data-aos-delay="0"
            >
              <Link to="/products?category=116">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src="/asset/images/gloves.png" alt="gloves" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>All Gloves</h1>
                </div>
              </Link>
            </div>
            <div
              className="home-cat-content-box"
              data-aos="fade-down"
              data-aos-delay="400"
            >
              <Link to="/products?category=75">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src="/asset/images/home_cat-3.webp" alt="General Dentist" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>General Dentist</h1>
                </div>
              </Link>
            </div>
            <div
              className="home-cat-content-box"
              data-aos="fade-down"
              data-aos-delay="200"
            >
              <Link to="/products?category=127">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src="/asset/images/v2-logo.png" alt="Vincismile" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>Vincismile</h1>
                </div>
              </Link>
            </div>

            <div
              className="home-cat-content-box"
              data-aos="fade-down"
              data-aos-delay="600"
            >
              <Link to="/products?category=125">
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src="/asset/images/retractor.png" alt="retractor" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>All Retactors</h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Banner */}
      <section>
        <div className="other-banner-main" data-aos="fade-down">
          <div className="other-banner">
            <div className="banner-txt" data-aos="fade-right">
              <p className="b-txt-1">The Best Doctor Recommended</p>
              <p className="b-txt-2">
                <span className="txt-2-name">TopCEM Dual</span>{" "}
                <span className="txt-2-underline">Cure Resin Cement</span>{" "}
                {/* <span className="txt-2-discount"> 10%</span>{" "}
                <span className="txt-2-dicount-type">Flat Discount</span> */}
              </p>
            </div>
            <div className="other-banner-btn-main">
              <Link to="/products/1158" className="other-banner-btn-0">
                <button className="other-banner-btn">SEE COLLECTION</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Variables products */}
      <section>
        <Cards />
      </section>

      {/* other section */}

      <section>
        <div className="other-cards-main-section">
          <div className="main-title-other-card-main">
            <h2 className="main-title" data-aos="fade-down"
              data-aos-delay="0">Our Services</h2>
          </div>
          <div className="other-cards-main">
            <div className="other-card-main-1" data-aos="fade-down"
              data-aos-delay="0">
              <div className="other-card-icon-main">
                <span className="other-card-icon" data-aos="fade-right"
                  data-aos-delay="0"><MdLocalShipping /></span>
              </div>
              <div className="other-card-title-main">
                <h2 className="other-card-title" data-aos="fade-left"
                  data-aos-delay="0">
                  FAST SHIPPING
                </h2>
              </div>
            </div>
            <div className="other-card-main-2" data-aos="fade-down"
              data-aos-delay="200">
              <div className="other-card-icon-main" data-aos="fade-right"
                data-aos-delay="200">
                <span className="other-card-icon">
                  <MdSecurity />
                </span>
              </div>
              <div className="other-card-title-main" data-aos="fade-left"
                data-aos-delay="200">
                <h2 className="other-card-title">
                  SECURE PAYMENT
                </h2>
              </div>
            </div>
            <div className="other-card-main-3" data-aos="fade-down"
              data-aos-delay="400">
              <div className="other-card-icon-main">
                <span className="other-card-icon" data-aos="fade-right"
                  data-aos-delay="400">
                  <MdSupportAgent />
                </span>
              </div>
              <div className="other-card-title-main">
                <h2 className="other-card-title" data-aos="fade-left"
                  data-aos-delay="400">
                  BEST SUPPORT
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
