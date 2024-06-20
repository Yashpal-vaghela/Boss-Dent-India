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

const Allroutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>}/>
            <Route path="/my-account" element={<Login />} />
            <Route path='/sign-up' element={<Signup />}/>
            <Route path='/contact' element={<Contact />}/>
            <Route path='/help-center' element={<HelpCenter />}/>
            <Route path='/refund-and-returns-policy' element={<RefundPolicy />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
        </Routes>
    </div>
  )
}

export default Allroutes