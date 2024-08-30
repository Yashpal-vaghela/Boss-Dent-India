import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import '../css/cards.css';
import Allcaps from '../images/All-surgon-cap.jpg';
import Bluecap from '../images/Blue-surgon-cap.jpg';
import Pinkcap from '../images/Pink-surgon-cap.jpg';
import Blackcap from '../images/Black-surgon-cap.jpg';
import Redcap from '../images/Red-surgon-cap.jpg';
import Purplecap from '../images/Purple-surgon-cap.jpg';
import Greencap from '../images/Green-surgon-cap.jpg';

import Allairwater from '../images/All-airwater.jpg';
import airwater1 from '../images/Airwater-1.jpg';
import airwater2 from '../images/Airwater-2.jpg';
import airwater3 from '../images/Airwater-3.jpg';
import airwater4 from '../images/Airwater-4.jpg';
import airwater5 from '../images/Airwater-5.jpg';
import airwater6 from '../images/Airwater-6.jpg';
import airwater7 from '../images/Airwater-7.jpg';
import airwater8 from '../images/Airwater-8.jpg';
import airwater9 from '../images/Airwater-9.jpg';

import Allapplicator from '../images/Allapplicator.jpg';
import applicator1 from '../images/Applicator-pink-1.jpg';
import applicator2 from '../images/Applicator-yellow-2.jpg';
import applicator3 from '../images/Applicator-white-3.jpg';
import applicator4 from '../images/Applicator-green-4.jpg';






// import required modules
import { EffectCards } from 'swiper/modules';
import { Link } from 'react-router-dom';

const Cards = () => {
  const surgoncaps = [
    { capimage: Allcaps, capname: 'Tieon Surgeon Caps' },
    { capimage: Bluecap, capname: 'Tieon Surgeon Cap (Blue)' },
    { capimage: Pinkcap, capname: 'Tieon Surgeon Cap (Pink)' },
    { capimage: Blackcap, capname: 'Tieon Surgeon Cap (Black)' },
    { capimage: Redcap, capname: 'Tieon Surgeon Cap (Red)' },
    { capimage: Purplecap, capname: 'Tieon Surgeon Cap (Purple)' },
    { capimage: Greencap, capname: 'Tieon Surgeon Cap (Green)' },
  ];
  const airwater = [
    { airimage: Allairwater, airname: 'Air Water Syringe' },
    { airimage: airwater1, airname: 'Air Water Syringe (Radium)' },
    { airimage: airwater9, airname: 'Air Water Syringe (Purple)' },
    { airimage: airwater8, airname: 'Air Water Syringe (Yellow)' },
    { airimage: airwater7, airname: 'Air Water Syringe (Orange)' },
    { airimage: airwater6, airname: 'Air Water Syringe (Green)' },
    { airimage: airwater5, airname: 'Air Water Syringe (Pink)' },
    { airimage: airwater4, airname: 'Air Water Syringe (Blue)' },
    { airimage: airwater3, airname: 'Air Water Syringe (SkyBlue)' },
    { airimage: airwater2 , airname: 'Air Water Syringe (White)' },
  ];

  const applicators = [
    { appimage: Allapplicator, appname: 'Micro Applicator Tips' },
    { appimage: applicator1, appname: 'Micro Applicator Tips (Pink)' },
    { appimage: applicator2, appname: 'Micro Applicator Tips (Yellow)' },
    { appimage: applicator3, appname: 'Micro Applicator Tips (White)' },
    { appimage: applicator4, appname: 'Micro Applicator Tips (Green)' },
  ];

  return (
    <div className='cards-main'>
      <div className="variable-cards-title-main">
          <h2 className='variable-cards-title'>Our Packeges Products</h2>
      </div>
      <div className="variable-cards-main">
        <div className="cards-1-main">
          <Link to="/products/2159"  className="cards-1">
            <Swiper 
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
               {surgoncaps.map((product, index) => (
                <SwiperSlide key={index} className='slide'>
                  <img src={product.capimage} alt={`Slide ${index + 1}`} className='slide-image' />
                  <Link className="card-product-name" to="/products/2159">{product.capname}</Link>
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
                <SwiperSlide key={index} className='slide'>
                  <img src={product.airimage} alt={`Slide ${index + 1}`} className='slide-image' />
                  <Link className="card-product-name" to="/products/2159">{product.airname}</Link>
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
                <SwiperSlide key={index} className='slide'>
                  <img src={product.appimage} alt={`Slide ${index + 1}`} className='slide-image' />
                  <Link className="card-product-name" to="/products/2159">{product.appname}</Link>
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
