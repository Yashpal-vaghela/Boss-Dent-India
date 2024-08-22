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
  const [finalTotal, setFinalTotal] = useState(total);
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
    if (coupon === 'DISCOUNT10') {
      setAppliedCoupon(coupon);
      setFinalTotal(finalTotal - 10);
    }
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the order and retrieve the order ID
      const orderResponse = await fetch('https://bossdentindia.com/wp-json/custom/v1/order_create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add authorization if needed
        },
        body: JSON.stringify({
          amount: finalTotal,
          customerDetails: contactDetails,
          items: cart.map((item)=>({
            product_id: item.id,
            quantity: item.quantity,
          }))
        }),
      });

      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order creation error:', errorText);
        throw new Error('Failed to create order.');
      }

      const orderData = await orderResponse.json();
      const newOrderId =  orderData.orderId.toString();

      // Proceed to payment
      if (paymentMethod === 'PhonePe') {
        const paymentResponse = await fetch('https://bossdentindia.com/wp-json/phone/v1/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            amount: finalTotal,
            customerDetails: contactDetails,
            orderId: newOrderId, // Pass the order ID to the payment initiation
          }),
        });

        if (!paymentResponse.ok) {
          const paymentErrorText = await paymentResponse.text();
          console.error('Payment response error text:', paymentErrorText);
          throw new Error('Failed to initiate payment.');
        }

        const paymentData = await paymentResponse.json();
        if (
          paymentData.success &&
          paymentData.data &&
          paymentData.data.instrumentResponse &&
          paymentData.data.instrumentResponse.redirectInfo &&
          paymentData.data.instrumentResponse.redirectInfo.url
        ) {
          const paymentUrl = paymentData.data.instrumentResponse.redirectInfo.url;
          window.location.href = paymentUrl;
        }
      }
    } catch (error) {
      console.error('Error handling checkout:', error);
      alert('Error processing payment. Please try again.');
    }
  };

  const groupedCart = cart.reduce((acc, item) =>{
    const parentId = item.parent_id || item.id;
    if (!acc[parentId]){
      acc[parentId] = {
        ...item,    
        variations: []
      };
    }else {
      acc[parentId].variations.push(item);
    }
    return acc;
  }, {});

  const deliveryCharge = total < 2500 ? 103 : 0;

  return (
    <div className="checkout-page">
      <div className="header">
        <h1 className="checkout-title">Check out</h1>
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
              {Object.values(groupedCart).map((product) => (
                <li key={product.id}>
                  {product.title.rendered} - ₹{product.price} x {product.quantity}
                  {product.selectedAttributes && (
                    <ul className='product-variations'>
                      {Object.entries(product.selectedAttributes).map(([key, value]) => (
                        <li key={key}>
                          {key.replace(/attribute_pa_|attribute_/, "")}: {value}
                        </li>
                      ))}
                    </ul>
                  )}
                  {product.variations.length > 0 && (
                    <ul className='product-variations'>
                      {product.variations.map((variation) => (
                        <li key={variation.id}>
                          {variation.title.rendered} - ₹{variation.price} x {variation.quantity}
                          {variation.selectedAttributes && (
                            <ul>
                              {Object.enetries(variation.selectedAttributes).map(([key, value]) =>(
                                <li key={key}>
                                    {key.replace(/attribute_pa_|attribute_/, "")}: {value}
                                </li>
                              ))}
                            </ul>
                          )}
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
