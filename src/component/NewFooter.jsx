import React from "react";
import { FaFacebook, FaInstagram, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";

const NewFooter = () => {
  return (
    <div>
      <footer className="footer-main-section">
        <div className="row mx-0">
          <div className="col-lg-3 col-sm-6 col-md-6 col-12">
            <div className="footer-section">
              <Link className="footer-logo">
                <img
                  src="/asset/images/footer-logo.png"
                  className="logo"
                  width={250}
                  height={80}
                  alt="BossDent"
                ></img>
              </Link>
              <div className="footer-Meta-description">
                <p>
                  Bossdentindia (Disposables & Consumables) is an online dental
                  product selling store based in Surat Gujarat.
                </p>
              </div>
              <div className="footer-helpline">
                <p className="helpline">
                  Our Help Line:{" "}
                  <span className="helpline-number">+91 76988 28883</span>{" "}
                </p>
              </div>
              <div className="footer-social-media">
                <p className="mb-0 pt-0">
                  Follow Us On <span className="golden-line"></span>
                </p>
                <Link
                  to="https://www.facebook.com/share/FgTSjonfbbaGDbNo/?mibextid=qi2Omg"
                  target="_blank"
                  className="pt-0"
                >
                  <FaFacebook></FaFacebook>
                </Link>
                <Link
                  to="https://www.instagram.com/_bossdent_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                  target="_blank"
                  className="pt-0"
                >
                  <FaInstagram />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-md-6 col-12">
            <div className="footer-section">
              <h1 className="mb-1">Quick Links</h1>
              <ul className="footer-quick-links">
                <li>
                  <Link to="/products">Shop</Link>
                </li>
                <li>
                  <Link to="/aboutus">About Us</Link>
                </li>
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
                <li>
                  <Link to="/wishlist">Wishlist</Link>
                </li>
                <li>
                  <Link to="/my-account">My Account</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 col-md-6 col-12">
            <div className="footer-section">
              <h1 className="mb-1">Policy</h1>
              <ul className="footer-quick-links">
                <li>
                  <Link to="/refund-and-returns-policy">
                    Refund & Return Policy
                  </Link>
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
          </div>
          <div className="col-lg-3 col-sm-6 col-md-6 col-12">
            <div className="footer-section">
              <h1 className="mb-1">Contact Us</h1>
              <div className="footer-contact-content">
                <span className="f-icon">
                  <FaLocationDot />
                </span>
                <span>
                  Plot No. 1 to 8, Marutidham Industrial Estate, Behind Hotel
                  Royal, Velanja Road, Umra, Surat-394130, Gujarat, India
                </span>
              </div>
              <div className="footer-contact-content">
                <span className="f-icon">
                  <FaPhoneAlt />
                </span>
                <strong>+91 76988 28883</strong>
              </div>
              <div className="footer-contact-content">
                <span className="f-icon">
                  <IoMdMail />
                </span>
                <Link to="mailto:zahndentaldepo@gmailcom">
                  zahndentaldepo@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>2024 © all right reserved by BossDentIndia</p>
        </div>
      </footer>
    </div>
  );
};

export default NewFooter;
