import React, { useState, useEffect } from "react";
import * as yup from "yup";
import BreadCrumbs from "../component/BreadCrumbs";
import Indian_states_cities_list from "indian-states-cities-list";
import { useFormik } from "formik";
import Loader1 from "../component/Loader1";
import Loader from "../component/Loader";
import axios from "axios";
import { toast } from "react-toastify";
import Success from "./success";
import { useWatchlist } from "./WatchlistContext";

const checkoutSchema = yup.object().shape({
  first_name:yup.string().required("First Name field is required"),
  last_name:yup.string().required("Last Name field is required"),
  // name: yup.string().required("Name field is required"),
  email: yup
    .string()
    .email("Contact Details Email is not valid.")
    .required("Email Field is required."),
  phone: yup
    .number()
    .min(10, "The phone number must be a vaild number.")
    .required("Phone Field is required."),
  address: yup.string().required("Address Field is required."),
  city: yup.string().required("City Field is required."),
  state: yup.string().required("State Field is required."),
  zip: yup.string().required("ZipCode Field is required."),
});

const CheckOut = () => {
  const { removeFromCartListProduct } = useWatchlist();
  const deliveryChargData = localStorage.getItem("deliveryCharge");
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentMethod] = useState("PhonePe");
  const [States, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getCouponData, setGetCouponData] = useState([]);
  const token = localStorage.getItem("token");
  const [getCartData] = useState(JSON.parse(localStorage.getItem("cart")));
  const [cartTotal] = useState(getCartData?.cart_total.total_price);
  const [finalTotal, setFinalTotal] = useState();
  const [discountAmount, setDiscountAmount] = useState();
  const [HandleSubmit, setHandleSubmit] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [getUserData] = useState(JSON.parse(localStorage.getItem("UserData")));
  const getCoupon = async () => {
    // setLoading(true)
    await axios
      .get("https://admin.bossdentindia.com/wp-json/custom/v1/coupons")
      .then((res) => {
        // setLoading(false);
        // console.log("res", res.data);
        setGetCouponData(res.data);
        localStorage.setItem("couponData", JSON.stringify(res.data));
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  useEffect(() => {
    setStates(Indian_states_cities_list?.STATES_OBJECT);
    getCoupon();
  }, []);

  const handleApplyCouponCode = () => {
    const filtercoupon = getCouponData.filter(
      (item) => item.post_title === coupon
    );

    if (filtercoupon && finalTotal > 2000) {
      const total = finalTotal - (finalTotal * 10) / 100;
      const discount = finalTotal - total;
      setDiscountAmount(discount.toFixed(2));
      setFinalTotal(total);
      setCouponError("");
    } else {
      setCouponError(
        `${coupon} discount code apply on only more than ₹2000 price.`
      );
    }
  };
  useEffect(() => {
    setFinalTotal(
      getCartData?.cart_total.total_price + Number(deliveryChargData)
    );
    if (coupon) {
      handleApplyCouponCode();
    }
  }, [cartTotal, deliveryChargData]);

  // const handlePaymentSelect = (method) => {
  //   setPaymentMethod(method);
  // };

  // new form validation
  const initialValues = {
    // name: "",
    first_name:"",
    last_name:"",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: checkoutSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async () => {
      // console.log("finalsubmit", paymentMethod, getCartData,HandleSubmit,getCartData,formik?.values);
      if (paymentMethod && HandleSubmit === true) {
        try {
          setLoading(true);
          // Create the order and retrieve the order ID
          const orderResponse = await fetch(
            "https://admin.bossdentindia.com/wp-json/custom/v1/order_create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                amount: finalTotal,
                customerDetails: formik?.values,
                items: getCartData.cart_items?.map((item) => ({
                  product_id: Number(item?.product_id),
                  quantity: Number(item?.product_quantity),
                  selected_attribute:item?.selected_attribute
                })),
                user_id: getUserData.user_id,
              }),
            }
          );

          if (!orderResponse.ok) {
            const errorText = await orderResponse.text();
            console.error("Order creation error:", errorText);
            throw new Error("Failed to create order.");
          } else {
            setLoading(false);
          }

          const orderData = await orderResponse.json();
          const newOrderId = orderData.orderId.toString();
          setOrderId(newOrderId);
        
          //  Proceed to payment
          if (paymentMethod === "PhonePe") {
            setLoading(true);
            const paymentResponse = await fetch(
              "https://admin.bossdentindia.com/wp-json/phone/v1/initiate-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  amount: finalTotal,
                  customerDetails: formik?.values,
                  orderId: newOrderId, // Pass the order ID to the payment initiation
                }),
              }
            );

            if (!paymentResponse.ok) {
              const paymentErrorText = await paymentResponse.text();
              console.error("Payment response error text:", paymentErrorText,"paymentResponse",paymentResponse);
              throw new Error("Failed to initiate payment.");
            }

            const paymentData = await paymentResponse.json();
            if (
              paymentData.success &&
              paymentData.data &&
              paymentData.data.instrumentResponse &&
              paymentData.data.instrumentResponse.redirectInfo &&
              paymentData.data.instrumentResponse.redirectInfo.url
            ) {
              getCartData.cart_items?.map((item) =>
                removeFromCartListProduct(item.product_id,getUserData)
              );
              setLoading(false);
              const paymentUrl =
                paymentData.data.instrumentResponse.redirectInfo.url;
              // window.location.href = paymentUrl;
              window.open(paymentUrl, "_blank");
              setPaymentSuccess(true);
            }
          }
        } catch (error) {
          toast.error(error?.message);
          console.error("Error handling checkout:", error, error?.message);
          // alert("Error processing payment. Please try again.");
        }
      }
    },
  });

  //Applied coupon code
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
    setCouponError("");
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount("");
    setCoupon("");
    setCouponError("");
  };

  if (paymentSuccess) {
    <Success orderId={orderId} />;
  }

  return (
    <>
      {loading ? (
        <>
          <Loader1></Loader1>
        </>
      ) : (
        <div className="container">
          <div className="checkout-page1 overflow-hidden">
            <div className="header" data-aos="fade-up">
              <h1 className="checkout-title">Checkout</h1>
              <BreadCrumbs></BreadCrumbs>
            </div>
            <form onSubmit={formik?.handleSubmit}>
              <div className="row checkout-content-wrapper position-relative">
                <div
                  className="form-wrap col-lg-7 col-md-7 col-12"
                  data-aos="fade-right"
                  //  data-aos-anchor-placement="top-bottom"
                >
                  <h2>Billing Address</h2>
                  <div className="form-inside row mx-0">
                    <div
                      className={
                        formik?.errors?.first_name
                          ? "contactField-wrapper col-lg-6 col-12 mb-0"
                          : "contactField-wrapper col-lg-6 col-12"
                      }
                    >
                      <label className="form-label">First Name:</label>
                      <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        value={formik?.values?.first_name || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                      {formik?.errors?.first_name && (
                        <span className="text-danger">
                          {formik?.errors?.first_name}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.last_name
                          ? "contactField-wrapper col-lg-6 col-12 mb-0"
                          : "contactField-wrapper col-lg-6 col-12"
                      }
                    >
                      <label className="form-label">Last Name:</label>
                      <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        value={formik?.values?.last_name || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                      {formik?.errors?.last_name && (
                        <span className="text-danger">
                          {formik?.errors?.last_name}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.email
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">Email:</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formik?.values?.email || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                      {formik?.errors?.email && (
                        <span className="text-danger">
                          {formik?.errors?.email}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.phone
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">Phone:</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={formik?.values?.phone || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        maxLength={10}
                      />
                      {formik?.errors?.phone && (
                        <span className="text-danger">
                          {formik?.errors?.phone}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.address
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">Address:</label>
                      <input
                        type="text"
                        name="address"
                        className="form-control"
                        value={formik?.values?.address || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                      {formik?.errors?.address && (
                        <span className="text-danger">
                          {formik?.errors?.address}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.city
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">City:</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={formik?.values?.city || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      />
                      {formik?.errors?.city && (
                        <span className="text-danger">
                          {formik?.errors?.city}
                        </span>
                      )}
                    </div>

                    <div
                      className={
                        formik?.errors?.state
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">State:</label>
                      <select
                        type="text"
                        className="form-control"
                        name="state"
                        value={formik?.values?.state || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                      >
                        <option>Select state</option>
                        {States &&
                          States?.map((state, index) => {
                            return (
                              <React.Fragment key={index}>
                                <option value={state?.name}>
                                  {state?.value}
                                </option>
                              </React.Fragment>
                            );
                          })}
                      </select>
                      {formik?.errors?.state && (
                        <span className="text-danger">
                          {formik?.errors?.state}
                        </span>
                      )}
                    </div>
                    <div
                      className={
                        formik?.errors?.zip
                          ? "contactField-wrapper mb-0"
                          : "contactField-wrapper"
                      }
                    >
                      <label className="form-label">Zip Code:</label>
                      <input
                        type="text"
                        name="zip"
                        className="form-control"
                        value={formik?.values?.zip || ""}
                        onChange={formik?.handleChange}
                        onBlur={formik?.handleBlur}
                        maxLength={6}
                      />
                      {formik?.errors?.zip && (
                        <span className="text-danger">
                          {formik?.errors?.zip}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="col-lg-5 col-md-5 col-12" data-aos="fade-left">
                  <div className="order-summary-wrapper">
                    <h2>order summary</h2>
                    {/* order summary content */}
                    <div className="order-summary-content row">
                      {getCartData.cart_items.length === 0 ? (
                        <>
                          <Loader></Loader>
                        </>
                      ) : (
                        <>
                          {getCartData.cart_items?.map((product, index) => {
                            return (
                              <div
                                className="order-summary-product-wrapper"
                                key={index}
                              >
                                <div className="col-lg-3 col-md-3 col-3 ps-0 product-cart-img">
                                  <img
                                    src={product?.product_image}
                                    className="mx-auto img-fluid"
                                    alt={product?.product_title}
                                  ></img>
                                </div>
                                <div className="col-lg-6 col-md-6 col-6 cart-item-detail">
                                  <h1>{product?.product_title}</h1>
                                  {/* {console.log("product",product.selected_attribute)} */}
                                  {product?.selected_attribute ? (
                                    <>
                                      <div className="d-flex align-items-center justify-content-center">
                                        {Object.keys(
                                          product?.selected_attribute
                                        ).map((attribute, index) => {
                                          return (
                                            <h6 key={index}>
                                              {attribute.replace(
                                                /attribute_pa_|attribute_/,
                                                ""
                                              )}
                                              : &nbsp;
                                              <b>
                                                {
                                                  Object.values(
                                                    product?.selected_attribute
                                                  )[0]
                                                }
                                              </b>
                                            </h6>
                                          );
                                        })}
                                      </div>
                                    </>
                                  ) : null}
                                </div>
                                <div className="col-lg-1 col-md-1 col-1 cart-item-qty">
                                  <p className="mb-0">
                                    <i className="fa-solid fa-xmark"></i>&nbsp;
                                    {product?.product_quantity}
                                  </p>
                                </div>
                                <div className="col-lg-2 col-md-2 col-2 cart-remove-item">
                                  <p className="mb-0">
                                    {product?.product_price}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <div
                      className="order-coupon-code"
                      // className={`${
                      //   couponError ? "order-coupon-code" : "order-coupon-code"
                      // }`}
                    >
                      <input
                        className="form-control w-75"
                        type="text"
                        placeholder="Coupon code"
                        name="coupon"
                        value={coupon || ""}
                        onChange={handleCouponChange}
                      ></input>

                      <button
                        className="btn btn-ApplyCouponCode"
                        onClick={handleApplyCouponCode}
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <span className="text-danger">{couponError}</span>
                    )}
                    <div className="order-summary-total mb-4">
                      <div className="d-flex justify-content-between ">
                        <h6 className="order_title">Subtotal</h6>
                        <p>₹{getCartData?.cart_total.total_price}.00</p>
                        {/* <p>₹{cartTotal}.00</p> */}
                      </div>
                      {discountAmount && (
                        <div className="d-flex justify-content-between">
                          <div className="d-block">
                            <h6
                              className="order_discount mb-0"
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Order discount
                            </h6>
                            <span
                              className="d-flex align-items-center justify-content-between "
                              style={{
                                backgroundColor: "#333",
                                borderRadius: "4px",
                                textAlign: "center",
                                color: "#fff",
                                padding: "3px 3px",
                                width: "60%",
                              }}
                            >
                              <p className="px-1 mt-0">{coupon}</p>
                              <i
                                className="fa-solid fa-xmark px-1"
                                style={{ fontSize: "13px" }}
                                onClick={() => handleRemoveCoupon()}
                              ></i>
                            </span>
                          </div>
                          <p>-₹{discountAmount}</p>
                        </div>
                      )}
                      <div className="d-flex justify-content-between ">
                        <h6 className="order_title">Shipping </h6>
                        <p>₹{deliveryChargData}.00</p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <h6 className="order_title">Estimated taxes </h6>
                        <p>₹0.00</p>
                      </div>
                      <div className="d-flex justify-content-between ">
                        <h5 className="order_total_title">Total</h5>
                        <p> ₹{finalTotal && finalTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="order-payment-section mt-3">
                    <h2>Payment Methods</h2>
                    <div className="order-payment-content">
                      <div className="payment-logos">
                        <img
                          src="/asset/images/Phone-pe.png"
                          alt="PhonePe"
                          // onClick={() => handlePaymentSelect("PhonePe")}
                          className={
                            paymentMethod === "PhonePe" ? "selected" : ""
                          }
                        />
                        {/* <img
                          src="/asset/images/bank-transfer.png"
                          alt="Bank Transfer"
                          onClick={() => handlePaymentSelect("BankTransfer")}
                          className={
                            paymentMethod === "BankTransfer" ? "selected" : ""
                          }
                        /> */}
                      </div>
                      {formik?.errors?.paymentMethod && (
                        <span className="text-danger text-center d-block">
                          {formik?.errors?.paymentMethod}
                        </span>
                      )}
                      <button
                        type="submit"
                        className="payment-button"
                        onClick={() => setHandleSubmit((prev) => !prev)}
                      >
                        Proceed to payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOut;
