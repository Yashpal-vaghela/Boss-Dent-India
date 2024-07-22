import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddressForm = ({ token, fetchUserData }) => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchAddress = async () =>{
            try{
                const response = await axios.get ('https://bossdentindia.com/wp-json/custom/v1/address',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data ) {
                    const {address, city, state, zipcode } = response.data;
                    setAddress(address);
                    setCity(city);
                    setState(state);
                    setZipcode(zipcode);
                    setIsEditing(true);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setMessage('Failed to load address.');
            }
        };
        fetchAddress();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing address
                const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/address', {
                    address,
                    city,
                    state,
                    zipcode,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Address updated successfully');
            } else {
                // Add new address
                const response = await axios.post('https://bossdentindia.com/wp-json/custom/v1/address', {
                    address,
                    city,
                    state,
                    zipcode,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setMessage('Address added successfully');
            }
            fetchUserData(); // Refresh user data after saving address
        } catch (error) {
            let errorMessage = 'An unknown error occurred.';
            if (error.response) {
                errorMessage = 'Error saving address: ' + (error.response.data.message || 'Unknown error');
            } else if (error.request) {
                errorMessage = 'No response received from the server.';
            } else {
                errorMessage = 'Error: ' + error.message;
            }
            setMessage(errorMessage);
        }
    };

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <div>
                <label>Address:</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div>
                <label>City:</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
                <label>State:</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </div>
            <div>
                <label>Zipcode:</label>
                <input type="text" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required />
            </div>
            <button type="submit">{isEditing ? 'Update Address' : 'Save Address'}</button>
            {message && <p className={message.startsWith('Error') ? 'error' : ''}>{message}</p>}
        </form>
    );
}

export default AddressForm;
