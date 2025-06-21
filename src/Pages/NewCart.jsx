import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import '../css/cart.css';
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
  const { alertMessage, removeFromCartList, addToCartList ,EmptyCart} = useWatchlist();
  const [getUserData] = useState(JSON.parse(sessionStorage.getItem("UserData")));
  const [loading, setLoading] = useState(false);
  const [singleProduct,setSingleProduct] = useState([]);
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
          return addToCartList(Number(item.product_id));
        });
        // const a = res.data.cart_items.filter((product)=>product.category_id == 116)
        // console.log("a",a)
        // const eligibleTotal = res.data.cart_items
        // .filter((item)=>!excludedCategories.includes(item.category_name.toLowerCase()))
        // .reduce((sum,item)=> sum + item.product_price * item.product_quantity,0);
        
        // console.log("eli",eligibleTotal)
        sessionStorage.setItem("cart", JSON.stringify(res.data));
        sessionStorage.setItem("cart_length", res.data.cart_items.length);
        setLoading(false);
        setCartData(res.data);
        if (res.data.cart_total.total_price < 2300) {
          setDeliveryCharge(90);
        }
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

  const handleSingleProduct = (e,product) => {
      const itemToUpdate = CartData.cart_items.find((item) => {
        const isSameProduct = item.product_id === product.product_id;
          if (item.selected_attribute && product.selected_attribute) {
             const isSameAttribute = JSON.stringify(item.selected_attribute) === JSON.stringify(product.selected_attribute);
             return isSameProduct && isSameAttribute;
          }
          // If product has no variations, just match by product_id
          if (!item.selected_attribute && !product.selected_attribute) {
             return isSameProduct;
          }
         return false; 
      });
      // singleProduct.push(itemToUpdate);
      // setSingleProduct(itemToUpdate);
      if (!itemToUpdate) return;
  }

  const handleRemoveItem = async (e, product) => {
    console.log("product",product,CartData,singleProduct)
    e.preventDefault();
      const itemToUpdate = CartData.cart_items.find((item) => {
        const isSameProduct = item.product_id === product.product_id;
          if (item.selected_attribute && product.selected_attribute) {
             const isSameAttribute = JSON.stringify(item.selected_attribute) === JSON.stringify(product.selected_attribute);
             return isSameProduct && isSameAttribute;
          }
          // If product has no variations, just match by product_id
          if (!item.selected_attribute && !product.selected_attribute) {
             return isSameProduct;
          }
         return false; 
      });
      // singleProduct.push(itemToUpdate);
      // setSingleProduct(itemToUpdate);
      if (!itemToUpdate) return;
    // handleSingleProduct(e,product);
    // console.log("product",product)
    console.log("itemToUpdate",itemToUpdate) 
    const payload = {
      user_id: getUserData.user_id,
      product_id: itemToUpdate.product_id,
      selected_attribute:itemToUpdate.selected_attribute
    };

    await axios
      .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
        data: payload,
      })
      .then((res) => {
        const filterData = CartData?.cart_items.filter(
          (item) => item.id !== product.id
        );
        console.log("res",res.data.cart_total)
        setCartData({ cart_items: filterData });
        setCartgetTotal(res.data.cart_total);
        AdddeliveryCharge(res.data.cart_total, CartData);
        removeFromCartList(product.product_id);
        sessionStorage.setItem(
          "cart",
          JSON.stringify({ cart_items: filterData, cart_total: CartgetTotal })
        );
        // sessionStorage.setItem("cart_length", filterData.length);
      })
      .catch((error) => {
        console.log("Removing product with ID:", product.product_id);
      });

    // if(itemToUpdate.length !== 0 ){
        // await axios
    //   .delete(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/delete`, {
    //     data: payload,
    //   })
    //   .then((res) => {
    //     const filterData = CartData?.cart_items.filter(
    //       (item) => item.id !== product.id
    //     );
    //     setCartData({ cart_items: filterData });
    //     setCartgetTotal(res.data.cart_total);
    //     AdddeliveryCharge(res.data.cart_total, CartData);
    //     removeFromCartList(product.product_id);
    //     sessionStorage.setItem(
    //       "cart",
    //       JSON.stringify({ cart_items: filterData, cart_total: CartgetTotal })
    //     );
    //     // sessionStorage.setItem("cart_length", filterData.length);
    //   })
    //   .catch((error) => {
    //     console.log("Removing product with ID:", product.product_id);
    //   });
    // }
  
  };

  const handleEmptyCart = () => {
    EmptyCart(getUserData);
    setCartData({ cart_items: [], cart_total: {} });
  };

  const AdddeliveryCharge = (CartTotal) => {
    // const getTotalWeight = CartTotal.total_weight / 1000;
    const getTotalAmount = CartTotal.total_price;
    // console.log("getTotalAmount",getTotalAmount,CartTotal)
    if (getTotalAmount <= 2300) {
      setDeliveryCharge(90);
      sessionStorage.setItem("deliveryCharge", 90);
    } else {
      setDeliveryCharge(0);
      sessionStorage.setItem("deliveryCharge", 0);
    }
    // console.log("deliveryCharge",deliveryCharge)
    // if (getTotalWeight >= 1 && getTotalWeight <= 3) {
    //   setDeliveryCharge(125);
    // } else if (getTotalWeight > 3) {
    //   setDeliveryCharge(65);
    // }
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
    // handleUpdateQty,
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
  }) => {
    const [productVariations] = useState(() => {
      return product.product_attributes ? product.product_attributes : {};
    });

    const [selectedAttributes, setSelectedAttributes] = useState(() => {
      return product.selected_attribute ? product.selected_attribute : {};
    });
    const [showDialogBox, setShowDialogBox] = useState(false);
    
    // console.log("product",product)
    const [productPrice, setProductPrice] = useState(product.product_price);
    const handleAttributeSelect = async (product, attribute, value) => {
      const updateAttributes = {
        ...selectedAttributes,
        [attribute]: value,
      };
      // console.log("updateAttributes",updateAttributes,JSON.parse(updateAttributes))
      setSelectedAttributes(updateAttributes);
      await axios
        .post(`https://admin.bossdentindia.com/wp-json/custom/v1/cart/update`, {
          user_id: getUserData.user_id,
          product_id: product.product_id,
          selected_attribute: updateAttributes,
        })
        .then((response) => {
          // console.log("response",response.data)
          const UpdatedProduct = response?.data?.cart_item[0];
          const UpdatedCartData = CartData?.cart_items?.map((item) => {
            return item.product_id === UpdatedProduct.product_id
              ? {
                  ...item,
                  selected_attribute: {
                    ...item.selected_attribute, 
                    [attribute]: value },
                }
              : item;
          });
          const ProductFilterPrice =
            response.data?.cart_item[0].product_attributes.filter(
              (item) => Object.values(item.attributes)[0] == value
            );
            // console.log("productFilterDta",ProductFilterPrice,response.data)
          if (ProductFilterPrice[0].sale_price) {
            setProductPrice(ProductFilterPrice[0].sale_price);
          } else {
            setProductPrice(ProductFilterPrice[0].price);
          }
          sessionStorage.setItem(
            "cart",
            JSON.stringify({
              cart_items: UpdatedCartData,
              cart_total: CartgetTotal,
            })
          );
          setCartData({ cart_items: UpdatedCartData });
          AdddeliveryCharge(response.data.cart_total, response.data.cart_items);
          setCartgetTotal(response.data.cart_total);
        })
        .catch((err) => console.log("error", err));
    };

    const handleUpdateQty = async (e, product, action) => {
    const cart = JSON.parse(sessionStorage.getItem("cart"));
    if (!cart || !cart.cart_items) return;

    // Find the correct cart item:
    const itemToUpdate = cart.cart_items.find((item) => {
        const isSameProduct = item.product_id === product.product_id;

        // If product has variations, match by selected_attribute also
        if (item.selected_attribute && product.selected_attribute) {
            const isSameAttribute = JSON.stringify(item.selected_attribute) === JSON.stringify(product.selected_attribute);
            return isSameProduct && isSameAttribute;
        }

        // If product has no variations, just match by product_id
        if (!item.selected_attribute && !product.selected_attribute) {
            return isSameProduct;
        }

        return false; // In case of mismatch
    });

    if (!itemToUpdate) return;

    // Calculate new quantity
    let newQuantity =
        action === "PLUS"
            ? Number(itemToUpdate.product_quantity) + 1
            : Number(itemToUpdate.product_quantity) - 1;

    if (newQuantity <= 0) return;

    try {
        const response = await axios.post("https://admin.bossdentindia.com/wp-json/custom/v1/cart/update", {
            user_id: getUserData.user_id,
            product_id: itemToUpdate.product_id,
            product_quantity: newQuantity,
            selected_attribute: itemToUpdate.selected_attribute ? itemToUpdate.selected_attribute : {},
        });

        const updatedProduct = response?.data?.cart_item[0];

        const updatedCartData = cart.cart_items.map((item) => {
            const isSameProduct = item.product_id === updatedProduct.product_id;

            if (item.selected_attribute && updatedProduct.selected_attribute) {
                const isSameAttribute = JSON.stringify(item.selected_attribute) === JSON.stringify(updatedProduct.selected_attribute);
                if (isSameProduct && isSameAttribute) {
                    return { ...item, product_quantity: updatedProduct.product_quantity };
                }
            } else if (!item.selected_attribute && !updatedProduct.selected_attribute) {
                if (isSameProduct) {
                    return { ...item, product_quantity: updatedProduct.product_quantity };
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
                {Object.keys(productVariations[0].attributes).map(
                  (attribute) => {
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
                          <h4>{attribute.replace(/pa_|attribute_/, "")}:</h4>
                          {attribute === "color" ? (
                            <>
                              <div style={{ display: "flex" }}>
                                {productVariations?.map((variation, index) => {
                                  return (
                                    <div
                                      className={`color-option ${
                                        Object.values(variation?.attributes)[0]
                                      }${
                                        Object.values(
                                          variation?.attributes
                                        )[0] ===
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
                                      {typeof variation.attributes[
                                        attribute
                                      ] === "string"
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
                        {!canCheckout &&
                          !product.selected_attribute?.[attribute] && (
                            <p className="checkout-warning">
                              * Please select above attribute values to proceed
                              to checkout.
                            </p>
                          )}
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
          <div className="cart-item-quantity">
            <button onClick={(e) => handleUpdateQty(e, product, "MINUS")}>
              -
            </button>
            <span>
              {/* {console.log("productQuantity",product)} */}
              {product?.product_quantity && product?.product_quantity}
            </span>
            <button onClick={(e) => handleUpdateQty(e, product, "PLUS")}>
              +
            </button>
          </div>
          <div className="cart-price">
            {/* {console.log("pro", productPrice)} */}
            <p className="cart-item-price mb-0">₹{Number(productPrice).toFixed(2)}</p>
            <p className="cart-item-total mb-0">
              ₹
              {product.product_quantity !== undefined
                ? productPrice * product.product_quantity
                : 0}
              .00
            </p>
          </div>
          <button
            className="cart-item-remove"
            onClick={confirmDelete}
            // onClick={(e) => handleRemoveItem(e, product)}
          >
            <FaTrashAlt />
          </button>
        </div>
      </>
    );
  }
);
export default NewCart;
