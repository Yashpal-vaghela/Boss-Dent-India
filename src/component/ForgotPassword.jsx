import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleForgotPassword = async () => {
        try {
            const response = await fetch('https://bossdentindia.com/wp-json/custom/v1/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error data:', errorData);
                throw new Error('Failed to send reset password email');
            }

            alert('Password reset email sent successfully!');
            navigate('/my-account');
        } catch (error) {
            console.error('Error sending reset password email:', error);
            alert('Error sending reset password email');
        }
    };

    return (
        <div className="forgot-password">
            <h2>Forgot Password</h2>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="button" onClick={handleForgotPassword}>Send Reset Link</button>
        </div>
    );
};

export default ForgotPassword;
