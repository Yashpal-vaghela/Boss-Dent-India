import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

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

    useEffect(()=> {
      localStorage.setItem('cart', JSON.stringify(cart));
    },[cart]);


    const fetchProductDetails = async (productId)=>{
      try{
        const response = await axios.get(`https://bossdentindia.com/wp-json/wp/v2/product/${productId}`);
        return response.data;
      } catch(error){
        console.error("Error fetching product details:", error);
        return null;
      } 
    }

    const addToCart = async (product, quantity= 1 ) =>{
       const existingProduct = cart.find((item)=> item.id === product.id);
       if (existingProduct){
          setCart((prevCart)=>
          prevCart.map((item)=> item.id === product.id ?{...item, quantity: item.quantity + quantity}: item)
        );
       }else {
          const productDetails = await fetchProductDetails(product.id);
          if (productDetails){
            setCart((prevCart)=> [...prevCart,{...productDetails,quantity},
            ]);
          }
       }
    };
    const removeFromCart = (productId) => {
      setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
    };
    const updateQuantity = (productId, quantity) =>{
        setCart((prevCart)=>
        prevCart.map((product)=>
            product.id === productId ? { ...product, quantity } : product
        ));
    }  
    
      const getCartCount = () => {
        return cart.reduce((count, product) => count + product.quantity, 0);
      };
      getCartCount();
    return (
        <AddCartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartCount }}>
            {children}
        </AddCartContext.Provider>
    )
}
export const useCart = () => useContext(AddCartContext);