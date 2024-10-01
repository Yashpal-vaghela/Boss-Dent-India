import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartTotalAmount: 0,
  deliveryCharge:0
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    Add(state, action) {
      // console.warn("ts", state.cartItems, action.payload);
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      
      if (itemIndex >= 0) {
        if (state.cartItems[itemIndex] !== undefined || state.cartItems[itemIndex].qty >= 1) {
            if(!Array.isArray(action.payload)){
                state.cartItems[itemIndex].qty += 1;
            }else{
                state.cartItems = action.payload
            }
            localStorage.setItem("cart", JSON.stringify(state.cartItems));
        }
      } else if (action.payload.qty === undefined) {
        if(!Array.isArray(action.payload)){
            const tempvar = { ...action.payload, qty: 1 };
            state.cartItems.push(tempvar)
        }else{
            state.cartItems = action.payload
        }
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      } else {
        const tempvar = { ...action.payload, qty: action.payload.qty };
        state.cartItems.push(tempvar);
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },

    Remove(state, action) {
      // console.log("remove", state);
      const nextcartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      state.cartItems = nextcartItems;
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      if (state.cartItems[itemIndex].qty === 1) {
        state.cartItems[itemIndex].qty = 1;
      } else if (state.cartItems[itemIndex].qty > 1) {
        state.cartItems[itemIndex].qty -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    getTotal(state,action){
        let {total,qty} = state.cartItems.reduce((cartTotal,cartItems)=>{
            const {price,qty} = cartItems;
            const itemTotal = price * qty;
            cartTotal.total += itemTotal
            cartTotal.qty += qty
            return cartTotal;
        },
        {
            total:0,
            qty:0,
        }
        );
        state.qty = qty;
        state.cartTotalAmount = total;
    },
    updateSize(state, action) {
      const SizeIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );
      console.warn("state#######", state.cartItems, action.payload);
      if (SizeIndex !== -1) {
        state.cartItems[SizeIndex].selectedAttributes = {
          ...action.payload.selectedAttributes,
        };
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    DeliveryCharge(state,action){
      // console.log("sytate",state.deliveryCharge,action.payload)
      state.deliveryCharge = action.payload;
      localStorage.setItem('deliveryCharge',state.deliveryCharge)
      // state.cartItems = {...state.cartItems,"deliveryCharge":state.deliveryCharge}
    }
  },
});

export const { Add, Remove, decreaseCart, getTotal, updateSize ,DeliveryCharge} = cartSlice.actions;
export default cartSlice.reducer;
