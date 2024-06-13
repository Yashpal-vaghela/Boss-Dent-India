import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log("email",email, "password",password)
        setEmail('')
        setPassword('')
    }

    const handleShowPassword = () =>{
        setShowPassword(!showPassword)
    }
  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <span className='password-toggle-icon' onClick={handleShowPassword}>
                {showPassword ? <FaEye /> : <FaEyeSlash/> }
            </span>
        </div>
        <div>
            <a href="#" className="forgot-password">Forgot Password?</a>
        </div>
        <button type="submit" className="login-button">Login</button>
        <p className="login-text">Don't have an account? <a href="#">Sign Up</a></p>
      </form>
    </div>
  )
}

export default Login