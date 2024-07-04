import React, { createContext, useContext, useState } from 'react';
const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);

    const addToWatchlist = (productId) =>{
        setWatchlist((prevWatchlist)=>[...prevWatchlist, productId]);
    };

    const removeFromWatchlist = (prodcutId) =>{
        setWatchlist((prevWatchlist) => 
        prevWatchlist.filter((id) => id !== prodcutId));
    };

    return (
        <WatchlistContext.Provider value={{watchlist, addToWatchlist, removeFromWatchlist}}>
            {children}
        </WatchlistContext.Provider>
    )
  
}

export const useWatchlist = () => useContext(WatchlistContext);