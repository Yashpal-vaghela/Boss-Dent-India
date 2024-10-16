import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const location = useLocation();

  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = localStorage.getItem("watchlist");
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [cartList, setCartList] = useState(() => {
    const savedCartlist = localStorage.getItem("cart_productId");
    return savedCartlist ? JSON.parse(savedCartlist) : [];
  });
  const [getCartId, setgetCartId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const ensureAuthenticated = () => {
    if (!isAuthenticated()) {
      toast.error("Please Log In! Thank you.", {
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/my-account", { state: { from: location.pathname } });
      }, 3000);
      return false;
    }
    return true;
  };

  const addToWatchlist = (id, selectedAttributes) => {
    if (!ensureAuthenticated()) return;
    console.warn("addWatchlist", id, ensureAuthenticated());
    // Only add the product ID to the watchlist if it doesn't already exist
    setWatchlist((prevWatchlist) => {
      // console.log("prevWatchList",prevWatchlist)
      if (!prevWatchlist.includes(id)) {
        const updatedWatchlist = [...prevWatchlist, id];
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
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
      // console.warn("removeWatchlist", id, updatedWatchlist, prevWatchlist);
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      const attributesKey = `selectedAttributes_${id}`;
      localStorage.removeItem(attributesKey);
      return updatedWatchlist;
    });
  };

  const addToCartList = (id, selectedAttributes) => {
    // console.log("addToCartList",id,selectedAttributes)
    if (!ensureAuthenticated()) return;
    // console.warn("addWatchlist",id)
    // Only add the product ID to the watchlist if it doesn't already exist
    setCartList((prevCartlist) => {
      // console.log("preCartList",prevCartlist)
      if (!prevCartlist.includes(id)) {
        const updateCartList = [...prevCartlist, id];
        localStorage.setItem("cart_productId", JSON.stringify(updateCartList));
        const attributesKey = `selectedAttribute_${id}`;
        localStorage.setItem(attributesKey, JSON.stringify(selectedAttributes));
        return updateCartList;
      }
      return prevCartlist;
    });
  };

  const addToCartListProduct = async (id,selectedAttributes,fetchuserdata)=>{
    if(!ensureAuthenticated()) return;
    await axios.get(`https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata.user_id}`)
    .then((res)=>{
      localStorage.setItem("cart", JSON.stringify(res.data));
      setCartList((prevCartlist)=>{
        if(!prevCartlist.includes(id)){
          const updateCartList = [...prevCartlist,id];
          localStorage.setItem('cart_productId',JSON.stringify(updateCartList));
          const attributesKey = `selectedAttribute_${id}`;
          localStorage.setItem(attributesKey,JSON.stringify(selectedAttributes))
          return updateCartList;
        }
        return prevCartlist;
      })
    })
    .catch((err)=>console.log("err",err))
  }
  const removeFromCartList = (id) => {
    if (!ensureAuthenticated()) return;
    setCartList((prevCartlist) => {
      const updateCartList = prevCartlist.filter((itemId) => itemId != id);
      // console.warn("removeCartList",id,updateCartList,prevCartlist)
      localStorage.setItem("cart_productId", JSON.stringify(updateCartList));
      const attributesKey = `selectedAttributes_${id}`;
      localStorage.removeItem(attributesKey);
      return updateCartList;
    });
    console.log("carTlIST",cartList)
  };

  const LoginUserCartList = async (fetchuserdata,selectedAttributes) => {
    // if (!ensureAuthenticated()) return;
    console.log("loginUserCartList", cartList);
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata}`
      )
      .then((response) => {
        localStorage.setItem("cart", JSON.stringify(response.data));
        const id = response.data.cart_items.map((item)=>{
          if(!cartList.includes(item.product_id)){
          //  return  setgetCartId([...getCartId,Number(item.product_id)])
          // cartList.push(Number(item.product_id))
          setCartList((prevCartlist) => {
            // console.log("preCartList",prevCartlist)
            if (!prevCartlist.includes(item.product_id)) {
              const updateCartList = [...prevCartlist,Number(item.product_id)];
              localStorage.setItem("cart_productId", JSON.stringify(updateCartList));
              const attributesKey = `selectedAttribute_${item.product_id}`;
              localStorage.setItem(attributesKey, JSON.stringify(selectedAttributes));
              return updateCartList;
            }
            return prevCartlist;
          });
            return getCartId.push(Number(item.product_id))
          }
        })
       
        localStorage.setItem('cart_productId',JSON.stringify(getCartId))
        // setgetCartId(
        //   ...getCartId,
        //   response.data.cart_items.map((item) => item.id)
        // );
        console.log(
          "Login-user-cartList",
          "id",
          id,
          response.data,
          Object.values(response.data.cart_items),
          "setCartId",
          getCartId
        );
        // localStorage.setItem("cart_productId",response.data.cart_items)
      })
      .catch((error) => console.log("error", error));
  };
  const LogoutUserCartList = () =>{
    setgetCartId([]);
    setCartList([]);
    localStorage.setItem('cart_productId',JSON.stringify([]))
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        cartList,
        addToCartList,
        addToCartListProduct,
        removeFromCartList,
        LoginUserCartList,
        LogoutUserCartList
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
