import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

import '../css/cards.css';


// import required modules
import { EffectCards } from 'swiper/modules';

const Cards = () => {
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
