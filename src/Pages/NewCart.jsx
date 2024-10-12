import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import "../css/cartresponsive.css";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumbs from "../component/BreadCrumbs";
import axios from "axios";
import { useWatchlist } from "./WatchlistContext";
import { FaCheckCircle } from 'react-icons/fa';

const NewCart = () => {
  const [canCheckout, setCanCheckout] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState(99);
  const cartData = useSelector((state) => state.cart);
  const [CartData, setCartData] = useState([]);
  const [CartgetTotal, setCartgetTotal] = useState([]);
  const {alertMessage, removeFromCartList } = useWatchlist();
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  // const [cartTotalAmount, setCartTotalAmount] = useState();

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
  // fetchCartData
  const fetchCartData = async () => {
    const fetchuserdata = JSON.parse(localStorage.getItem("UserData"));
    // console.log("fetuser", fetchuserdata);
    const cartdata = await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${fetchuserdata.user_id}`
      )
      .then((res) => {
        // console.log("get-res", res.data);
        localStorage.setItem("cart", JSON.stringify(res.data));
        localStorage.setItem("cart_length", res.data.cart_items.length);
        // const getTotal = res.data.cart_total[0].total_price;
        setCartData(res.data.cart_items);
        setCartgetTotal(res.data.cart_total);
        // return res.data;
        AdddeliveryCharge(res.data.cart_total, res.data.cart_items);
      })
      .catch((err) => {
        localStorage.setItem("cart_length", 0);
        // console.log("err", err);
      });
  };

  const handleUpdateQty = async (e, product, action) => {
    let newQuantity =
      action === "PLUS"
        ? Number(product.product_quantity) + 1
        : Number(product.product_quantity) - 1;
    if (newQuantity <= 0) {
      return;
    }
    const updateQty = await axios
      .post("https://admin.bossdentindia.com/wp-json/custom/v1/cart/update", {
        user_id: getUserData.user_id,
        product_id: product.product_id,
        product_quantity: newQuantity,
        // select_Attributes: product.selected_attribute,
      })
      .then((response) => {
        const UpdatedProduct = response?.data?.cart_item[0];
        const UpdatedCartData = CartData?.map((item) =>
          item.product_id === UpdatedProduct.product_id
            ? { ...item, product_quantity: UpdatedProduct.product_quantity }
            : item
        );
        AdddeliveryCharge(response.data.cart_total, response.data.cart_items);
        setCartData(UpdatedCartData);
        setCartgetTotal(response.data.cart_total);
      })
      .catch((err) => console.log("error", err));
  };

  const handleRemoveItem = async (e, product) => {
    e.preventDefault();
    const payload = {
      user_id: getUserData.user_id,
      product_id: product.product_id,
    };
    const RemoveData = await axios
      .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
        data: payload,
      })
      .then((res) => {
        // console.log("response-delete-data-cart--------", res.data);
        const cartList = JSON.parse(localStorage.getItem("cart_productId"));
        const updateList = cartList.filter(
          (item) => item !== Number(product.product_id)
        );
        const filterData = CartData.filter((item) => item.id !== product.id);
        setCartData(filterData);
        setCartgetTotal(res.data.cart_total);
        AdddeliveryCharge(res.data.cart_total, CartData);
        removeFromCartList(product.product_id);
        // localStorage.setItem("cart_productId", JSON.stringify(updateList));
        localStorage.setItem("cart", JSON.stringify(filterData));
        localStorage.setItem("cart_length", res.data.cart_items.length);
      })
      .catch((error) => {
        console.log("Removing product with ID:", product.product_id);
        console.log("error-delete-cart", error);
      });
  };

  const handleEmptyCart = async () => {
    // cartData?.cartItems.forEach((product) => dispatch(Remove(product.id)));
    const deleteData = await axios
      .delete(
        "https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete_all",
        {
          data: { user_id: getUserData.user_id },
        }
      )
      .then((response) => {
        setCartData([]);
        localStorage.setItem("cart_productId", []);
        localStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: [], cart_total: {} })
        );
        console.log("response-delete-all", response.data);
      })
      .catch((error) => console.log("error-delete-all", error));
  };
  const AdddeliveryCharge = (CartTotal, CartItems) => {
    // console.log("count1--------", CartTotal, CartItems);
    const getTotalWeight = CartTotal.total_weight / 1000;
    // console.log("getTotalWeight", getTotalWeight);
    if (getTotalWeight < 1) {
      setDeliveryCharge(99);
    } else if (getTotalWeight >= 1 && getTotalWeight <= 3) {
      setDeliveryCharge(125);
    } else if (getTotalWeight > 3) {
      setDeliveryCharge(65);
    }
    // console.log("deliveryCharge",deliveryCharge);
    // dispatch(DeliveryCharge(deliveryCharge));
  };
  useEffect(() => {
    // dispatch(getTotal());
    fetchCartData();
    // if (CartData.length === 0) {
    //   localStorage.setItem("cart",JSON.stringify({cart_items:[],cart_total:{}}));
    // }
  }, []);

  const grandTotal = CartgetTotal?.total_price + deliveryCharge;

  const handleImageLoad = (productId) => {
    setImageLoading((prevState) => ({
      ...prevState,
      [productId]: true,
    }));
  };
  return (
    <div className="container">
      <div className="cart-page">
        <div className="header" data-aos="fade-up">
          <h1 className="cart-title">Cart</h1>
          <BreadCrumbs></BreadCrumbs>
        </div>
        {alertMessage && (
            <div className="success-alert">
              <FaCheckCircle className="alert-icon" />
              {alertMessage}
            </div>
          )}
        {CartData?.length === 0 ? (
          <div className="cart-page-empty">
            <p className="">Your Cart is Empty </p>
            <button className="btn btn-dark">
              <Link to="/products">Shop Now</Link>
            </button>
          </div>
        ) : (
          <div className="cart-content" data-aos="filp-left">
            <div className="cart-items">
              {CartData?.length !== 0 &&
                CartData?.map((product, index) => {
                  return (
                    <CartListItem
                      key={product.id}
                      product={product}
                      handleEmptyCart={handleEmptyCart}
                      handleRemoveItem={handleRemoveItem}
                      handleImageLoad={handleImageLoad}
                      handleUpdateQty={handleUpdateQty}
                      AdddeliveryCharge={AdddeliveryCharge}
                      imageLoading={imageLoading}
                      canCheckout={canCheckout}
                      CartData={CartData}
                      setCartData={setCartData}
                      setCartgetTotal={setCartgetTotal}
                      getUserData={getUserData}
                    ></CartListItem>
                  );
                })}
            </div>
            <div className="cart-summary">
              <button className="clear-cart" onClick={handleEmptyCart}>
                Clear Cart
              </button>
              <div className="cart-summary-item">
                <h2>Total</h2>
                <span>₹{CartgetTotal?.total_price}.00</span>
              </div>

              <div className="cart-summary-item">
                <span>Delivery Charge</span>
                <span>
                  {deliveryCharge === 0
                    ? "Free Delivery"
                    : `₹${deliveryCharge}`}
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
                  <img
                    src="/asset/images/bank-transfer.png"
                    alt="banktransfer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Memozied Cart Item to prevent unnecessary re-renders
const CartListItem = React.memo(
  ({
    index,
    product,
    handleRemoveItem,
    handleImageLoad,
    handleUpdateQty,
    AdddeliveryCharge,
    imageLoading,
    canCheckout,
    CartData,
    setCartData,
    setCartgetTotal,
    getUserData,
  }) => {
    const [productVariations, setProductVariations] = useState(() => {
      return product.product_attributes ? product.product_attributes : {};
    });

    const [selectedAttributes, setSelectedAttributes] = useState(() => {
      return product.selected_attribute ? product.selected_attribute : {};
    });

    const handleAttributeSelect = async (product, attribute, value) => {
      // console.log("update", attribute, value, product, { [attribute]: value });
      const updateAttributes = {
        ...selectedAttributes,
        [attribute]: value,
      };
      setSelectedAttributes(updateAttributes);
      const update = await axios
        .post(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`, {
          user_id: getUserData.user_id,
          product_id: product.product_id,
          selected_attribute: updateAttributes,
        })
        .then((response) => {
          const UpdatedProduct = response?.data?.cart_item[0];
          const UpdatedCartData = CartData?.map((item) => {
            // console.log("item", item.product_id, UpdatedProduct);
            return item.product_id === UpdatedProduct.product_id
              ? {
                  ...item,
                  selected_attribute: JSON.stringify({ [attribute]: value }),
                }
              : item;
          });
          // console.log("response-update", response.data, UpdatedCartData);
          setCartData(UpdatedCartData);
          AdddeliveryCharge(response.data.cart_total, response.data.cart_items);
          setCartgetTotal(response.data.cart_total);
        })
        .catch((err) => console.log("error", err));
    };
    return (
      <div
        // key={`${product.product_id}`}
        key={index}
        className="cart-item"
      >
        <div className="cart-item-image-wrapper">
          <img
            src={product?.product_image}
            alt={product?.product_title}
            className={`cart-item-image 
          ${imageLoading[product.product_id] ? "loaded" : "loading"}`}
            loading="lazy"
            onLoad={() => handleImageLoad(product.product_id)}
          />
        </div>
        <div className="cart-item-details">
          <Link
            to={`/products/${product.product_id}`}
            className="cart-item-link"
          >
            <h3>{product?.product_title}</h3>
          </Link>
          {productVariations.length !== 0 && (
            <div className="cart-item-attributes">
              {Object.keys(productVariations[0].attributes).map((attribute) => {
                //  console.log(
                //   "select",
                //   selectedAttributes,
                //   "product_variation",
                //   productVariations,
                //   "attributes",attribute
                // );
                return (
                  <div
                    key={attribute}
                    className={`${
                      !canCheckout
                        ? "cart-variation-main variation-cart-main"
                        : "variation-cart-main"
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <h4>
                        {attribute.replace(/attribute_pa_|attribute_/, "")}:
                      </h4>
                      {attribute === "attribute_pa_color" ? (
                        <>
                          <div style={{ display: "flex" }}>
                            {productVariations?.map((variation, index) => {
                              // console.log("vari",variation,Object.values(variation?.attributes)[0],selectedAttributes)
                              return (
                                <div
                                  className={`color-option ${
                                    Object.values(variation?.attributes)[0]
                                  }${
                                    Object.values(variation?.attributes)[0] ===
                                    Object.values(selectedAttributes)[0]
                                      ? " selected"
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
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="variation-buttons">
                            {productVariations?.map((variation, index) => {
                              return (
                                <button
                                  key={index}
                                  className={`variation-button ${
                                    selectedAttributes &&
                                    Object.values(selectedAttributes)[0] ===
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
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="cart-item-quantity">
          <button onClick={(e) => handleUpdateQty(e, product, "MINUS")}>
            -
          </button>
          <span>{product?.product_quantity && product?.product_quantity}</span>
          <button onClick={(e) => handleUpdateQty(e, product, "PLUS")}>
            +
          </button>
        </div>
        <div className="cart-price">
          <p className="cart-item-price">₹{product.product_price}</p>
          <p className="cart-item-total">
            ₹
            {product.product_quantity !== undefined
              ? product.product_price * product.product_quantity
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
  }
);
export default NewCart;
