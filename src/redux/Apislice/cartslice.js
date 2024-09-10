import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  cartItems1:[],
  cartTotalAmount: 0,
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
      // console.warn(
      //   "itemidex",
      //   itemIndex >= 0,
      //   itemIndex,
      //   "sad",
      //   action.payload,
      //   state.cartItems[itemIndex],
      //   !Array.isArray(action.payload)
      // );
      
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
      // console.warn("state#######", state.cartItems, action.payload, SizeIndex);
      if (SizeIndex !== -1) {
        state.cartItems[SizeIndex].selectedAttributes = {
          ...action.payload.selectedAttributes,
        };
        localStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
  },
});

export const { Add, Remove, decreaseCart, getTotal, updateSize } = cartSlice.actions;
export default cartSlice.reducer;


































// Old cartSlice
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: [],
//   qty: 0,
//   cartTotalAmount: 0,
// };

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     Add(state, action) {
//       console.log("add", state.cartItems, "action", action.payload);
//       const itemIndex = state.cartItems.findIndex(
//         (item) => item.id === action.payload.id
//       );
//       console.log("itemidex", itemIndex >= 0, itemIndex, action.payload.qty);

//       if (itemIndex >= 0)
//       {
//         state.cartItems[itemIndex].qty += 1;
//       }
//       else if (action.payload.qty === undefined)
//      {
//         const tempvar = { ...action.payload, qty: 1 };
//         console.log("tempvar", { ...state.cartItems, ...tempvar });
//         state.cartItems.push(tempvar);
//       }
//       else
//       {
//         const tempvar = { ...action.payload, qty: action.payload.qty };
//         console.log("thrid", tempvar, action.payload.qty);
//         state.cartItems.push(tempvar);
//       }
//       console.log("finaldata", ...state.cartItems);
//       localStorage.setItem('cart',JSON.stringify({...state.cartItems,qty:a}))
//       localStorage.setItem('cart',JSON.stringify({...state.cartItems,...tempvar}))
//       localStorage.setItem("cart", JSON.stringify(state.cartItems));
//         return {
//           ...state,
//           cartItems: state.cartItems,
//         };
//     },
//     Remove(state, action) {
//       console.log("remove", state);
//       const nextcartItems = state.cartItems.filter(
//         (item) => item.id !== action.payload
//       );
//       state.cartItems = nextcartItems;
//       localStorage.setItem("cart", JSON.stringify(state.cartItems));
//     },
//     decreaseCart(state, action) {
//       const itemIndex = state.cartItems.findIndex(
//         (item) => item.id == action.payload.id
//       );
//       if (state.cartItems[itemIndex].qty === 1) {
//         state.cartItems[itemIndex].qty = 1;
//       } else if (state.cartItems[itemIndex].qty > 1) {
//         let a = (state.cartItems[itemIndex].qty -= 1);

//           localStorage.setItem('cart',JSON.stringify([{...state.cartItems,qty:a}]))
//         const b = state.cartItems;
//         console.log(
//           "de",
//           state.cartItems[itemIndex].qty,
//           b[itemIndex],
//           itemIndex,
//           action.payload,
//           (state.cartItems[0].qty -= 1),
//           ...state.cartItems
//         );
//       }
//         localStorage.setItem("cart", JSON.stringify(state.cartItems));
//         return {
//           ...state,
//           cartItems: state.cartItems,
//         };
//     },
//        getTotal(state,action){
//         let {total,qty} = state.cartItems.reduce((cartTotal,cartItems)=>{
//             const {price,qty} = cartItems;
//             const itemTotal = price * qty;
//             cartTotal.total += itemTotal
//             cartTotal.qty += qty
//             return cartTotal;
//         },
//         {
//             total:0,
//             qty:0,
//         }
//         );
//         state.qty = qty;
//         state.cartTotalAmount = total;
//        }
//   },
// });

// export const { Add, Remove, decreaseCart, getTotal } = cartSlice.actions;
// export default cartSlice.reducer;

// Try Object key and value
//   console.log(
//     "add",
//     state.cartItems,
//     action.payload,
//     Object.keys(action.payload)
//   );
//   if (Object.keys(action.payload) == "localstorage") {
//     const entries = action.payload.localstorage
//     const itemIndex = action.payload.localstorage.findIndex((item) =>
//         state.cartItems.filter((entry) =>{
//        return  entry.id === item.id
//       } )
//     );
//     if(itemIndex >= 0){
//         console.warn("%",state.cartItems[0])
//         localStorage.setItem("cart", JSON.stringify(state.cartItems));
//         // state.cartItems[itemIndex].qty += 1;
//     }else if(action.payload.localstorage)
//     console.log("entries", entries, itemIndex);
//   }

// Add(state, action)  {
//   const itemIndex = state.cartItems.findIndex(
//     (item) => item.id === action.payload.id
//   );
//   const savedData = JSON.parse(localStorage.getItem('cart'))
// //   console.warn("itemidex", itemIndex >= 0, itemIndex, "sad", action.payload);
// //   window.addEventListener('beforeunload',(event)=>{
// //     console.warn("event",event)
// //   })
//   if (itemIndex >= 0) {
//     //    const filter = action.payload.localStorage.findIndex((item)=>item.)
//       state.cartItems[itemIndex].qty += 1;
//   } else if (action.payload.qty === undefined) {
//       const tempvar = { ...action.payload, qty: 1 };
//     //   console.log(tempvar);
//       state.cartItems.push(tempvar)
//     //   return({...state,cartItems: state.cartItems.push(tempvar)})
//   } else if(savedData.length == 0){
//     const tempvar = { ...action.payload, qty: action.payload.qty };
//    state.cartItems.push(tempvar)
//    console.warn({...state,cartItems:state.cartItems})
//     // return({...state,cartItems:state.cartItems.push(tempvar)})
//   }
//   else{
//    const tempvar = { ...action.payload, qty: action.payload.qty };
//    state.cartItems.push(tempvar)
//    console.warn({...state,cartItems:state.cartItems})
//   }
//   localStorage.setItem("cart", JSON.stringify(state.cartItems));

// },

//   if(action.payload.length !== 0){
//     localStorage.setItem("cart", JSON.stringify(state.cartItems));
//   }

//   return {
//     ...state,
//     cartItems: state.cartItems,
//   };
