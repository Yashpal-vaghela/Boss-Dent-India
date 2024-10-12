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
  const [cartList,setCartList] = useState(()=>{
    const savedCartlist = localStorage.getItem('cart_productId');
    return savedCartlist ? JSON.parse(savedCartlist):[];
  });
  const [logout,setLogout] = useState(false);
  const [getUserData] = useState(localStorage.getItem('token'));

  useEffect(()=>{
    window.addEventListener('storage',(event)=>{
      console.log("storage",event)
      if(event.key == "token"){
        setLogout(true);
      }else{
        setLogout(false);
      }
    })
    console.log("logout",logout)
    // ensureAuthenticated();
  },[logout])

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

  const addToWatchlist = (id, selectedAttributes) => {
    if (!ensureAuthenticated()) return;
    console.warn("addWatchlist",id,ensureAuthenticated())
    // Only add the product ID to the watchlist if it doesn't already exist
    setWatchlist((prevWatchlist) => {
      // console.log("prevWatchList",prevWatchlist)
      if (!prevWatchlist.includes(id)) {
        const updatedWatchlist = [...prevWatchlist, id];
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        // Store selected attributes separately for this product
        const attributesKey = `selectedAttributes_${id}`;
        localStorage.setItem(attributesKey, JSON.stringify(selectedAttributes));
        return updatedWatchlist;
      }
      return prevWatchlist; // No change if ID already exists
    });
   
  };

  const removeFromWatchlist = (id) => {
    if (!ensureAuthenticated()) return;
    
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = prevWatchlist.filter((itemId) => itemId != id);
      console.warn("removeWatchlist",id,updatedWatchlist,prevWatchlist)
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
      const attributesKey = `selectedAttributes_${id}`;
      localStorage.removeItem(attributesKey);
      return updatedWatchlist;
    });
   
  };

  const addToCartList = (id,selectedAttributes) =>{
    // console.log("addToCartList",id,selectedAttributes)
    if (!ensureAuthenticated()) return;
    // console.warn("addWatchlist",id)
    // Only add the product ID to the watchlist if it doesn't already exist
    setCartList((prevCartlist)=>{
      // console.log("preCartList",prevCartlist)
      if(!prevCartlist.includes(id)){
        const updateCartList = [...prevCartlist,id];
        localStorage.setItem('cart_productId',JSON.stringify(updateCartList));
        const attributesKey = `selectedAttribute_${id}`;
        localStorage.setItem(attributesKey,JSON.stringify(selectedAttributes))
        return updateCartList;
      }
      return prevCartlist;
    })
  }

  const removeFromCartList = (id) =>{
    if (!ensureAuthenticated()) return;
    setCartList((prevCartlist)=>{
      const updateCartList = prevCartlist.filter((itemId)=>itemId != id);
      // console.warn("removeCartList",id,updateCartList,prevCartlist)
      localStorage.setItem('cart_productId',JSON.stringify(updateCartList));
      const attributesKey = `selectedAttributes_${id}`;
      localStorage.removeItem(attributesKey);
      return updateCartList;
    }
  )
  }
  
  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist,cartList, addToCartList, removeFromCartList}}>
      {children}
    </WatchlistContext.Provider>
  );
};
