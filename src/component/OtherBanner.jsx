import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {FaChevronLeft,FaChevronRight} from 'react-icons/fa6'
// import "../css/otherBanner.css";

const OtherBanner = () => {
  const BannerImageData = [
    // {
    //   id: 1,
    //   src: "/asset/images/Composite finishing spiral discs.jpg",
    //   alt: "Composite-finishing-spiral-disc",
    // },
    // {
    //   id: 2,
    //   src: "/asset/images/4 PLY MASK.jpg",
    //   alt: "4-Ply-Mask",
    // },
    // {
    //   id: 3,
    //   src: "/asset/images/MIxing Tips.jpg",
    //   alt: "Mixing-Tips",
    // },
    {
      id: 4,
      src: "/asset/images/Prophy cups and brushes.jpg",
      alt: "Prophy-cups-and-brushes",
    },
    // {
    //   id:5,
    //   src: "/asset/images/Tieon Surgeon Cap.jpg",
    //   alt: "Tieon-surgeon-cap",
    // },
    {
      id:6,
      src: "/asset/images/Suction Tips_.jpg",
      alt: "Suction-tips",
    },
    // {
    //   id:7,
    //   src: "/asset/images/Dispensing Gun.jpg",
    //   alt: "Dispensing-gun",
    // },
    {
      id:8,
      src: "/asset/images/Comp Polishing kit & wheel.jpg",
      alt: "Comp-Polishing-kit-and-wheel",
    },
    // {
    //   id:9,
    //   src: "/asset/images/Starilaization.jpg",
    //   alt: "Starilaization",
    // },
    // {
    //   id:10,
    //   src: "/asset/images/Patient Bibs.jpg",
    //   alt: "Patient-Bibs",
    // },
    {
      id:11,
      src: "/asset/images/Veneer Box and Veneer Glue Stick.jpg",
      alt: "Venner-box-and-veneer-glue-stick",
    },
    // {
    //   id:12,
    //   src: "/asset/images/Patient Draps.jpg",
    //   alt: "Patient-Draps",
    // },
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
  const handleClick = () =>{
    console.log("click")
  }
  return (
    <section className="OtherBanner-section">
      <div className="container-fluid mb-3">
        {/* <h1>Image Gallery</h1> */}
        <div className="row OtherBanner-wrapper">
          {BannerImageData.map((item, index) => {
            return (
              <div key={index} className="col-lg-3 col-12">
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
              slides={clickedImg}
              index={currentIndex}
              on={{ slideChange: handleClick() }}
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
                    {/* <FaArrowLeft size={30} color="white" /> */}
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
              // render={{
              //   buttonPrev: () => {
              //     <div>
              //       <button
              //         type="button"
              //         title="Previous"
              //         aria-label="Previous"
              //         className="yarl__button yarl__navigation_prev"
              //         style={{
              //           position: "absolute",
              //           top: "50%",
              //           left: "20px",
              //           transform: "translateY(-50%)",
              //           backgroundColor: "transparent",
              //           border: "none",
              //           cursor: "pointer",
              //           zIndex: 1000,
              //         }}
              //         onClick={handleRotationLeft}
              //       >
              //         <svg
              //           xmlns="http://www.w3.org/2000/svg"
              //           viewBox="0 0 24 24"
              //           width="24"
              //           height="24"
              //           aria-hidden="true"
              //           focusable="false"
              //           class="yarl__icon"
              //         >
              //           <g fill="currentColor">
              //             <path d="M0 0h24v24H0z" fill="none"></path>
              //             <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              //           </g>
              //         </svg>
              //       </button>
              //     </div>;
              //   },
              //   buttonNext: () => {
              //     <button
              //       // onClick={handleNext}
              //       aria-label="Next"
              //       style={{
              //         position: "absolute",
              //         top: "50%",
              //         right: "20px",
              //         transform: "translateY(-50%)",
              //         backgroundColor: "rgba(0, 0, 0, 0.5)",
              //         border: "none",
              //         cursor: "pointer",
              //         padding: "10px",
              //         zIndex: 1000,
              //       }}
              //     >
              //       Right
              //       {/* <FaArrowRight size={30} color="white" /> */}
              //     </button>;
              //   },
              // }}
            ></Lightbox>
          )}
          {/* {clickedImg && (
            <>
              <LightBox
                setModelOpen={setModelOpen}
                modalopen={ModelOpen}
                currentIndex={BannerImageData.length}
                // clickedImg={clickedImg}
                handleRotationRight={handleRotationRight}
                setClickedImg={setClickedImg}
                handleRotationLeft={handleRotationLeft}
              ></LightBox>
            </>
          )} */}
          {/* <div className="col-lg-4 col-12">
            <img
              src="/asset/images/Suction Tips_.jpg"
              className="img-fluid"
              alt="suction-tips"
            ></img>
          </div>
          <div className="col-lg-4 col-12">
            <img
              src="/asset/images/Prophy cups and brushes.jpg"
              className="img-fluid"
              alt="prophy-cups-and-brushes"
            ></img>
          </div> */}
        </div>
        {/* <div className="d-flex align-items-center justify-content-between OtherBanner-wrapper">
          <img
            src="/asset/images/Comp Polishing kit & wheel.jpg"
            className="img-fluid"
          ></img>
          <img
            src="/asset/images/Suction Tips_.jpg"
            className="img-fluid"
          ></img>
          <img
            src="/asset/images/Prophy cups and brushes.jpg"
            className="img-fluid"
          ></img>
        </div> */}
      </div>
    </section>
  );
};

export default OtherBanner;

// <button onClick={handleRotationLeft} className="yarl__button yarl__navigation_prev" type="button" title="Prev">❮</button>
