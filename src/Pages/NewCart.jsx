import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import "../css/cart.css";
import BreadCrumbs from "../component/BreadCrumbs";
import axios from "axios";
import { useWatchlist } from "./WatchlistContext";
import { FaCheckCircle } from "react-icons/fa";
import ConfirmationDialog from "../component/ConfirmationDialog";
import Loader from "../component/Loader";

const NewCart = () => {
  const [canCheckout, setCanCheckout] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [deliveryCharge, setDeliveryCharge] = useState();
  const [CartData, setCartData] = useState(() => {
    const d = sessionStorage.getItem("cart");
    return d ? JSON.parse(d) : null;
  });
  const [CartgetTotal, setCartgetTotal] = useState([]);
  const { alertMessage, removeFromCartList, addToCartList, EmptyCart } =
    useWatchlist();
  const [getUserData] = useState(
    JSON.parse(sessionStorage.getItem("UserData"))
  );
  const [loading, setLoading] = useState(false);
  // const [singleProduct,setSingleProduct] = useState([]);
  // const [subTotal,setSubTotal] = useState([]);
  // const excludedCategories = ['gloves'];

  useEffect(() => {
    fetchCartData();
  }, []);

  // fetchCartData
  const fetchCartData = async () => {
    setLoading(true);
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/cart-items?user_id=${getUserData.user_id}`
      )
      .then((res) => {
        res.data.cart_items.map((item) => {
          return addToCartList(Number(item.id));
        });
        sessionStorage.setItem("cart", JSON.stringify(res.data));
        sessionStorage.setItem("cart_length", res.data.cart_items.length);
        setLoading(false);
        setCartData(res.data);
        setCartgetTotal(res.data.cart_total);
        AdddeliveryCharge(res.data.cart_total, res.data.cart_items);
      })
      .catch((err) => {
        setLoading(false);
        sessionStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: [], cart_total: {} })
        );
      });
  };

  const handleRemoveItem = async (e, product) => {
    e.preventDefault();
    const itemToUpdate = CartData.cart_items.find((item) => {
      const isSameProduct = item.product_id === product.product_id;
      if (item.selected_attribute && product.selected_attribute) {
        const isSameAttribute =
          JSON.stringify(item.selected_attribute) ===
          JSON.stringify(product.selected_attribute);
        return isSameProduct && isSameAttribute;
      }
      if (!item.selected_attribute && !product.selected_attribute) {
        return isSameProduct;
      }
      return false;
    });

    if (!itemToUpdate) return;
    const payload = {
      cart_id: Number(product.id),
      user_id: getUserData.user_id,
      product_id: Number(itemToUpdate.product_id),
      selected_attribute: itemToUpdate.selected_attribute,
    };

    await axios
      .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
        data: payload,
      })
      .then((res) => {
        const filterData = CartData?.cart_items.filter(
          (item) => item.id !== product.id
        );
        setCartData({ cart_items: filterData });
        setCartgetTotal(res.data.cart_total);
        AdddeliveryCharge(res.data.cart_total, CartData);
        removeFromCartList(res.data.cart_id);
        sessionStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: filterData, cart_total: CartgetTotal })
        );
      })
      .catch((error) => {
        console.log("Removing product with ID:", product.product_id);
      });
  };

  const handleEmptyCart = () => {
    EmptyCart(getUserData);
    setCartData({ cart_items: [], cart_total: {} });
  };

  const AdddeliveryCharge = (CartTotal, CartItem) => {
    const getTotalAmount = CartTotal.total_price;
    if (getTotalAmount <= 2300) {
      setDeliveryCharge(90);
      sessionStorage.setItem("deliveryCharge", 90);
    } else {
      setDeliveryCharge(0);
      sessionStorage.setItem("deliveryCharge", 0);
    }
  };

  const grandTotal = (CartgetTotal?.total_price || 0) + (deliveryCharge || 0);

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
        {loading ? (
          <>
            <Loader></Loader>
          </>
        ) : (
          <>
            {CartData?.cart_items?.length === 0 ? (
              <>
                <div className="cart-page-empty">
                  <p className="">Your Cart is Empty </p>
                  <button className="btn btn-dark">
                    <Link to="/products">Shop Now</Link>
                  </button>
                </div>
              </>
            ) : (
              <div className="cart-content" data-aos="filp-left">
                <div className="cart-items">
                  {CartData?.cart_items?.length !== 0 &&
                    CartData?.cart_items?.map((product, index) => {
                      return (
                        <CartListItem
                          key={product.id}
                          product={product}
                          handleEmptyCart={handleEmptyCart}
                          handleRemoveItem={handleRemoveItem}
                          handleImageLoad={handleImageLoad}
                          // handleUpdateQty={handleUpdateQty}
                          AdddeliveryCharge={AdddeliveryCharge}
                          imageLoading={imageLoading}
                          canCheckout={canCheckout}
                          CartData={CartData}
                          setCartData={setCartData}
                          setCartgetTotal={setCartgetTotal}
                          getUserData={getUserData}
                          setCanCheckout={setCanCheckout}
                          addToCartList={addToCartList}
                          CartgetTotal={CartgetTotal}
                          deliveryCharge={deliveryCharge}
                        ></CartListItem>
                      );
                    })}
                </div>
                <div className="cart-summary">
                  <button className="clear-cart" onClick={handleEmptyCart}>
                    Clear Cart
                  </button>
                  <div className="cart-summary-item">
                    <h2 className="mb-0">Total</h2>
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
                </div>
              </div>
            )}
          </>
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
    AdddeliveryCharge,
    imageLoading,
    canCheckout,
    CartData,
    setCartData,
    setCartgetTotal,
    getUserData,
    setCanCheckout,
    // addToCartList,
    CartgetTotal,
    deliveryCharge,
  }) => {
    const [productVariations] = useState(() => {
      return product.product_attributes ? product.product_attributes : {};
    });
    const [showDialogBox, setShowDialogBox] = useState(false);

    const handleUpdateQty = async (e, product, action) => {
      const cart = JSON.parse(sessionStorage.getItem("cart"));
      if (!cart || !cart.cart_items) return;

      const itemToUpdate = cart.cart_items.find((item) => {
        const isSameProduct = item.product_id === product.product_id;

        if (item.selected_attribute && product.selected_attribute) {
          const isSameAttribute =
            JSON.stringify(item.selected_attribute) ===
            JSON.stringify(product.selected_attribute);
          return isSameProduct && isSameAttribute;
        }

        if (!item.selected_attribute && !product.selected_attribute) {
          return isSameProduct;
        }

        return false;
      });

      if (!itemToUpdate) return;

      let newQuantity =
        action === "PLUS"
          ? Number(itemToUpdate.product_quantity) + 1
          : Number(itemToUpdate.product_quantity) - 1;

      if (newQuantity <= 0) return;

      try {
        const response = await axios.post(
          "https://admin.bossdentindia.com/wp-json/custom/v1/cart/update",
          {
            user_id: getUserData.user_id,
            product_id: itemToUpdate.product_id,
            product_quantity: newQuantity,
            cart_id: Number(product.id),
            category_id: [Number(product.category_id)],
            selected_attribute: product.selected_attribute,
          }
        );
        const updatedProduct = response?.data?.cart_items[0];

        const updatedCartData = cart.cart_items.map((item) => {
          const isSameProduct = item.id === updatedProduct.id;

          if (item.selected_attribute && updatedProduct.selected_attribute) {
            const isSameAttribute =
              JSON.stringify(item.selected_attribute) ===
              JSON.stringify(updatedProduct.selected_attribute);
            if (isSameProduct && isSameAttribute) {
              return {
                ...item,
                product_quantity: updatedProduct.product_quantity,
              };
            } else if (isSameProduct) {
              return {
                ...item,
                product_quantity: updatedProduct.product_quantity,
              };
            }
          } else if (
            !item.selected_attribute &&
            !updatedProduct.selected_attribute
          ) {
            if (isSameProduct) {
              return {
                ...item,
                product_quantity: updatedProduct.product_quantity,
              };
            }
          }
          return item; // All others remain unchanged
        });

        // Update local storage
        sessionStorage.setItem(
          "cart",
          JSON.stringify({
            cart_items: updatedCartData,
            cart_total: response.data.cart_total,
          })
        );

        // Update frontend state
        AdddeliveryCharge(response.data.cart_total, response.data.cart_items);
        setCartData({ cart_items: updatedCartData });
        setCartgetTotal(response.data.cart_total);
      } catch (err) {
        console.log("Error while updating quantity:", err);
      }
    };

    const confirmDelete = () => {
      setShowDialogBox(true);
    };
    const handleConfirmRemove = (e) => {
      handleRemoveItem(e, product);
      setShowDialogBox(false);
    };
    const handleCancel = () => {
      setShowDialogBox(false);
    };

    useEffect(() => {
      const AllAttributesSelected = CartData?.cart_items.every((product) => {
        if (
          product.product_attributes &&
          product.product_attributes.length > 0
        ) {
          if (Object.values(product.selected_attribute)[0]) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      });
      setCanCheckout(AllAttributesSelected);
    }, [CartData]);

    return (
      <>
        {showDialogBox && (
          <ConfirmationDialog
            onConfirm={handleConfirmRemove}
            onCancel={handleCancel}
            title={product?.product_title}
          />
        )}
        <div key={index} className="cart-item">
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
              to={`/products/${product.product_slug}`}
              className="cart-item-link"
            >
              <h3>{product?.product_title}</h3>
            </Link>

            {productVariations.length !== 0 && (
              <div className="cart-item-attributes">
                {Object.entries(product.selected_attribute).map(
                  ([attribute, value]) => (
                    <div key={attribute} className="variation-cart-main">
                      <div className="d-flex align-items-center">
                        <h4 className="me-2">
                          {attribute.replace(/pa_|attribute_pa_/, "")}:
                          {/* {attribute.charAt(0).toUpperCase() +
                            attribute.slice(1)} */}
                        </h4>
                        <div className="variation-button selected">{value}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          {product?.product_slug !== "paper-point" ? (
            <div className="cart-item-quantity">
              <button onClick={(e) => handleUpdateQty(e, product, "MINUS")}>
                -
              </button>
              <span>
                {product?.product_quantity && product?.product_quantity}
              </span>
              <button onClick={(e) => handleUpdateQty(e, product, "PLUS")}>
                +
              </button>
            </div>
          ) : null}

          <div className="cart-price">
            <p className="cart-item-price mb-0">
              ₹{Number(product.product_price).toFixed(2)}
            </p>
            <p className="cart-item-total mb-0">
              ₹
              {product.product_quantity !== undefined
                ? product.product_price * product.product_quantity
                : 0}
              .00
            </p>
          </div>
          <button className="cart-item-remove" onClick={confirmDelete}>
            <FaTrashAlt />
          </button>
        </div>
      </>
    );
  }
);
export default NewCart;
