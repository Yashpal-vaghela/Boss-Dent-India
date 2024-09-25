import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
// import googlepay from "../images/Google-pay.png";
// import phonepe from "../images/Phone-pe.png";
// import banktransfer from "../images/bank-transfer.png";
import "../css/cartresponsive.css";
// import Aos from "aos";
import { useDispatch, useSelector } from "react-redux";
// import CartDefaultFuntion from "../component/CartDefaultFuntion";
import {
  decreaseCart,
  Remove,
  Add,
  updateSize,
  getTotal,
  DeliveryCharge,
} from "../redux/Apislice/cartslice";
import BreadCrumbs from "../component/BreadCrumbs";

const NewCart = () => {
  const [canCheckout, setCanCheckout] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState(99);
  const cartData = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    const allAttributesSelected = cartData?.cartItems.every((product) => {
      if (product.variations && product.variations.length > 0) {
        return Object.keys(product.variations[0].attributes).every(
          (key) => product.selectedAttributes && product.selectedAttributes[key]
        );
      }
      return true;
    });
    setCanCheckout(allAttributesSelected);
  }, [cartData]);

  // useEffect(() => {
  //   Aos.init({
  //     duration: 1000, // Animation duration in milliseconds
  //     once: false, // Allow animations to trigger multiple times
  //     mirror: true, // Trigger animations on scroll up
  //   });
  // }, []);

  const handleAttributeSelect = (product, attribute, value) => {
    // console.log("update", attribute, value, product);
    dispatch(
      updateSize({
        ...product,
        selectedAttributes: { [attribute]: value },
      })
    );
  };

  const AdddeliveryCharge = () => {
    const count = cartData?.cartItems?.reduce((total, count) => {
      return total + (Number(count?.weight) * count.qty) / 1000;
    }, 0);
    if (count < 1) {
      setDeliveryCharge(99);
    } else if (count > 1 && count < 3) {
      setDeliveryCharge(125);
    } else if (count > 3) {
      setDeliveryCharge(65);
    }
    // console.log(deliveryCharge)
    dispatch(DeliveryCharge(deliveryCharge));
  };

  const handleAddQuantity = (e, product) => {
    e.preventDefault();
    // console.warn("cartitem", product, product.qty);
    dispatch(Add({ ...product, qty: product.qty }));
    AdddeliveryCharge();
  };

  const handleSubtractQuantity = (e, product) => {
    e.preventDefault();
    // console.log("subtracquantity", product);
    if (product.qty >= 1) {
      dispatch(decreaseCart(product));
    }
    AdddeliveryCharge();
  };

  const handleRemoveItem = (e, product) => {
    e.preventDefault();
    // removeFromCart(product.id);
    dispatch(Remove(product.id));
    // console.log("Removing product with ID:", product.id);
    AdddeliveryCharge();
  };

  const handleEmptyCart = () => {
    cartData?.cartItems.forEach((product) => dispatch(Remove(product.id)));
  };

  useEffect(() => {
    return () => {
      dispatch(getTotal());
    };
  }, [dispatch]);

  useEffect(() => {
    AdddeliveryCharge();
    // console.log("deliveryCharge",deliveryCharge)
  }, [deliveryCharge]);

  const grandTotal = cartData?.cartTotalAmount + deliveryCharge;

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };
  return (
    <div className="cart-page container">
      <div className="header" data-aos="fade-up">
        <h1 className="cart-title">Cart</h1>
        <BreadCrumbs></BreadCrumbs>
      </div>
      {cartData?.cartItems?.length === 0 ? (
        <div className="cart-page-empty">
          <p className="">Your Cart is Empty </p>
          <button className="btn btn-dark">
            <Link to="/products">Shop Now</Link>
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartData.cartItems?.length !== 0 &&
              cartData.cartItems?.map((product) => {
                // let imageUrl = product?.yoast_head_json?.og_image?.[0]?.url
                return (
                  <div
                    key={`${product.id}-${JSON.stringify(
                      product.selectedAttributes || {}
                    )}`}
                    className="cart-item"
                  >
                    <div className="cart-item-image-wrapper">
                      <img
                        src={product?.yoast_head_json?.og_image?.[0]?.url}
                        alt={product?.title?.rendered}
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
                        <h3>{product?.title?.rendered}</h3>
                      </Link>
                      {product.variations && (
                        <div className="cart-item-attributes">
                          {Object.keys(
                            product.variations[0].attributes || {}
                          ).map((attribute) => {
                            return (
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

                                {attribute === "attribute_pa_color" ? (
                                  <div style={{ display: "flex" }}>
                                    {product?.variations?.map(
                                      (variation, index) => {
                                        return (
                                          <div
                                            className={`color-option ${
                                              Object.values(
                                                variation?.attributes
                                              )[0]
                                            } ${
                                              Object.values(
                                                variation?.attributes
                                              )[0] ===
                                              Object.values(
                                                product.selectedAttributes
                                              )[0]
                                                ? `selected `
                                                : ""
                                            }`}
                                            key={index}
                                            onClick={() =>
                                              handleAttributeSelect(
                                                product,
                                                attribute,
                                                variation.attributes[attribute]
                                              )
                                            }
                                          ></div>
                                        );
                                      }
                                    )}
                                  </div>
                                ) : (
                                  <div className="variation-buttons">
                                    {product?.variations?.map(
                                      (variation, index) => {
                                        return (
                                          <button
                                            key={index}
                                            className={`variation-button ${
                                              product.selectedAttributes &&
                                              Object.values(
                                                product.selectedAttributes
                                              )[0] ===
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
                                            {typeof variation.attributes[
                                              attribute
                                            ] === "string"
                                              ? variation.attributes[attribute]
                                              : JSON.stringify(
                                                  variation.attributes[
                                                    attribute
                                                  ]
                                                )}
                                          </button>
                                        );
                                      }
                                    )}
                                  </div>
                                )}

                                {!canCheckout &&
                                  !product.selectedAttributes?.[attribute] && (
                                    <p className="checkout-warning">
                                      * Please select above attribute values to
                                      proceed to checkout.
                                    </p>
                                  )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="cart-item-quantity">
                      <button
                        onClick={(e) => handleSubtractQuantity(e, product)}
                      >
                        -
                      </button>
                      <span>
                        {product?.qty !== undefined ? product?.qty : null}
                      </span>
                      <button onClick={(e) => handleAddQuantity(e, product)}>
                        +
                      </button>
                    </div>
                    <div className="cart-price">
                      <p className="cart-item-price">₹{product.price}.00</p>
                      <p className="cart-item-total">
                        ₹
                        {product.qty !== undefined
                          ? product.price * product.qty
                          : 0}
                        .00
                      </p>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={(e) => handleRemoveItem(e, product)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                );
              })}
          </div>
          <div className="cart-summary">
            <button className="clear-cart" onClick={handleEmptyCart}>
              Clear Cart
            </button>
            <div className="cart-summary-item">
              <h2>Total</h2>
              <span>₹{cartData?.cartTotalAmount}.00</span>
            </div>

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
            <Link to="/checkout">
              <button className="checkout-button" disabled={!canCheckout}>
                Check Out
              </button>
            </Link>

            <div className="cart-payment-methods">
              <p>We Accept</p>
              <div className="payment-logos">
                <img src="/asset/images/Google-pay.png" alt="googlepay" />
                <img src="/asset/images/Phone-pe.png" alt="phone-pe" />
                <img src="/asset/images/bank-transfer.png" alt="banktransfer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCart;