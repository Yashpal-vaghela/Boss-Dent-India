import React, { useState, useEffect } from 'react';
import { useCart } from './AddCartContext';
import phonepe from "../images/Phone-pe.png";
import banktransfer from "../images/bank-transfer.png";

const CheckOut = () => {
  const { cart, total } = useCart();
  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [finalTotal, setFinalTotal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
    const deliveryCharge = total < 2500 ? 103 : 0;
    setFinalTotal(total + deliveryCharge);
  }, [total]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactDetails({ ...contactDetails, [name]: value });
  };

  const handleCouponChange = (e) => {
    setCoupon(e.target.value);
  };

  const applyCoupon = () => {
    // For demonstration, assume a fixed discount if the coupon code is "DISCOUNT10"
    if (coupon === 'DISCOUNT10') {
      setAppliedCoupon(coupon);
      setFinalTotal(total - 10); // Applying a $10 discount
    }
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log('Order submitted:', {
      contactDetails,
      appliedCoupon,
      paymentMethod,
      cart,
      finalTotal,
    });
  };
  const deliveryCharge = total < 2500 ? 103 : 0;
  return (
    <div className="checkout-page">
      <div className="header">
        <h1 className="cart-title">Check out</h1>
        <nav>
          <a href="/">Home</a> &gt; <span>Check out</span>
        </nav>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="checkout-content">
          <div className="contact-details">
            <h2>Contact Details</h2>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={contactDetails.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={contactDetails.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Phone:
              <input
                type="number"
                name="phone"
                value={contactDetails.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={contactDetails.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="city"
                value={contactDetails.city}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="state"
                value={contactDetails.state}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              ZIP Code:
              <input
                type="number"
                name="zip"
                value={contactDetails.zip}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <ul>
            {cart.map((product) => (
                <li key={product.id}>
                  {product.title.rendered} - ₹{product.price} x {product.quantity}
                  {product.selectedAttributes && (
                    <ul>
                      {Object.entries(product.selectedAttributes).map(([key, value]) => (
                        <li key={key}>
                          {key.replace(/attribute_pa_|attribute_/, "")}: {value}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <p><strong>Order Subtotal:</strong> ₹{total}.00</p>
            <p><strong>Shipping Charge:</strong> ₹{deliveryCharge}.00</p>
            <p><strong>Tax:</strong> ₹0.00</p>
            <p><strong>Total:</strong> ₹{finalTotal}.00</p>
            <div className="coupon">
              <label>
                If you have a coupon code, please enter it in the box below:
                <input
                  type="text"
                  value={coupon}
                  onChange={handleCouponChange}
                />
              </label>
              <button type="button" onClick={applyCoupon} className='ap-btn'>
                Apply coupon
              </button>
            </div>
            <div className="payment-methods">
              <h2>Payment Methods</h2>
              <div className="payment-logos">
                <img
                  src={phonepe}
                  alt="PhonePe"
                  onClick={() => handlePaymentSelect('PhonePe')}
                  className={paymentMethod === 'PhonePe' ? 'selected' : ''}
                />
                <img
                  src={banktransfer}
                  alt="Bank Transfer"
                  onClick={() => handlePaymentSelect('BankTransfer')}
                  className={paymentMethod === 'BankTransfer' ? 'selected' : ''}
                />
              </div>
            </div>
            <button type="submit" className="checkout-button">
              Proceed to payment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckOut;
