import React, { useRef, useState } from 'react';
import banner1 from "../images/banner1.png";
import banner2_1 from "../images/banner2-1.png";
import banner2_2 from "../images/banner-2-2.png";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import cat1 from "../images/hom_cat-1.png";
import cat2 from "../images/home_cat-2.png";
import cat3 from "../images/home_cat-3.webp";
import cat4 from "../images/home_cat-4.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

const Home = () => {
  return (
    <div>
      {/* Banner Section */}
      <section>
        <div className="banner-main">
          <div className="banner-sub">
            <div className="banner-p1">
              <div className="banner-p1-txt">
                <div className="banner-p1-txt-head">
                  <p>100% Premium Quality</p>
                  <h1>GENERAL DENTIST</h1>
                </div>
                <div className="banner-p1-txt-content">
                  <ul>
                    {/* <li>
                      <p>Fast and Safe Delivery</p>
                    </li> */}
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
                        SHOP NOW{" "}
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
          </div>
        </div>
      </section>
      {/* Category Section */}
      <section>
        <div className="home-cat-main">
          <div className="home-cat-sub">
            <div className="home-cat-content-box">
              <Link>
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src={cat1} alt="" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>Prosthodontist</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box">
              <Link>
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src={cat2} alt="" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>LAB Material</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box">
              <Link>
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src={cat3} alt="" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>Genral Dentist</h1>
                </div>
              </Link>
            </div>
            <div className="home-cat-content-box">
              <Link>
                <div className="home-cat-img-box">
                  <div className="home-cat-img-div">
                    <img src={cat4} alt="" />
                  </div>
                </div>
                <div className="home-cat-txt">
                  <h1>Accessories</h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Product Section */}
      <section>
        <div className="home-product-main">
          <div className="home-product-sub">
            
          </div>
        </div>
      </section>
      <section>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={banner1} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2_1} alt="" />
        </SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide> 

        
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
      </section>
    </div>
  );
};

export default Home;
