import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import About from "../Pages/About";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Contact from "../Pages/Contact";
import HelpCenter from "../Pages/HelpCenter";
import RefundPolicy from "../Pages/RefundPolicy";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TermAndCondition from "../Pages/TermAndCondition";
import Product from "../Pages/Product";
import SingleProduct from "../Pages/SingleProduct";
import WatchList from "../Pages/WatchList";
import CheckOut from "../Pages/CheckOut";
import UserData from "../Pages/Userdata";
import ForgotPassword from "./ForgotPassword";
import NewNav1 from "./NewNav1";
import NewCart from "../Pages/NewCart";
import ProtectedRoute from "./ProtectedRoute";
import Gallery from "../Pages/Gallery";
import Success from "../Pages/success";
import ReturnExchange from "../Pages/ReturnExchange";
import OrderDetailsInfo from "../Pages/OrderDetailsInfo";

const Allroutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/my-account" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Product />} />
        <Route path="/shop" element={<Product/>}></Route>
        <Route path="/products/:id" element={<SingleProduct />} />
        {/* <Route path='/products/:slug' element={<SingleProduct />} /> */}
        {/* <Route path= '/cart' element={<NewCart />}/> */}
        <Route path="/wishlist" element={<WatchList />} />
        <Route path="/user" element={<UserData />} />
        <Route path="/help-center" element={<HelpCenter />} />
        {/* <Route path='/checkout' element={<CheckOut />}/> */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/refund-and-returns-policy" element={<RefundPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermAndCondition />} />
        <Route path="/return-exchange" element={<ReturnExchange/>}></Route>
        <Route path="/new-nav" element={<NewNav1 />} />
        {/* <Route path='/gallery' element={<ImageGallery />}/> */}
        <Route path="/cart" element={<ProtectedRoute><NewCart/></ProtectedRoute>}/>
        <Route path="/checkout" element={<ProtectedRoute><CheckOut/></ProtectedRoute>}/>
        <Route path="/order-details-info" element={<OrderDetailsInfo/>}></Route>
        <Route path="/gallery" element={<Gallery/>}></Route>
        <Route path="/success" element={<Success/>} />
        <Route path="*" element={<Home/>}></Route>
      </Routes>
    </>
  );
};

export default Allroutes;
