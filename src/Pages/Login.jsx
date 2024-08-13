import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import Aos from "aos";

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
    const response = await axios.post('https://bossdentindia.com/wp-json/jwt-auth/v1/token',{
      username: userIdentifier,
      password
    });
    const token = response.data.token;
    localStorage.setItem('token', token);
    alert('Login successful!');
    // console.log("email", email, "password", password);
    window.location.href = '/';
    }catch(error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your username and password.');
    }
    setUserIdentifier("");
    setPassword(""); 
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    Aos.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,    // Allow animations to trigger multiple times
      mirror: true,   // Trigger animations on scroll up
    });
  }, []);

  return (
    <div className="login-container" data-aos="fade">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Username or Email
          </label>
          <input
            type="text"
            id="userIdentifier"
            className="form-input"
            placeholder="Enter Username / Email"
            value={userIdentifier}
            onChange={(e) => setUserIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-input"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle-icon" onClick={handleShowPassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div>
          <a href="/forgot-password" className="forgot-password-l">
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="login-button">
          Log in
        </button>
        <p className="login-text">
          Don't have an account? <a href="/sign-up">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
