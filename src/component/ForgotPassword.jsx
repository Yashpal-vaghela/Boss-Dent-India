import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
// import Aos from 'aos';
import AlertSuccess from './AlertSuccess';
import "../css/forgotpassword.css";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [showAlert, setShowAlert] = useState(false);
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

    const handleForgotPassword = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/forgot-password', {
                email
            });
            if (response.data.success){
                setLoading(false);
                setShowAlert(true);    
                // alert('Password reset email sent successfully!');
                setStep(2); // Move to the next step
            } else {
                throw new Error('Failed to send reset password email');
            }

            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
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
                email,
                otp
            });
            if (response.data.success){
                setLoading(false);
                setShowAlert(true);
                // alert('OTP verified successfully!');
                setStep(3); // Move to the next step
            } else{
                throw new Error('Invalid OTP'); 
            }
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error.response?.data?.message || 'Invalid OTP');
            // alert(error.response?.data?.message || 'Invalid OTP');
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
            if (response.data.success){
                setLoading(false);
                setShowAlert(true);
                // alert('Password changed successfully!');
                navigate('/my-account');
            } else {
                throw new Error('Failed to change password');
            }
            setTimeout(() =>{
                setShowAlert(false);
            }, 3000);
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.response?.data?.message || 'Failed to change password');
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

    // useEffect(() => {
    //     Aos.init({
    //       duration: 1000, // Animation duration in milliseconds
    //       once: false,    // Allow animations to trigger multiple times
    //       mirror: true,   // Trigger animations on scroll up
    //     });
    //   }, []);
    

    return (
        <div className="forgot-password-container" data-aos="fade">
            {error && <div className="error-message">{error}</div>}
            {step === 1 && (
                <div className="step-1">
                    <h2>Forgot Password</h2>
                    <div>
                        <label>Please enter your registered email address to receive an OTP for resetting your password.</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email address"
                            required
                        />
                    </div>
                    <button type="button" onClick={handleForgotPassword}>Request For OTP</button>
                    {loading && (
                        <div className="loader-overlay">
                            <div>
                                <div className="loader-spinner"></div>
                                <div className="loader-message">
                                Please wait, while OTP will send to your mail...
                                </div>
                            </div>
                        </div>
                    )}
                    {showAlert && <AlertSuccess  message='OTP is sucessfully send to Entered Email Address'/>}
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
                    {loading && (
                        <div className='loader-overlay'>
                            <div>
                               <div className='loader-spinner'></div>
                               <div className='loader-message'>
                                please wait, while OTP is verifying...
                               </div>
                            </div>
                        </div>
                    )}
                    {showAlert && <AlertSuccess message ="OTP verified succesfully" />}
                </div>
            )}
            {step === 3 && (
                <div className="step-3" data-aos="fade">
                    <h2>Set New Password</h2>
                    <div>
                        <label>New Password:</label>
                        <input
                            type={showPassword ? "text" :"password"}
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
                                    Your password has been Changing...
                                </div>
                            </div>
                        </div>
                    )}
                    {showAlert && <AlertSuccess message ="Your password changed Successfully." />}
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
