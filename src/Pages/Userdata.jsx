import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddressForm from "../component/AddressForm";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/responsiveuserdata.css";
import AlertSuccess from "../component/AlertSuccess";
import { toast } from "react-toastify";
import Loader1 from "../component/Loader1";
import Loader from "../component/Loader";
import { useWatchlist } from "./WatchlistContext";
import axios from "axios";
import OrderDetailsInfo from "./OrderDetailsInfo";

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
  const [ApiLoader, setApiLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [OrderDetail, setOrderDetails] = useState([]);
  const navigate = useNavigate();
  const { LogoutUserList } = useWatchlist();

  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in!");
      navigate("/my-account");
      return;
    }

    try {
      // Fetch user data
      const response = await fetch(
        "https://admin.bossdentindia.com/wp-json/wp/v2/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        toast("Please log in!");
        navigate("/my-account");
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch user data");

      // Fetch detailed user info
      const userDetailResponse = await fetch(
        "https://admin.bossdentindia.com/wp-json/custom/v1/user-data",
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
      const a = localStorage.getItem("userSidebar");
      if (a == "orders") {
        setSelectedSection(a);
        handleOrderApiData(a, userDetailData);
        localStorage.removeItem("userSidebar");
      }
      setContactNumber(userDetailData.contactNumber || "");
      setGender(userDetailData.gender || "");

      // Fetch address data
      const addressResponse = await fetch(
        "https://admin.bossdentindia.com/wp-json/custom/v1/settings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!addressResponse.ok) throw new Error("Failed to fetch address data");
      const addressData = await addressResponse.json();
      setAddress(addressData.pickup_locations || []);
      // console.log("ad", userDetailData);
      // Fetch Order Details
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data");
      navigate("/my-account");
    }
  }, [navigate]);

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
      navigate("/my-account");
      return;
    }

    const userData = {
      contactNumber,
      gender,
    };

    try {
      const response = await fetch(
        "https://admin.bossdentindia.com/wp-json/custom/v1/user-details",
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
    } catch (error) {
      toast.error("Error updating user data");
      console.error("Error updating user data:", error);
    }
  };
  const handleLogin = async (username, password) => {
    try {
      const loginResponse = await fetch(
        "https://admin.bossdentindia.com/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
      const loginResult = await loginResponse.json();
      if (loginResponse.ok) {
        localStorage.setItem("token", loginResult.token);
        return true;
      } else {
        toast.error(loginResult.message || "Login failed.");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
      return false;
    }
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    let username = "";
    const storeUserData = localStorage.getItem("UserData");
    if (storeUserData) {
      const userData = JSON.parse(storeUserData);
      username = userData.user_email;
    }
    console.log("userName :::::", username);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Not logged in!");
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
        "https://admin.bossdentindia.com/wp-json/custom/v1/change-password",
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
      const loginSuccess = await handleLogin(username, newPassword);
      if (loginSuccess) {
        toast.success("Logged in successfully with the new password!");
      } else {
        toast.error("Automatic login failed. Please log in manually.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password");
    } finally {
      setLoading(false);
    }
  };
  const linkToProduct = () => {
    navigate("/products");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.setItem(
      "cart",
      JSON.stringify({ cart_items: [], cart_total: {} })
    );
    LogoutUserList();
    toast("Logged out!");
    navigate("/my-account");
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleOrderApiData = async (section, userId) => {
    // console.log("section", user,section);
    setApiLoader(true);
    setSelectedSection(section);
    if (user !== null) {
      await axios
        .get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/user-orders/${user.ID}`
        )
        .then((response) => {
          // console.log("Orderresponse", response.data);
          const FilterData = response.data.filter(
            (order) => order.status !== "trash"
          );
          setApiLoader(false);
          // console.log("filter", FilterData);
          setOrderDetails(FilterData);
        })
        .catch((error) => {
          setApiLoader(false);
          console.log("error", error);
        });
    } else {
      await axios
        .get(
          `https://admin.bossdentindia.com/wp-json/custom/v1/user-orders/${userId.ID}`
        )
        .then((response) => {
          // console.log("Orderresponse", response.data);
          const FilterData = response.data.filter(
            (order) => order.status !== "trash"
          );
          setApiLoader(false);
          // console.log("filter", FilterData);
          setOrderDetails(FilterData);
        })
        .catch((error) => {
          setApiLoader(false);
          console.log("error", error);
        });
    }
  };

  return !user ? (
    <Loader1 />
  ) : (
    <div className="container">
      <div className="user-data overflow-hidden">
        <div className="header" data-aos="fade-up">
          <h1>User Data</h1>
          <nav className="bread-crumbs">
            <Link to="/">Home</Link>
            <i className="fa-solid fa-angle-right"></i> <span>User Data</span>
          </nav>
        </div>
        <div className="user-data-container" data-aos="fade">
          <div className="user-data-sidebar">
            <img
              className="avatar"
              src="/asset/images/avtar.png"
              alt="User Avatar"
              width={100}
              height={100}
              onClick={() => setSelectedSection("welcome")}
            />
            <h3>{user.username}</h3>
            <ul>
              <li onClick={() => setSelectedSection("contactDetails")}>
                Contact Details
              </li>
              <li onClick={() => handleOrderApiData("orders")}>Orders</li>
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
                <h2 className="section-title">Contact Details</h2>
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

            {selectedSection === "orders" && (
              <div className="order-section d-inline">
                {/* <p>Orders section coming soon...</p> */}
                {OrderDetail.length !== 0 ? (
                  <>
                    <h2 className="order-details-title section-title">
                      Order Details
                    </h2>
                    <div className="order-table">
                      <div className="order-title row mx-0">
                        <div className="col-2">
                          <h1>Order Id</h1>
                        </div>
                        <div className="col-2">
                          <h1>Order Date</h1>
                        </div>
                        <div className="col-2">
                          <h1>Product Items</h1>
                        </div>
                        <div className="col-2">
                          <h1>Total Amount</h1>
                        </div>
                        <div className="col-2">
                          <h1>Status</h1>
                        </div>
                        <div className="col-2">
                          <h1>Action</h1>
                        </div>
                      </div>
                      <div className="order-content row mx-0 justify-content-between align-items-center">
                        {OrderDetail?.map((order, index) => {
                          const dateOnly = order.order_date.split(" ")[0];
                          const [year, month, day] = dateOnly.split("-");
                          return (
                            <React.Fragment key={index}>
                              <div className="col-2">
                                <span>{order.order_id}</span>
                              </div>
                              <div className="col-2 date-section">
                                <span>
                                  {/* {dateOnly} */}
                                  {day}-{month}-{year}
                                </span>
                              </div>
                              <div className="col-2">
                                <span>{order.items.length}</span>
                              </div>
                              <div className="col-2">
                                <span>{order.order_total}</span>
                              </div>
                              <div className="col-2">
                                <span>
                                  {order.status.replace(/wc-|wc-/, "")}
                                </span>
                              </div>
                              <div className="col-2 px-0 action-button d-flex align-items-center justify-content-center">
                                <i
                                  className="d-flex d-sm-none d-md-none d-lg-none fa-solid fa-angles-right"
                                  onClick={() => {
                                    navigate("/order-details-info");
                                    localStorage.setItem(
                                      "OrderId",
                                      order.order_id
                                    );
                                  }}
                                ></i>
                                <button
                                  className="d-none d-sm-block d-md-block d-lg-block btn btn-dark mx-1"
                                  onClick={() => {
                                    navigate("/order-details-info");
                                    localStorage.setItem(
                                      "OrderId",
                                      order.order_id
                                    );
                                  }}
                                >
                                  View
                                </button>
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center justify-content-center h-100">
                      {ApiLoader === true ? (
                        <Loader></Loader>
                      ) : (
                        <div className="d-block text-center  order-main">
                          <p>No Order details found!</p>
                          <p>
                            Please your first Order
                            <Link to="/products" style={{ color: "#c39428" }}>
                              {" "}
                              ShopNow
                            </Link>
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
            {selectedSection === "address" && (
              <div className="address-section">
                <h2 className="section-title">Address Information</h2>
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
                  <Link to="/forgot-password" className="forgot-password-link">
                    {" "}
                    Forgot Password?
                  </Link>
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
                  <div className="new-loader-overlay">
                    <div>
                      <div className="new-loader-spinner"></div>
                      <div className="new-loader-message">
                        please wait, your password has been changed....
                      </div>
                    </div>
                  </div>
                )}
                {showAlert && (
                  <AlertSuccess message="Your Password Change successfully" />
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
