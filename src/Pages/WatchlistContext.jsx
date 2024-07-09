import React, { createContext, useContext, useEffect, useState } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (id) => {
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = [...prevWatchlist, id];
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  const removeFromWatchlist = (id) => {
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
