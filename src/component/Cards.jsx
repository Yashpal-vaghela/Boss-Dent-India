import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";

const Cards = () => {
  const surgoncaps = [
    {
      capimage: "/asset/images/All-surgon-cap.webp",
      capname: "Tieon Surgeon Caps",
    },
    {
      capimage: "/asset/images/Blue-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Blue)",
    },
    {
      capimage: "/asset/images/Pink-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Pink)",
    },
    {
      capimage: "/asset/images/Black-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Black)",
    },
    {
      capimage: "/asset/images/Red-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Red)",
    },
    {
      capimage: "/asset/images/Purple-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Purple)",
    },
    {
      capimage: "/asset/images/Green-surgon-cap1.jpg",
      capname: "Tieon Surgeon Cap (Green)",
    },
  ];
  const masks = [
    { airimage: "/asset/images/maskall.jpg", airname: "Masks (3ply & 4ply)" },
    { airimage: "/asset/images/maskall1.jpg", airname: "Masks (3ply & 4ply)" },
    { airimage: "/asset/images/mask1.jpg", airname: "Orange" },
    { airimage: "/asset/images/mask2.jpg", airname: "Green" },
    { airimage: "/asset/images/mask3.jpg", airname: "Blue" },
    { airimage: "/asset/images/mask4.jpg", airname: "Pink" },
    { airimage: "/asset/images/mask5.jpg", airname: "yelllow" },
    { airimage: "/asset/images/mask6.jpg", airname: "Black" },
    { airimage: "/asset/images/mask7.jpg", airname: "White" },
    { airimage: "/asset/images/mask8.jpg", airname: "White" },
    { airimage: "/asset/images/mask9.jpg", airname: "Purple" },
  ];

  const applicators = [
    {
      appimage: "/asset/images/Tipsnew.jpg",
      appname: "Micro Applicator Tips",
    },
    {
      appimage: "/asset/images/tipsnew1.jpg",
      appname: "Elongated Micro Applicator Tips",
    },
    {
      appimage: "/asset/images/tipsnew2.jpg",
      appname: "Elongated Micro Applicator Tips",
    },
    // { appimage: "/asset/images/TIPS3.jpg", appname: "Micro Applicator Tips" },
    {
      appimage: "/asset/images/tipsnew4.jpg",
      appname: "Fine Micro Applicator Tips",
    },
    {
      appimage: "/asset/images/tipsnew5.jpg",
      appname: "Fine Micro Applicator Tips",
    },
    {
      appimage: "/asset/images/tipsnew6.jpg",
      appname: "Super Fine Micro Applicator Tips",
    },
  ];

  const navigate = useNavigate();

  return (
    <section className="Product-cards">
      <div className="cards-main">
        <div className="variable-cards-title-main">
          <h2 className="variable-cards-title">Our Products</h2>
        </div>
        <div className="variable-cards-main">
          <div className="cards-1-main">
            <Link className="cards-1" to="/products/tieon-surgeon-cap-washable">
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
                    {/* <Link
                    className="card-product-name"
                    to="/products/tieon-surgeon-cap-washable"
                    // onClick={() => {
                    //   localStorage.setItem("productId", 2159);
                    // }}
                  >
                    {product.capname}
                  </Link> */}
                    <span
                      className="card-product-name"
                      onClick={() =>
                        navigate("/products/tieon-surgeon-cap-washable")
                      }
                    >
                      {product.capname}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Link>

            <Link to="/products?category=118" className="cards-1">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                modules={[EffectCards]}
                className="mySwiper-1"
              >
                {masks.map((product, index) => (
                  <SwiperSlide key={index} className="slide">
                    <img
                      src={product.airimage}
                      alt={`Slide ${index + 1}`}
                      className="slide-image"
                    />
                    <span
                      className="card-product-name"
                      onClick={() => navigate("/products?category=118")}
                    >
                      {product.airname}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Link>
            <Link to="/products/micro-applicator-tips" className="cards-1">
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
                      onClick={() => {
                        navigate("/products/micro-applicator-tips");
                      }}
                    >
                      {product.appname}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cards;
