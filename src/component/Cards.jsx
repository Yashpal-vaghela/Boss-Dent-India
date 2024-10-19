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
    {
      capimage: "/asset/images/All-surgon-cap.jpg",
      capname: "Tieon Surgeon Caps",
    },
    {
      capimage: "/asset/images/Blue-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Blue)",
    },
    {
      capimage: "/asset/images/Pink-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Pink)",
    },
    {
      capimage: "/asset/images/Black-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Black)",
    },
    {
      capimage: "/asset/images/Red-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Red)",
    },
    {
      capimage: "/asset/images/Purple-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Purple)",
    },
    {
      capimage: "/asset/images/Green-surgon-cap.jpg",
      capname: "Tieon Surgeon Cap (Green)",
    },
  ];
  const masks = [
    { airimage: "/asset/images/masc10.jpg", airname: "Masks (3ply & 4ply)" },
    { airimage: "/asset/images/masc1.jpg", airname: "Masks (3ply & 4ply)" },
    { airimage: "/asset/images/masc2.jpg", airname: "Orange" },
    { airimage: "/asset/images/masc3.jpg", airname: "Green" },
    { airimage: "/asset/images/masc4.jpg", airname: "Blue" },
    { airimage: "/asset/images/masc5.jpg", airname: "Pink" },
    { airimage: "/asset/images/masc6.jpg", airname: "yelllow" },
    { airimage: "/asset/images/masc7.jpg", airname: "Black" },
    { airimage: "/asset/images/masc8.jpg", airname: "White" },
    { airimage: "/asset/images/masc11.jpg", airname: "White" },
    { airimage: "/asset/images/masc15.jpg", airname: "Purple" },
  ];

  const applicators = [
    {
      appimage: "/asset/images/TIPS.jpg",
      appname: "Elongated Micro Applicator Tips",
    },
    { appimage: "/asset/images/TIPS1.jpg", appname: "Micro Applicator Tips" },
    { appimage: "/asset/images/TIPS2.jpg", appname: "Micro Applicator Tips" },
    // { appimage: "/asset/images/TIPS3.jpg", appname: "Micro Applicator Tips" },
    { appimage: "/asset/images/TIPS4.jpg", appname: "Micro Applicator Tips" },
    {
      appimage: "/asset/images/TIPS5.jpg",
      appname: "Fine Micro Applicator Tips",
    },
    {
      appimage: "/asset/images/TIPS6.jpg",
      appname: "Super Fine Micro Applicator Tips",
    },
  ];

  const navigate = useNavigate();
  const handleProductNavigate = (e, slug, id) => {
    console.log("e", e, slug, id);
    navigate(`/products/${encodeURIComponent(slug)}}`, {
      state: { productId: id },
    });
  };
  return (
    <div className="cards-main">
      <div className="variable-cards-title-main">
        <h2 className="variable-cards-title">Our Products</h2>
      </div>
      <div className="variable-cards-main">
        <div className="cards-1-main">
          <div
            className="cards-1 "
            onClick={(e) =>
              handleProductNavigate(e, "tieon-surgeon-cap-washable", 2159)
            }
          >
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
                    onClick={(e) =>
                      handleProductNavigate(
                        e,
                        "tieon-surgeon-cap-washable",
                        2159
                      )
                    }
                  >
                    {product.capname}
                  </span>
                  {/* </Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* <Link
            to="/products/Tieon-Surgeon-Caps"
            className="cards-1 "
            onClick={(e) =>
              handleProductNavigate(e, "/products/Tieon-Surgeon-Caps", 2159)
            }
          ></Link> */}
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
                    onClick={() => navigate("/products/1913")}
                  >
                    {product.airname}
                  </span>
                  {/* <Link className="card-product-name" to="/products/2159">{product.airname}</Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </Link>
          <div
            className="cards-1"
            onClick={(e) =>
              handleProductNavigate(e,"micro-applicator-tips",1698)
            }
          >
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
                    onClick={(e) =>
                      handleProductNavigate(e,"micro-applicator-tips",1698)
                    }
                    // onClick={() =>
                    //   navigate("/products/Elongated-Micro-Applicator-Tips")
                    // }
                  >
                    {product.appname}
                  </span>
                  {/* <Link className="card-product-name" to="/products/2159">{product.appname}</Link> */}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* <Link
            to="/products/Elongated-Micro-Applicator-Tips"
            className="cards-1 "
          >
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Cards;
