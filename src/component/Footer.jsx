import React from 'react'
import '../css/styles.css'
import flogo from "../images/flogo.png"
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaLinkedin, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <img src={flogo} alt="BossDent" className="logo" />
          <p>Bossdentindia (Disposables & Consumables) is an online dental product selling store based in Surat Gujrat.</p>
          <p className="helpline">Our Help Line: <div className='helpline-number'>+91 76988 28883</div></p>
          <div className="social-media">
            <p>Follow Us On
                <span className="golden-line"></span>
            </p>
            {/* <a href="#"><FaLinkedin /></a> */}
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
        <div className="footer-section ">
          <h3>BOSSDENT</h3>
          <ul>
            <li><a href="#">Shop</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="#">Wishlist</a></li>
            <li><a href="/my-account">My Account</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Policy</h3>
          <ul>
            <li><a href="/refund-and-returns-policy">Refund & Returns Policy</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="/help-center">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p className='f-i-txt'> 
            <span className='f-icon'><FaLocationDot /></span>
            <span>Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road, Varachha, Surat</span>
          </p>
          <p className='f-i-txt'>
            <span className='f-icon'><FaPhoneAlt /></span>
            <strong>+91 76988 28883</strong>
          </p>
          <p className='f-i-txt'>
            <span className='f-icon'><IoMdMail /></span>
            <a href="mailto:zahndentaldepo@gmailcom">
                zahndentaldepo@gmail.com
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2024 © all right reserved by BossDentIndia</p>
        {/* <p>Powered By Web Best Solution</p> */}
      </div>
    </footer>
  )
}

export default Footer