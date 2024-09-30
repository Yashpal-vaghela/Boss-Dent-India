import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// import "../css/otherBanner.css";

const OtherBanner = () => {
  const [ModelOpen, setModelOpen] = useState(false);
  const [clickedImg, setClickedImg] = useState([]);

  // const handleClick = (item, index) => {
  //   setModelOpen((prev) => !prev);
  //   setCurrentIndex(index);
  //   setClickedImg([
  //     { src: item?.img, title: item.title, address: item.address },
  //   ]);
  // };

  const handleShowImage = (item, index) => {
    // setImageModal(item);
    setModelOpen(true);
    // setModelOpen((prev) => !prev);
    // setCurrentIndex(index);
    setClickedImg([{ src: item?.src }]);
  };


  const BannerImageData = [
    {
      id:1,
      src: "/asset/images/Composite finishing spiral discs.jpg",
      alt: "Prophy-cups-and-brushes",
    },
    {
      id:2,
      src: "/asset/images/4 PLY MASK.jpg",
      alt: "4-Ply-Mask",
    },
    {
      id:3,
      src: "/asset/images/MIxing Tips.jpg",
      alt: "Mixing-Tips",
    },
    {
      id:4,
      src: "/asset/images/Prophy cups and brushes.jpg",
      alt: "Prophy-cups-and-brushes",
    },
    {
      id:5,
      src: "/asset/images/Tieon Surgeon Cap.jpg",
      alt: "Prophy-cups-and-brushes",
    },
    {
      id:6,
      src: "/asset/images/Suction Tips_.jpg",
      alt: "Suction-tips",
    },
    {
      id:6,
      src: "/asset/images/Comp Polishing kit & wheel.jpg",
      alt: "Comp-Polishing-Kit-and-wheel",
    }
  ];
 
 
  return (
    <section className="OtherBanner-section">
      <div className="container-fluid">
        <h1>Image Gallery</h1>
        <div className="row OtherBanner-wrapper">
          {BannerImageData.map((item, index) => {
            return (
              <div key={index} className="col-lg-2 col-12">
                <img
                  src={item.src}
                  className="img-fluid"
                  alt={item.alt}
                  onClick={() => setModelOpen(true)}
                ></img>
              </div>
            );
          })}
          {clickedImg && (
            <Lightbox
              open={ModelOpen}
              close={() => setModelOpen(false)}
              slides={BannerImageData}
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
