import React from "react";
import { useCart } from "./AddCartContext";
import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, getCartCount } =
    useCart();

  const handleAddQuantity = (product) => {
    updateQuantity(product.id, product.quantity + 1);
  };

  const handleSubtractQuantity = (product) => {
    if (product.quantity > 1) {
      updateQuantity(product.id, product.quantity - 1);
    }
  };
  const handleRemoveItem = (product) => {
    removeFromCart(product.id);
  };

  const handleEmptyCart = () => {
    cart.forEach((product) => removeFromCart(product.id));
  };

  const total = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const deliveryCharge = total < 2500 ? 103 : 0;
  const grandTotal = total + deliveryCharge;

  return (
    <div className="cart-page">
      {/* <div className="header">
                <Link to="/" className="go-back">Go Back</Link>
                <h1 className="cart-title">Cart</h1>
                <p className="breadcrumb">Home / Cart</p>
            </div> */}
      <div className="header">
        <h1 className="cart-title">Cart</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Cart</span>
        </nav>
      </div>
      {cart.length === 0 ? (
        <p>Your Cart is Empty</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((product) => (
              <div key={product.id} className="cart-item">
                <img
                  src={product.yoast_head_json?.og_image?.[0]?.url}
                  alt={product.title.rendered}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{product.title.rendered}</h3>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => handleSubtractQuantity(product)}>
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => handleAddQuantity(product)}>+</button>
                </div>
                <p className="cart-item-price">₹{product.price}.00</p>
                <p className="cart-item-total">
                  ₹{product.price * product.quantity}.00
                </p>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(product)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Total</h2>
            <span>₹{total}.00</span>
            <div className="cart-summary-item">
              <span>Delivery Charge</span>
              <span>
                {deliveryCharge === 0 ? "Free Delivery" : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="cart-summary-item">
              <span>Grand Total</span>
              <span>₹{grandTotal}.00</span>
            </div>
            <button className="checkout-button">Check Out</button>
            <div className="cart-payment-methods">
              <p>We Accept</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
