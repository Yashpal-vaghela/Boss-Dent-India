import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {FaChevronLeft,FaChevronRight} from 'react-icons/fa6'


const OtherBanner = () => {
  const BannerImageData = [
    {
      id: 1,
      src: "/asset/images/Prophy-cups-and-brushes.jpg",
      alt: "Prophy-cups-and-brushes",
    },
    {
      id:2,
      src: "/asset/images/Suction-Tips_.jpg",
      alt: "Suction-tips",
    },
    {
      id:3,
      src: "/asset/images/Comp-Polishing-kit-&-wheel.jpg",
      alt: "Comp-Polishing-kit-and-wheel",
    },
    {
      id:4,
      src: "/asset/images/Veneer-Box-and-Veneer-Glue-Stick.jpg",
      alt: "Venner-box-and-veneer-glue-stick",
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
  // const handleClick = () =>{
  //   console.log("click")
  // }
 
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
                  onClick={() => handleShowImage(item, index)}
                ></img>
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
                      fontSize:"20px",
                      color:"#fff",
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
                      fontSize:"20px",
                      color:"#fff",
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
  );
};

export default OtherBanner;

// <button onClick={handleRotationLeft} className="yarl__button yarl__navigation_prev" type="button" title="Prev">❮</button>
