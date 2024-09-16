import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddCartContext = createContext();

export const AddCartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart data from local storage:", error);
      return [];
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const fetchProductDetails = async (productId) => {
    try {
      const response = await axios.get(`https://bossdentindia.com/wp-json/wp/v2/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  const ensureAuthenticated = () => {
    if (!isAuthenticated()) {
      toast("Please Log In!! Thank you..");
      // window.alert("Please Log In!! Thank you..");
      navigate('/my-account');
      return false;
    }
    return true;
  };

  const addToCart = async (product, quantity, selectedAttributes = {}) => {
    console.log("quanttity1",quantity);
    if (!ensureAuthenticated()) return;
   
    const existingProduct = cart.find((item) => item.id === product.id && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes));

    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const productDetails = await fetchProductDetails(product.id);
      if (productDetails) {
        setCart((prevCart) => [
          ...prevCart,
          { ...productDetails, quantity, selectedAttributes },
        ]);
      }
    }
  };
   
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity, selectedAttributes = {}) => {
    if (!ensureAuthenticated()) return;
    setCart((prevCart) =>
      prevCart.map((product) =>
        product.id === productId && JSON.stringify(product.selectedAttributes) === JSON.stringify(selectedAttributes)
          ? { ...product, quantity }
          : product
      )
    );
  };

  const updateAttributes = (productId, attributes) => {
    setCart(cart.map(item => item.id === productId ? { ...item, selectedAttributes: attributes } : item));
  };

  const updatePrice = (productId, newPrice) => {
    if (!ensureAuthenticated()) return;
    setCart(prevCart => (
      prevCart.map(product => (
        product.id === productId ? { ...product, price: newPrice } : product
      ))
    ));
  };

  // const getCartCount = () => {
  //   return cart.reduce((count, product) => count + product.quantity, 0);
  // };

  // const total = cart.reduce((total, product) => total + product.price * product.quantity, 0);
  // getCartCount();

  return (
    <AddCartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateAttributes, updatePrice }}>
      {children}
    </AddCartContext.Provider>
  );
};

export const useCart = () => useContext(AddCartContext);
