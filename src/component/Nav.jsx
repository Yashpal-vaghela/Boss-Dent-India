import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <div className="nav-main">
      <div className="nav-sub">
        <div className="top-nav-main">
          <div className="top-nav-sub">
            <ul className="top-nav-p1">
              <li>
                <Link>Shop</Link>
              </li>
              <li>
                <Link>About Us</Link>
              </li>
              <li>
                <Link>Wishlist</Link>
              </li>
              <li>
                <Link>My Account</Link>
              </li>
            </ul>
            <div className="top-nav-p2">
                <div className="top-p2-txt">
                    <p>Follow Us On</p>
                </div>
                <div className="top-p2-icon">
                    <span></span>
                    <span></span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
