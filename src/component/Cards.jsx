import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import '../css/cards.css';
import Image1 from '../images/1.jpg';
import Image2 from '../images/2.jpg';
import Image3 from '../images/3.jpg';
import Image4 from '../images/4.jpg';

// import required modules
import { EffectCards } from 'swiper/modules';
import { Link } from 'react-router-dom';

const Cards = () => {
  const products = [
    { image: Image1, name: 'Tieon Surgeon Cap' },
    { image: Image2, name: 'Product 2' },
    { image: Image3, name: 'Product 3' },
    { image: Image4, name: 'Product 4' },
  ];

  return (
    <div className='cards-main'>
      <div className="variable-cards-title-main">
        <div className="variable-cards-title"></div>
      </div>
      <div className="variable-cards-main">
        <div className="cards-1-main">
          <div className="cards-1">
            <Swiper 
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
               {products.map((product, index) => (
                <SwiperSlide key={index} className='slide'>
                  <img src={product.image} alt={`Slide ${index + 1}`} className='slide-image' />
                  <Link className="product-name" to="/products/2159">{product.name}</Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="cards-1">
            <Swiper 
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
              <SwiperSlide className='slide-1'>Slide 1</SwiperSlide>
              <SwiperSlide className='slide-2'>Slide 2</SwiperSlide>
              <SwiperSlide className='slide-3'>Slide 3</SwiperSlide>
              <SwiperSlide className='slide-4'>Slide 4</SwiperSlide>
              <SwiperSlide className='slide-5'>Slide 5</SwiperSlide>
              <SwiperSlide className='slide-6'>Slide 6</SwiperSlide>
              <SwiperSlide className='slide-7'>Slide 7</SwiperSlide>
              <SwiperSlide className='slide-8'>Slide 8</SwiperSlide>
              <SwiperSlide className='slide-9'>Slide 9</SwiperSlide>
            </Swiper>
          </div>
          <div className="cards-1">
            <Swiper 
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="mySwiper-1"
            >
              <SwiperSlide className='slide-1'>Slide 1</SwiperSlide>
              <SwiperSlide className='slide-2'>Slide 2</SwiperSlide>
              <SwiperSlide className='slide-3'>Slide 3</SwiperSlide>
              <SwiperSlide className='slide-4'>Slide 4</SwiperSlide>
              <SwiperSlide className='slide-5'>Slide 5</SwiperSlide>
              <SwiperSlide className='slide-6'>Slide 6</SwiperSlide>
              <SwiperSlide className='slide-7'>Slide 7</SwiperSlide>
              <SwiperSlide className='slide-8'>Slide 8</SwiperSlide>
              <SwiperSlide className='slide-9'>Slide 9</SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
