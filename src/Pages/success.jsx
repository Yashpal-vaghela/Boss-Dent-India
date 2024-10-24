import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Success = ({ orderId }) => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const navigate = useNavigate();
  
  useEffect(() =>{
    const fetchPaymentStatus = async () => {
      try {
        const response = await axios.get(`https://admin.bossdentindia.com/wp-json/custom/v1/payment-status?order_id=${orderId}`);
        const { status } = response.data; 
        setPaymentStatus(status); 
      } catch (error) {
        console.error("Error fetching payment status:", error);
        setPaymentStatus('failed');
      }
    };
    if(orderId === undefined){
      navigate('/');
    } else{
      fetchPaymentStatus(); 
    }
  },[orderId])

  return (
    <section className="checkout-success-wrapper container">
      <h1 className="checkout-success-message">Thank You!</h1>
      <p>For Your Order</p>
      {paymentStatus === 'success' ? (
        <>
          <h2>Your order was completed successfully.</h2>
          <br />
          <p className="order-status-success">
            <i className="fa-regular fa-circle-check"></i> Order Successfully Placed
          </p>
        </>
      ):(
        <>
          <h2>Your Payment could not be verified.</h2>
          <br />
          <p className="order-status-failed">
            <i className="fa-regular fa-circle-xmark"></i>Payment Failed
          </p>
        </>
      )}
      <p className="order-id">Your Order No:{orderId}</p>
      <p className="contact-detalis">If you have any question regarding your order, you can contact at <strong>zahadental@gmail.com or call us at 76988 28883</strong></p>
      <div className="checkout-success">
        <div id="content">
          <div className="holder">
            <div className="content-wrap">
              <div className="receipt-table">
                <p>
                  Thank you for your interest in Wedding Sparklers Now
                  products.
                </p>
              </div>
            </div>
            <p>Thanks for shopping with us online!</p>
            <div className="buttons">
              <div className="right">
                <Link to="/products" className="btn text-white">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
