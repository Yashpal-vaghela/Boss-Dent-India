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
  // const [selectAttribute, setSelectAttribute] = useState(() => {
  //   const selectAttributeList = localStorage.getItem("selectedAttributes");
  //   return selectAttributeList ? JSON.parse(selectAttributeList) : [];
  // });
  const [getCartId, setgetCartId] = useState([]);
  const [getWishlistId, setWishlistId] = useState([]);
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

  const addToWatchlist = (id) => {
    // console.log("id",id)
    if (!ensureAuthenticated()) return;
    // Only add the product ID to the watchlist if it doesn't already exist
    setWatchlist((prevWatchlist) => {
      if (!prevWatchlist.includes(id)) {
        const updatedWatchlist = [...prevWatchlist, id];
        // localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
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
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      return updatedWatchlist;
    });
  };

  const addToCartList = (id) => {
    // console.log("addToCartList",id,selectedAttributes)
    if (!ensureAuthenticated()) return;
    // console.warn("addWatchlist",id)
    // Only add the product ID to the watchlist if it doesn't already exist
    setCartList((prevCartlist) => {
      // console.log("preCartList",prevCartlist)
      if (!prevCartlist.includes(id)) {
        const updateCartList = [...prevCartlist, id];
        localStorage.setItem("cart_productId", JSON.stringify(updateCartList));
        return updateCartList;
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
        localStorage.setItem("cart", JSON.stringify(res.data));
        setCartList((prevCartlist) => {
          if (!prevCartlist.includes(id)) {
            const updateCartList = [...prevCartlist, id];
            localStorage.setItem(
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
    // console.log("id", id);
    if (!ensureAuthenticated()) return;
    setCartList((prevCartlist) => {
      const updateCartList = prevCartlist.filter(
        (itemId) => itemId !== Number(id)
      );
      localStorage.setItem("cart_productId", JSON.stringify(updateCartList));
      return updateCartList;
    });
  };
  const removeFromCartListProduct = async (product_id, userdata) => {
    const payload = {
      user_id: userdata.user_id,
      product_id: product_id,
    };
    await axios
      .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
        data: payload,
      })
      .then((response) => {
        setCartList((prevCartlist) => {
          const updateCartList = prevCartlist.filter(
            (itemId) => itemId !== Number(product_id)
          );
          localStorage.setItem(
            "cart_productId",
            JSON.stringify(updateCartList)
          );
          return updateCartList;
        });
        localStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: [], cart_total: {} })
        );
        // console.log("delete", response.data);
      })
      .catch((error) => console.log("error", error));
  };
  const LoginUserCartList = async (fetchuserdata) => {
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata}`
      )
      .then((response) => {
        localStorage.setItem("cart", JSON.stringify(response.data));
        response.data.cart_items.map((item) => {
          if (!cartList.includes(item.product_id)) {
            setCartList((prevCartlist) => {
              if (!prevCartlist.includes(item.product_id)) {
                const updateCartList = [
                  ...prevCartlist,
                  Number(item.product_id),
                ];
                localStorage.setItem(
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
              localStorage.setItem(
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
    localStorage.setItem("cart_productId", JSON.stringify([]));
    setWishlistId([]);
    setWatchlist([]);
    localStorage.setItem("watchlist", JSON.stringify([]));
    localStorage.setItem("watchlist_length", 0);
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
        // LogoutUserWatchList,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
