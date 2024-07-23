import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avtar from '../images/avtar.png';
import Loader from '../component/Loader';
import AddressForm from '../component/AddressForm';

const UserData = () => {
    const [user, setUser] = useState(null);
    const [selectedSection, setSelectedSection] = useState('welcome');
    const [contactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('');
    const [address, setAddress] = useState([]);
    const navigate = useNavigate();

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Not logged in!');
            navigate('/my-account');
            return;
        }

        try {
            // Fetch user data
            const response = await fetch('https://bossdentindia.com/wp-json/wp/v2/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData = await response.json();

            // Fetch detailed user info
            const userDetailResponse = await fetch('https://bossdentindia.com/wp-json/custom/v1/user-data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!userDetailResponse.ok) throw new Error('Failed to fetch user details');
            const userDetailData = await userDetailResponse.json();

            setUser(userDetailData);
            setContactNumber(userDetailData.contactNumber || '');
            setGender(userDetailData.gender || '');

            // Fetch address data
            const addressResponse = await fetch('https://bossdentindia.com/wp-json/custom/v1/settings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!addressResponse.ok) throw new Error('Failed to fetch address data');
            const addressData = await addressResponse.json();
            setAddress(addressData.pickup_locations || []);

        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Error fetching user data');
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Not logged in!');
            navigate('/my-account');
            return;
        }

        try {
            const response = await fetch('https://bossdentindia.com/wp-json/custom/v1/user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contactNumber,
                    gender,
                }),
            });

            if (!response.ok) throw new Error('Failed to update user data');
            const updatedUserData = await response.json();
            setUser(updatedUserData);
            alert('User data updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Error updating user data');
        }
    };

    const linkToProduct = () => {
        navigate("/products");
    };

    const logout = () => {
        localStorage.removeItem('token');
        alert('Logged out!');
        navigate('/my-account');
    };

    if (!user) {
        return <Loader />;
    }

    return (
        <div className="user-data">
            <div className='user-data-container'>
                <div className='user-data-sidebar'>
                    <img className='avatar' 
                         src={avtar} 
                         alt='User Avatar'
                         onClick={() => setSelectedSection('welcome')}
                    />
                    <h3>{user.username}</h3>
                    <ul>
                        <li onClick={() => setSelectedSection('contactDetails')}>Contact Details</li>
                        <li onClick={() => setSelectedSection('orders')}>Orders</li>
                        <li onClick={() => setSelectedSection('address')}>Address</li>
                    </ul>
                    <button className='logout-button' onClick={logout}>Log Out</button>
                </div>
                <div className="user-data-main">
                    {selectedSection === 'welcome' && (
                        <div className='user-section'>
                            <h2>Welcome, <span>{user.username}!</span></h2>
                            <p>We're glad to see you here. Enjoy shopping with us!</p>
                            <p>Find the best deals on dental products and materials.</p>
                            <p>Feel free to reach out to our support team for any assistance.</p>  
                            <button className='shop-button' onClick={linkToProduct}>Shop Now!</button>
                        </div>
                    )}
                    {selectedSection === 'contactDetails' && (
                        <form className="user-details-form">
                            <h2>Contact Details</h2>
                            <div>
                                <label>Name:</label>
                                <input type="text" value={user.username} readOnly />
                            </div>
                            <div>
                                <label>Email:</label>
                                <input type="email" value={user.email || 'Email not available'} readOnly />
                            </div>
                            <div>
                                <label>Contact Number:</label>
                                <input
                                    type="text"
                                    value={contactNumber}
                                    onChange={(e) => setContactNumber(e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Gender:</label>
                                <input
                                    type="text"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                />
                            </div>
                            <button type="button" onClick={handleSave}>Save</button>
                        </form>
                    )}
                    {selectedSection === 'orders' && (
                        <p>Orders section coming soon...</p>
                    )}
                    {selectedSection === 'address' && (
                        <div className='address-section'>
                            <h2>Address Information</h2>
                            {address.length > 0 ? (
                                address.map((loc, index) => (
                                    <div key={index} className="address-item">
                                        <h3>{loc.name}</h3>
                                        <p>{loc.address.address_1}</p>
                                        <p>{loc.address.city}, {loc.address.state} {loc.address.postcode}</p>
                                        <p>{loc.address.country}</p>
                                    </div>
                                )) 
                            ) : (
                                <>
                                    <p>No address information available.</p>
                                    <AddressForm token={localStorage.getItem('token')} fetchUserData={fetchUserData} />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserData;