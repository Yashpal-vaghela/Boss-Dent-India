import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import "../css/alert.css";

const AlertSuccess = ({ message = "Success! Your action was completed." }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // Automatically show the alert on component mount
    setShowAlert(true);

    // Hide the alert after 3 seconds
    const timer = setTimeout(() => setShowAlert(false), 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {showAlert && (
        <div className="success-alert">
          <FaCheckCircle className="alert-icon" />
          {message}
        </div>
      )}
    </div>
  );
}

export default AlertSuccess;
