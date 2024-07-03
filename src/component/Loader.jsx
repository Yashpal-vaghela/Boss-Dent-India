import React, { useEffect, useState } from 'react';
import './spiner.css';

const colors = ['#c89c31'];


const Loader = () => {
    const [colorIndex, setColorIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
      }, 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div style={styles.wrapper}>
        <div style={{ ...styles.circle, backgroundColor: colors[colorIndex] }} />
        <div style={{ ...styles.circle, backgroundColor: colors[(colorIndex + 1) % colors.length] }} />
        <div style={{ ...styles.circle, backgroundColor: colors[(colorIndex + 2) % colors.length] }} />
        <div style={{ ...styles.circle, backgroundColor: colors[(colorIndex + 3) % colors.length] }} />
      </div>
    );
  };
  
  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    },
    circle: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      margin: '10px',
      animation: 'pulse 1.2s infinite ease-in-out',
    },
  
}

export default Loader