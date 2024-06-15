import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import About from '../Pages/About'
import Login from '../Pages/Login'
import Signup from '../Pages/Signup'
import Contact from '../css/Contact'

const Allroutes = () => {
  return (
    <div>
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="about" element={<About/>}/>
            <Route path="/my-account" element={<Login />} />
            <Route path='/sign-up' element={<Signup />}/>
            <Route path='/contact' element={<Contact />}/>
        </Routes>
    </div>
  )
}

export default Allroutes