import React, { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import Aos from "aos";
// import * as yup from "yup";
import AlertSuccess from "../component/AlertSuccess"; // Adjust the path as needed
import Loader1 from "../component/Loader1";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [otp, setOTP] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(value)) {
      setError(
        "Create a strong password: min 8 characters, uppercase, lowercase, number, special character"
      );
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handlePhoneChange = (e) => {
    if (phone.length !== 10) {
      setPhone(e.target.value);
    }else{
      setPhone()
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
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
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setStep(2);
        setAlertMessage(
          "Registration successful. Please check your email for the OTP."
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Error signing up:", error);
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

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://admin.bossdentindia.com/wp-json/custom/v1/verify-otp",
        {
          email,
          otp,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setAlertMessage("OTP verified successfully. Registration completed.");
        navigate("/my-account");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "OTP verification failed.",
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
          email,
        }
      );

      if (response.status === 200) {
        setLoading(false);
        setAlertMessage("OTP has been resent. Please check your email.");
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
    <div className="signup-container" data-aos="fade">
      {loading ? (
        <Loader1></Loader1>
      ) : (
        <>
          <h2 className="signup-title">Sign Up</h2>
          {alertMessage && (
            <AlertSuccess message="Otp sent in your email succesfully." />
          )}
          {step === 1 ? (
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
                  value={username}
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
                  value={email}
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
                ></input>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Create Your Password
                </label>
                <div className="d-flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Create Your Password"
                    className="form-input"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />

                  <span
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
                {error && (
                <p
                  style={{ color: "red" }}
                  className={`${error ? "error" : ""} `}
                >
                  {error}
                </p>
              )}
              </div>
            
              <button type="submit" className="signup-button">
                Sign Up
              </button>
              <p className="login-text">
                I already have an account? <a href="/my-account">Log in</a>
              </p>
            </form>
          ) : (
            <form className="otp-form" onSubmit={handleVerifyOTP}>
              {alertMessage && (
                <AlertSuccess message="You are signup successfully." />
              )}
              <div className="form-group">
                <label className="form-label" htmlFor="otp">
                  Enter OTP
                </label>
                <small className="form-text">
                  A one-time password (OTP) has been sent to{" "}
                  <span className="from-txt-otp">{email}</span>. Please enter it
                  above to complete your registration.
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
  );
};

export default Signup;
