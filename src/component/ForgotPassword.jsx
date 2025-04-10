import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
// import Aos from 'aos';
import AlertSuccess from './AlertSuccess';
// import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState([]);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (value) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(value)) {
            setPasswordError('Create a strong password: min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character');
        } else {
            setPasswordError('');
        }
    };

    const handlePhoneChange = (e) => {
        if (phone.length !== 10) {
          setPhone(e.target.value);
        } else {
          setPhone([]);
        }
      };

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            console.log("step1");
            
            const response = await axios.post('https://admin.bossdentindia.com/wp-json/custom/v1/forgot-password', {
               "phone_number": phone
            });
            console.log("step2", phone);
            console.log("Full Response:", response.data);
            if (response.data.success) {
                console.log("step3");
                setLoading(false);
                setShowAlert(true);
                setAlertMessage('Password reset phone sent successfully! Please check your inbox.');
                setStep(2); // Move to the next step
            } else {
                throw new Error('Failed to send reset password email');
            }
        } catch (error) {
            console.error('Error sending reset password email:', error);
            alert(error.response?.data?.message || 'Error sending reset password email');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            setLoading(true);
            const response = await axios.post('https://admin.bossdentindia.com/wp-json/custom/v1/verify-reset-otp', {
                "phone_number": phone,
                otp
            });
            if (response.data.success) {
                setLoading(false);
                // setShowAlert(true);
                setAlertMessage('OTP verified successfully! You can now reset your password.');
                
                setStep(3); // Move to the next step
            } else {
                throw new Error('Invalid OTP');
            }
            // setTimeout(() => {
            //     setShowAlert(false);
            // }, 3000);
        } catch (error) {
            console.error('Error verifying OTP:', error);
            // toast.error(error.response?.data?.message || 'Invalid OTP');
            setAlertMessage('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://admin.bossdentindia.com/wp-json/custom/v1/reset-password', {
                email,
                password: newPassword
            });
            if (response.data.success) {
                setAlertMessage('Password changed successfully!');
                setLoading(false);
                setShowAlert(true);
                // setAlertMessage('OTP verified successfully! You can now reset your password.');
                // setTimeout(() => {
                //     navigate('/my-account');
                // }, 3000)
                // navigate('/my-account');
            } else {
                throw new Error('Failed to change password');
            }
            setTimeout(() =>{
                setShowAlert(false);
                navigate('/my-account');
            }, 3000);
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        validatePassword(value);
    };
    // console.log("message", alertMessage);
    


    return (
        <div className="forgot-password-container" data-aos="fade">
            
            {error && <div className="error-message">{error}</div>}
            {step === 1 && (
                <div className="step-1">
                    <h2>Forgot Password</h2>
                    <div>
                        <label>Please enter your registered mobile number to receive an OTP for resetting your password.</label>
                        <input
                            type="phone"
                            value={phone || ""}
                            onChange={(e) => handlePhoneChange(e)}
                            placeholder="Enter your registered Mobile number"
                            required
                        />
                    </div>
                    <button type="button" onClick={handleForgotPassword}>Request For OTP</button>
                    {alertMessage && <AlertSuccess message={alertMessage} />}
                    {loading && (
                        <div className="loader-overlay">
                            <div>
                                <div className="loader-spinner"></div>
                                <div className="loader-message">
                                    Please wait, while OTP is being sent to your mail...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="step-2" data-aos="fade">
                    <label>Enter the OTP sent to your registered email address:</label>
                    <div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter your OTP"
                            required
                        />
                    </div>
                    <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
                    {alertMessage && <AlertSuccess message={alertMessage} />}
                    {loading && (
                        <div className='loader-overlay'>
                            <div>
                                <div className='loader-spinner'></div>
                                <div className='loader-message'>
                                    Please wait, while OTP is verifying...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="step-3" data-aos="fade">
                    <h2>Set New Password</h2>
                    <div>
                        <label>New Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            placeholder='Enter Your Password'
                            onChange={handlePasswordChange}
                            required
                        />
                        <span className='password-icon' onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
                    </div>
                    <button type="button" onClick={handleChangePassword}>Change Password</button>
                    {loading && (
                        <div className='loader-overlay'>
                            <div>
                                <div className='loader-spinner'></div>
                                <div className='loader-message'>
                                    Your password is being changed...
                                </div>
                            </div>
                        </div>
                    )}
                    {showAlert && <AlertSuccess message={alertMessage} />}
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
