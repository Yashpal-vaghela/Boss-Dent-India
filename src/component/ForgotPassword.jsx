import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        try {
            const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/forgot-password', {
                email
            });

            if (response.status !== 200) {
                throw new Error('Failed to send reset password email');
            }

            alert('Password reset email sent successfully!');
            setStep(2); // Move to the next step
        } catch (error) {
            console.error('Error sending reset password email:', error);
            alert(error.response?.data?.message || 'Error sending reset password email');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/verify-reset-otp', {
                email,
                otp
            });

            if (response.status !== 200) {
                throw new Error('Invalid OTP');
            }

            alert('OTP verified successfully!');
            setStep(3); // Move to the next step
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert(error.response?.data?.message || 'Invalid OTP');
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/reset-password', {
                email,
                password: newPassword
            });

            if (response.status !== 200) {
                throw new Error('Failed to change password');
            }

            alert('Password changed successfully!');
            navigate('/my-account');
        } catch (error) {
            console.error('Error changing password:', error);
            setError(error.response?.data?.message || 'Failed to change password');
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="forgot-password-container">
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
                </div>
            )}
            {step === 2 && (
                <div className="step-2">
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
                </div>
            )}
            {step === 3 && (
                <div className="step-3">
                    <h2>Set New Password</h2>
                    <div>
                        <label>New Password:</label>
                        <input
                            type={showPassword ? "text" :"password"}
                            value={newPassword}
                            placeholder='Enter Your Password'
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            
                        />
                        <span className='password-icon' onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <button type="button" onClick={handleChangePassword}>Change Password</button>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
