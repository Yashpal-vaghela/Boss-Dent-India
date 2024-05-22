import React from "react";
import '../css/styles.css';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import logo from '../images/footer-logo-2.png';
import { MdCall } from 'react-icons/md';
import { IoMail } from 'react-icons/io5';

const Footer = () =>{
    return(
    <footer className="footer">
            <div className="footer-container">
            <div className="footer-section">
                <img src={logo} alt="BossDent Logo" className="footer-logo" />
                <p>
                Bossdentindia (Disposables & Consumables) is an online dental product selling store based in Surat Gujrat.
                </p>
                <p>Our Help Line:</p>
                <h2>+91 76988 28883</h2>
                <div className="footer-follow">
                    <p>Follow Us On</p>
                    <div className="footer-socials">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaInstagram /></a>
                    </div>
                </div>
                
            </div>
            <div className="footer-section">
                <h3>BOSSDENT</h3>
                <ul>
                <li><a href="/shop">Shop</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/wishlist">Wishlist</a></li>
                <li><a href="/account">My Account</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Policy</h3>
                <ul>
                <li><a href="/refund">Refund & Returns Policy</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms & Conditions</a></li>
                <li><a href="/help">Help Center</a></li>
                </ul>
            </div>
            <div className="footer-section">
                <h3>Contact Us</h3>
                <p><FaLocationDot /> Plot no.3-3/3-4/ Dhuna house, opp. Patel Nagar, A.k. Road, Varachha, Surat.</p>
                <p><MdCall /> +91 76988 28883</p>
                <p><IoMail /> zahndentaldepo@gmail.com</p>
            </div>
            </div>
    </footer>  
    );
};
export default Footer;