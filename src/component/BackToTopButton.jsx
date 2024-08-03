import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 300) {
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
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#c39428',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            letterSpacing: '1px',
            outline: 'none',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            padding: '10px 15px',
            cursor: 'pointer',
          }}
        >
          ↑
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
