import React, { useState, useEffect } from "react";
import phonepe from "../images/Phone-pe.png";
import banktransfer from "../images/bank-transfer.png";
import { useDispatch, useSelector } from "react-redux";
import { getTotal } from "../redux/Apislice/cartslice";
import * as yup from "yup";
import BreadCrumbs from "../component/BreadCrumbs";
import Indian_states_cities_list from "indian-states-cities-list";

const checkoutSchema = yup.object().shape({
  contactdetails_name: yup.string().required("Name field is required"),
  contactdetails_email: yup
    .string()
    .email("Contact Details Email is not valid.")
    .required("Email Field is required."),
  contactdetails_phone: yup
    .number()
    .min(10, "The phone number must be a vaild number.")
    .required("Phone Field is required."),
  contactdetails_address: yup.string().required("Address Field is required."),
  contactdetails_city: yup.string().required("City Field is required."),
  contactdetails_state: yup.string().required("State Field is required."),
  contactdetails_zipCode: yup.string().required("ZipCode Field is required."),
});

const CheckOut = () => {
  const cartData = useSelector((state) => state.cart?.cartItems);
  const cartTotal = useSelector((state) => state.cart?.cartTotalAmount);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [finalTotal, setFinalTotal] = useState(cartTotal);
  const [paymentMethod, setPaymentMethod] = useState("");
  const dispatch = useDispatch();
  const [state, setState] = useState({});
  const [error, setError] = useState({});
  const [States, setStates] = useState([]);

  useEffect(() => {
    const deliveryCharge = cartTotal < 2500 ? 103 : 0;
    setFinalTotal(cartTotal + deliveryCharge);
  }, [cartTotal]);

  useEffect(() => {
    return () => {
      dispatch(getTotal());
    };
  }, [cartData]);
  useEffect(() => {
    setStates(Indian_states_cities_list?.STATES_OBJECT);
  }, []);

  const convertYupErrors = (err) => {
    let temp_errors = {};
    err?.inner?.forEach((e) => {
      temp_errors = {
        ...temp_errors,
        [e.path]: e.message,
      };
    });
    return temp_errors;
  };

  // validateSingleField
  const validateSingleField = async (schema, name, value) => {
    return schema
      .validate({ [name]: value }, { abortEarly: false })
      .then((res) => {
        return false;
      })
      .catch((err) => {
        let tErrors = convertYupErrors(err);
        if (tErrors[name]) {
          return { [name]: tErrors[name] };
        } else {
          return false;
        }
      });
  };

  // handleChange
  async function handleChange(e) {
    const { name, value, type } = e?.target;
    setState({
      ...state,
      [name]: value,
    });

    const errors = await validateSingleField(checkoutSchema, state, name);
    console.warn("showerros", errors);
    if (errors) {
      setError({ ...error, ...errors });
    } else {
      setError({ ...error, [name]: "" });
    }
  }

  // handleStateChange

  const handleStateChange = async (e) => {
    const { name, value, type, checked } = e?.target;
    try {
      const { name, value, type, checked } = e?.target;
      const errors = await validateSingleField(
        checkoutSchema,
        state,
        name,
        value
      );
      if (errors) {
        setError({ ...error, ...errors });
      } else {
        setError({ ...error, [name]: "" });
      }
      if (Boolean(value)) {
        setState({ ...state, [name]: value });
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  //Applied coupon code
  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };

  const handleApplyCouponCode = () => {
    // console.log("apply code");
    if (coupon === "DISCOUNT10") {
      setAppliedCoupon(coupon);
      setFinalTotal(finalTotal - 10);
    }
  };
  // const applyCoupon = () => {
  //   if (coupon === "DISCOUNT10") {
  //     setAppliedCoupon(coupon);
  //     setFinalTotal(finalTotal - 10);
  //   }
  // };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const finalSubmit = async () => {
    try {
      // Create the order and retrieve the order ID
      const orderResponse = await fetch(
        "https://bossdentindia.com/wp-json/custom/v1/order_create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization if needed
          },
          body: JSON.stringify({
            amount: finalTotal,
            customerDetails: state,
            items: cartData?.map((item) => ({
              product_id: item?.id,
              quantity: item?.quantity,
            })),
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

      // Proceed to payment
      if (paymentMethod === "PhonePe") {
        const paymentResponse = await fetch(
          "https://bossdentindia.com/wp-json/phone/v1/initiate-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              amount: finalTotal,
              customerDetails: state,
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
          window.location.href = paymentUrl;
        }
      }
    } catch (error) {
      console.error("Error handling checkout:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    if (e && e?.preventDefault && typeof e?.preventDefault == "function") {
      e?.preventDefault();
    }
    const isValid = await checkoutSchema.isValid(state, { abortEarly: false });

    if (!isValid) {
      checkoutSchema.validate(state, { abortEarly: false }).catch((err) => {
        let temp_errors = convertYupErrors(err);
        // console.log("temp_errors", temp_errors);
        setError(temp_errors);
      });
    } else {
      console.log("finalSubmit");
      finalSubmit();
    }
  };

  const deliveryCharge = cartTotal < 2500 ? 103 : 0;

  // const groupedCart = cartData?.reduce((acc, item) => {
  //   const parentId = item.parent_id || item.id;
  //   if (!acc[parentId]) {
  //     acc[parentId] = {
  //       ...item,
  //       variations: [],
  //     };
  //   } else {
  //     acc[parentId].variations.push(item);
  //   }
  //   return acc;
  // }, {});

  

  return (
    <>
      <div className="checkout-page1 container">
        <div className="header">
          <h1 className="checkout-title">Checkout</h1>
          <BreadCrumbs></BreadCrumbs>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row checkout-content-wrapper">
            <div className="form-wrap col-lg-7 col-md-7 col-12">
              <h2>Billing Address</h2>
              <div className="form-inside">
                <div
                  className={
                    error?.contactdetails_name
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Name:</label>
                  <input
                    type="text"
                    name="contactdetails_name"
                    className="form-control"
                    value={state?.contactdetails_name || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_name && (
                    <span className="text-danger">
                      {error?.contactdetails_name}
                    </span>
                  )}
                </div>
                <div
                  className={
                    error?.contactdetails_email
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    name="contactdetails_email"
                    className="form-control"
                    value={state?.contactdetails_email || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_email && (
                    <span className="text-danger">
                      {error?.contactdetails_email}
                    </span>
                  )}
                </div>
                <div
                  className={
                    error?.contactdetails_phone
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Phone:</label>
                  <input
                    type="text"
                    name="contactdetails_phone"
                    className="form-control"
                    value={state?.contactdetails_phone || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_phone && (
                    <span className="text-danger">
                      {error?.contactdetails_phone}
                    </span>
                  )}
                </div>
                <div
                  className={
                    error?.contactdetails_address
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Address:</label>
                  <input
                    type="text"
                    name="contactdetails_address"
                    className="form-control"
                    value={state?.contactdetails_address || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_address && (
                    <span className="text-danger">
                      {error?.contactdetails_address}
                    </span>
                  )}
                </div>
                <div
                  className={
                    error?.contactdetails_state
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">State:</label>
                  <select
                    type="text"
                    className="form-control"
                    name="contactdetails_state"
                    value={state?.contactdetails_state || ""}
                    onChange={handleStateChange}
                  >
                    {States &&
                      States?.map((state, index) => {
                        return (
                          <React.Fragment key={index}>
                            <option value={state?.name}>{state?.value}</option>
                          </React.Fragment>
                        );
                      })}
                  </select>
                  {error?.contactdetails_state && (
                    <span className="text-danger">
                      {error?.contactdetails_state}
                    </span>
                  )}
                </div>
                <div
                  className={
                    error?.contactdetails_city
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">City:</label>
                  <input
                    type="text"
                    name="contactdetails_city"
                    className="form-control"
                    value={state?.contactdetails_city || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_city && (
                    <span className="text-danger">
                      {error?.contactdetails_city}
                    </span>
                  )}
                </div>

                <div
                  className={
                    error?.contactdetails_zipCode
                      ? "contactField-wrapper mb-0"
                      : "contactField-wrapper"
                  }
                >
                  <label className="form-label">Zip Code:</label>
                  <input
                    type="text"
                    name="contactdetails_zipCode"
                    className="form-control"
                    value={state?.contactdetails_zipCode || ""}
                    onChange={handleChange}
                  />
                  {error?.contactdetails_zipCode && (
                    <span className="text-danger ">
                      {error?.contactdetails_zipCode}
                    </span>
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
                        <div className="col-lg-3 ps-0 product-cart-img">
                          <img
                            src={product?.yoast_head_json?.og_image?.[0]?.url}
                            className="mx-auto img-fluid"
                          ></img>
                        </div>
                        <div className="col-lg-6 cart-item-detail">
                          <h1>{product?.title?.rendered}</h1>
                          <h6>Product weight</h6>
                          {product?.selectedAttributes ? (
                            <button className="variation-button selected">
                              {product?.selectedAttributes?.attribute_pa_size}
                            </button>
                          ) : null}
                        </div>
                        <div className="col-lg-1 cart-item-qty">
                          <p>
                            <i className="fa-solid fa-xmark"></i>&nbsp;
                            {product?.qty}
                          </p>
                        </div>
                        <div className="col-lg-2 cart-remove-item">
                          <p>{product?.price}</p>
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
                    onClick={handleApplyCouponCode}
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
                    <p>₹{deliveryCharge}.00</p>
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
