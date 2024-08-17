import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        window.alert("Please Log In!! Thank you.");
        navigate('/my-account');
        return false;
      }
      return true;
    };

    const addToCart = (product) => {
      const existingProduct = cart.find(item => item.id === product.id);
      // console.log('Existing Product:', existingProduct);
      // console.log('Selected Quantity:', product.quantity);
  
      if (existingProduct) {
          const updatedQuantity = existingProduct.quantity + product.quantity;
          // console.log('Updated Quantity:', updatedQuantity); 
  
          const updatedCart = cart.map(item =>
              item.id === product.id
                  ? { ...item, quantity: updatedQuantity }
                  : item
          );
          // console.log('Updated Cart:', updatedCart);
          setCart(updatedCart);
      } else {
          // console.log('New Product Quantity:', product.quantity);
  
          const newCart = [...cart, { ...product, quantity: product.quantity }];
          // console.log('New Cart:', newCart);
          setCart(newCart);
      }
  };  

    const removeFromCart = (productId) => {
      if (!ensureAuthenticated()) return;
      setCart((prevCart) =>
        prevCart.filter((product) => product.id !== productId)
      );
    };

    const updateQuantity = (productId, quantity) => {
      if (!ensureAuthenticated()) return;
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === productId ? { ...product, quantity } : product
        )
      );
    };

    const updateAttributes = (productId, attributes) => {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId
            ? { ...item, selectedAttributes: attributes }
            : item
        )
      );
    };

    const updatePrice = (productId, newPrice) => {
      if (!ensureAuthenticated()) return;
      setCart((prevCart) =>
        prevCart.map((product) =>
          product.id === productId ? { ...product, price: newPrice } : product
        )
      );
    };

    const getCartCount = () => {
      return cart.reduce((count, product) => count + product.quantity, 0);
    };

    const total = cart.reduce((total, product) => total + product.price * product.quantity, 0);

    return (
      <AddCartContext.Provider
        value={{
          cart,
          addToCart,
          removeFromCart,
          updateQuantity,
          getCartCount,
          updateAttributes,
          updatePrice,
          total
        }}
      >
        {children}
      </AddCartContext.Provider>
    );
  };

export const useCart = () => useContext(AddCartContext);
