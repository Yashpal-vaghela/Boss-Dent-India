import React, { useState } from "react";
import "yet-another-react-lightbox/styles.css";
import { Link } from "react-router-dom";

const OtherBanner = () => {
  const BannerImageData = [
    {
      id: 1,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Comp-Polishing-kit.webp",
      slug: "products?category=120",
      alt: "Prophy-cups-and-brushes",
      width: 300,
      height: 400,
    },
    {
      id: 2,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Suction-Tips_.webp",
      slug: "products?category=123",
      alt: "Suction-tips",
      width: 300,
      height: 400,
    },
    {
      id: 3,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Prophy-cups-and-brushes.webp",
      slug: "products?category=117",
      alt: "Comp-Polishing-kit-and-wheel",
      width: 300,
      height: 400,
    },
    {
      id: 4,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Veneer-Box-and-Veneer-Glue-Stick.webp",
      slug: "products?category=75",
      alt: "Venner-box-and-veneer-glue-stick",
      width: 300,
      height: 400,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="OtherBanner-section">
      <div className="container-fluid">
        {/* <h1>Image Gallery</h1> */}
        <div className="row OtherBanner-wrapper px-0">
          {BannerImageData.map((item, index) => {
            return (
              <div
                key={index}
                className="col-lg-3 col-md-3 col-sm-6 col-12 mb-lg-0 mb-4"
                data-aos="zoom-in"
              >
                <Link to={item?.slug}>
                  {/* <img
                    src={item.src}
                    className="img-fluid"
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    // loading="lazy"
                    // onClick={() => handleShowImage(item, index)}
                  /> */}
                  <picture>
                    <source srcSet={item.src} type="image/webp"></source>
                    <img
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      className="img-fluid"
                    ></img>
                  </picture>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="more-product-image">
          <Link
            to="/gallery"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <i
              className="fa-solid fa-plus"
              style={{
                display: "inline-block",
                transition: "transform 0.3s ease",
                transform: isHovered ? "rotate(140deg)" : "rotate(0deg)",
              }}
            ></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OtherBanner;
