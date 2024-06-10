import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUserAlt, FaHeart, FaCartPlus, FaSearch, FaPhoneAlt } from "react-icons/fa";
import logo from "../images/flogo.png";
import { IoMdCloseCircle } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    var menuSubElements = document.getElementsByClassName("menu-sub");
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      for (var i = 0; i < menuSubElements.length; i++) {
        menuSubElements[i].style.top = "0";
      }
    } else {
      for (var i = 0; i < menuSubElements.length; i++) {
        menuSubElements[i].style.top = "70px";
      }
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`nav-main ${menuOpen ? 'nav-main-open' : ''}`}>
      <div className="nav-sub">
        <div className="main-nav">
          <div className="main-nav-sub">
            <div className="top-nav-p2">
              <div className="top-p2-txt">
                <p>Follow Us On</p>
              </div>
              <hr />
              <div className="top-p2-icon">
                <Link>
                  <FaFacebookF />
                </Link>
                <Link>
                  <FaInstagram />
                </Link>
              </div>
            </div>
            <div className="search-main">
              <div className="search-sub">
                <input type="text" placeholder="Search For Products ..." />
                <span>
                  <FaSearch />
                </span>
              </div>
            </div>

            <div className="menu-num-sub">
              <div className="menu-num-icon">
                <span>
                  <FaPhoneAlt />
                </span>
              </div>
              <div className="menu-num-txt">
                <p className="menu-txt">Need any Help ?</p>
                <Link className="menu-txt">+91 76988 28883</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="menu-main">
          <div className="menu-sub">
            <div className="logo-main">   
              <div className="logo-sub">
                <Link>
                  <img src={logo} alt="" />
                </Link>
              </div>
              {/* Render toggle button for mobile view */}
              {isMobile ? (
                <div className="toggle-main" onClick={toggleMenu}>
                  {menuOpen ? (
                    <IoMdCloseCircle className="toggle-icon" />
                  ) : (
                    <TiThMenu className="toggle-icon" />
                  )}
                </div>
              ) : (
                // Render nothing for desktop view
                null
              )}
            </div>
            {/* Render menu bar for desktop view and mobile open state */}
            {(isMobile && menuOpen) || !isMobile ? (
              <div className="menu-div">
                <ul>
                  <li onClick={closeMenu}>
                    <Link to="/" className="menu-link">
                      HOME
                    </Link>
                  </li>
                  <li onClick={closeMenu}>
                    <Link className="menu-link">SHOP</Link>
                  </li>
                  <li onClick={closeMenu}>
                    <Link to="/about" className="menu-link">
                      ABOUT US
                    </Link>
                  </li>
                  <li onClick={closeMenu}>
                    <Link className="menu-link">MY ACCOUNT</Link>
                  </li>
                  <li onClick={closeMenu}>
                    <Link className="menu-link">CONTACT</Link>
                  </li>
                </ul>
                <div className="menu-num-main">
                  <div className="main-nav-icon">
                    <div className="main-nav-icon-sub">
                      <Link className="main-nav-icon-user">
                        <FaUserAlt />
                      </Link>
                      <Link>
                        <FaHeart />
                        <span>0</span>
                      </Link>
                      <Link>
                        <FaCartPlus />
                        <span>0</span>
                      </Link>
                    </div>
                    <div className="main-nav-price-icon">
                      <p>₹ 0.00</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
