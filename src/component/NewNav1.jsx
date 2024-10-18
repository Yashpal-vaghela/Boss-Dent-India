import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaUserAlt,
  FaHeart,
  FaCartPlus,
  FaSearch,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";
import { useWatchlist } from "../Pages/WatchlistContext";
import axios from "axios";

const NewNav1 = () => {
  const { watchlist ,cartList} = useWatchlist();
  const [searchIcon, setSeachIcon] = useState(false);
  const [searchQuery, setSeachQuery] = useState("");
  const [suggested, setSuggested] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleSearchInputChangeSub = async (e) => {
    const query = e.target.value;
    setSeachQuery(query);
    if (query) {
      setSeachIcon(true);
    } else {
      setSeachIcon(false);
    }

    try {
      const response = await axios.get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/product-search?s=${query}`
      );
      const filterData = response.data.filter((product) => {
        return product.product_name.toLowerCase().includes(query.toLowerCase());
      });
      const products = filterData.map((product) => ({
        id: product.product_id,
        title: product.product_name,
        slug: product.product_slug,
      }));

      setSuggested(products);
      setSuggestions(products);
    } catch (error) {
      console.error(
        "Error fetching search suggestions:",
        error.response.data.message
      );
      setSuggested([]);
      setSuggestions([]);
    }
  };
  const handleClick = (product) => {
    console.log("pro",product)
    navigate(`/products/${encodeURIComponent(product.slug)}`, {
      state: { productId: product.id },
    });
    // navigate(`/products/${id}`);
    handleOffcanvas1();
    handleClearSearch();
  };

  const handleClearSearch = () => {
    setSeachQuery("");
    setSuggestions([]);
    setSuggested([]);
    setSeachIcon((prev) => !prev);
  };

  const handleOffcanvas1 = () => {
    var x = document.getElementById("close");
    if (window.innerWidth <= 991) {
      if (window?.getComputedStyle(x)?.display !== "none") {
        return x.click();
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const topNav = document.querySelector(".navbar-top");
      const menuSubElements = document.getElementsByClassName("newnavbar1");
      const searchElements = document.getElementById("search-icon");
      const showSearchElements = document.getElementById("navbar-social-icon");
      const alertMessageElements =
        document.getElementsByClassName("success-alert");
      const bannerElements = document.getElementsByClassName("banner-section");
  
      if (window.innerWidth >= 991) {
        if (window.scrollY >= 20) {
          searchElements.style.display = "flex" ;
          showSearchElements.classList.add("show-search-icon");
          topNav.style.display = "none";
          Array.from(alertMessageElements).forEach((element) => {
            element.style.top = "50px";
          });
          Array.from(menuSubElements).forEach((element) => {
            element.style.top = "0";
            // element.setAttribute('data-aos','fade-up')
          });
          Array.from(bannerElements).forEach((element) => {
            element.style.paddingTop = "20px";
          });
        } else {
          showSearchElements.classList.remove("show-search-icon");
          searchElements.style.display = "none";
          topNav.style.display = "flex";
          Array.from(menuSubElements).forEach((element) => {
            element.style.top = "0px";
            // element.setAttribute('data-aos','fade-up')
          });
          Array.from(alertMessageElements).forEach((element) => {
            element.style.top = "130px";
          });
          Array.from(bannerElements).forEach((element) => {
            element.style.paddingTop = "0px";
          });
        }
      } else {
        searchElements.classList.remove("show-search-icon");
        showSearchElements.style.display = "none";
        topNav.style.display = "flex";
        Array.from(menuSubElements).forEach((element) => {
          element.style.top = "0px";
          // element.setAttribute('data-aos','zoom-in')
        });
        Array.from(bannerElements).forEach((element) => {
          element.style.paddingTop = "0px";
        });
      }
    };

    const handleResize = () => {
      handleScroll();
    };

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
      // setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", scrollFunction);
    return () => {
      window.removeEventListener("scroll", scrollFunction);
    };
  }, []);
  return (
    <div className="navbar-main">
      {/* navbar-top */}
      <div className="navbar-top container-fluid">
        <div className="navbar-contact-link">
          <p className="mb-0">Follow Us On</p>
          <hr></hr>
          <div className="navbar-contact-link-icon">
            <Link
              to="https://www.facebook.com/share/FgTSjonfbbaGDbNo/?mibextid=qi2Omg"
              target="_blank"
            >
              <FaFacebookF />
            </Link>
            <Link
              to="https://www.instagram.com/_bossdent_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div className="navbar-top-search-main">
          <input
            type="text"
            className="form-control"
            placeholder="Search For Products ..."
            value={searchQuery}
            onChange={handleSearchInputChangeSub}
          />
          {searchQuery ? (
            <span className="clear-icon" onClick={handleClearSearch}>
              <FaTimes />
            </span>
          ) : (
            <FaSearch />
          )}
          {searchQuery && (
            <>
              {suggestions?.length !== 0 ? (
                <div className="suggestion-main">
                  <ul className="suggestions">
                    {suggestions.map((product,index) => (
                      <li
                        key={index}
                        onClick={() => handleClick(product)}
                      >
                        {product.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="suggestion-main">
                    <ul className="suggestions">
                      <li>
                        <h2
                          className="d-flex m-auto align-items-center justify-content-center"
                          style={{
                            height: "100px",
                            fontSize: "16px",
                            width: "200px",
                            color: "#bf8e22",
                          }}
                        >
                          No Products Items Found!
                        </h2>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
          {/* {suggestions.length > 0 && (
            <div className="suggestion-main">
              <ul className="suggestions">
                {suggestions.map((product) => (
                  <li key={product.id} onClick={() => handleClick(product.id)}>
                    {product.title}
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
        <div className="navbar-contact-details-wrapper">
          <span>
            <FaPhoneAlt />
          </span>
          <div className="navbar-contact-details">
            <p className="navbar-contact-txt mb-0" style={{ fontSize: "15px" }}>
              Need any Help ?
            </p>
            <Link
              to="#"
              className="navbar-contact-txt"
              style={{ fontWeight: "700" }}
            >
              +91 76988 28883
            </Link>
          </div>
        </div>
      </div>

      {/* navbar */}
      <nav className="newnavbar1 navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid newnavbar-sub">
          <div className="navbarlogo">
            <Link to="/">
              <img
                src="/asset/images/flogo.png"
                alt="Logo"
                className="img-fluid"
              ></img>
            </Link>
          </div>
          {/* moblie and tablet screen search icon */}
          <div className="d-lg-none d-sm-flex d-md-flex search-icon align-items-center">
            {/* {
              searchQuery ? <></> : <></>
            } */}
            {/* {console.log("searchQuery", searchQuery, searchIcon)} */}
            {searchIcon || searchQuery ? (
              <>
                <input
                  className="d-sm-none d-md-flex d-none form-control search-input"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchInputChangeSub}
                ></input>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setSeachIcon((prev) => !prev)}
                  style={{ color: "#fff" }}
                  className="d-sm-none d-md-block d-none"
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
                <i
                  className="d-md-none  fa-solid fa-xmark"
                  style={{ color: "#fff" }}
                  onClick={() => setSeachIcon((prev) => !prev)}
                ></i>
              </>
            ) : (
              <>
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setSeachIcon((prev) => !prev)}
                  style={{ color: "#fff" }}
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
              </>
            )}
          </div>
          {/* moblie and tablet screen navbar social icon */}
          <div className="d-none d-sm-flex d-lg-none d-md-flex navbar-social-icon ml-auto">
            <div className="user-icon icon">
              <Link to="/user">
                <FaUserAlt />
              </Link>
            </div>
            <div className="wishlist-icon icon">
              <Link to="/wishlist">
                <FaHeart />
                <span>
                {watchlist?.length}
                  {/* {WishList} */}
                </span>
              </Link>
            </div>
            <div className="cart-icon icon">
              <Link to="/cart">
                <FaCartPlus />
                <span>{cartList?.length}</span>
              </Link>
            </div>
          </div>
          {/* navbar toogle button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          {/* navbar main-content */}
          <div
            className="offcanvas offcanvas-start navbar-offcanvas"
            tabIndex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            <div className="offcanvas-header">
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                id="close"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="offcanvas-body justify-content-end">
              <ul
                className={`${
                  searchIcon
                    ? "navbar-link navbar-nav  mb-lg-0 navbar-show-icon"
                    : "navbar-link navbar-nav me-auto mb-2 mb-lg-0"
                }`}
              >
                <li className="nav-item" onClick={handleOffcanvas1}>
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
                </li>
                <li className="nav-item" onClick={handleOffcanvas1}>
                  <Link to="/aboutus" className="nav-link">
                    About us
                  </Link>
                </li>
                <li className="nav-item" onClick={handleOffcanvas1}>
                  <Link className="nav-link" to="/products">
                    Shop
                  </Link>
                </li>
                <li className="nav-item" onClick={handleOffcanvas1}>
                  <Link to="/my-account" className="nav-link">
                    my account
                  </Link>
                </li>
                <li className="nav-item" onClick={handleOffcanvas1}>
                  <Link to="/contact" className="nav-link">
                    contact
                  </Link>
                </li>
              </ul>
              {/* computer size serach bar */}
              <div
                id="search-icon"
                className="search-icon align-items-center"
              >
                {searchIcon ? (
                  <>
                    <input
                      className="form-control search-input"
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchInputChangeSub}
                    ></input>
                    {/* {console.log("suggest", suggested)} */}
                    {suggestions.length !== 0 ? (
                      <>
                        <div className="suggestion-sub">
                          <ul className="suggested">
                            {suggested.map((product) => (
                              <li
                                key={product.id}
                                onClick={() => handleClick(product)}
                              >
                                {product.title}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="suggestion-sub w-25 h-0 overflow-hidden">
                          <ul className="suggested ">
                            <li>
                              <h2
                                className="d-flex m-auto align-items-center justify-content-center"
                                style={{
                                  height: "100px",
                                  fontSize: "16px",
                                  width: "200px",
                                  color: "#bf8e22",
                                  // padding: "20px",
                                }}
                              >
                                No Product Items Found!
                              </h2>
                            </li>
                          </ul>
                        </div>
                        <div className="suggestion-sub w-100">
                          <ul className="suggested">
                            <li>
                              <h2
                                className="d-flex m-auto align-items-center justify-content-center"
                                style={{
                                  height: "100px",
                                  fontSize: "16px",
                                  width: "200px",
                                  color: "#bf8e22",
                                  // padding: "20px",
                                }}
                              >
                                No Product Items Found!
                              </h2>
                            </li>
                          </ul>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 512 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => setSeachIcon((prev) => !prev)}
                >
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
              </div>
              {/* computer size navbar social icon */}
              <div
                id="navbar-social-icon"
                className="d-flex d-sm-none d-md-none d-lg-flex navbar-social-icon align-items-center"
              >
                <div className="user-icon icon" onClick={handleOffcanvas1}>
                  <Link to="/user">
                    <FaUserAlt />
                  </Link>
                </div>
                <div className="wishlist-icon icon" onClick={handleOffcanvas1}>
                  <Link to="/wishlist">
                    <FaHeart />
                    <span>
                      {watchlist?.length}
                      {/* {WishList} */}
                    </span>
                  </Link>
                </div>
                <div className="cart-icon icon" onClick={handleOffcanvas1}>
                  <Link to="/cart">
                    <FaCartPlus />
                    {/* {
                      console.log("cartList",cartList)
                    } */}
                    <span>{cartList?.length}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* navbar mobile and tablet screen */}
      <div
        className={`${
          searchIcon
            ? "d-lg-none d-md-none d-sm-flex d-flex searchbar-wrapper"
            : "d-none d-lg-none d-md-none d-sm-none searchbar-wrapper"
        }`}
      >
        <input
          className="form-control search-input"
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChangeSub}
        ></input>
        {searchQuery ? (
          <>
            <i className="fa-solid fa-xmark" onClick={handleClearSearch}></i>
          </>
        ) : (
          <>
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
            </svg>
          </>
        )}
      </div>
      {/* suggestion box mobile and tablet screen */}
      <div
        className="d-lg-none d-sm-block d-block d-md-block suggestion-box"
        // style={{ top: "54px" }}
      >
        {searchQuery ? (
          <>
            {suggested.length !== 0 ? (
              <div className="suggestion-sub">
                <ul className="suggested">
                  {suggested.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleClick(product)}
                    >
                      {product.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="suggestion-sub w-25">
                <ul className="suggested">
                  <li>
                    <h2
                      className="d-flex m-auto align-items-center justify-content-center"
                      style={{
                        height: "100px",
                        fontSize: "16px",
                        width: "200px",
                        color: "#bf8e22",
                        // padding: "20px",
                      }}
                    >
                      No Items Found !
                    </h2>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NewNav1;