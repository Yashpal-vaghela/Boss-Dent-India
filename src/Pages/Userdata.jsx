import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avtar from '../images/avtar.png';

const UserData = () => {
    const [user, setUser] = useState(null);
    const [selectedSection, setSelectedSection] = useState('welcome');
    const [contactNumber, setContactNumber] = useState('');
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            const token = localStorage.getItem('token');
        
            if (!token) {
                alert('Not logged in!');
                navigate('/my-account');
                return;
            }
        
            try {
                const response = await fetch('https://bossdentindia.com/wp-json/wp/v2/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                console.log('User Data:', userData); // Debugging line to log entire user data
                setUser(userData);
                setContactNumber(userData.contactNumber || '');
                setGender(userData.gender || '');
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Error fetching user data');
                navigate('/login');
            }
        }

        fetchUserData();
    }, [navigate]); // Added navigate to dependency array

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Not logged in!');
            navigate('/my-account');
            return;
        }

        try {
            const response = await fetch('https://bossdentindia.com/wp-json/wp/v2/users/me', {
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

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const updatedUserData = await response.json();
            setUser(updatedUserData);
            alert('User data updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Error updating user data');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        alert('Logged out!');
        navigate('/my-account');
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-data">
            <div className='user-data-container'>
                <div className='user-data-sidebar'>
                    <img className='avatar' src={avtar} alt='User Avatar'/>
                    <h3>{user.name}</h3>
                    <ul>
                        <li onClick={() => setSelectedSection('contactDetails')}>Contact Details</li>
                        <li onClick={() => setSelectedSection('orders')}>Orders</li>
                        <li onClick={() => setSelectedSection('address')}>Address</li>
                    </ul>
                    <button className='logout-button' onClick={logout}>Log Out</button>
                </div>
                <div className="user-data-main">
                    {selectedSection === 'welcome' && (
                        <>
                            <h2>Welcome, {user.name}!</h2>
                            <p>We're glad to see you here. Enjoy shopping with us!</p>
                            <p>Find the best deals on dental products and materials.</p>
                            <p>Feel free to reach out to our support team for any assistance.</p>
                        </>
                    )}
                    {selectedSection === 'contactDetails' && (
                        <form className="user-details-form">
                            <h2>Contact Details</h2>
                            <div>
                                <label>Name:</label>
                                <input type="text" value={user.name} readOnly />
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
                        <p>Address section coming soon...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserData;
