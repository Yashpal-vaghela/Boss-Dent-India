import React, { useState } from 'react';
import axios from 'axios';

const AddressForm = ({ token, fetchUserData }) => {
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
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

            setMessage(response.data);
            fetchUserData(); // Refresh user data after saving address
        } catch (error) {
            if (error.response) {
                // Server responded with a status other than 2xx
                setMessage('Error saving address: ' + (error.response.data.message || 'Unknown error'));
            } else if (error.request) {
                // Request was made but no response received
                setMessage('No response received from the server.');
            } else {
                // Other errors
                setMessage('Error: ' + error.message);
            }
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
            <button type="submit">Save Address</button>
            {message && <p className={message.startsWith('Error') ? 'error' : ''}>{message}</p>}
    </form>
  )
}

export default AddressForm;