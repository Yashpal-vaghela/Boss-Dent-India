import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ensureAuthenticated = () => {
    if (!isAuthenticated()) {
      window.alert("Please Log In! Thank you.");
      navigate('/my-account');
      return false;
    }
    return true;
  };

  const addToWatchlist = (id) => {
    if (!ensureAuthenticated()) return;
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = [...prevWatchlist, id];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  const removeFromWatchlist = (id) => {
    if (!ensureAuthenticated()) return;
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = prevWatchlist.filter((itemId) => itemId !== id);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
