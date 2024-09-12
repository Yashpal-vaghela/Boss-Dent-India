import React, { useEffect,useState } from 'react'
import { useLocation, useRoutes } from 'react-router-dom'

const BreadCrumbs = () => {
    const pathName = useLocation();
    // const pathName1 = useRoutes();
    const [pathname,setPathname] = useState([])
    useEffect(()=>{
        
        setPathname(pathName?.pathname?.split("/"))
        // console.log("pathName",pathName1)
    },[pathName])
  return (
    <div>
      <nav className="bread-crumbs">
          <a href="/">Home</a>  
          <i className="fa-solid fa-angle-right"></i>
          {
            pathName !== undefined ? <span>{pathName?.pathname?.split("/")}</span>: null
          }
          
          {/* <span>Checkout</span> */}
        </nav>
    </div>
  )
}

export default BreadCrumbs
