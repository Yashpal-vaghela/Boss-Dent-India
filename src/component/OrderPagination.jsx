import React, { useState } from "react";

const OrderPagination = ({
  itemPerPage,
  totalItems,
  onPageChange,
  currentPage,
  onRowsPerPageChange
}) => {
  const [rowPerPage, setRowsPerPage] = useState(itemPerPage);
  const pageNumber = [];

  // console.log(
  //   "item",
  //   itemPerPage,
  //   "totalItems",
  //   totalItems,
  //   // "paginate",
  //   // paginate,
  //   "pageChange",
  //   onPageChange,
  //   "currentPage",
  //   currentPage
  // );
  for (let i = 1; i <= Math.ceil(totalItems / itemPerPage); i++) {
    pageNumber.push(i);
  };

  const handleRowPerPageChange = (e) => {
    const newRowsPerPage = parseInt(e.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    onRowsPerPageChange(newRowsPerPage);
  }
  return (
    <>
      <div className="row align-items-center mx-0 justify-content-between mt-3">
        <div className="col-lg-3 col-md-6 col-6 text-start OrderProductTotal">
          <b>Total Items:</b> {totalItems}
        </div>
        <div className="col-lg-3 col-md-6 col-6  OrderProductRowPage">
          <div className="row_page d-flex align-items-center justify-content-lg-end justify-content-md-end justify-content-between">
            <h6 className="mb-0 me-md-2 me-lg-2">Row Per Page</h6>
            {/* Row Per Page */}
            <select
              className="form-select"
              aria-label="Rows per page selector"
              value={rowPerPage}
              onChange={handleRowPerPageChange}
              style={{
                width: "30%",
                padding: ".175rem 1.3rem .175rem .55rem",
                backgroundPosition: "right .35rem center",
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={totalItems}>All</option>
            </select>
          </div>
        </div>
        <div className="col-lg-4 col-12">
          <div className="Orderpagination d-flex align-items-center justify-content-lg-end justify-content-center">
          <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
            <div className="OrderPagination-list d-flex">
              {pageNumber.map((number, index) => {
                // console.log("number",number)
                return (
                  <button
                    key={index}
                    className={`OrderPagination_button page-item ${currentPage === number ? "active" : ""
                      }`}
                    onClick={(e) => onPageChange(e, number)}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pageNumber.length}
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderPagination;

{
  /* <div className="d-flex align-items-center justify-content-between orderdetails-pagination-main">
        <div className="orderproduct-total">Product Total Items</div>
        <div className="order-per-page w-lg-25">
          <div className="row_page d-flex align-items-center justify-content-end">
            <h6 className="mb-0 me-2">Row Per Page</h6>
            <select
              className="form-select"
              aria-label="Default select Example"
              style={{
                width: "40%",
                padding: ".175rem 1.3rem .175rem .55rem",
                backgroundPosition: "right .35rem center",
              }}
            >
              <option selected>Page</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>
        <div className="order-pagination">
          <nav
            aria-label="Page navigation example"
            className="d-flex justify-content-end"
          >
            <ul className="pagination">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div> */
}

{
  /* <ul className="wrapper">
            <li>
              <Link to="#"><i className="fa-solid fa-chevron-left"></i></Link>
            </li>
            <li>
              <Link to="#">1</Link>
            </li>
            <li>
              <Link to="#">2</Link>
            </li>
            <li>
              <Link to="#">3</Link>
            </li>
            <li>
              <Link to="#"><i className="fa-solid fa-chevron-right"></i></Link>
            </li>
          </ul> */
}

{
  /* <nav
aria-label="Page navigation example"
className="d-flex align-items-center justify-content-lg-end justify-content-between mx-auto"
>
<ul className="Orderpagination pagination mx-lg-0 mx-auto my-sm-2 my-2">
  <li
    className="page-item"
    onClick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1}
  >
    <a className="page-link">
      <span aria-hidden="true">&laquo;</span>
    </a>
    <Link className="page-link" to="#" aria-label="Previos"></Link>
  </li>
  {console.log("pageNu", pageNumber)}
  {pageNumber.map((number) => {
    return (
      <li
        key={number}
        className={`page-item ${
          currentPage === number ? "active" : ""
        }`}
      >
        <a
          onClick={() => onPageChange(number)}
          className="page-link"
        >
          {number}
        </a>
      </li>
    );
  })}
  <li className="page-item">
    <a
      className="page-link"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === pageNumber.length}
    >
      <span aria-hidden="true">&raquo;</span>
    </a>
    <a className="page-link" href="#" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>  
  </li>
</ul>
</nav> */
}
