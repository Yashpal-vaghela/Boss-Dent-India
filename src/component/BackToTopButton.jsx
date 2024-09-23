import React, { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#c39428',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            letterSpacing: '1px',
            outline: 'none',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            padding: '13px 15px',
            cursor: 'pointer',
            transition: 'background-color 0.5s ease', 
            zIndex:1
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transition: 'transform 0.3s ease', 
              transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)', 
            }}
          >
            <FaArrowUp />
          </span>
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
