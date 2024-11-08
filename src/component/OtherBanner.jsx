import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {FaChevronLeft,FaChevronRight} from 'react-icons/fa6'


const OtherBanner = () => {
  const BannerImageData = [
    {
      id: 1,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Comp-Polishing-kit.webp",
      alt: "Prophy-cups-and-brushes",
      width: 300,
      height: 400,
    },
    {
      id:2,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Suction-Tips_.webp",
      // src:"/asset/images/Comp-Polishing-kit.webp"
      alt: "Suction-tips",
      width: 300,
      height: 400,
    },
    {
      id:3,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Prophy-cups-and-brushes.webp",
      alt: "Comp-Polishing-kit-and-wheel",
      width: 300,
      height: 400,
    },
    {
      id:4,
      src: "https://new-product-banner.s3.ap-south-1.amazonaws.com/Veneer-Box-and-Veneer-Glue-Stick.webp",
      alt: "Venner-box-and-veneer-glue-stick",
      width: 300,
      height: 400,
    },
  ];
  const [ModelOpen, setModelOpen] = useState(false);
  const [clickedImg, setClickedImg] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleShowImage = (item, index) => {
    setModelOpen((prev) => !prev);
    setCurrentIndex(index);
    setClickedImg([{ src: item?.src }]);
  };

  const handleRotationLeft = () => {
    const totalLength = BannerImageData.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalLength - 1);
      const newUrl = BannerImageData[totalLength - 1].src;
      setClickedImg([{ src: newUrl }]);
      return;
    }
    const newIndex = currentIndex - 1;
    const newUrl = BannerImageData.filter((item) => {
      // console.warn("item=====",item, BannerImageData.indexOf(item), newIndex);
      return BannerImageData.indexOf(item) === newIndex;
    });
    
    const newItem = newUrl[0].src;
    // console.log("newUrl", newUrl, "newINdex", newIndex,"newItem",newItem);
    setClickedImg([{ src: newItem }]);
    setCurrentIndex(newIndex)
  };

  const handleRotationRight = () =>{
    const totalLength = BannerImageData.length;
    if(currentIndex + 1 >= totalLength){
      setCurrentIndex(0);
      const newUrl = BannerImageData[0].src;
      setClickedImg([{src:newUrl}])
      return ;
    }
    const newIndex = currentIndex + 1;
    const newUrl = BannerImageData.filter((item)=>{
      return BannerImageData.indexOf(item) === newIndex;
    })
    const newItem = newUrl[0].src;
    setClickedImg([{src:newItem}])
    setCurrentIndex(newIndex)
  }
 
  return (
    <section className="OtherBanner-section">
      <div className="container-fluid">
        {/* <h1>Image Gallery</h1> */}
        <div className="row OtherBanner-wrapper">
          {BannerImageData.map((item, index) => {
            return (
              <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-12 mb-lg-0 mb-4 " data-aos="zoom-out">
                <img
                  src={item.src}
                  className="img-fluid"
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  onClick={() => handleShowImage(item, index)}
                />
              </div>
            );
          })}
          {clickedImg && (
            <Lightbox
              open={ModelOpen}
              close={() => setModelOpen(false)}
              slides={BannerImageData}
              index={currentIndex}
              render={{
                // Custom Previous Button
                buttonPrev: () => (
                  <button
                    onClick={() => {
                      handleRotationLeft();
                    }}
                    aria-label="Previous"
                    className="lightbox-button btn-prev"
                  >
                    <FaChevronLeft />
                  </button>
                ),
                // Custom Next Button
                buttonNext: () => (
                  <button
                    onClick={() => {
                      handleRotationRight();
                    }}
                    aria-label="Next"
                    className="lightbox-button btn-next"
                  >
                    <FaChevronRight />
                  </button>
                ),
              }}
            ></Lightbox>
          )}
        </div>
      </div>
    </section>
  );
};

export default OtherBanner;
