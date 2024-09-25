import React from "react";
import { Link } from "react-router-dom";

const Success = () => {
  return (
    <section className="checkout-success-wrapper container">
        <h1 className="checkout-success-message">Thank You!</h1>
        <p>For Your Order</p>
        <h2>Your order was completed successfully.</h2>
        <h2>You order has been confirmed.</h2>
        <br/>
        <p><i className="fa-regular fa-circle-check"></i> Order Successfully Placed</p>
        <p>Your Order No:234234324</p>
        <p>If you have question about your order ,you can email at <b>zahadental@gmail.com or call us at 888-766-8784</b></p>
        <button className="btn btn-dark">view order details </button>
        {/* <img src="/asset/images/Thank-you-banner1.jpg" className="img-fluid"></img> */}
      
        <div className="checkout-success">
          <div id="content">
            <div className="holder">
              <div className="content-wrap">
                <div className="receipt-table">
                  <p>
                    Thank you for your interest in Wedding Sparklers Now
                    products. A tracking number will be emailed to you once it
                    has been generated.
                  </p>
                 
                </div>
              </div>
              <p>Your order has been successfully processed!</p>
              <p>Thanks for shopping with us online!</p>
              <div className="buttons">
                <div className="right">
                  <Link href="/" className="btn text-white">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
      
        {/* <div style={{ padding: "450px", background: "#fff" }}></div> */}
      </div>
    </section>
  );
};

export default Success;
