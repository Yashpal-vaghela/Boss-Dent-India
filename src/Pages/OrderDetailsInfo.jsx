import React, { useEffect, useState } from "react";
// import BreadCrumbs from "../component/BreadCrumbs";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";
const OrderDetailsInfo = () => {
  const [getOrderId] = useState(localStorage.getItem("OrderId"));
  const [getOrderData, setOrderData] = useState([]);
  const [productPrice, setProductPrice] = useState();
  const pathName = useLocation();
  // console.log("getOrderId", getOrderData);
  const handleOrderDetails = async () => {
    // console.log("fetchOrderDetails");
    await axios
      .get(
        `https://admin.bossdentindia.com/wp-json/custom/v1/order_details?order_id=${getOrderId}`
      )
      .then((response) => {
        setOrderData(response.data);
        const getPrice = response.data.order_items.map((item) => {
          let price = "";
          if (item.quantity > 1) {
            price = item.total / item.quantity;
            // console.log("price", price);
          } else {
            price = Number(item.total);
          }
          // setProductPrice({...price,ProductPrice:price});
          // console.log("price---",price);
          return price;
        });
        setProductPrice(getPrice);
        // console.log(
        //   "response",
        //   response.data,
        //   response.data.order_items,
        //   "getPrice",
        //   getPrice
        // );
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    handleOrderDetails();
  }, []);
  return (
    <>
      <div className="container-fluid container">
        <div className="header" data-aos="fade-up">
          <h1 className="shop-title">Shop</h1>
          <nav className="bread-crumbs">
            <Link to="/">Home</Link>
            <i className="fa-solid fa-angle-right"></i>{" "}
            <Link
              to="/user"
              onClick={() => localStorage.setItem("userSidebar", "orders")}
            >
              Order
            </Link>
            <i className="fa-solid fa-angle-right"></i>
            {pathName !== undefined ? (
              <span>{pathName?.pathname?.split("/")}</span>
            ) : null}
          </nav>
        </div>
        <div className="row  position-relative flex-md-row m-0 col-12 p-0  py-4">
          <div
            id="order-items"
            className="position-relative col-lg-8 col-12 px-sm-0 mb-4 mb-lg-0"
          >
            <div className="order_items_content">
              <div className="order-item-title">
                <h1
                  style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                >
                  Order Item
                </h1>
              </div>
              {/* {console.log("getOrder", getOrderData)} */}
              {getOrderData.length !== 0 &&
                getOrderData.order_items.map((Product, index) => {
                  // console.log("getOrder", Product);
                  return (
                    <div
                      className="row align-items-center justify-content-center mx-0"
                      key={index}
                    >
                      <div className="col-lg-2 col-3 px-sm-0">
                        <img
                          src={Product.product_image}
                          width={100}
                          height={100}
                          className="img-fluid"
                        ></img>
                      </div>
                      <div className="col-lg-4 col-md-4 col-sm-5 col-5">
                        <h2 className="order-product-title">
                          {Product.product_name}
                        </h2>
                        {Object.keys(Product.attributes)[0] === "pa_color" ? (
                          <>
                            <div className="order-detail-attributes d-flex align-items-center">
                              <h2 className="mb-0">Color:&nbsp;</h2>
                              <span>
                                {Object.values(Product.attributes)[0]}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="order-detail-attributes d-flex align-items-center">
                              <h2 className="mb-0">Size:&nbsp;</h2>
                              <span>
                                {Object.values(Product.attributes)[0]}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="col-lg-2 col-sm-1 col-2 text-center d-sm-block">
                        <span className="order-item-qty">
                          {Product.quantity}
                        </span>
                        <br />
                        <span className="order-item-price d-block d-sm-none d-md-none d-lg-none">
                          {console.log(
                            "price-display===",
                            productPrice[index],
                            Object.keys(productPrice)
                          )}
                          {productPrice[index]}
                          100.00
                        </span>
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-2 col-1 text-center d-lg-block d-md-block d-sm-block d-none">
                        <span className="order-item-price">100.00</span>
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-2 col-2 text-center">
                        <span className="order-item-priceTotal">
                          {Product.total}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="order-summary-details">
              <div className="order-summary-title">
                <h1>Order Summary</h1>
              </div>
              <div className="order-summary-content-main">
                <div className="d-flex justify-content-between align-items-center order-summary-main">
                  <span>Items(s) Subtotal:</span>
                  {/* {
                    getOrderData.order_items.map((item)=>console.log("item",item))
                  } */}
                  <span>1 item</span>
                  <span>
                    {getOrderData.length !== 0 &&
                      getOrderData?.order_items.reduce((total, ite) => {
                        // console.log("total", total, Number(ite.total));
                        return total + Number(ite.total);
                      }, 0)}
                  </span>
                  {/* <span>
                    200.00{getOrderData?.order_items.map((ite) => ite.total)}
                  </span> */}
                </div>
                <div className="d-flex justify-content-between align-items-center order-summary-main">
                  <span>Shipping</span>
                  <span>0.00</span>
                </div>
                <div className="d-flex justify-content-between align-items-center order-summary-main">
                  <span>Total</span>
                  <span>200.00</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-lg-4 col-12 order-details-info-wrap"
            // style={{ zIndex: "99", top: "0px", height: "100%" }}
          >
            <div className="payment-method-container" id="payment-method">
              <div className="payment-sec-title">
                <h1 className="payment-method-title">Payment Methods</h1>
              </div>
              <div className="payment-method-main-content">
                {getOrderData?.payment_instrument !== "" ? (
                  <>
                    <h2>{getOrderData?.payment_instrument}</h2>
                  </>
                ) : (
                  <>
                    <h2 className="text-danger">Payment Failed</h2>
                  </>
                )}

                {/* <h2>Phone Pe</h2> */}
              </div>
            </div>
            <div className="shipping-details-container" id="shipping-details">
              <div className="shipping-detail-title">
                <h1>Billing Address</h1>
              </div>
              <div className="shipping-details-content">
                <h2>{getOrderData?.customer_details?.name}</h2>
                <h2>{getOrderData?.customer_details?.address_1}</h2>
                <h2>{getOrderData?.customer_details?.city}</h2>
                <h2>{getOrderData?.customer_details?.state}</h2>
                <h2>{getOrderData?.customer_details?.postcode}</h2>
                <h2>{getOrderData?.customer_details?.phone}</h2>
                {/* <h2>{getOrderData?.customer_details.city}</h2> */}
              </div>
            </div>
          </div>
        </div>
        <div className="order-buyitem-again d-flex mb-5 mt-3 align-item-center justify-content-end px-4 ">
          <Link to="/">
            <button className="btn btn-dark btn-buy-again">
              <i className="fa-solid fa-repeat"></i> Buy it again
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsInfo;