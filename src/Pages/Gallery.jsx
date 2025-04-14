import React from "react";
import BreadCrumbs from "../component/BreadCrumbs";
// import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Link } from "react-router-dom";
import "../css/gallery.css";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Gallery = () => {
  const GalleryData = [
    {
      id: 1,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Comp-Polishing-kit.webp",
      slug: "/products?category=120",
      alt: "Comp-Polishing-kit",
    },
    // {
    //   id: 2,
    //   src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Prophy-cups-and-brushes.webp",
    //   alt: "Prophy-cups-and-brushes",
    // },
    {
      id: 3,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Veneer-Box-and-Veneer-Glue-Stick.webp",
      slug: "/products?category=75",
      alt: "Veneer-box-and-Veneer-Glue-Stick",
    },
    {
      id: 4,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/4-PLY-MASK.webp",
      slug: "/products?category=118",
      alt: "4Ply-Mask",
    },
    {
      id: 5,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Dispensing+Gun.webp",
      slug: "/products?category=46",
      alt: "Dispensing-Gun",
    },
    {
      id: 6,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/MIxing+Tips.webp",
      slug: "/products/micro-applicator-tips",
      alt: "Mixing-Tips",
    },
    {
      id: 7,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Patient+Bibs.webp",
      slug: "/products/patient-bibs",
      alt: "Patient-Bibs",
    },
    {
      id: 8,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Patient+Draps.webp",
      slug: "/products/premium-patient-drape-washable-cotton-pvc",
      alt: "Patient-Draps",
    },
    {
      id: 9,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Starilaization.webp",
      slug: "/products?category=75",
      alt: "Starilaization",
    },
    {
      id: 10,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Tieon+Surgeon+Cap.webp",
      slug:"/products/tieon-surgeon-cap-washable",
      alt: "Tieon-Surgeon-Cap",
    },
  ];

  return (
    <div className="container">
      <section className="gallery-section">
        <div className="header" data-aos="fade-up">
          <h1 className="shop-title">Gallery</h1>
          <BreadCrumbs />
        </div>
        <div className="gallery-content">
          <div className="row m-4">
            {GalleryData.map((item, index) => {
              return (
                <div
                  className="col-lg-4 col-md-6 col-12 gallery-product-img"
                  key={index}
                >
                  <Link to={item.slug} >
                    <img
                      src={item.src}
                      className="img-fluid"
                      alt={item.alt}
                      // onClick={() => handleShowImage(item, index)}
                    ></img>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
