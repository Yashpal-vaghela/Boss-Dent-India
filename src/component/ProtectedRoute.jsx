import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {  // Correct prop name
    const location = useLocation();
    const token = localStorage.getItem("token");  // Check for token in localStorage
    
    if (!token) {
        // If the user is not logged in, redirect them to login page
        return (
            <Navigate 
                to="/my-account" 
                state={{ from: location.pathname }}  // Pass state properly
                replace 
            />
        );
    }

    // If user is logged in, render the children
    return children;
};

export default ProtectedRoute;
