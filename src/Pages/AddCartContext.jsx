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
    const isAuhtenticated = () => {
      return !! localStorage.getItem('token')
    }

    const ensureAuthenticated = () =>{
      if (!isAuhtenticated()){
        window.alert("Please Log In!! Thank you..");
        navigate('/my-account');
        return false;
      } 
      return true;
    }

    const addToCart = async (product, quantity= 1 ) =>{
      if (!ensureAuthenticated()) return;
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
      if(!ensureAuthenticated()) return;
      setCart((prevCart) => prevCart.filter((product) => product.id !== productId));
    };
    const updateQuantity = (productId, quantity) =>{
        if(!ensureAuthenticated()) return;
        setCart((prevCart)=>
        prevCart.map((product)=>
            product.id === productId ? { ...product, quantity } : product
        ));
    } 
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
    
      const getCartCount = () => {
        return cart.reduce((count, product) => count + product.quantity, 0);
      };
      const total = cart.reduce((total, product) => total + product.price * product.quantity, 0);
      getCartCount();
    return (
        <AddCartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, getCartCount, updateAttributes, updatePrice, total }}>
            {children}
        </AddCartContext.Provider>
    )
}
export const useCart = () => useContext(AddCartContext);