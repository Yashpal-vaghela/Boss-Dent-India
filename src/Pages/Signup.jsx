import React, { useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOTP] = useState('');
    const [otpSent, setOTPSent] = useState(false); // To track if OTP has been sent

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://bossdentindia.com/wp-json/custom/v1/register", {
                username,
                email,
                password
            });

            if (response.status === 200) {
                setStep(2);
                setOTPSent(true); // Mark OTP as sent
                Swal.fire({
                    icon: "success",
                    title: response.data,
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error('Error signing up:', error);
            let errorMessage = 'Registration failed.';
            if (error.response && error.response.data) {
                const serverError = error.response.data;
                if (serverError.code === 'missing_fields') {
                    errorMessage = 'Please fill in all required fields.';
                } else if (serverError.code === 'user_exists') {
                    errorMessage = 'Username or Email already exists.';
                } else if (serverError.code === 'registration_failed') {
                    errorMessage = 'Registration failed.';
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
            const response = await axios.post("https://bossdentindia.com/wp-json/custom/v1/verify-otp", {
                email,
                otp
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "OTP verified successfully. Registration completed.",
                    showConfirmButton: false,
                    timer: 3000
                });
                navigate('/my-account'); // Redirect to the login page
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'OTP verification failed.',
                showConfirmButton: true,
            });
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await axios.post("https://bossdentindia.com/wp-json/custom/v1/resend-otp", {
                email
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "OTP has been resent. Please check your email.",
                    showConfirmButton: false,
                    timer: 3000
                });
                setOTPSent(true); // Mark OTP as resent
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: 'Failed to resend OTP. Please try again.',
                showConfirmButton: true,
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='signup-container'>
            <h2 className='signup-title'>Sign Up</h2>
            {step === 1 ? (
                <form className='signup-form' onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='username'>Username</label>
                        <input 
                            type='text'
                            id='username'
                            placeholder='Enter Your Username'
                            className='form-input'
                            value={username}
                            onChange={(e)=> setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder='Enter Your E-mail'
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
                            placeholder='Enter Your Password'
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEye /> : <FaEyeSlash /> }
                        </span>
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button> 
                    <p className='login-text'>I already have an account? <a href='/my-account'>Log in</a></p>
                </form>
            ) : (
                <form className='otp-form' onSubmit={handleVerifyOTP}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='otp'>Enter OTP</label>
                        <small className="form-text">A one-time password (OTP) has been sent to <span className='from-txt-otp'>{email}</span>. Please enter it above to complete your registration.</small>
                        <input
                            type='text'
                            id='otp'
                            placeholder='Enter OTP'
                            className='form-input'
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            required
                        />
                        <button type="button" className="resend-otp-button" onClick={handleResendOTP}>
                       Valid for 3 minutes? <span className='resend-txt'>Resend OTP</span> 
                    </button>
                    </div>
                    <button type="submit" className="verify-otp-button">Verify OTP</button>
                    
                </form>
            )}
        </div>
    );
}

export default Signup;
