import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUserAlt, FaHeart, FaCartPlus, FaSearch, FaPhoneAlt, FaTimes } from "react-icons/fa";
import logo from "../images/flogo.png";
import { IoMdCloseCircle } from "react-icons/io";
import { TiThMenu } from "react-icons/ti";
import axios from "axios";

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showAltMenu, setShowAltMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 991);
      if (window.innerWidth > 991) {
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
  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    try {
      const response = await axios.get(`https://bossdentindia.com/wp-json/wp/v2/product?search=${query}`);
      const products = response.data.map(product => ({
        id: product.id,
        title: product.title.rendered,
        slug: product.slug
      }));
      setSuggestions(products);
      setShowAltMenu(query.trim().length> 0);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSuggestions([]);
    }
  };
  
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://bossdentindia.com/wp-json/wp/v2/product?search=${searchQuery}`);
      if (response.data.length > 0) {
        const product = response.data[0]; // Assuming you want to navigate to the first matching product
        navigate(`/products/${product.slug}`);
      } else {
        alert('No products found');
      }
    } catch (error) {
      console.error('Error searching for products:', error);
    }
    setSearchQuery("");
  };

  useEffect(() => {
    const scrollFunction = () => {
      const topNav = document.querySelector(".top-nav-p2");
      const menuSubElements = document.getElementsByClassName("menu-sub");
      if (document.body.scrollTop >= 20 || document.documentElement.scrollTop >= 20) {
        topNav.style.display = "none";
        Array.from(menuSubElements).forEach(element => {
          element.style.top = "0";
        });
      } else {
        topNav.style.display = "flex";
        Array.from(menuSubElements).forEach(element => {
          element.style.top = "70px";
        });
      }
    };
    window.onscroll = scrollFunction;
  }, []);
  // console.log(menuOpen);
  useEffect(() => {
    const scrollFunction = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", scrollFunction);

    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <div className={`nav-main ${menuOpen && isMobile ? 'nav-main-open' : ''}`}>
      <div className={`nav-sub ${isScrolled ? "scrolled" : ""}`}>
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
                <form onSubmit={handleSearchSubmit} className="search-sub">
                  <input
                    type="text"
                    placeholder="Search For Products ..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                  />
                  {searchQuery && (
                    <span className="clear-icon" onClick={clearSearch}>
                      <FaTimes />
                    </span>
                   )}
                  <button type="submit">
                    <FaSearch />
                  </button>
                </form>
                {suggestions.length > 0 && showAltMenu && (
                  <div className="suggestion-main">
                    <ul className="suggestions">
                    {suggestions.map(product =>(
                      <li key={product.id} onClick={() => navigate(`/products/${product.slug}`)}>
                        {product.title}
                      </li>
                    ))}
                  </ul>
                  </div>
                )}
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
                        <Link className="menu-link" to="/products">SHOP</Link>
                      </li>
                      <li onClick={closeMenu}>
                        <Link to="/about" className="menu-link">
                          ABOUT US
                        </Link>
                      </li>
                      <li onClick={closeMenu}>
                        <Link to="/my-account"className="menu-link">MY ACCOUNT</Link>
                      </li>
                      <li onClick={closeMenu}>
                        <Link to="/contact"className="menu-link">CONTACT</Link>
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
                      <Link to="/watchlist">
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
