import React, { createContext, useContext, useState } from "react";

const AddCartContext = createContext();

export const AddCartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (productId) =>{
        setCart((prevCart)=> [...prevCart, productId]);
    };
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((id) => id !== productId));
      };
    
      const getCartCount = () => {
        return cart.length;
      };
      getCartCount();
    return (
        <AddCartContext.Provider value={{ cart, addToCart, removeFromCart, getCartCount }}>
            {children}
        </AddCartContext.Provider>
    )
}
export const useCart = () => useContext(AddCartContext);