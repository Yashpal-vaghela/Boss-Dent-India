import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import OrderPagination from './OrderPagination';
import Loader1 from './Loader1';


const OrderDetails = ({
    OrderDetail,
    ApiLoader,
    currentOrders,
    itemPerPage,
    currentPage,
    handlePageChange,
    handleItemsPerPageChange,
  }) => {
    const navigate = useNavigate();
  
    return (
      <div className="order-section d-inline">
        {OrderDetail.length !== 0 ? (
          <>
            <h2 className="order-details-title section-title">Order Details</h2>
            <div className="order-table">
              <div className="order-title row mx-0">
                <div className="col-2">
                  <h1>Order Id</h1>
                </div>
                <div className="col-2">
                  <h1>Order Date</h1>
                </div>
                <div className="col-2">
                  <h1>Product Items</h1>
                </div>
                <div className="col-2">
                  <h1>Total Amount</h1>
                </div>
                <div className="col-2">
                  <h1>Status</h1>
                </div>
                <div className="col-2">
                  <h1>Action</h1>
                </div>
              </div>
              <div className="order-content row mx-0 justify-content-between align-items-center">
                {currentOrders?.map((order, index) => {
                  const dateOnly = order.order_date.split(" ")[0];
                  const [year, month, day] = dateOnly.split("-");
                  return (
                    <React.Fragment key={index}>
                      <div className="col-2">
                        <span>{order.order_id}</span>
                      </div>
                      <div className="col-2 date-section">
                        <span>
                          {day}-{month}-{year}
                        </span>
                      </div>
                      <div className="col-2">
                        <span>{order.items.length}</span>
                      </div>
                      <div className="col-2">
                        <span>{order.order_total}</span>
                      </div>
                      <div className="col-2">
                        <span>{order.status.replace(/wc-|wc-/, "")}</span>
                      </div>
                      <div className="col-2 px-0 action-button d-flex align-items-center justify-content-center">
                        <i
                          className="d-flex d-sm-none d-md-none d-lg-none fa-solid fa-angles-right"
                          onClick={() => {
                            navigate("/order-details-info");
                            localStorage.setItem("OrderId", order.order_id);
                          }}
                        ></i>
                        <button
                          className="d-none d-sm-block d-md-block d-lg-block btn btn-dark mx-1"
                          onClick={() => {
                            navigate("/order-details-info");
                            localStorage.setItem("OrderId", order.order_id);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
            <OrderPagination
              itemPerPage={itemPerPage}
              totalItems={OrderDetail.length}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              onRowsPerPageChange={handleItemsPerPageChange}
            />
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            {ApiLoader ? (
              <Loader1 />
            ) : (
              <div className="d-block text-center order-main">
                <p>No Order details found!</p>
                <p>
                  Please make your first order{" "}
                  <Link to="/products" style={{ color: "#c39428" }}>
                    ShopNow
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  export default OrderDetails;