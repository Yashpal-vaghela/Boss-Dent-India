import React from 'react'
import '../css/styles.css'
import flogo from "../images/flogo.png"

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <img src={flogo} alt="BossDent" className="logo" />
          <p>Bossdentindia (Disposables & Consumables) is an online dental product selling store based in Surat Gujrat.</p>
          <p className="helpline">Our Help Line: <strong>+91 76988 28883</strong></p>
          <div className="social-media">
            <p>Follow Us On</p>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
        <div className="footer-section">
          <h3>BOSSDENT</h3>
          <ul>
            <li><a href="#">Shop</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Wishlist</a></li>
            <li><a href="#">My Account</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Policy</h3>
          <ul>
            <li><a href="#">Refund & Returns Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road, Varachha, Surat</p>
          <p><strong>+91 76988 28883</strong></p>
          <p><a href="mailto:zahndentaldepo@gmail.com">zahndentaldepo@gmail.com</a></p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>2024 © all right reserved by BossDentIndia</p>
        <p>Powered By Web Best Solution</p>
      </div>
    </footer>
  )
}

export default Footer