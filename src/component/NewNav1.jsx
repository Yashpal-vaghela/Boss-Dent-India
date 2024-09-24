import React from "react";
import { Link } from "react-router-dom";
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
import { useSelector } from "react-redux";
import { useWatchlist } from "../Pages/WatchlistContext";

const NewNav1 = () => {
  const { watchlist } = useWatchlist();
  const cartData = useSelector((state) => state.cart.cartItems);
  const handleOffcanvas1 = () => {
    var x = document.getElementById("close");
    console.log("x",x)
    if (window.innerWidth <= 991) {
      if (window?.getComputedStyle(x)?.display !== "none") {
        return x.click();
      }
    }
  };
  return (
    <div className="position-relative h-100 overflow-visible">
      <nav className="newnavbar1 navbar navbar-dark bg-dark navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbarlogo">
            <Link to="/">
              <img
                src="/asset/images/flogo.png"
                alt="Logo"
                className="img-fluid"
              ></img>
            </Link>
          </div>
          <div className="d-lg-none d-md-block search-icon">
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
          </div>
          <div className="d-none d-sm-flex d-lg-none d-md-flex navbar-social-icon ml-auto">
            <div className="user-icon icon">
              <Link to="/your-data">
                <FaUserAlt />
              </Link>
            </div>
            <div className="wishlist-icon icon">
              <Link to="/wishlist">
                <FaHeart />
                <span>{watchlist?.length}</span>
              </Link>
            </div>
            <div className="cart-icon icon">
              <Link to="/cart">
                <FaCartPlus />
                <span>{cartData?.length}</span>
              </Link>
            </div>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
            // data-bs-toggle="collapse"
            // data-bs-target="#navbarSupportedContent"
            // aria-controls="navbarSupportedContent"
          >
            {/* <span className="navbar-toggler-icon"></span> */}
            <i className="fa-solid fa-bars"></i>
          </button>

          <div
            className="offcanvas offcanvas-start navbar-offcanvas"
            tabIndex="-1"
            id="offcanvasExample"
            aria-labelledby="offcanvasExampleLabel"
          >
            
            <div className="offcanvas-header">
            {/* <button
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                  id="close"
                ></button> */}
              <button
                type="button"
                className="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                id="close"
              ><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="offcanvas-body justify-content-end">
              <ul className="navbar-link navbar-nav me-auto mb-2 mb-lg-0">
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
              <div className="d-none d-lg-flex search-icon">
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
              </div>
              <div className="d-flex d-sm-none d-md-none d-lg-flex navbar-social-icon">
                <div className="user-icon icon">
                  <Link to="/your-data">
                    <FaUserAlt />
                  </Link>
                </div>
                <div className="wishlist-icon icon">
                  <Link to="/wishlist">
                    <FaHeart />
                    <span>{watchlist?.length}</span>
                  </Link>
                </div>
                <div className="cart-icon icon">
                  <Link to="/cart">
                    <FaCartPlus />
                    <span>{cartData?.length}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NewNav1;

{
  /* <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> */
}
