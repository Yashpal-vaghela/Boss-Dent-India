import React, { useState, useEffect } from "react";
import phonepe from "../images/Phone-pe.png";
import banktransfer from "../images/bank-transfer.png";
import { useDispatch, useSelector } from "react-redux";
import { getTotal } from "../redux/Apislice/cartslice";
import * as yup from "yup";
import BreadCrumbs from "../component/BreadCrumbs";
import Indian_states_cities_list from "indian-states-cities-list";
import { useFormik } from "formik";
import { toast } from "react-toastify";

const checkoutSchema = yup.object().shape({
  name: yup.string().required("Name field is required"),
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
  const cartData = useSelector((state) => state.cart?.cartItems);
  const cartTotal = useSelector((state) => state.cart?.cartTotalAmount);
  const deliveryChargData = localStorage.getItem("deliveryCharge");
  const [coupon, setCoupon] = useState("");
  // const [appliedCoupon, setAppliedCoupon] = useState("");
  const [finalTotal, setFinalTotal] = useState(cartTotal);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [States, setStates] = useState([]);
  const dispatch = useDispatch();
  // const [state, setState] = useState({});
  // const [error, setError] = useState({});
  const token = localStorage.getItem("token")

  useEffect(() => {
    setStates(Indian_states_cities_list?.STATES_OBJECT);
  }, []);

  // new form validation
  const initialValues = {
    name: "",
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
      // console.log("finalsubmit");
      try {
        // Create the order and retrieve the order ID
        const orderResponse = await fetch(
          "https://bossdentindia.com/wp-json/custom/v1/order_create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: finalTotal,
              customerDetails: formik?.values,
              items: cartData?.map((item) => ({
                product_id: item?.id,
                quantity: item?.quantity,
              })
              ),
            }),
          }
        );
        if (!orderResponse.ok) {
          const errorText = await orderResponse.text();
          console.error("Order creation error:", errorText);
          throw new Error("Failed to create order.");
        }

        const orderData = await orderResponse.json();
        const newOrderId = orderData.orderId.toString();

        //  Proceed to payment
        if (paymentMethod === "PhonePe") {
          const paymentResponse = await fetch(
            "https://bossdentindia.com/wp-json/phone/v1/initiate-payment",
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
            console.error("Payment response error text:", paymentErrorText);
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
            const paymentUrl =
              paymentData.data.instrumentResponse.redirectInfo.url;
            // window.location.href = paymentUrl;
            window.open(paymentUrl, "_blank");
          }
        }
      } catch (error) {
        toast.error(error?.message)
        console.error("Error handling checkout:", error, error?.message);
        // alert("Error processing payment. Please try again.");
      }
    },
  });

  useEffect(() => {
    setFinalTotal(cartTotal + Number(deliveryChargData));
  }, [cartTotal]);

  useEffect(() => {
    return () => {
      dispatch(getTotal);
    };
  }, [cartData]);


  //Applied coupon code
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };

  // const handleApplyCouponCode = () => {
  //   if (coupon === "DISCOUNT10") {
  //     setAppliedCoupon(coupon);
  //     setFinalTotal(finalTotal - 10);
  //   }
  // };
  // const applyCoupon = () => {
  //   if (coupon === "DISCOUNT10") {
  //     setAppliedCoupon(coupon);
  //     setFinalTotal(finalTotal - 10);
  //   }
  // };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  return (
    <>
      <div className="checkout-page1 container">
        <div className="header">
          <h1 className="checkout-title">Checkout</h1>
          <BreadCrumbs></BreadCrumbs>
        </div>
        <form onSubmit={formik?.handleSubmit}>
          <div className="row checkout-content-wrapper position-relative">
            <div className="form-wrap col-lg-7 col-md-7 col-12">
              <h2>Billing Address</h2>
              <div className="form-inside">
                <div
                  className={
                    formik?.errors?.name
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formik?.values?.name || ""}
                    onChange={formik?.handleChange}
                    onBlur={formik?.handleBlur}
                  />
                  {formik?.errors?.name && (
                    <span className="text-danger">{formik?.errors?.name}</span>
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
                    <span className="text-danger">{formik?.errors?.email}</span>
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
                  />
                  {formik?.errors?.phone && (
                    <span className="text-danger">{formik?.errors?.phone}</span>
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
                            <option value={state?.name}>{state?.value}</option>
                          </React.Fragment>
                        );
                      })}
                  </select>
                  {formik?.errors?.state && (
                    <span className="text-danger">{formik?.errors?.state}</span>
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
                    <span className="text-danger">{formik?.errors?.city}</span>
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
                  />
                  {formik?.errors?.zip && (
                    <span className="text-danger">{formik?.errors?.zip}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-5 col-md-5 col-12 ">
              <div className="order-summary-wrapper">
                <h2>order summary</h2>

                {/* order summary content */}
                <div className="order-summary-content row">
                  {cartData?.map((product, index) => {
                    return (
                      <div
                        className="order-summary-product-wrapper"
                        key={index}
                      >
                        <div className="col-lg-3 col-md-3 col-3 ps-0 product-cart-img">
                          <img
                            src={product?.yoast_head_json?.og_image?.[0]?.url}
                            className="mx-auto img-fluid"
                            alt={product?.yoast_head_json?.og_title}
                          ></img>
                        </div>
                        <div className="col-lg-6 col-md-6 col-6 cart-item-detail">
                          <h1>{product?.title?.rendered}</h1>

                          {product?.selectedAttributes ? (
                            <>
                              <div className="d-flex align-items-center justify-content-center">
                                {Object.keys(product?.selectedAttributes).map(
                                  (attribute,index) => {
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
                                              product?.selectedAttributes
                                            )[0]
                                          }
                                        </b>
                                      </h6>
                                    );
                                  }
                                )}
                              </div>
                            </>
                          ) : // <button className="variation-button selected">
                            //   {product?.selectedAttributes?.attribute_pa_size}
                            // </button>
                            null}
                        </div>
                        <div className="col-lg-1 col-md-1 col-1 cart-item-qty">
                          <p className="mb-0">
                            <i className="fa-solid fa-xmark"></i>&nbsp;
                            {product?.qty}
                          </p>
                        </div>
                        <div className="col-lg-2 col-md-2 col-2 cart-remove-item">
                          <p className="mb-0">{product?.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="order-coupon-code">
                  <input
                    className="form-control w-75"
                    type="text"
                    placeholder="Coupon code"
                    value={coupon || ""}
                    onChange={handleCouponChange}
                  ></input>
                  <button
                    className="btn btn-ApplyCouponCode"
                    // onClick={handleApplyCouponCode}
                  >
                    Apply
                  </button>
                </div>
                <div className="order-summary-total mb-4">
                  <div className="d-flex justify-content-between ">
                    <h6 className="order_title">Subtotal</h6>
                    <p>₹{cartTotal}.00</p>
                  </div>
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
                    <p> ₹{finalTotal}.00</p>
                  </div>
                </div>
              </div>
              <div className="order-payment-section mt-3">
                <h2>Payment Methods</h2>
                <div className="order-payment-content">
                  <div className="payment-logos">
                    <img
                      src={phonepe}
                      alt="PhonePe"
                      onClick={() => handlePaymentSelect("PhonePe")}
                      className={paymentMethod === "PhonePe" ? "selected" : ""}
                    />
                    <img
                      src={banktransfer}
                      alt="Bank Transfer"
                      onClick={() => handlePaymentSelect("BankTransfer")}
                      className={
                        paymentMethod === "BankTransfer" ? "selected" : ""
                      }
                    />
                  </div>
                  <button type="submit" className="payment-button">
                    Proceed to payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CheckOut;

