import React, { useState } from "react";
import BreadCrumbs from "../component/BreadCrumbs";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Gallery = () => {
  const GalleryData = [
    { id: 1, product_img: "/asset/images/4 PLY MASK.jpg", alt: "4Ply-Mask" },
    {
      id: 2,
      product_img: "/asset/images/Dispensing Gun.jpg",
      alt: "Dispensing-Gun",
    },
    { id: 3, product_img: "/asset/images/MIxing Tips.jpg", alt: "Mixing-Tips" },
    {
      id: 4,
      product_img: "/asset/images/Patient Bibs.jpg",
      alt: "Patient-Bibs",
    },
    {
      id: 5,
      product_img: "/asset/images/Patient Draps.jpg",
      alt: "Patient-Draps",
    },
    {
      id: 6,
      product_img: "/asset/images/Starilaization.jpg",
      alt: "Starilaization",
    },
    {
      id: 7,
      product_img: "/asset/images/Tieon Surgeon Cap.jpg",
      alt: "Tieon-Surgeon-Cap",
    },
  ];
  const [ModelOpen, setModelOpen] = useState(false);
  const [clickedImg, setClickedImg] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleShowImage = (item, index) => {
    console.log("item", item);
    setModelOpen((prev) => !prev);
    setCurrentIndex(index);
    setClickedImg([{ product_img: item.product_img }]);
  };

  const handleRotationLeft = () => {
    const totalLength = GalleryData.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = GalleryData[totalLength - 1].product_img;
      setClickedImg([{ product_img: newUrl }]);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = GalleryData.filter((item) => {
      // console.warn("item=====",item, BannerImageData.indexOf(item), newIndex);
      return GalleryData.indexOf(item) === newIndex;
    });

    const newItem = newUrl[0].product_img;
    // console.log("newUrl", newUrl, "newINdex", newIndex,"newItem",newItem);
    setClickedImg([{ product_img: newItem }]);
    setCurrentIndex(newIndex);
  };
  const handleRotationRight = () => {
    const totalLength = GalleryData.length;
    if (currentIndex + 1 >= totalLength) {
      setCurrentIndex(0);
      const newUrl = GalleryData[0].product_img;
      setClickedImg([{ product_img: newUrl }]);
      return;
    }
    const newIndex = currentIndex + 1;
    const newUrl = GalleryData.filter((item) => {
      return GalleryData.indexOf(item) === newIndex;
    });
    const newItem = newUrl[0].product_img;
    setClickedImg([{ product_img: newItem }]);
    setCurrentIndex(newIndex);
  };
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
                  <img
                    src={item.product_img}
                    className="img-fluid"
                    alt={item.alt}
                    onClick={() => handleShowImage(item, index)}
                  ></img>
                </div>
              );
            })}
            {clickedImg && (
              <Lightbox
                open={ModelOpen}
                close={() => setModelOpen(false)}
                slides={GalleryData}
                index={currentIndex}
                render={{
                  // Custom Previous Button
                  buttonPrev: () => (
                    <button
                      onClick={() => {
                        handleRotationLeft();
                      }}
                      type="button"
                      aria-label="Previous"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "20px",
                        transform: "translateY(-50%)",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "10px",
                        zIndex: 1000,
                        fontSize: "20px",
                        color: "#fff",
                      }}
                    >
                      <FaChevronLeft></FaChevronLeft>
                    </button>
                  ),
                  // Custom Next Button
                  buttonNext: () => (
                    <button
                      onClick={() => {
                        handleRotationRight();
                      }}
                      aria-label="Next"
                      className="btn btn-next"
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "20px",
                        transform: "translateY(-50%)",
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "10px",
                        zIndex: 1000,
                        fontSize: "20px",
                        color: "#fff",
                      }}
                    >
                      <FaChevronRight></FaChevronRight>
                    </button>
                  ),
                }}
              ></Lightbox>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;