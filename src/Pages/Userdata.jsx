import React, { useEffect, useState,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import avtar from '../images/avtar.png';
import Loader from '../component/Loader';
import AddressForm from '../component/AddressForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import "../css/responsiveuserdata.css"
import Aos from 'aos';
import AlertSuccess from '../component/AlertSuccess';
import { toast } from "react-toastify";

const UserData = () => {
  const [user, setUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState("welcome");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = useCallback(
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not logged in!")
        // alert("Not logged in!");
        navigate("/my-account");
        return;
      }
  
      try {
        // Fetch user data
        const response = await fetch(
          "https://bossdentindia.com/wp-json/wp/v2/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status === 401) {
          toast("Please log in!");
          // alert("Please log in!");
          navigate("/my-account");
          return;
        }
  
        if (!response.ok) throw new Error("Failed to fetch user data");
        // const userData = await response.json();
  
        // Fetch detailed user info
        const userDetailResponse = await fetch(
          "https://bossdentindia.com/wp-json/custom/v1/user-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userDetailResponse.ok)
          throw new Error("Failed to fetch user details");
        const userDetailData = await userDetailResponse.json();
  
        setUser(userDetailData);
        setContactNumber(userDetailData.contactNumber || "");
        setGender(userDetailData.gender || "");
  
        // Fetch address data
        const addressResponse = await fetch(
          "https://bossdentindia.com/wp-json/custom/v1/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!addressResponse.ok) throw new Error("Failed to fetch address data");
        const addressData = await addressResponse.json();
        setAddress(addressData.pickup_locations || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
        // alert("Error fetching user data");
        navigate("/login");
      }
    },[navigate]
  )


  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const validatePassword = (value) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(value)) {
      setPasswordError(
        "Create a strong password with 8 characters,  uppercase, lowercase, number, and special character"
      );
    } else {
      setPasswordError("");
    }
  };
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Not logged in!");
      // alert("Not logged in!");
      navigate("/my-account");
      return;
    }

    const userData = {
      contactNumber,
      gender,
    };

    try {
      const response = await fetch(
        "https://bossdentindia.com/wp-json/custom/v1/user-details",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Failed to update user data");
      }

      const updatedUserData = await response.json();
      setUser(updatedUserData);
      toast.success("User data updated successfully!");
      // alert("User data updated successfully!");
    } catch (error) {
      toast.error("Error updating user data");
      console.error("Error updating user data:", error);
      // alert("Error updating user data");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Not logged in!")
      // alert("Not logged in!");
      navigate("/my-account");
      return;
    }

    const passwordData = {
      oldPassword,
      newPassword,
    };
    try {
      const response = await fetch(
        "https://bossdentindia.com/wp-json/custom/v1/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passwordData),
        }
      );
      if (response.status === 401) {
        toast.error("Incorrect old password!");
        // alert("Incorrect old password!");
        return;
      }
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data:", errorData);
        throw new Error("Failed to change password");
      }
      setShowAlert(true);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password");
      // alert("Error changing password");
    } finally {
      setLoading(false);
    }
    
    setTimeout(() => {
      setShowAlert(false);
      navigate("/my-account");
    }, 3000);
  };

  const linkToProduct = () => {
    navigate("/products");
  };

  const logout = () => {
    localStorage.removeItem("token");
    toast("Logged out!");
    // alert("Logged out!");
    navigate("/my-account");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowNewPassword(!showNewPassword);
  };
  useEffect(() => {
    Aos.init({
      duration: 1000, // Animation duration in milliseconds
      once: false,    // Allow animations to trigger multiple times
      mirror: true,   // Trigger animations on scroll up
    });
  }, []);

  if (!user) {
    return <Loader />;
  }

  return (
    <div className="user-data">
      <div className='header' data-aos="fade-up">
        <h1>User Data</h1>
        <nav>
          <a href='/'>Home</a> &gt; <span>User Data</span>
        </nav>
      </div>
        <div className="user-data-container" data-aos="fade">
          <div className="user-data-sidebar">
            <img
              className="avatar"
              src={avtar}
              alt="User Avatar"
              onClick={() => setSelectedSection("welcome")}
            />
            <h3>{user.username}</h3>
            <ul>
              <li onClick={() => setSelectedSection("contactDetails")}>
                Contact Details
              </li>
              <li onClick={() => setSelectedSection("orders")}>Orders</li>
              <li onClick={() => setSelectedSection("address")}>Address</li>
              <li onClick={() => setSelectedSection("changePassword")}>
                Change Password
              </li>
            </ul>
            <button className="logout-button" onClick={logout}>
              Log Out
            </button>
          </div>
          <div className="user-data-main">
            {selectedSection === "welcome" && (
              <div className="user-section" data-aos="fade-left">
                <h2>
                  Welcome, <span>{user.username} !</span>
                </h2>
                <p>We're glad to see you here. Enjoy shopping with us!</p>
                <p>Find the best deals on dental products and materials.</p>
                <p>
                  Feel free to reach out to our support team for any assistance.
                </p>
                <button className="shop-button" onClick={linkToProduct}>
                  Shop Now!
                </button>
              </div>
            )}
            {selectedSection === "contactDetails" && (
              <form className="user-details-form">
                <h2>Contact Details</h2>
                <div>
                  <label>Name:</label>
                  <input type="text" value={user.username} readOnly />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    value={user.email || "Email not available"}
                    readOnly
                  />
                </div>
                <div>
                  <label>Contact Number:</label>
                  <input
                    type="number"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label>Gender:</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="male"
                        checked={gender === "male"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="female"
                        checked={gender === "female"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Female
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="other"
                        checked={gender === "other"}
                        onChange={(e) => setGender(e.target.value)}
                      />
                      Other
                    </label>
                  </div>
                </div>
                <button type="button" onClick={handleSave}>
                  Save
                </button>
              </form>
            )}
            {selectedSection === "orders" && <p>Orders section coming soon...</p>}
            {selectedSection === "address" && (
              <div className="address-section">
                <h2>Address Information</h2>
                {address.length > 0 ? (
                  address.map((loc, index) => (
                    <div key={index} className="address-item">
                      <h3>{loc.name}</h3>
                      <p>{loc.address.address_1}</p>
                      <p>
                        {loc.address.city}, {loc.address.state}{" "}
                        {loc.address.postcode}
                      </p>
                      <p>{loc.address.country}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <AddressForm
                      token={localStorage.getItem("token")}
                      fetchUserData={fetchUserData}
                    />
                  </>
                )}
              </div>
            )}
            {selectedSection === "changePassword" && (
              <form className="change-password-form">
                <h2>Change Password</h2>
                <div className="input-group">
                  <label>Old Password:</label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={oldPassword}
                      placeholder="Enter Your Old Password"
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <span
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                </div>
                <div className="input-group">
                  <label>New Password:</label>
                  <div className="password-input-container">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      placeholder="Enter Your New Password"
                      onChange={handlePasswordChange}
                      required
                    />
                    <span
                      className="password-toggle"
                      onClick={togglePasswordVisibility1}
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  {passwordError && (
                    <p style={{ color: "red" }}>{passwordError}</p>
                  )}
                </div>
                <div>
                  <a href="/forgot-password" className="forgot-password-link">
                    Forgot Password?
                  </a>
                </div>
                <div>
                  {/* {isLoading ? <div className="loader"> </div>  : null } */}
                  <button onClick={handleChangePassword}>
                      Change Password
                  </button>
                  {/* {isLoading && <p>Changing Password...</p>}
                  {!isLoading && isSuccess && <p>Your password has been successfully changed.</p>} */}
                </div>
                {loading && (
                  <div className='new-loader-overlay'>
                    <div>
                      <div className='new-loader-spinner'></div>
                      <div className='new-loader-message'>
                        please wait, your password has been changed....
                      </div>
                    </div>
                  </div>
                )}
                {showAlert && <AlertSuccess message='Your Password Change successfully'/>}
              </form>
            )}
          </div>
        </div>
    </div>
  );
};

export default UserData;
