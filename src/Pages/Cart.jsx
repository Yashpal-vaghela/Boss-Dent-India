import React, { useState, useEffect } from "react";
import { json, Link } from "react-router-dom";
import { useCart } from "./AddCartContext";
import { FaTrashAlt } from "react-icons/fa";
import googlepay from "../images/Google-pay.png";
import phonepe from "../images/Phone-pe.png";
import banktransfer from "../images/bank-transfer.png";
import "../css/cartresponsive.css";
import Aos from "aos";
import { useDispatch, useSelector } from "react-redux";
import { decreaseCart, Remove,Add ,updateSize} from "../redux/Apislice/cartslice";

const Cart = () => {
  const {
    cart,
    // removeFromCart,
    updateQuantity,
    updateAttributes,
    updatePrice,
    // addTocart,
  } = useCart();
  const [canCheckout, setCanCheckout] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const cartData = useSelector((state) => state.cart.cartItems);
  const cartData1 = JSON.parse(localStorage.getItem("cart"));
  const dispatch = useDispatch();

  useEffect(() => {
    const allAttributesSelected = cart.every((product) => {
      if (product.variations && product.variations.length > 0) {
        return Object.keys(product.variations[0].attributes).every(
          (key) => product.selectedAttributes && product.selectedAttributes[key]
        );
      }
      return true;
    });
    setCanCheckout(allAttributesSelected);
  }, [cartData1]);

  useEffect(() => {
    Aos.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Allow animations to trigger multiple times
      mirror: true, // Trigger animations on scroll up
    });
    const getCartData = JSON.parse(localStorage.getItem('cart'))
    if(cartData.length === 0 && getCartData.length !== 0){
      dispatch(Add(...getCartData))
    }
    console.warn("cartdata", cartData, ...cartData1,getCartData);
  }, []);


  const handleAddQuantity = (e,product) => {
    e.preventDefault();
    console.warn("cartitem",product,product.qty)
    dispatch(Add(product))
    // updateQuantity(product.id, product.quantity + 1);
  };

  const handleSubtractQuantity = (e,product) => {
    e.preventDefault();
    console.log("subtracquantity",product)
    
    if (product.qty >= 1) {
      dispatch(decreaseCart(product))
      // updateQuantity(product.id, product.quantity - 1);
    }
  };

  const handleRemoveItem = (e,product) => {
    e.preventDefault();
    // removeFromCart(product.id);
    dispatch(Remove(product.id))
    console.log("Removing product with ID:", product.id);
  };

  // const handleEmptyCart = () => {
  //   cart.forEach((product) => removeFromCart(product.id));
  // };

  const handleAttributeSelect = (product, attribute, value) => {
    const updatedAttributes = {
      ...product.selectedAttributes,
      [attribute]: value,
    };

    updateAttributes(product.id, updatedAttributes);

    const selectedVariation = product.variations.find(
      (variation) => variation.attributes[attribute] === value
    );

    if (selectedVariation) {
      const newPrice = selectedVariation.price;
      updatePrice(product.id, newPrice);
    }
  };

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };

  // const total = cart.reduce(
  //   (total, product) => total + product.price * product.quantity,
  //   0
  // );
  // const deliveryCharge = total < 2500 ? 103 : 0;
  // const grandTotal = total + deliveryCharge;

  return (
    <div className="cart-page">
      <div className="header" data-aos="fade-up">
        <h1 className="cart-title">Cart</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Cart</span>
        </nav>
      </div>
      {cartData1.length === 0 ? (
        <p>Your Cart is Empty</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartData1?.length !== 0 &&
              cartData1.map((product) => {
                return (
                  <div
                    key={`${product.id}-${JSON.stringify(
                      product.selectedAttributes || {}
                    )}`}
                    className="cart-item"
                  >
                    <div className="cart-item-image-wrapper">
                      <img
                        src={product.yoast_head_json?.og_image?.[0]?.url}
                        alt={product.title.rendered}
                        className={`cart-item-image ${
                          imageLoading[product.id] ? "loaded" : "loading"
                        }`}
                        loading="lazy"
                        onLoad={() => handleImageLoad(product.id)}
                      />
                    </div>
                    <div className="cart-item-details">
                      <Link
                        to={`/products/${product.id}`}
                        className="cart-item-link"
                      >
                        <h3>{product.title.rendered}</h3>
                      </Link>
                      {product.variations && (
                        <div className="cart-item-attributes">
                          {Object.keys(
                            product.variations[0].attributes || {}
                          ).map((attribute) => (
                            <div
                              key={attribute}
                              className="variation-cart-main"
                            >
                              <h4>
                                {attribute.replace(
                                  /attribute_pa_|attribute_/,
                                  ""
                                )}
                                :
                              </h4>
                              <div className="variation-buttons">
                                {product.variations
                                  .filter(
                                    (variation) =>
                                      variation.attributes[attribute] !==
                                      undefined
                                  )
                                  .map((variation, index) => (
                                    <button
                                      key={index}
                                      className={`variation-button ${
                                        product.selectedAttributes &&
                                        product.selectedAttributes[
                                          attribute
                                        ] === variation.attributes[attribute]
                                          ? "selected"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleAttributeSelect(
                                          product,
                                          attribute,
                                          variation.attributes[attribute]
                                        )
                                      }
                                    >
                                      {typeof variation.attributes[
                                        attribute
                                      ] === "string"
                                        ? variation.attributes[attribute]
                                        : JSON.stringify(
                                            variation.attributes[attribute]
                                          )}
                                    </button>
                                  ))}
                              </div>
                              {!canCheckout &&
                                !product.selectedAttributes?.[attribute] && (
                                  <p className="checkout-warning">
                                    * Please select above attribute values to
                                    proceed to checkout.
                                  </p>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={(e) => handleSubtractQuantity(e,product)}>
                        -
                      </button>
                      {/* {console.warn("product1",product)} */}
                      <span>{product?.qty !== undefined ? product?.qty:null}</span>
                      <button onClick={(e) => handleAddQuantity(e,product)}>
                        +
                      </button>
                    </div>
                    <div className="cart-price">
                      <p className="cart-item-price">₹{product.price}.00</p>
                      <p className="cart-item-total">
                        ₹{product.qty !== undefined ? product.price * product.qty: 0}.00
                      </p>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={(e) => handleRemoveItem(e,product)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                );
              })}
            {/* {cart.map((product) => (
              <div
                key={`${product.id}-${JSON.stringify(
                  product.selectedAttributes || {}
                )}`}
                className="cart-item"
              >
                <div className="cart-item-image-wrapper">
                  <img
                    src={product.yoast_head_json?.og_image?.[0]?.url}
                    alt={product.title.rendered}
                    className={`cart-item-image ${
                      imageLoading[product.id] ? "loaded" : "loading"
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(product.id)}
                  />
                </div>
                <div className="cart-item-details">
                  <Link
                    to={`/products/${product.id}`}
                    className="cart-item-link"
                  >
                    <h3>{product.title.rendered}</h3>
                  </Link>
                  {product.variations && (
                    <div className="cart-item-attributes">
                      {Object.keys(product.variations[0].attributes || {}).map(
                        (attribute) => (
                          <div key={attribute} className="variation-cart-main">
                            <h4>
                              {attribute.replace(
                                /attribute_pa_|attribute_/,
                                ""
                              )}
                              :
                            </h4>
                            <div className="variation-buttons">
                              {product.variations
                                .filter(
                                  (variation) =>
                                    variation.attributes[attribute] !==
                                    undefined
                                )
                                .map((variation, index) => (
                                  <button
                                    key={index}
                                    className={`variation-button ${
                                      product.selectedAttributes &&
                                      product.selectedAttributes[attribute] ===
                                        variation.attributes[attribute]
                                        ? "selected"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      handleAttributeSelect(
                                        product,
                                        attribute,
                                        variation.attributes[attribute]
                                      )
                                    }
                                  >
                                    {typeof variation.attributes[attribute] ===
                                    "string"
                                      ? variation.attributes[attribute]
                                      : JSON.stringify(
                                          variation.attributes[attribute]
                                        )}
                                  </button>
                                ))}
                            </div>
                            {!canCheckout &&
                              !product.selectedAttributes?.[attribute] && (
                                <p className="checkout-warning">
                                  * Please select above attribute values to
                                  proceed to checkout.
                                </p>
                              )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => handleSubtractQuantity(product)}>
                    -
                  </button>
                  <span>{product.quantity}</span>
                  <button onClick={() => handleAddQuantity(product)}>+</button>
                </div>
                <div className="cart-price">
                  <p className="cart-item-price">₹{product.price}.00</p>
                  <p className="cart-item-total">
                    ₹{product.price * product.quantity}.00
                  </p>
                </div>
                <button
                  className="cart-item-remove"
                  onClick={() => handleRemoveItem(product)}
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))} */}
          </div>
          <div className="cart-summary">
            <button className="clear-cart" 
            // onClick={handleEmptyCart}
            >
              Clear Cart
            </button>
            <h2>Total</h2>
            {/* <span>₹{total}.00</span> */}
            <div className="cart-summary-item">
              <span>Delivery Charge</span>
              {/* <span>
                {deliveryCharge === 0 ? "Free Delivery" : `₹${deliveryCharge}`}
              </span> */}
            </div>
            <div className="cart-summary-item">
              <span>Grand Total</span>
              {/* <span>₹{grandTotal}.00</span> */}
            </div>
            <Link to="/checkout">
              <button className="checkout-button" disabled={!canCheckout}>
                Check Out
              </button>
            </Link>

            <div className="cart-payment-methods">
              <p>We Accept</p>
              <div className="payment-logos">
                <img src={googlepay} alt="googlepay" />
                <img src={phonepe} alt="phone-pe" />
                <img src={banktransfer} alt="banktransfer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
