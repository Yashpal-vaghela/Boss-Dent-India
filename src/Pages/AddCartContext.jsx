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

  const isAuthenticated = () => !!localStorage.getItem('token');

  const ensureAuthenticated = () => {
    if (!isAuthenticated()) {
      window.alert("Please Log In!! Thank you.");
      navigate('/my-account');
      return false;
    }
    return true;
  };

  // const addToCart = (product) => {

  //   const { id, quantity, selectedAttributes } = product;
  //   const existingProduct = cart.find(item => item.id === id && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes));

  //   if (existingProduct) {
  //     const updatedQuantity = existingProduct.quantity + quantity;
  //     const updatedCart = cart.map(item =>
  //       item.id === id && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
  //         ? { ...item, quantity: updatedQuantity }
  //         : item
  //     );
  //     setCart(updatedCart);
  //   } else {
  //     const newCart = [...cart, { ...product, quantity }];
  //     setCart(newCart);
  //   }
  // };
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.selectedAttributes) === JSON.stringify(product.selectedAttributes)
      );

      if (existingProductIndex > -1) {
        // If product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: updatedCart[existingProductIndex].quantity + product.quantity,
        };
        return updatedCart;
      } else {
        // If product does not exist, add to cart
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productId, selectedAttributes) => {
    if (!ensureAuthenticated()) return;
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId || JSON.stringify(item.selectedAttributes) !== JSON.stringify(selectedAttributes))
    );
  };

  const updateQuantity = (productId, selectedAttributes, quantity) => {
    if (!ensureAuthenticated()) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateAttributes = (productId, updatedAttributes) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, selectedAttributes: updatedAttributes }
          : item
      )
    );
  };

  const updatePrice = (productId, updatedAttributes, newPrice) => {
    if (!ensureAuthenticated()) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId && JSON.stringify(item.selectedAttributes) === JSON.stringify(updatedAttributes)
          ? { ...item, price: newPrice }
          : item
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
