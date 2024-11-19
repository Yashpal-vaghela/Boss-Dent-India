import React from 'react'
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const CanonicalURL = ({ children }) => {
    const location = useLocation();
    const baseUrl = "https://bossdentindia.com";
    return (
        <>
            <Helmet>
                <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
            </Helmet>
            {children}
        </>
    );
}

export default CanonicalURL