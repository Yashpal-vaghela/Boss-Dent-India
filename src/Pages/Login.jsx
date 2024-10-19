import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loader1 from "../component/Loader1";
import { useWatchlist } from "./WatchlistContext";

const Login = () => {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("")
  const location = useLocation();
  const navigate = useNavigate();
  const { LoginUserCartList, LoginUserWatchList, LogoutUserWatchList, LogoutUserCartList } = useWatchlist();

  useEffect(() => {
    const savedUsername = localStorage.getItem("userIdentifier");
    const savedPasssword = localStorage.getItem("password");
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("UserData"));
    if (token && userData) {
      setIsLoggedIn(true);
      setUserName(userData.user_dispaly_name);
    }
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
      const ObjectUserData = {
        user_dispaly_name: response.data.user_display_name,
        user_email: response.data.user_email,
        user_id: response.data.user_id,
        user_nicename: response.data.user_nicename
      }
      LoginUserCartList(response.data.user_id,{})
      LoginUserWatchList(response.data.user_id,{})
      // console.log("res==",response,ObjectUserData)
      localStorage.setItem("token", token);
      localStorage.setItem('UserData', JSON.stringify(ObjectUserData))
      // localStorage.setItem("user_id", userId);
      if (rememberMe) {
        localStorage.setItem("userIdentifier", userIdentifier);
        localStorage.setItem("password", password);
        setLoading(false);
      } else {
        localStorage.removeItem("userIdentifier");
        localStorage.removeItem("password");
      }
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        timer: 2500,
        showConfirmButton: false,
      });
      setTimeout(()=>{
        const redirectPath = location.state?.from || "/"; 
        navigate(redirectPath);
      },2700)
      
    } catch (error) {
      toast.error("Login failed. Please check your username and password.");
      console.error("Error logging in:", error);
      setLoading(false);
    }
    setUserIdentifier("");
    setPassword("");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("UserData");
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify({cart_items:[], cart_total:{}}));
    LogoutUserCartList();
    LogoutUserWatchList();
    Swal.fire({
      icon: "success",
      title: "Logout Succesful",
      timer: 2500,
      showConfirmButton: false,
    });
    setTimeout(() => {
     window.location.reload(); 
    }, 2700)
        
  };

  return loading ? (
    <>
      <Loader1></Loader1>
    </>
  ) : (
    <div className="container">
      {isLoggedIn ? (
        <div className="already-logged-in" data-aos="fade">
          <p>You are already logged in as <strong>{userName}</strong></p>
          <butoon onClick={handleLogout} className="logout-button"> Log Out </butoon>
        </div>
      ) : (
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
                <Link href="/forgot-password" className="forgot-password-l"></Link>
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
        </div>
      )}
    </div>
  );
};

export default Login;
