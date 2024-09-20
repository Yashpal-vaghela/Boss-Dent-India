import React, { useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css'; // Import AOS styles
// import about1 from "../images/about-img_1.jpg";
// import about2 from "../images/about-img_2.jpg";
import "../css/about.css";
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import BreadCrumbs from '../component/BreadCrumbs';

const About = () => {
  // useEffect(() => {
  //   AOS.init({
  //     duration: 1000, // Animation duration in milliseconds
  //     once: false,    // Allow animations to trigger multiple times
  //     mirror: true,   // Trigger animations on scroll up
  //   });
  // }, []);

  return (
    <div className='container'>
      <div className="header" data-aos="fade-up">
        <h1 className="cart-title">About us</h1>
        <BreadCrumbs></BreadCrumbs>
      </div>
      <div className='about-main-page'>
        <div className='about-img-main' data-aos="fade-left">
          <div className='about-img-1'>
            <img src="/asset/images/about-img_1.jpg" alt="" className='about-img-item-1'/>
          </div>
          <div className='about-img-2'>
            <img src="/asset/images/about-img_2.jpg" alt="" className='about-img-item-2' />
          </div>
        </div>
        <div className='about-txt-main' data-aos="fade-right">
          <p className='about-sub-title' data-aos="fade-right" data-aos-delay="0">What We Are Doing For Our Business</p>
          <h2 className='about-title' data-aos="fade-right" data-aos-delay="200">Bossdentindia Create Unique High-quality Product.</h2>
          <div className='about-txt-p'>
            <p className='about-txt'data-aos="fade-right" data-aos-delay="300">BossDentIndia is a leading online retailer specializing in dental products and equipment. We offer a wide range of high-quality dental supplies, instruments, and accessories to dental professionals, students, and individuals seeking dental care products. Our mission is to provide exceptional products and excellent customer service to support the dental community’s needs.</p>
            <p className='about-txt'data-aos="fade-right" data-aos-delay="400">At BossDentIndia, we are committed to delivering superior dental products and ensuring customer satisfaction. We strive to maintain the highest standards of quality, reliability, and affordability in all our offerings. We continuously work towards expanding our product selection, staying up-to-date with the latest advancements in dental technology, and fostering strong relationships with dental manufacturers to provide the best solutions to our customers.</p>
          </div>
          <Link to="/contact" className='about-btn-main'data-aos="fade-right" data-aos-delay="800">
            <button className='about-btn' data-aos="fade-right" data-aos-delay="600">Contact With Us <span className='about-icon'><IoIosArrowForward /></span></button>
          </Link>
        </div>
      </div>
      <div className='quality-assurance-main' data-aos="fade-up">
        <p className='q-sub-title'>How We Over Come</p>
        <h3 className='q-title'>Quality Assurance</h3>
        <div className='q-txt-main'>
          <p className='q-txt'>Quality is of utmost importance to us. We ensure that all products available on BossDentIndia meet stringent quality standards. We carefully select our suppliers and conduct rigorous quality checks to ensure that our customers receive reliable, safe, and effective dental products. Our commitment to quality extends to every aspect of our operations, including order processing, packaging, and shipping.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
