import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Add } from "../redux/Apislice/cartslice";

const CartDefaultFuntion = () => {
  const cartData = useSelector((state) => state.cart?.cartItems);
  const dispatch = useDispatch();
  const SavedData1 = JSON.parse(localStorage.getItem("cart"));

  useEffect(() => {
    DefaultFunction();
  }, [DefaultFunction]);

  const DefaultFunction = useCallback(() => {
    if (SavedData1.length !== 0) {
      if (cartData.length === 0) {
        dispatch(Add(SavedData1));
      }
    }
    // console.warn("cartdata", cartData, SavedData1);
  }, [SavedData1, dispatch, cartData.length]);
  return <></>;
};

export default CartDefaultFuntion;

//  const  CartDefaultFunction = useCallback(() => {
//   if (SavedData1.length !== 0) {
//     if (cartData.length === 0) {
//       dispatch(Add(SavedData1));
//     }
//   }
//   console.warn("cartdata", cartData, SavedData1);
// }, [SavedData1]);

// export default CartDefaultFunction;
