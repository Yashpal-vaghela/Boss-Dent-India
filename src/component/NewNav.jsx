import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUserAlt, FaHeart, FaCartPlus, FaSearch, FaPhoneAlt, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useWatchlist } from "../Pages/WatchlistContext";
import "../css/navbar.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const NewNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [tabletScreen, setTabletScreen] = useState(window.innerWidth <= 991);
  const [smallScreen, setSmallScreen] = useState(window.innerHeight <= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [showAltMenu, setShowAltMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { watchlist } = useWatchlist();  
  const navigate = useNavigate();
  const cartData = useSelector((state)=>state.cart.cartItems)

  const toggleMenu = () => {
    setMenuOpen((prevMenuOpen) => !prevMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleSearchInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowAltMenu(query.trim().length > 0);
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/wp/v2/product?search=${query}`
      );
      const products = response.data.map((product) => ({
        id: product.id,
        title: product.title.rendered,
        slug: product.slug,
      }));
      setSuggestions(products);
      setSuggested(products);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  };
  const handleSearchInputChangeSub = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowAltMenu(query.trim().length > 0);
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/wp/v2/product?search=${query}`
      );
      const products = response.data.map((product) => ({
        id: product.id,
        title: product.title.rendered,
        slug: product.slug,
      }));
      setSuggested(products);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggested([]);
    }
  };
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/wp/v2/product?search=${searchQuery}`
      );
      if (response.data.length > 0) {
        const product = response.data[0];
        navigate(`/products/${product.id}`);
      } else {
        toast.error("No products found");
        // alert("No products found");
      }
    } catch (error) {
      console.error("Error searching for products:", error);
    }
    setSearchQuery("");
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setSuggested([]);
  };

  const toggleSearchInput = () => {
    setShowSearchInput((prevState) => !prevState);

  };

  const handleClick = (id) => {
    navigate(`/products/${id}`);
    closeMenu();
    clearSearch();
  }

  useEffect(() => {
    const handleScroll = () => {
      const topNav = document.querySelector(".top-nav");
      const menuSubElements = document.getElementsByClassName("menu-sub");

      if (window.innerWidth > 991) {
        if (window.scrollY >= 20) {
          topNav.style.display = "none";
          Array.from(menuSubElements).forEach((element) => {
            element.style.top = "0";
          });
        } else {
          topNav.style.display = "flex";
          Array.from(menuSubElements).forEach((element) => {
            element.style.top = "70px";
          });
        }
      } else {
        topNav.style.display = "flex";
        Array.from(menuSubElements).forEach((element) => {
          element.style.top = "70px";
        });
      }
    };


    const handleResize = () => {
      setTabletScreen(window.innerWidth <= 991);
      setSmallScreen(window.innerHeight <= 768);
      setIsMobile(window.innerWidth <= 480);
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const scrollFunction = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Aos.init({
    //   duration: 1000, // Animation duration in milliseconds
    //   once: false,    // Allow animations to trigger multiple times
    //   mirror: true,   // Trigger animations on scroll up
    // });

    window.addEventListener("scroll", scrollFunction);

    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);

  return (
    <div className="nav-main">
      <div className="nav-sub">
        <div className="top-nav" >
          <div className="top-nav-sub">
            <div className="top-nav-p2">
              <div className="top-p2-txt">
                <p className="mb-0">Follow Us On</p>
              </div>
              <hr />
              <div className="top-p2-icon">
                <Link to="https://www.facebook.com/share/FgTSjonfbbaGDbNo/?mibextid=qi2Omg" target="_blank">
                  <FaFacebookF />
                </Link>
                <Link to="https://www.instagram.com/_bossdent_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank">
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
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => handleClick(product.id)}
                      >
                        {product.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="menu-nav-sub">
              <div className="menu-nav-icon">
                <span>
                  <FaPhoneAlt />
                </span>
              </div>
              <div className="menu-num-txt">
                <p className="menu-txt">Need any Help ?</p>
                <Link to="#" className="menu-txt">+91 76988 28883</Link>
              </div>
            </div>
          </div>
        </div>
        {/* Main nav started here */}
        <div className="menu-main">
          <div className={`menu-sub ${menuOpen ? "open" : ""}`}>
            <div className="logo-main">
              <div className="logo-sub">
                <Link to="/">
                  <img src="/asset/images/flogo.png" alt="Logo" />
                </Link>
              </div>
            </div>
            {!(tabletScreen || smallScreen || isMobile) && (
              <div className="menu-main-div">
                <div className="menu-div">
                  <ul>
                    <li onClick={closeMenu}>
                      <Link to="/" className="menu-link">
                        HOME
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/aboutus" className="menu-link">
                        ABOUT US
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/products" className="menu-link">
                        SHOP
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/user" className="menu-link">
                        MY ACCOUNT
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/contact" className="menu-link">
                        CONTACT
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            <div className="menu-nav-main">
              <div className="main-nav-icon">
                <div className="main-nav-icon-sub">
                  {(isScrolled || tabletScreen) && (
                    <div className="search-icon">
                      {searchQuery ? (
                        <span className="clear-icon" onClick={clearSearch}>
                          <FaTimes />
                        </span>
                      ) : (
                        <FaSearch onClick={toggleSearchInput} />
                      )}
                      {showSearchInput && (
                        <>
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchInputChangeSub}
                          />
                          {suggested.length > 0 && showAltMenu && (
                            <div className="suggestion-sub">
                              <ul className="suggested" >
                                {suggested.map((product) => (
                                  <li
                                    key={product.id}
                                    onClick={() => handleClick(product.id)}
                                  >
                                    {product.title}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="user-icon">
                    <Link to="/my-account">
                      <FaUserAlt />
                    </Link>
                  </div>
                  <div className="watchlisticon">
                    <Link to="/wishlist">
                      <FaHeart />
                      <span>{watchlist.length}</span>
                    </Link>
                  </div>
                  <div className="cart-icon">
                    <Link to="/cart">
                      <FaCartPlus />
                      <span>
                        {/* {cart.length} */}
                        {cartData?.length}</span>
                    </Link>
                  </div>
                </div>
                {(tabletScreen || smallScreen || isMobile) && (
                  <div className="menu-toggle" onClick={toggleMenu}>
                    <div id="toggle" className={menuOpen ? "on" : ""}>
                      <div className="one"></div>
                      <div className="two"></div>
                      <div className="three"></div>
                    </div>
                  </div>)}
              </div>
            </div>
            {/* Mobile menu implementation */}
            {(tabletScreen || smallScreen || isMobile) &&
              (<div className={`menu-main-div ${menuOpen ? "open" : ""}`}>
                <div className="menu-div">
                  <ul>
                    <li onClick={closeMenu}>
                      <Link to="/" className="menu-link">
                        HOME
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/aboutus" className="menu-link">
                        ABOUT US
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/products" className="menu-link">
                        SHOP
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/user" className="menu-link">
                        MY ACCOUNT
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/contact" className="menu-link">
                        CONTACT
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="main-nav-icon">
                  <div className="main-nav-icon-sub">
                    {isMobile && (
                      <>
                        <div className="user-icon">
                          <Link to="/my-account" onClick={closeMenu}>
                            <FaUserAlt />
                          </Link>
                        </div>
                        <div className="watchlisticon">
                          <Link to="/wishlist" onClick={closeMenu}>
                            <FaHeart />
                            <span>{watchlist.length}</span>
                          </Link>
                        </div>
                        <div className="cart-icon" onClick={closeMenu}>
                          <Link to="/cart">
                            <FaCartPlus />
                            <span>
                              {/* {cart.length} */}
                              {cartData?.length}
                              </span>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="search-icon">
                  {searchQuery ? (
                    <span className="clear-icon" onClick={clearSearch}>
                      <FaTimes />
                    </span>
                  ) : (
                    <FaSearch onClick={toggleSearchInput} />
                  )}
                  {showSearchInput && (
                    <>
                      <input
                        type="text"
                        className="search-input"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchInputChangeSub}
                      />
                      {suggested.length > 0 && showAltMenu && (
                        <div className="suggestion-sub">
                          <ul className="suggested" >
                            {suggested.map((product) => (
                              <li
                                key={product.id}
                                onClick={() => handleClick(product.id)}
                              >
                                {product.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNav;
