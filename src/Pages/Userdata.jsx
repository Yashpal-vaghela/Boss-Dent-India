import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserData = () => {
    const [user, setUser] = useState(null);
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
                console.log('User Email:', userData.email)
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Error fetching user data');
                navigate('/login');
            }
        }

        fetchUserData();
    }, [navigate]); // Added navigate to dependency array

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
            <h2>User Data</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.data?.email || 'Email not available'}</p> {/* Fallback text if email is not available */}
            <p>Description: {user.description}</p>
            <button className="logout-button" onClick={logout}>Logout</button>
        </div>
    );
};

export default UserData;
