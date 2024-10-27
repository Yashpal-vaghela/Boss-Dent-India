import React from "react";
import "../css/styles.css";
import { FaLocationDot } from "react-icons/fa6";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section" data-aos="fade-up" 
        // data-aos-delay="0"
        >
          <Link to="/">
          <img src="/asset/images/flogo1.png" width={250} height={77} alt="BossDent" className="logo" />
          </Link>
          <p>
            Bossdentindia (Disposables & Consumables) is an online dental
            product selling store based in Surat Gujrat.
          </p>
          <p className="helpline">
            Our Help Line:
            <span className="helpline-number">+91 76988 28883</span>
          </p>
          <div className="social-media">
            <p>
              Follow Us On
              <span className="golden-line"></span>
            </p>
            <Link
              to="https://www.facebook.com/share/FgTSjonfbbaGDbNo/?mibextid=qi2Omg"
              target="_blank"
            >
              <FaFacebook />
            </Link>
            <Link
              to="https://www.instagram.com/_bossdent_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div className="footer-section" data-aos="fade-up" 
        // data-aos-delay="200"
        >
          <h3>Quick Links</h3>
          <ul>
            <li>
              <Link to="/products">Shop</Link>
            </li>
            <li>
              <Link to="/aboutus">About Us</Link>
            </li>
            {/* <li>
              <Link to="/gallery">Gallery</Link>
            </li> */}
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
            <li>
              <Link to="/my-account">My Account</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section" data-aos="fade-up" 
        // data-aos-delay="400"
        >
          <h3>Policy</h3>
          <ul>
            <li>
              <Link to="/refund-and-returns-policy">Refund & Returns Policy</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-and-conditions">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/help-center">Help Center</Link>
            </li>
            <li>
              <Link to="/return-exchange">Return & Exchange</Link>
            </li>
          </ul>
        </div>
        <div className="footer-section" data-aos="fade-up" 
        // data-aos-delay="600"
        >
          <h3>Contact Us</h3>
          <p className="f-i-txt align-items-start">
            <span className="f-icon mt-1">
              <FaLocationDot />
            </span>
            {/* <span>Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road, Varachha, Surat</span> */}
            <span>
              Plot No. 1 to 8, Marutidham Industrial Estate, Behind Hotel Royal,
              Velanja Road, Umra, Surat-394130, Gujarat, India
            </span>
          </p>
          <p className="f-i-txt">
            <span className="f-icon">
              <FaPhoneAlt />
            </span>
            <strong>+91 76988 28883</strong>
          </p>
          <p className="f-i-txt">
            <span className="f-icon">
              <IoMdMail />
            </span>
            <Link to="mailto:zahndentaldepo@gmailcom">zahndentaldepo@gmail.com</Link>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2024 © all right reserved by BossDentIndia</p>
      </div>
    </footer>
  );
};

export default Footer;
