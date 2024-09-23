import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

import "../css/cards.css";

// import required modules
import { EffectCards } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";

const Cards = () => {
  const surgoncaps = [
    { capimage: "/asset/images/All-surgon-cap.jpg", capname: "Tieon Surgeon Caps" },
    { capimage: "/asset/images/Blue-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Blue)" },
    { capimage: "/asset/images/Pink-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Pink)" },
    { capimage: "/asset/images/Black-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Black)" },
    { capimage: "/asset/images/Red-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Red)" },
    { capimage: "/asset/images/Purple-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Purple)" },
    { capimage: "/asset/images/Green-surgon-cap.jpg", capname: "Tieon Surgeon Cap (Green)" },
  ];
  const airwater = [
    { airimage: "/asset/images/All-airwater (2).jpg", airname: "Air Water Syringe" },
    { airimage: "/asset/images/Airwater-11.jpg", airname: "Air Water Syringe (Radium)" },
    { airimage: "/asset/images/Airwater-9.jpg", airname: "Air Water Syringe (Purple)" },
    { airimage: "/asset/images/Airwater-8.jpg", airname: "Air Water Syringe (Yellow)" },
    { airimage: "/asset/images/Airwater-7.jpg", airname: "Air Water Syringe (Orange)" },
    { airimage: "/asset/images/Airwater-6.jpg", airname: "Air Water Syringe (Green)" },
    { airimage: "/asset/images/Airwater-5.jpg", airname: "Air Water Syringe (Pink)" },
    { airimage: "/asset/images/Airwater-4.jpg", airname: "Air Water Syringe (Blue)" },
    { airimage: "/asset/images/Airwater-3.jpg", airname: "Air Water Syringe (SkyBlue)" },
    { airimage: "/asset/images/Airwater-2.jpg", airname: "Air Water Syringe (White)" },
  ];

  const applicators = [
    { appimage: "/asset/images/Allapplicator.jpg", appname: "Micro Applicator Tips" },
    { appimage: "/asset/images/Applicator-pink-1.jpg", appname: "Micro Applicator Tips (Pink)" },
    { appimage: "/asset/images/Applicator-yellow-2.jpg", appname: "Micro Applicator Tips (Yellow)" },
    { appimage: "/asset/images/Applicator-white-3.jpg", appname: "Micro Applicator Tips (White)" },
    { appimage: "/asset/images/Applicator-green-4.jpg", appname: "Micro Applicator Tips (Green)" },
  ];

  const navigate = useNavigate();
  return (
    <div className="cards-main">
      <div className="variable-cards-title-main">
        <h2 className="variable-cards-title">Our Packeges Products</h2>
      </div>
      <div className="variable-cards-main">
        <div className="cards-1-main">
          <Link to="/products/2159" className="cards-1">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
              {surgoncaps.map((product, index) => (
                <SwiperSlide key={index} className="slide">
                  <img
                    src={product.capimage}
                    alt={`Slide ${index + 1}`}
                    className="slide-image"
                  />
                  {/* <Link className="card-product-name" to="/products/2159"> */}
                  <span
                    className="card-product-name"
                    onClick={() => navigate("/products/2159")}
                  >
                    {product.capname}
                  </span>
                  {/* </Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </Link>
          <Link to="/products/1976" className="cards-1">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
              {airwater.map((product, index) => (
                <SwiperSlide key={index} className="slide">
                  <img
                    src={product.airimage}
                    alt={`Slide ${index + 1}`}
                    className="slide-image"
                  />
                  <span
                    className="card-product-name"
                    onClick={() => navigate("/products/2159")}
                  >
                    {product.airname}
                  </span>
                  {/* <Link className="card-product-name" to="/products/2159">{product.airname}</Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </Link>
          <Link to="/products/1698" className="cards-1">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
              {applicators.map((product, index) => (
                <SwiperSlide key={index} className="slide">
                  <img
                    src={product.appimage}
                    alt={`Slide ${index + 1}`}
                    className="slide-image"
                  />
                  <span
                    className="card-product-name"
                    onClick={() => navigate("/products/2159")}
                  >
                    {product.appname}
                  </span>
                  {/* <Link className="card-product-name" to="/products/2159">{product.appname}</Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cards;
