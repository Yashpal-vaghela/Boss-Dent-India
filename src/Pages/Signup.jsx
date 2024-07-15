import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'
import { register } from 'swiper/element';



const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
          const response = await axios.post("https://bossdentindia.com/wp-json/custom/v1/register",{
            username,
            email,
            password
          });
          console.log("signup", username , email, password);
          const Toast = Swal.mixin({
            toast: true,
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
        } catch (error){
          console.error('Error signing up:', error);
          alert('Registration failed.');
        }
        // console.log("username",username, "email",email, "password",password )
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
      };

  return (
    <div className='signup-container'>
        <h2 className='signup-title'>Sign Up</h2>
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
                placeholder='Entern Your Password'
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
        <p className='login-text'>I have a already account?<a href='/my-account'>Log in</a></p>
        </form>
    </div>
  )
}

export default Signup