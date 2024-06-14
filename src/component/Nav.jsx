import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUserAlt, FaHeart, FaCartPlus, FaSearch, FaPhoneAlt } from "react-icons/fa";
import logo from "../images/flogo.png";
import { IoMdCloseCircle } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(prevMenuOpen => !prevMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };
  
  useEffect(() => {
    const scrollFunction = () => {
      const menuSubElements = document.getElementsByClassName("menu-sub");
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        Array.from(menuSubElements).forEach(element => {
          element.style.top = "0";
        });
      } else {
        Array.from(menuSubElements).forEach(element => {
          element.style.top = "70px";
        });
      }
    };
    window.onscroll = scrollFunction;
  }, []);
  // console.log(menuOpen);

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
        {/* Main nav started here */}
        <div className="menu-main">
          <div className="menu-sub">
            <div className="logo-main">
              <div className="logo-sub">
                <Link>
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
              {isMobile ? (
                <>
                  <div className="menu-num-main">
                    <div className="main-nav-icon2">
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
                    </div>
                </div>
                <div className="toggle-main" onClick={toggleMenu} role="button" aria-label="Toggle menu">
                  {/* {menuOpen ? (
                    <IoMdCloseCircle className="toggle-icon" />
                  ) : (
                    <TiThMenu className="toggle-icon" />
                  )} */}
                    <TiThMenu className="toggle-icon" />
                </div>
                </>
              ) : null}
              {(isMobile && menuOpen) || !isMobile ? (
                <div className={`menu-main-div ${menuOpen ? 'open' : ''}`}>
                  <div className="menu-div">
                    <ul>
                      {menuOpen && (
                          <li onClick={toggleMenu} className="close">
                            <IoMdCloseCircle className="toggle-icon" />
                          </li>
                      )}
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
                  </div>
                </div>
              ) : null}
              {!isMobile && (
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
                  </div>
                </div>
              )}
            </div>    
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
