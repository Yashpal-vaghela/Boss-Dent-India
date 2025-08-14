import React, { useEffect, useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import AlertSuccess from "../component/AlertSuccess"; // Adjust the path as needed
import Loader1 from "../component/Loader1";
import { toast } from "react-toastify";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState([]);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otp, setOTP] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  // const [singupalertMessage,setSingupAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 8) {
      errors.push("at least 8 characters");
    }

    if (!/[A-Z]/.test(value)) {
      errors.push("an uppercase letter");
    }

    if (!/[a-z]/.test(value)) {
      errors.push("a lowercase letter");
    }

    if (!/\d/.test(value)) {
      errors.push("a number");
    }

    if (!/[@$!%*?&]/.test(value)) {
      errors.push("a special character (@$!%*?&)");
    }

    if (errors.length > 0) {
      setPasswordError(`Password must contain ${errors.join(", ")}.`);
    } else {
      setPasswordError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordError("Password is not match with your created password.");
    } else {
      setPasswordError("");
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setPhone(value);
    }
    // if (phone.length !== 10) {
    //   setPhone(e.target.value);
    // } else {
    //   setPhone([]);
    // }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setSingupAlertMessage("You are signup successfully.");
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error,
        showConfirmButton: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.bossdentindia.com/wp-json/custom/v1/register",
        {
          username,
          email,
          password,
          phone_number: phone,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setStep(2);
        setAlertMessage(
          "Registration successful. Please check your Whatsapp for the OTP."
        );
      }
    } catch (error) {
      setLoading(false);
      // setError(error.response.data.message);
      // toast.error(error.response.data.message);
      console.log("error", error);
      let errorMessage = "Registration failed.";
      if (error.response && error.response.data) {
        const serverError = error.response.data;
        if (serverError.code === "missing_fields") {
          errorMessage = "Please fill in all required fields.";
        } else if (serverError.code === "user_exists") {
          errorMessage = "Username or Email already exists.";
        } else if (serverError.code === "registration_failed") {
          errorMessage = "Registration failed.";
        }
      }
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: true,
      });
    }
  };
  const handleLogin = async () => {
    try {
      const loginResponse = await axios.post(
        "https://admin.bossdentindia.com/wp-json/jwt-auth/v1/token",
        {
          username,
          password,
        }
      );
      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
        sessionStorage.setItem("token", token);
        const ObjectUserData = {
          user_display_name: loginResponse.data.user_display_name,
          user_email: loginResponse.data.user_email,
          user_id: loginResponse.data.user_id,
        };
        sessionStorage.setItem("UserData", JSON.stringify(ObjectUserData));
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You are now logged in.",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Login Failed. Please try again.",
        timer: 2000,
        showConfirmButton: true,
      });
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.bossdentindia.com/wp-json/custom/v1/verify-otp",
        {
          email,
          phone_number: phone,
          otp,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: "Verified!",
          text: "Your OTP has been successfully verified. Logging you in...",
          showConfirmButton: false,
          timer: 2000,
        });
        await handleLogin();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: "The OTP entered is incorrect or expired. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.bossdentindia.com/wp-json/custom/v1/resend-otp",
        {
          phone_number: phone,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setAlertMessage("OTP has been resent. Please check your Whatsapp.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error resending OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to resend OTP. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <div className="signup-container" data-aos="fade">
        {loading ? (
          <Loader1></Loader1>
        ) : (
          <>
            <h2 className="signup-title">Sign Up</h2>
            {/* {alertMessage && (
              <AlertSuccess message="Otp has been sent to your WhatsApp! Please check and verify." />
            )} */}
            {step === 1 ? (
              <> 
              <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter Your Username"
                    className="form-input"
                    value={username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Your E-mail"
                    className="form-input"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    type="phone"
                    id="phone"
                    placeholder="Enter Your Phone Number"
                    className="form-input"
                    value={phone || ""}
                    maxLength={10}
                    minLength={9}
                    onChange={(e) => handlePhoneChange(e)}
                    // min={10}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    Create Your Password
                  </label>
                  <div className="d-flex " style={{ width: "106%" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create Your Password"
                      className="form-input"
                      value={password || ""}
                      onChange={handlePasswordChange}
                      required
                    />

                    <span
                      className="signup-password-toggle-icon"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  {/* {error && (
                    <p
                      style={{ color: "red" }}
                      className={`${error ? "error" : ""} `}
                    >
                      {error}
                    </p>
                  )} */}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="confirm-password">
                    Confirm Your Password
                  </label>
                  <div className="d-flex " style={{ width: "106%" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder="Confirm Your Password"
                      className="form-input"
                      value={confirmPassword || ""}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    <span
                      className="signup-password-toggle-icon"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  {passwordError && (
                    <p
                      style={{ color: "red" }}
                      className={`${passwordError ? "error" : ""} `}
                    >
                      {passwordError}
                    </p>
                  )}
                </div>
                <button type="submit" className="signup-button">
                  Sign Up
                </button>
                <p className="login-text">
                  I already have an account?{" "}
                  <Link to="/my-account">Log in</Link>
                </p>
              </form>
              </>
            ) : (
              <form className="otp-form" onSubmit={handleVerifyOTP}>
                {/* {singupalertMessage && (
                  <AlertSuccess message="You are signup successfully." />
                )} */}
                <div className="form-group">
                  <small className="form-text">
                    We have sent <b>6 digit</b> verification code on WhatsApp to this Number{" "}
                    <span className="from-txt-otp">+91-XXXX-XX{phone.slice(-4)}</span>. 
                    Enter the code below to continue.
                  </small>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Enter OTP"
                    className="form-input"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="resend-otp-button"
                    onClick={handleResendOTP}
                  >
                    Valid for 5 minutes only?{" "}
                    <span className="resend-txt">Resend OTP</span>
                  </button>
                </div>
                <button type="submit" className="verify-otp-button">
                  Verify OTP
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
