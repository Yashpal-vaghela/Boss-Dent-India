import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) =>{
        e.preventDefault()
        console.log("username",username, "email",email, "password",password, "confirmPassword",confirmPassword)
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };
    
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
      }

  return (
    <div className='signup-container'>
        <h2 className='signup-title'>Sign Up</h2>
        <form className='signup-form' onSubmit={handleSubmit}>
            <div  className='form-group'>
                <label className='form-label' htmlFor='usernamee'>Username</label>
                <input 
                    type='text'
                    id='username'
                    className='form-input'
                    value={username}
                    onchnage={(e)=> setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
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
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="confirm-password">Re-enter Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            className="form-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span className="password-toggle-icon" onClick={toggleConfirmPasswordVisibility}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
        </form>
    </div>
  )
}

export default Signup