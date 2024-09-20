import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
// import Aos from "aos";
import AlertSuccess from "../component/AlertSuccess"; // Import the AlertSuccess component
import { toast } from "react-toastify";

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://admin.bossdentindia.com/wp-json/jwt-auth/v1/token', {
        username: userIdentifier,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setShowAlert(true); // Show alert on successful login
      setTimeout(() => {
        setShowAlert(false);
        window.location.href = '/'; // Redirect after hiding alert
      }, 3000); // Adjust the duration as needed
    } catch (error) {
      toast.error('Login failed. Please check your username and password.')
      console.error('Error logging in:', error);
      // alert('Login failed. Please check your username and password.');
    }
    setUserIdentifier("");
    setPassword(""); 
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // useEffect(() => {
  //   Aos.init({
  //     duration: 1000,
  //     once: false,
  //     mirror: true,
  //   });
  // }, []);

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
      {showAlert && <AlertSuccess message="You are login successfully." />} 
    </div>
  );
};

export default Login;
