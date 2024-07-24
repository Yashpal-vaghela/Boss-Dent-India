import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Contact from '../Pages/Contact'
import HelpCenter from '../Pages/HelpCenter'
import RefundPolicy from '../Pages/RefundPolicy'
import PrivacyPolicy from '../Pages/PrivacyPolicy'
import TermAndCondition from '../Pages/TermAndCondition'
import Product from '../Pages/Product'
import SingleProduct from '../Pages/SingleProduct'
import Cart from '../Pages/Cart'
import WatchList from '../Pages/WatchList'
import CheckOut from '../Pages/CheckOut'
import UserData from '../Pages/Userdata'
import ForgotPassword from './ForgotPassword'

const Allroutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>}/>
            <Route path="/my-account" element={<Login />} />
            <Route path='/sign-up' element={<Signup />}/>
            <Route path='/contact' element={<Contact />}/>
            <Route path='/products' element={<Product/>}/>
            <Route path='/products/:id' element={<SingleProduct/>}/>
            <Route path= '/cart' element={<Cart />}/>
            <Route path='/watchlist' element={<WatchList/>} />
            <Route path='/your-data' element={<UserData/>} />
            <Route path='/help-center' element={<HelpCenter />}/>
            <Route path='/checkout' element={<CheckOut />}/>
            <Route path='/forgot-password' element={<ForgotPassword/>} />
            <Route path='/refund-and-returns-policy' element={<RefundPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
            <Route path='/terms-and-conditions' element={ <TermAndCondition />}/>
        </Routes>
    </div>
  )
}

export default Allroutes