import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import AlertSuccess from "../component/AlertSuccess"; // Import the AlertSuccess component
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Loader1 from "../component/Loader1";
import { useWatchlist } from "./WatchlistContext";

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // Add state for alert visibility
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {LoginUserCartList} = useWatchlist();
  // const redirectPath = location.state?.pathname
  // console.log(redirectPath);

  useEffect(() => {
    const savedUsername = localStorage.getItem("userIdentifier");
    const savedPasssword = localStorage.getItem("password");
    setLoading(true);
    if (savedUsername && savedPasssword) {
      setUserIdentifier(savedUsername);
      setPassword(savedPasssword);
      // setRememberMe(true); // Set rememberMe to true if saved credentials are present
    }
    setTimeout(() => {
      setLoading(false);
    }, [500]);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.bossdentindia.com/wp-json/jwt-auth/v1/token",
        {
          username: userIdentifier,
          password,
        }
      );
      const token = response.data.token;
     
      // const userId = response.data.user_id;
      // console.log(userId)
      const ObjectUserData = {
        user_dispaly_name:response.data.user_display_name,
        user_email:response.data.user_email,
        user_id:response.data.user_id,
        user_nicename:response.data.user_nicename
      }
      LoginUserCartList(response.data.user_id)
      // console.log("res==",response,ObjectUserData)
      localStorage.setItem("token", token);
      localStorage.setItem('UserData',JSON.stringify(ObjectUserData))
      // localStorage.setItem("user_id", userId);
      if (rememberMe) {
        localStorage.setItem("userIdentifier", userIdentifier);
        localStorage.setItem("password", password);
        setLoading(false);
      } else {
        localStorage.removeItem("userIdentifier");
        localStorage.removeItem("password");
      }
      setShowAlert(true); // Show alert on successful login
      const redirectPath = location.state?.from || "/"; // Fallback to homepage if no previous path
      navigate(redirectPath);
    } catch (error) {
      toast.error("Login failed. Please check your username and password.");
      console.error("Error logging in:", error);
      setLoading(false);
      // alert('Login failed. Please check your username and password.');
    }
    setUserIdentifier("");
    setPassword("");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return loading ? (
    <>
      <Loader1></Loader1>
    </>
  ) : (
    <div className="container">
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
                <span
                  className="password-toggle-icon"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
              <div className="form-group remember-me-row">
                <div className="left-section">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
                <div>
                  <a href="/forgot-password" className="forgot-password-l">
                    Forgot Password?
                  </a>
                </div>
              </div>
              <button type="submit" className="login-button">
                Log in
              </button>
              <p className="login-text">
                Don't have an account? <a href="/sign-up">Sign Up</a>
              </p>
            </form>
            {showAlert && (
              <AlertSuccess message="You are login successfully." />
            )}
      </div>
    </div>
  );
};

export default Login;
