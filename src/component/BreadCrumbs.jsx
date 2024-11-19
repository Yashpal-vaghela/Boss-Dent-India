import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const BreadCrumbs = () => {
    const pathName = useLocation();
  return (
    <div>
      <nav className="bread-crumbs">
        <Link to="/">Home</Link>
          <i className="fa-solid fa-angle-right"></i>
          {
            pathName !== undefined ? <span>{pathName?.pathname?.split("/")}</span>: null
          }
        </nav>
    </div>
  )
}

export default BreadCrumbs
