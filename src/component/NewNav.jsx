import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaUserAlt, FaHeart, FaCartPlus, FaSearch, FaPhoneAlt, FaTimes } from "react-icons/fa";
import logo from "../images/flogo.png";
import { TiThMenu } from "react-icons/ti";
import axios from "axios";
import { useWatchlist } from "../Pages/WatchlistContext";
import { useCart } from "../Pages/AddCartContext";
import "../css/navbar.css";

const NewNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showAltMenu, setShowAltMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const { watchlist } = useWatchlist();
  const { cart } = useCart();
  const navigate1 = useNavigate();
  const cartIconRef = useRef(null);
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
        `https://bossdentindia.com/wp-json/wp/v2/product?search=${query}`
      );
      const products = response.data.map((product) => ({
        id: product.id,
        title: product.title.rendered,
        slug: product.slug,
      }));
      setSuggestions(products);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `https://bossdentindia.com/wp-json/wp/v2/product?search=${searchQuery}`
      );
      if (response.data.length > 0) {
        const product = response.data[0]; // Assuming you want to navigate to the first matching product
        navigate(`/products/${product.slug}`);
      } else {
        alert("No products found");
      }
    } catch (error) {
      console.error("Error searching for products:", error);
    }
    setSearchQuery("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const topNav = document.querySelector(".top-nav-p2");
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
        // Ensure the menus are correctly positioned and visible for smaller widths
        topNav.style.display = "flex";
        Array.from(menuSubElements).forEach((element) => {
          element.style.top = "70px";
        });
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Ensure the nav is visible on initial render for smaller screens
    if (window.innerWidth <= 991) {
      const topNav = document.querySelector(".top-nav-p2");
      const menuSubElements = document.getElementsByClassName("menu-sub");
      topNav.style.display = "flex";
      Array.from(menuSubElements).forEach((element) => {
        element.style.top = "70px";
      });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
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

  const toggleSearchInput = () => {
    setShowSearchInput((prevState) => !prevState);
  };

  return (
    <div className="nav-main">
      <div className="nav-sub">
        <div className="top-nav">
          <div className="top-nav-sub">
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
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
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
              <div className="menu-num-main">
                <div className="main-nav-icon">
                  <div className="main-nav-icon-sub">
                    {isScrolled && (
                      <div className="search-icon">
                        <FaSearch onClick={toggleSearchInput} />
                        {showSearchInput && (
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                          />
                        )}
                      </div>
                    )}
                    <div className="user-icon">
                      <Link to="/your-data">
                        <FaUserAlt />
                      </Link>
                    </div>
                    <div className="watchlisticon">
                      <Link onClick={() => navigate1("/watchlist")}>
                        <FaHeart />
                        <span>{watchlist.length}</span>
                      </Link>
                    </div>
                    <div className="cart-icon">
                      <Link ref={cartIconRef} to="/cart">
                        <FaCartPlus />
                        <span>{cart.length}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {isMobile && (
                <div className="menu-toggle" onClick={toggleMenu}>
                  <div id="toggle" className={menuOpen ? "on" : ""}>
                    <div className="one"></div>
                    <div className="two"></div>
                    <div className="three"></div>
                  </div>
                </div>
              )}
            </div>
            {(isMobile && menuOpen) || !isMobile ? (
              <div className={`menu-main-div ${menuOpen ? "open" : ""}`}>
                <div className="menu-div">
                  <ul>
                    <li onClick={closeMenu}>
                      <Link to="/" className="menu-link">
                        HOME
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/about" className="menu-link">
                        ABOUT US
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/shop" className="menu-link">
                        SHOP
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/categories" className="menu-link">
                        CATEGORIES
                      </Link>
                    </li>
                    <li onClick={closeMenu}>
                      <Link to="/contact" className="menu-link">
                        CONTACT US
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNav;
