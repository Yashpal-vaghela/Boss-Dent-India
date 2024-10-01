import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const location = useLocation();
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
      
      toast.error("Please Log In! Thank you.",{
        autoClose:3000
      });
      setTimeout(() =>{
        navigate('/my-account', { state: {from: location.pathname}});
      },3000);
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
