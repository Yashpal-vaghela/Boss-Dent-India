import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
  const location = useLocation();

  const [watchlist, setWatchlist] = useState(() => {
    const savedWatchlist = sessionStorage.getItem("watchlist");
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });
  const [cartList, setCartList] = useState(() => {
    const savedCartlist = sessionStorage.getItem("cart_productId");
    return savedCartlist ? JSON.parse(savedCartlist) : [];
  });
  // const [selectAttribute, setSelectAttribute] = useState(() => {
  //   const selectAttributeList = sessionStorage.getItem("selectedAttributes");
  //   return selectAttributeList ? JSON.parse(selectAttributeList) : [];
  // });
  const [getCartId, setgetCartId] = useState([]);
  const [getWishlistId, setWishlistId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
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

  const addToWatchlist = (id) => {
    if (!ensureAuthenticated()) return;

    setWatchlist((prevWatchlist) => {
      if (!prevWatchlist.includes(id)) {
        const updatedWatchlist = [...prevWatchlist, id];
        // sessionStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
        return updatedWatchlist;
      }
      return prevWatchlist; // No change if ID already exists
    });
  };

  const removeFromWatchlist = (id) => {
    if (!ensureAuthenticated()) return;
    setWatchlist((prevWatchlist) => {
      const updatedWatchlist = prevWatchlist.filter(
        (itemId) => itemId !== Number(id)
      );
      sessionStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  const addToCartList = (id) => {
    if (!ensureAuthenticated()) return;
    // Only add the product ID to the watchlist if it doesn't already exist
    setCartList((prevCartlist) => {
      if (!prevCartlist.includes(id)) {
        const updateCartList = [...prevCartlist, Number(id)];
        if(updateCartList){
           sessionStorage.setItem("cart_productId",  JSON.stringify(updateCartList));
        }
        return (updateCartList);
      }
      return prevCartlist;
    });
  };
  const addToCartListProduct = async (
    id,
    selectedAttributes,
    fetchuserdata
  ) => {
    if (!ensureAuthenticated()) return;
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata.user_id}`
      )
      .then((res) => {
        sessionStorage.setItem("cart", JSON.stringify(res.data));
        setCartList((prevCartlist) => {
          
          if (!prevCartlist.includes(id)) {
            const updateCartList = [...prevCartlist, id];
            sessionStorage.setItem(
              "cart_productId",
              JSON.stringify(updateCartList)
            );
            return updateCartList;
          }
          return prevCartlist;
        });
      })
      .catch((err) => console.log("err", err));
  };
  const removeFromCartList = (id) => {
    const fetchCartId = JSON.parse(sessionStorage.getItem("cart_productId"));
    if (!ensureAuthenticated()) return;
    setCartList(()=>{
      const  updateCartList = fetchCartId.filter((item)=>item !== Number(id));
      sessionStorage.setItem("cart_productId", JSON.stringify(updateCartList));
      return updateCartList;
    })
  };
  const removeFromCartListProduct = async (id,product_id, userdata,selectAttribute) => {
    const payload = {
      user_id: userdata.user_id,
      cart_id:id,
      product_id: product_id,
      selected_attribute:selectAttribute
    };
    await axios
      .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
        data: payload,
      })
      .then((response) => {
        const fetchCartId = JSON.parse(sessionStorage.getItem("cart_productId"));
        setCartList(()=>{
          const  updateCartList = fetchCartId.filter((item)=>item !== Number(id));
          sessionStorage.setItem("cart_productId", JSON.stringify(updateCartList));
          return updateCartList;
        })
    
        sessionStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: [], cart_total: {} })
        );
      })
      .catch((error) => console.log("error", error));
  };
  const EmptyCart = async (userdata) =>{
    const payload={
      user_id: userdata.user_id
    }
    await axios.delete("https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete_all",{
      data:payload
    })
    .then((response)=>{
      setCartList([])
      sessionStorage.setItem("cart_length",response.data.cart_length);
      sessionStorage.setItem("cart_productId", JSON.stringify([]));
      sessionStorage.setItem(
        "cart",
        JSON.stringify({ cart_items: [], cart_total: {} })
      );
    })
    .catch((error) => console.log("error-delete-all", error));
  }
  const LoginUserCartList = async (fetchuserdata) => {
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata}`
      )
      .then((response) => {
        sessionStorage.setItem("cart", JSON.stringify(response.data));
        response.data.cart_items.map((item) => {
          if (!cartList.includes(item.product_id)) {
            setCartList((prevCartlist) => {
              if (!prevCartlist.includes(item.product_id)) {
                const updateCartList = [
                  ...prevCartlist,
                  Number(item.product_id),
                ];
                sessionStorage.setItem(
                  "cart_productId",
                  JSON.stringify(updateCartList)
                );
                return updateCartList;
              }
              return prevCartlist;
            });
            return getCartId.push(Number(item.product_id));
          }
          return getCartId;
        });
      })
      .catch((error) => console.log("Error fetching cartList", error));
  };
  const LoginUserWatchList = async (fetchuserdata) => {
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/wishlist?user_id=${fetchuserdata}`
      )
      .then((response) => {
        response.data.map((item) => {
          setWatchlist((prevWatchlist) => {
            if (!prevWatchlist.includes(item.product_id)) {
              const updateWatchList = [
                ...prevWatchlist,
                Number(item.product_id),
              ];
              sessionStorage.setItem(
                "watchlist",
                JSON.stringify(updateWatchList)
              );
              return updateWatchList;
            }
            return prevWatchlist;
          });
          return getWishlistId.push(Number(item.product_id));
        });
      })
      .catch((error) => console.log("Error fetching watchList", error));
  };
  const LogoutUserList = () => {
    setgetCartId([]);
    setCartList([]);
    sessionStorage.setItem("cart_productId", JSON.stringify([]));
    setWishlistId([]);
    setWatchlist([]);
    sessionStorage.setItem("watchlist", JSON.stringify([]));
    sessionStorage.setItem("watchlist_length", 0);
  };

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
        removeFromCartListProduct,
        LoginUserCartList,
        LogoutUserList,
        LoginUserWatchList,
        EmptyCart
        // LogoutUserWatchList,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
